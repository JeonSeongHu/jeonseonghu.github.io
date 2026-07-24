---
layout: project
type: publication
title: "CAMEO: Correspondence-Attention Alignment for Multi-View Diffusion Models"
short_title: "CAMEO"
description: "A training technique that supervises attention maps using geometric correspondence, reducing training iterations by half while achieving superior multi-view generation quality."
image: "/assets/images/projects/cameo-teaser.webp"
authors: "Minkyung Kwon*, Jinhyeok Choi*, Jiho Park*, Seonghu Jeon, Jinhyuk Jang, Junyoung Seo, Minseop Kwak, Jin-Hwa Kim†, Seungryong Kim†"
venue: "CVPR 2026"
date: 2026-02-01
role: "Research Contributor"
link: "https://arxiv.org/abs/2512.03045"
arxiv: "https://arxiv.org/abs/2512.03045"
pdf: "https://arxiv.org/pdf/2512.03045"
project_link: "https://cvlab-kaist.github.io/CAMEO/"
code: "https://github.com/cvlab-kaist/CAMEO"
tags: ["Generative AI", "Diffusion Models", "3D Vision"]
bibtex: |
  @inproceedings{kwon2026cameo,
    title     = {CAMEO: Correspondence-Attention Alignment for Multi-View Diffusion Models},
    author    = {Kwon, Minkyung and Choi, Jinhyeok and Park, Jiho and Jeon, Seonghu and Jang, Jinhyuk and Seo, Junyoung and Kwak, Minseop and Kim, Jin-Hwa and Kim, Seungryong},
    booktitle = {IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year      = {2026}
  }
---

## Abstract

We present **CAMEO**, a method to align correspondence and attention for multi-view diffusion models. By supervising attention maps with geometric correspondence during training, we ensure that attention across different views remains consistent with underlying 3D geometry. This achieves significantly improved multi-view consistency while reducing training iterations by half.

## Links

- [Paper](https://arxiv.org/abs/2512.03045)
- [Project Page](https://cvlab-kaist.github.io/CAMEO/)
- [Code](https://github.com/cvlab-kaist/CAMEO)
