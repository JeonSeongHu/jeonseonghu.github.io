---
layout: project
type: publication
title: "Geometric Action Model for Robot Policy Learning"
short_title: "GAM"
description: "A language-conditioned robot policy that repurposes a pretrained geometric foundation model for perception, future geometry prediction, and action decoding."
image: "/assets/images/projects/gam-teaser.webp"
authors: "Jisang Han*, Seonghu Jeon*, Jaewoo Jung, René Zurbrügg, Honggyu An, Tifanny Portela, Marco Hutter, Marc Pollefeys, Seungryong Kim†, Sunghwan Hong†"
venue: "Under Review, 2026"
date: 2026-06-15
role: "Equal Contribution"
link: "https://arxiv.org/abs/2606.17046"
arxiv: "https://arxiv.org/abs/2606.17046"
huggingface: "https://huggingface.co/papers/2606.17046"
pdf: "https://arxiv.org/pdf/2606.17046"
project_link: "https://cvlab-kaist.github.io/Geometric-Action-Model/"
tags: ["Robot Learning", "Visuomotor Control", "3D Vision", "Geometric Foundation Models"]
---

## Abstract

**Geometric Action Model (GAM)** is a language-conditioned manipulation policy that directly reuses a pretrained geometric foundation model as the shared backbone for perception, temporal prediction, and action decoding. GAM splits the geometric model at an intermediate layer: early blocks encode observations, a causal future predictor forecasts latent tokens conditioned on language and robot state history, and the remaining blocks propagate those tokens into future geometry and actions.

Across simulation and real-robot manipulation benchmarks, GAM improves accuracy, robustness, inference speed, and model efficiency compared with foundation-model-scale baselines.

## Notes

- \* Equal contribution
- † Corresponding author

## Links

- [arXiv](https://arxiv.org/abs/2606.17046)
- [Hugging Face](https://huggingface.co/papers/2606.17046)
- [PDF](https://arxiv.org/pdf/2606.17046)
- [Project Page](https://cvlab-kaist.github.io/Geometric-Action-Model/)
