---
layout: post
hidden: true
title: "UWM vs Fast-WAM: 코드베이스 기반 아키텍처 검증"
author: jeonseonghu
main_category: Research
toc: true
featured: false
sub_category: Notes
series: map-name-projects-posts-list
categories:
  - Research
---

논문에서 확인하기 어려운 구현 세부사항을 실제 코드 기반으로 검증한 결과를 정리한다.

- **UWM**: [github.com/WEIRDLabUW/unified-world-model](https://github.com/WEIRDLabUW/unified-world-model)
- **Fast-WAM**: [github.com/yuantianyuan01/FastWAM](https://github.com/yuantianyuan01/FastWAM)

---

## 1. UWM — 코드 검증 결과

### 1.1 Positional Encoding: Learnable (RoPE 아님)

논문에서 명시하지 않았던 positional encoding은 **learnable positional embedding**이다.

```python
# models/uwm/uwm.py:136-138
total_len = action_len + obs_len + num_registers
self.pos_embed = nn.Parameter(
    torch.empty(1, total_len, embed_dim).normal_(std=0.02)
)
```

`forward()`에서 `x = x + self.pos_embed`으로 단순히 더한다 (line 200). 코드베이스에 RoPE 유틸리티(`get_nd_rotary_embed`, `apply_rotary_embed`)가 존재하지만, UWM의 DiT 블록에서는 **사용하지 않는다**. Sinusoidal embedding은 **diffusion timestep 인코딩에만** 사용된다.

### 1.2 VAE 사용: SDXL VAE (Pixel-level이 아님)

원래 정리에서는 "VAE 없음 (pixel-level 또는 별도 encoder)"로 적었으나, 실제로는 **Stability AI의 SDXL VAE**를 사용한다.

```python
# models/common/transforms.py:90
self.vae = AutoencoderKL.from_pretrained("stabilityai/sdxl-vae")
```

- 4채널 latent, 8x spatial downsampling
- VAE 파라미터는 **전부 frozen** (`p.requires_grad = False`)
- latent에 추가 normalization 적용 (shift/scale buffer)
- DiT는 이 **VAE latent의 3D 패치**에서 동작한다

config에서 `latent_patch_shape: [2, 4, 4]`로, VAE latent 위에서 시공간 패치를 적용한다.

### 1.3 모델 크기: ~100M (trainable)

config 기준:
- `embed_dim: 768`, `depth: 12`, `num_heads: 12`, `mlp_ratio: 4`
- `timestep_embed_dim: 512`, `num_registers: 8`

이는 **DiT-B** 스케일에 해당한다. Trainable 파라미터는 약 **100M** 수준이다 (frozen SDXL VAE ~83M 제외).

### 1.4 AdaLN: 6개 modulation parameter, zero-init

```python
# models/common/adaln_attention.py
# shift_msa, scale_msa, gate_msa, shift_mlp, scale_mlp, gate_mlp
# modulate(x, shift, scale) = x * (1 + scale) + shift
```

- `cond = [obs_features, timestep_embedding]` concatenation
- `nn.Sequential(nn.SiLU(), nn.Linear(cond_dim, 6 * dim))`으로 6개 modulation 생성
- Self-attention과 MLP 각각에 shift, scale, gate 적용
- **Zero-initialization**: adaLN modulation layer의 weight와 bias를 0으로 초기화

### 1.5 Register Tokens: 8개, 학습 가능

```python
# models/uwm/uwm.py:130-132
self.registers = nn.Parameter(
    torch.empty(1, num_registers, embed_dim).normal_(std=0.02)
)
```

시퀀스 순서: `[action_tokens, obs_patch_tokens, register_tokens]`. Register 출력은 최종 예측에서 **버려진다** — action과 obs 토큰만 사용.

### 1.6 Multi-view: ResNet-18 + GroupNorm

```python
# models/common/vision.py
# ResNet-18 (IMAGENET1K_V1 pretrained)
# BatchNorm2d → GroupNorm (16 channels/group) 교체
# 입력: (B, V, C, T, H, W) → (B*V*T, C, H, W)로 reshape 후 독립 처리
# 출력: (B, V*T*embed_dim)으로 flat concatenation
```

이 ResNet encoder는 **global conditioning**용이다 (current observation → AdaLN cond). Next observation은 별도로 **3D Conv patchifier**를 통해 VAE latent 패치 토큰으로 변환된다.

### 1.7 독립 Timestep: DDIM, 독립 샘플링

```python
# models/uwm/uwm.py:287-301
action_t = torch.randint(low=0, high=self.num_train_steps, ...)
next_obs_t = torch.randint(low=0, high=self.num_train_steps, ...)
```

- Scheduler: **DDIM** (`DDIMScheduler`, `beta_schedule: squaredcos_cap_v2`)
- `DualTimestepEncoder`: 각 timestep → sinusoidal embedding → concatenate → MLP (1024 → 2048 → 512)
- 추론 모드별 timestep 제어:
  - **Policy** (marginal action): obs timestep = max noise, action만 denoise
  - **World model** (forward dynamics): action timestep = clean, obs만 denoise
  - **Inverse dynamics**: obs timestep = clean, action만 denoise
  - **Joint sampling**: 동일 timestep 공유

### 1.8 Diffusion 방식: DDPM/DDIM (Flow matching 아님)

UWM은 `diffusers.DDIMScheduler`를 사용한다. `squaredcos_cap_v2` beta schedule, 100 training steps, 10 inference steps.

---

## 2. Fast-WAM — 코드 검증 결과

### 2.1 3D RoPE: Wan2.2에서 상속, 분리 계산

```python
# src/fastwam/models/wan22/wan_video_dit.py:38-43
def precompute_freqs_cis_3d(dim, end=1024, theta=10000.0):
    f_freqs_cis = precompute_freqs_cis(dim - 2 * (dim // 3), end, theta)
    h_freqs_cis = precompute_freqs_cis(dim // 3, end, theta)
    w_freqs_cis = precompute_freqs_cis(dim // 3, end, theta)
    return f_freqs_cis, h_freqs_cis, w_freqs_cis
```

- `attn_head_dim=128` 기준: temporal 축에 44차원, height/width 각 42차원 할당
- 3D frequency를 `(f, h, w)` 그리드로 expand한 뒤 concat하여 `(f*h*w, 1, rope_dim)` 형태로 사용
- **Action Expert**는 **1D RoPE** 사용: `precompute_freqs_cis(attn_head_dim, end=1024)`

```python
# src/fastwam/models/wan22/action_dit.py:99
self.freqs = precompute_freqs_cis(attn_head_dim, end=1024)
```

**발견**: Action Expert는 3D RoPE가 아닌 1D RoPE를 사용한다. 이는 action 시퀀스가 1차원이기 때문이다.

### 2.2 Attention Mask: 코드에서 정확히 확인

```python
# src/fastwam/models/wan22/fastwam.py:386-407
def _build_mot_attention_mask(self, video_seq_len, action_seq_len, video_tokens_per_frame, device):
    total_seq_len = video_seq_len + action_seq_len
    mask = torch.zeros((total_seq_len, total_seq_len), dtype=torch.bool, device=device)

    # video -> video (first_frame_causal 모드)
    mask[:video_seq_len, :video_seq_len] = self.video_expert.build_video_to_video_mask(...)

    # action -> action (양방향)
    mask[video_seq_len:, video_seq_len:] = True

    # action -> first-frame video only
    first_frame_tokens = min(video_tokens_per_frame, video_seq_len)
    mask[video_seq_len:, :first_frame_tokens] = True
    return mask
```

Video-to-video mask (`first_frame_causal` 모드):
```python
# wan_video_dit.py:501-505
video_mask = torch.ones((video_seq_len, video_seq_len), dtype=torch.bool, device=device)
first_frame_tokens = min(video_tokens_per_frame, video_seq_len)
video_mask[:first_frame_tokens, first_frame_tokens:] = False
```

정리하면:

| Query \ Key | First-frame video | Future video | Action |
|---|---|---|---|
| **First-frame video** | Self only | X | X |
| **Future video** | O | Bidirectional | X |
| **Action** | O | **X** | Bidirectional |

논문 설명과 정확히 일치한다. 핵심: **action은 미래 비디오에 절대 attend하지 않는다**.

**FastWAMJoint** 변형에서는 action이 **전체 비디오**에 attend 가능하다:
```python
# fastwam_joint.py:48
mask[video_seq_len:, :video_seq_len] = True  # action -> full video
```

### 2.3 Action Expert: 정확한 사양

config 기준 (`configs/model/fastwam.yaml`):
```yaml
action_dit_config:
  hidden_dim: 1024
  ffn_dim: 4096
  num_heads: 24
  attn_head_dim: 128
  num_layers: 30
  text_dim: 4096
  freq_dim: 256
```

- Video Expert: `hidden_dim=3072`, `ffn_dim=14336`, 30 layers → **~5B**
- Action Expert: `hidden_dim=1024`, `ffn_dim=4096`, 30 layers → **~1B**
- **num_heads와 attn_head_dim이 동일해야** MoT shared attention이 가능 (둘 다 24 heads, 128 dim)
- Action Expert의 `head`는 단순 `nn.Linear(hidden_dim, action_dim)` (action_dit.py:98)

### 2.4 MoT (Mixture-of-Transformer): Shared Attention 구조

```python
# src/fastwam/models/wan22/mot.py:447-556 (forward)
```

각 레이어에서:
1. 각 expert가 **독립적으로** Q, K, V를 계산 (각자의 projection weight 사용)
2. RoPE 적용 (video: 3D, action: 1D)
3. 모든 expert의 Q, K, V를 **concatenate**
4. **하나의 shared attention** 수행 (attention mask로 접근 제어)
5. 출력을 다시 expert별로 **split**
6. 각 expert가 **독립적으로** post-attention 처리 (gate, cross-attention, MLP)

**중요**: cross-attention은 **각 expert에서 독립적으로** 수행된다. Video expert는 text+action context에, action expert는 text context에 각각 cross-attend한다.

### 2.5 Multi-view: Horizontal Concatenation

```yaml
# configs/data/libero_2cam.yaml
concat_multi_camera: "horizontal"
video_size: [224, 448]  # H, W (2배 너비)
```

- 2개 카메라 (image + wrist_image), 각 224x224
- **수평으로 concatenate** → 224x448 이미지
- 이 concatenated 이미지가 Wan2.2 VAE에 입력됨
- RoboTwin은 3개 카메라, 384x(384*3) = 384x1152

### 2.6 Flow Matching: Continuous, Shift-based

```python
# src/fastwam/models/wan22/schedulers/scheduler_continuous.py
# target = noise - sample (velocity prediction)
# noisy = (1 - sigma) * sample + sigma * noise
# step: sample = sample + model_output * delta
```

- **Flow matching** objective (DDPM이 아님)
- Training target: `noise - sample` (velocity)
- Shift-based sampling: `sigma = shift * u / (1 + (shift-1) * u)` (default shift=5.0)
- Training weight: Gaussian-like weighting centered at `t = steps/2`
- `num_train_timesteps: 1000` (UWM의 100과 대비)

### 2.7 독립 Noise Schedule

```python
# fastwam.py:459-477
timestep_video = self.train_video_scheduler.sample_training_t(...)
timestep_action = self.train_action_scheduler.sample_training_t(...)
```

- Video와 action에 **별도 scheduler 인스턴스** (각각 독립적인 shift, timestep 설정 가능)
- 기본 config에서는 둘 다 `shift=5.0, num_train_timesteps=1000`

### 2.8 Separated Timestep: First-frame은 Timestep 0

```python
# wan_video_dit.py:541-547
token_timesteps = torch.ones(...) * timestep.view(batch_size, 1, 1)
token_timesteps[:, 0, :] = 0  # first frame gets timestep 0 (clean)
```

First-frame latent의 timestep을 **0으로 설정**하여, 모델이 first frame을 clean conditioning으로 인식하게 한다. 이는 `fuse_vae_embedding_in_latents=True`와 연동되어, first frame latent를 직접 주입하고 noising하지 않는 방식이다.

### 2.9 Language Conditioning: T5 + Cross-Attention (양쪽 Expert 모두)

- Text encoder: T5 기반 (`wan_video_text_encoder.py`에 T5LayerNorm 등 구현)
- **Video expert**: text embedding → cross-attention (`DiTBlock.cross_attn`)
- **Action expert**: text embedding → **별도의** cross-attention (같은 DiTBlock 구조)
- Precomputed text embedding 사용 가능 (`text_embedding_cache_dir`)

### 2.10 Proprioception: Linear → Context Token으로 추가

```python
# fastwam.py:59
self.proprio_encoder = nn.Linear(self.proprio_dim, self.text_dim)
# → context에 1개 토큰으로 concat
```

Proprioception은 text context에 **추가 토큰**으로 append된다. LIBERO에서 `proprio_output_dim: 8` (eef_pose 6 + gripper 2).

### 2.11 KV Cache: Action-only 추론 최적화

```python
# fastwam.py:905-1048 (infer_action)
```

Action-only 추론 시:
1. First-frame latent (timestep=0)로 video expert를 **한 번만** forward → 각 layer의 K, V를 캐시
2. Action denoising loop에서는 **캐시된 video K/V + 현재 action K/V**로 attention
3. Video expert의 반복 계산을 제거하여 latency 대폭 감소

### 2.12 Loss: Weighted MSE

```python
# fastwam.py:563
loss_total = lambda_video * loss_video + lambda_action * loss_action
```

- 기본 `lambda_action: 1.0` (config에서 `lambda_video`는 별도 설정 없으면 1.0)
- Timestep-dependent Gaussian weighting 적용
- Padding mask 지원 (action_is_pad, image_is_pad)

### 2.13 Action-conditioned Video

Video expert에서 action을 **cross-attention context에 추가**할 수 있다:
```python
# wan_video_dit.py:560-590
action_emb = self.action_embedding(action)  # Linear(action_dim, hidden_dim)
context = torch.cat([context, action_emb], dim=1)  # text + action
```

이때 `create_group_causal_attn_mask`로 각 latent frame이 대응하는 action group에만 attend하도록 마스킹. 기본 config에서는 `action_conditioned: false` (action은 MoT shared attention으로만 교류).

---

## 3. 수정된 비교표

| | **UWM** | **Fast-WAM** |
|---|---|---|
| **Backbone** | From scratch DiT-B | Wan2.2-TI2V-5B (pretrained) |
| **모델 크기** | ~100M (trainable) | ~6B (5B video + 1B action) |
| **Positional encoding** | **Learnable** | Video: **3D RoPE**, Action: **1D RoPE** |
| **Conditioning** | **AdaLN** (obs + timestep) | AdaLN (timestep) + **Cross-attention** (text, action) |
| **Action-Video 관계** | 공유 모델, 독립 timestep | **MoT** (shared attention + 독립 expert) |
| **Register tokens** | 8개 (learnable) | 미사용 |
| **VAE** | **SDXL VAE** (frozen) | **Wan2.2 VAE** |
| **Diffusion 방식** | **DDIM** (100 steps) | **Flow matching** (1000 steps) |
| **Language conditioning** | 없음 (기본 config) | **T5** + cross-attention |
| **Multi-view** | ResNet-18 per view → concat | **이미지 수평 concat** → VAE |
| **추론 최적화** | timestep 제어 | **KV cache** (video 1회 → action만 반복) |
| **Proprioception** | 미사용 (기본 config) | Linear → context token |
| **Cross-attention** | 없음 | Video/Action expert 각각 별도 |

---

## 4. 원래 정리에서 수정이 필요한 부분

1. **UWM의 VAE**: "없음"이 아니라 **SDXL VAE (frozen)**를 사용한다. DiT는 latent space에서 동작한다.

2. **UWM의 Positional Encoding**: "표준 sinusoidal"이 아니라 **learnable embedding**이다. Sinusoidal은 timestep 인코딩에만 사용된다.

3. **UWM의 Observation conditioning**: ResNet encoder는 current observation을 global conditioning vector로 만들어 AdaLN에 주입한다. Next observation은 **VAE latent → 3D Conv patchifier**로 토큰화되어 DiT 입력으로 직접 들어간다.

4. **Fast-WAM의 Action Expert RoPE**: 3D RoPE가 아닌 **1D RoPE**를 사용한다. 3D RoPE는 video expert에서만 사용된다.

5. **Fast-WAM의 Cross-attention**: Video expert뿐만 아니라 **Action expert도** text에 대해 독립적으로 cross-attend한다.

6. **Fast-WAM의 separated timestep**: First frame의 timestep을 0으로 설정하여 clean conditioning으로 처리하는 구현이 있다.

7. **Fast-WAM의 추론 최적화**: 단순히 "single forward pass"가 아니라, **video KV cache를 1회 계산** 후 action denoising만 반복하는 방식이다. Action denoising은 여전히 iterative하다 (default 20 steps).
