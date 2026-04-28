---
layout: post
title: "Portfolio 레이아웃 미리보기 — 임시 포스트"
author: jeonseonghu
date: 2026-04-28 14:00:00 +0900
hidden: false
toc: true
comments: false
main_category: Research
sub_category: Notes
categories:
  - Research
tags:
  - Preview
  - Style Test
excerpt: 새로 다듬은 .pf-prose 본문 타이포그래피와 사이드바 TOC, prev/next 카드, 코드 블록 등을 한 페이지에서 확인하기 위한 임시 포스트.
---

새 포트폴리오 레이아웃에서 블로그 포스트가 어떻게 보이는지 확인하기 위한 **임시 글**입니다. 본문은 [pf-prose](#pf-prose) 클래스로 렌더링되고, 사이드바에는 sticky TOC가 붙습니다.

## 본문 타이포그래피

본문 폰트는 DM Sans 16px / line-height 1.7 입니다. 단락 간격은 `1.1em`, 한국어 *italic*과 **bold**, 그리고 [외부 링크](https://example.com)는 파란색 밑줄로 구분됩니다.

> 인용문은 왼쪽에 파란 3px 보더가 붙고, italic으로 표시됩니다. 두 줄 이상이어도 부드럽게 흐릅니다 — 본문 흐름을 끊지 않으면서 강조하는 데 적합합니다.

### 리스트

순서 없는 리스트:

- 항목 1 — 일반 텍스트
- 항목 2 — `inline code`가 섞인 항목
- 항목 3
  - 중첩된 항목
  - 또 다른 중첩

순서 있는 리스트:

1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

### 코드 블록

```python
def diffuse(x_t, t, model):
    """One denoising step."""
    eps = model(x_t, t)
    alpha = alphas[t]
    sigma = sigmas[t]
    return (x_t - sigma * eps) / alpha.sqrt()
```

```bash
bundle exec jekyll serve --livereload
```

## 표

| 모델 | 파라미터 | 학습 시간 |
| --- | --- | --- |
| Tiny | 12M | 2h |
| Base | 86M | 8h |
| Large | 307M | 28h |

## 이미지와 figure

키보드 단축키도 가능합니다 — <kbd>Cmd</kbd> + <kbd>K</kbd> 로 검색을 열 수 있고, ==하이라이트== 텍스트도 지원합니다.

---

## H2 두 번째 섹션

상단 보더가 있는 H2가 새 섹션을 시각적으로 구분합니다.

### 작은 H3

#### H4까지

##### H5는 uppercase 라벨

여기까지가 일반적인 글의 끝입니다. 페이지 하단에는 태그 chip과 prev/next 카드가 따라옵니다.

> **참고**: 이 포스트는 스타일 검증용입니다. 실제 배포 전에 삭제하거나 `hidden: true`로 바꾸세요.
