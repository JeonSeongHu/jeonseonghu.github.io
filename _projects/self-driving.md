---
layout: project
type: project
title: "Driving Practice: Optimizing Segmentation Models in Resource-Constrained Environments"
short_title: "AIKU Driving Practice"
description: "Revisiting the AIKUTHON driving-scene segmentation task on 3,850 CARLA images: fixing the training pipeline, then comparing SegFormer, CoordConv, and three optimizers under limited compute."
image: "/assets/images/projects/driving-practice-thumb.webp"
authors: "Seonghu Jeon, Seohyun Park, Namseok Lee"
venue: "AIKU (Korea University AI Society) Internal Project"
date: 2023-06-01
tags: ["Semantic Segmentation", "Autonomous Driving", "Deep Learning", "Computer Vision"]
categories: ["Vision"]
link: ""
---

# Introduction

Semantic segmentation assigns a class label to every pixel of a driving scene, such as road, vehicle, or pedestrian, so it needs both high-level semantics and precise localization.

AIKUTHON, the hackathon of AIKU (Korea University AI Society), posed this task on **3,850 images captured in the CARLA driving simulator**, with limited compute. Our three-person team had unfinished business with it: some of us could not compete because we were running the event, and others failed to submit or scored low. "Driving Practice" revisited the task afterwards with one goal: reach a first-place score under the same resource limits.

# Code review

Before adding any method, we audited the code we had used during the hackathon.

* **Dataset split.** Training and validation images were not separated correctly, so the validation scores could not be trusted. We fixed the split first.
* **Augmentation.** Removing every augmentation except the random crop needed for the DeepLab V3+ input size gave the largest single improvement in our runs.
* **Optimizer.** We switched to **AdamW** and raised the learning rate from 0.0001 to 0.01.
* **Baseline.** DeepLab V3+ with an EfficientNet-b0 backbone scored 0.74; a frozen EfficientNet-b3 backbone scored 0.628, so we dropped it.

# Methods

## 1. CoordConv

Convolutions are poor at knowing where a pixel is. CoordConv (Liu et al., NeurIPS 2018) concatenates two extra channels holding each pixel's row and column coordinates, which adds position information at almost no cost. Driving scenes have strong position priors, with road at the bottom and sky at the top, so we added CoordConv to DeepLab V3+.

## 2. SegFormer

SegFormer (Xie et al., NeurIPS 2021) is a transformer encoder with a lightweight all-MLP decoder that combines multi-scale features. It captures global context without a heavy decoder.

## 3. Optimizers

* **RAdam** multiplies Adam's update by a rectification term that keeps the variance of the adaptive learning rate consistent early in training.
* **AdaBound** bounds each parameter's learning rate from above and below, tightening the bound over time so training behaves like Adam early and like SGD later.
* **AdamW** decouples weight decay from the adaptive update, which restores the regularization that L2 loses under Adam. It worked best with cosine annealing.

All runs used a Dice-BCE loss (0.75 × BCE + 0.25 × Dice) and a CosineAnnealingLR schedule.

# Results

IoU after 2 epochs, for each model and optimizer:

| Optimizer | SegFormer | DeepLab V3+ (CoordConv) | DeepLab V3+ (Conv) |
| :-------- | :-------: | :---------------------: | :----------------: |
| **AdamW** | **0.749** | 0.717 | 0.705 |
| RAdam     | 0.738 | 0.696 | 0.695 |
| AdaBound  | 0.654 | 0.518 | 0.519 |

Final IoU with AdamW: **SegFormer 0.763**, DeepLab V3+ with CoordConv 0.749, DeepLab V3+ with standard convolutions 0.740. CoordConv improved DeepLab V3+ under every optimizer except AdaBound, and SegFormer led in every row.

![Label and prediction](/assets/images/projects/driving-practice-result.webp)

Our best submission, made after the competition deadline, scored **0.793** on the leaderboard.

# Conclusion

The largest single improvement came from fixing the pipeline, above all from dropping augmentation, before any new method was added. Among the models, SegFormer was ahead of DeepLab V3+ with every optimizer, and AdamW was the best optimizer for every model.
