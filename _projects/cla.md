---
layout: project
type: project
title: "Revisiting Flow-Conditioned Motion Transfer via Pseudo-Flow and Consecutive Local Attention"
short_title: "CLA"
description: "Consecutive Local Attention (CLA) extracts a pseudo optical flow from the 2D spatial attention of a UNet video diffusion model and uses it to guide zero-shot motion transfer. Best on three of four ReMoTE metrics."
image: "/assets/images/projects/cla-figure.webp"
authors: "Seonghu Jeon, Jinhyeok Choi, Junghyun Hwang, Seungryong Kim†"
venue: "IEIE Undergraduate AI Paper Competition, AISP 2025 (Excellence Award)"
date: 2025-06-01
tags: ["Motion Transfer", "Video Generation", "Computer Vision", "Diffusion Models"]
categories: ["Vision", "Generative Models"]
link: ""
---


# Introduction

In video generation, motion is not merely a visual change but a form of structural consistency that must be preserved over time for scenes and objects. Frame-level realism alone is insufficient; object positions, shape continuity, and the direction and magnitude of movement must remain logically connected across time. As a result, video generation presents far more complex constraints than image generation.

Early approaches addressed this challenge by conditioning generation on explicit motion representations such as optical flow, human pose, or tracking information. While effective in domains with well-defined structures, these methods struggled to generalize to generic objects or complex scenes, where defining motion itself becomes difficult. Estimating stable flows or poses for non-parametric objects is inherently challenging.

Motion transfer emerged as an alternative paradigm. Instead of injecting explicit motion conditions, motion transfer methods extract movement information from a source video and apply it to a target. This expands applicability across domains, but at the cost of interpretability: it becomes unclear how motion is represented or preserved, and many approaches rely heavily on model-specific or heuristic designs.

This work revisits flow-based perspectives within modern diffusion architectures. We ask whether flow-like representations can be extracted from a diffusion model’s internal attention structure without external motion definitions, and whether such representations can be used in a stable and architecture-agnostic manner.

---

# Motivation

This study originated from a detailed analysis of Diffusion Motion Transfer (DMT). DMT attracted attention by preserving motion during sampling while keeping a pre-trained text-to-video diffusion model fixed. Notably, it avoids external motion estimators by defining motion through internal spatio-temporal features of the model.

However, through close examination and practical use, two concerns became apparent.

The first concerns evaluation. It was unclear whether existing benchmarks and metrics for motion transfer truly aligned with human judgment or visual quality. This concern motivated the ReMoTE benchmark, which systematically analyzes the limitations and reliability issues of existing motion metrics.

The second concern lies within the methodology itself. DMT’s core mechanism—preserving residuals of space-time features—is intuitive, yet strongly heuristic. Whether global feature differences genuinely represent motion, and how sensitive this definition is to layer choice or architecture, remained open questions.

This paper addresses the second concern. We build upon DMT’s framework while exploring whether motion can be defined in a more interpretable and structurally explicit form.

---

# DMT

DMT begins with the assumption that motion information is already embedded in the spatio-temporal representations learned by diffusion models. This allows motion preservation without learning new representations or injecting external conditions.

An input video is first inverted into a latent diffusion trajectory using DDIM inversion. At each timestep, the latent passes through intermediate layers of the diffusion model, producing spatio-temporal features spanning both frame and spatial dimensions. These features encode appearance, spatial layout, and temporal change.

Because appearance and motion are entangled, DMT applies spatial averaging to produce a global feature per frame. This operation suppresses fine-grained appearance details while emphasizing structural changes over time.

Directly matching global features, however, overly constrains appearance. To mitigate this, DMT introduces a loss based on frame-to-frame residuals rather than absolute feature values. This loss encourages the generated video to follow the same temporal variation pattern as the reference while allowing appearance changes.

Additionally, DMT initializes sampling by preserving only the low-frequency components of the input video and replacing high-frequency components with random noise. This strategy balances motion preservation with editability.

Overall, DMT operates by inserting optimization steps into the diffusion sampling process, iteratively aligning motion-related feature statistics.

---

# Limitations

Despite its contributions, DMT exhibits several structural limitations.

The primary issue is how motion is defined. Frame-wise differences of global features are easy to compute but do not directly represent spatial displacement or correspondence. As a result, the motion representation lacks interpretability and may vary significantly depending on feature selection.

Furthermore, defining motion as a statistical difference weakens its connection to physical intuition, such as optical flow. This makes analysis and failure diagnosis more difficult.

Finally, some subsequent approaches rely on 3D or spatio-temporal attention mechanisms to extract motion signals. However, many widely used diffusion models still rely on 2D or factorized attention, limiting the general applicability of such assumptions.

---

# Method

To address these limitations, we propose extracting pseudo-flow representations that explicitly encode frame-to-frame displacement. The key insight is that even in 2D self-attention architectures without explicit temporal interaction, flow-like information can be induced through minimal structural modification. We call the resulting attention **Consecutive Local Attention (CLA)**.

