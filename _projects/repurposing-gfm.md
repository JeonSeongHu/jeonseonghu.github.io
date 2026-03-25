---
layout: project
type: publication
title: "Repurposing Geometric Foundation Models for Multi-view Diffusion"
short_title: "GLD"
full_title: "Repurposing Geometric Foundation Models for Multi-view Diffusion"
description: "We repurpose geometric foundation model features as latent space for multi-view diffusion, achieving 4.4× faster training convergence and zero-shot geometry decoding."
image: "https://cvlab-kaist.github.io/GLD/assets/img-000.png"
authors: "Wooseok Jang*, Seonghu Jeon*, Jisang Han, Jinhyeok Choi, Minkyung Kwon, Seungryong Kim, Saining Xie, Sainan Liu"
venue: "arXiv 2025"
date: 2025-03-28
role: "Research Contributor"
tags: ["3D Vision", "Diffusion Models", "Generative AI"]
link: "https://arxiv.org/abs/2603.22275"
project_link: "https://cvlab-kaist.github.io/GLD/"
arxiv: "https://arxiv.org/abs/2603.22275"
pdf: "https://arxiv.org/pdf/2603.22275"
code: "https://github.com/cvlab-kaist/GLD/"
---

## Abstract

Latent diffusion models have achieved remarkable success in multi-view image generation by encoding images into a compact latent space using a pretrained Variational Autoencoder (VAE). However, despite their effectiveness in image compression, VAE features are not inherently designed for 3D tasks, potentially limiting performance in multi-view generation. In this work, we propose **Geometric Latent Diffusion (GLD)**, which repurposes the feature space of geometric foundation models as the latent representation for multi-view diffusion. Our approach achieves **4.4× faster training convergence** compared to VAE-based approaches and delivers competitive performance with methods that leverage text-to-image pretraining, despite being trained from scratch. Furthermore, the frozen geometric decoder enables **zero-shot geometry decoding**, allowing direct depth estimation and point cloud generation from the diffusion output without additional training.
