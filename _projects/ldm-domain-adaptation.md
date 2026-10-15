---
layout: project
type: project
title: "Latent Diffusion Models for Domain Adaptation"
short_title: "LDM for DA"
description: "Synthetic-to-real image translation for driving scenes: Stable Diffusion fine-tuned with ControlNet on segmentation maps from GTA and Synthia, in an industry-academic project of Korea University CVLAB and Hyundai Mobis."
image: ""
date: 2023-08-01
tags: ["Domain Adaptation", "Diffusion Models", "ControlNet"]
categories: ["Vision", "Generative Models"]
---

## Overview

This project trained a diffusion model to translate synthetic driving scenes into photorealistic images while keeping the objects in each scene in place.

It was the vision-team task of a 2023 synthetic-to-real translation project, an industry-academic collaboration of Korea University CVLAB and Hyundai Mobis. From August to October 2023, three AIKU members worked with two CVLAB researchers; I led the AIKU team and worked on the code implementation.

## Setup

* **Data.** Open datasets only: GTA and Synthia as the synthetic domain, Cityscapes and later INIT as the real domain.
* **Goal.** Turn a synthetic image into a photorealistic one while preserving cars, roads, signs, and the other objects in the scene.

## What we tried

1. **ControlNet on segmentation maps.** Starting from the code of DisCo (Disentangled Control for Realistic Human Dance Generation), we fine-tuned Stable Diffusion with ControlNet and gave the synthetic image's segmentation map as an additional control. Objects were generated according to the map, and content stayed consistent.
2. **AdaIN for style.** The style reference, a real image passed through the CLIP encoder into the U-Net transformer blocks, had almost no effect. We replaced every layer normalization in those blocks with AdaIN and switched the real dataset from Cityscapes to INIT, to check whether weather and time-of-day styles carried over. The model did not improve, and artifacts increased.
3. **BoxDiff sampling.** We planned to add BoxDiff to the sampling process so that objects inside each box would be generated more reliably, but ran out of time before implementing it.

## Takeaway

Fine-tuning a diffusion model on undergraduate-level resources was possible but hard. The project also showed that a design that makes sense on paper, such as AdaIN for style transfer, does not always work once trained.