**Temporal token shifting.** For a video with *f* frames, CLA pairs the queries of frame *t* with the keys of frame *t*+1 inside an existing 2D spatial attention layer (*q′ₜ = qₜ*, *k′ₜ = kₜ₊₁*). Each attention score then measures how well a position in one frame matches a position in the next.

**Local correspondence constraint.** Objects move only a short distance between consecutive frames, so scores between positions more than *r* apart (L1 distance in the attention map) are masked to −∞. Without this mask, long-range matches make the flow noisy, especially in the background.

**Pseudo-flow.** A softmax with temperature β turns the masked scores into weights *A*, and each position's displacement is the weighted average of the matched coordinates minus its own coordinate: *Δᵢ = Σⱼ Aᵢⱼ cⱼ − cᵢ*. The resulting displacement field is the pseudo-flow, and it is differentiable with respect to the latent.

---

# Sampling

Once pseudo-flow is defined, it can be used to guide diffusion sampling. The reference video is inverted with DDIM, and its pseudo-flow *Δ*ʳᵉᶠ is extracted with the same mechanism. Sampling starts from the inverted noise. At each early denoising step, the latent is updated by a few gradient steps on the L1 loss between *Δ*ʳᵉᶠ and the pseudo-flow of the video being generated, followed by the standard denoising update. This mirrors DMT's optimization-based sampling but replaces feature-residual alignment with direct flow alignment.

We found that **50 steps of DDIM inversion** are enough instead of 1,000. The appearance still follows the new prompt without DMT's low-frequency initialization, and preprocessing becomes more than 20 times faster.

**Implementation.** We use Zeroscope as the backbone and extract pseudo-flow from all spatial self-attention layers of the last up-block. Across the model's attention layers, the last up-block gave the flow closest to the real motion; the down-blocks also followed the motion but were much noisier in the background. We set *r* = 3, β = 5.0, and optimize the latent with SGD (learning rate 0.5) during the first 10 of 50 denoising steps.

---

# Experiments

We compared CLA with three zero-shot motion transfer methods on the ReMoTE benchmark: DMT, MOFT, and MotionClone (MC). MotionClone uses AnimateDiff as its backbone and the others use Zeroscope. Every method generated 12-frame videos at 576×320.

| Method | IQ ↑ Intra | IQ ↑ Cross | MFSym ↑ Intra | MFSym ↑ Cross | VMD ↓ Intra | VMD ↓ Cross | MLMF ↑ Intra | MLMF ↑ Cross |
| :-- | :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| DMT | **31.95** | **32.05** | 0.942 | 0.939 | 9,835 | 10,051 | 0.679 | 0.593 |
| MOFT | 31.57 | 31.69 | 0.939 | 0.938 | 9,908 | **9,986** | 0.728 | 0.598 |
| MC | 30.77 | 30.93 | 0.936 | 0.936 | 11,193 | 12,592 | 0.689 | **0.787** |
| **CLA (ours)** | 31.11 | 31.34 | **0.948** | **0.949** | **8,802** | 12,064 | **0.779** | 0.667 |

CLA scored best on MFSym in both settings and on VMD and MLMF in the intra-category setting, which makes it best on three of the four metrics. In the cross-category setting, VMD and MLMF fell behind, so keeping objects aligned when the target belongs to a different category remains hard. IQ (CLIPScore) was in the middle: in some videos, background details from the prompt were missing, for example in "A mouse scurrying between chair legs on a wooden floor."

| Method | Preprocessing (s) | Generation (s) | Total (s) |
| :-- | :--: | :--: | :--: |
| DMT | 360.03 | 214.41 | 574.44 |
| MOFT | 355.48 | 217.00 | 572.48 |
| MC | 0 | 342.44 | 342.44 |
| **CLA (ours)** | **20.14** | **186.10** | **206.24** |

Time per sample, measured on one RTX 3090; CLA's generation ran on two RTX 3090s with FSDP. CLA uses 10 optimization steps against about 20 for DMT, and the 50-step inversion removes most of the preprocessing time.

Visually, the local correspondence constraint substantially reduces background noise in the pseudo-flow maps and yields clearer object motion. In generated videos, the layout and motion of the reference carried over even when the object changed completely, as from a car to a lion or from a horse to a person.

---

# Conclusion

This work revisits how motion should be defined and utilized in diffusion-based motion transfer. Building upon DMT’s framework, we redefine motion as an explicit displacement field rather than a statistical feature difference, while maintaining compatibility with 2D attention architectures.

Evaluation reliability is addressed through ReMoTE, and methodological limitations are tackled via CLA-based pseudo-flow extraction. Together, these efforts contribute toward more interpretable and generalizable motion transfer frameworks. Future work will focus on improving generalization in cross-category transfer scenarios.

---
