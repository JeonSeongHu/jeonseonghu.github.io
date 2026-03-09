---
layout: project
type: project
title: "Driving Practice: Optimizing Segmentation Models in Resource-Constrained Environments"
short_title: "AIKU Driving Practice"
description: "A practical study on improving semantic segmentation for autonomous driving under limited data and compute, focusing on architecture choices, coordinate-aware convolutions, and optimizer/schedule tuning."
image: ""
authors: "Seonghu Jeon, Seohyun Park, Namseok Lee"
venue: "AIKU (Korea University AI Society) Internal Project"
date: 2026-01-09
tags: ["Semantic Segmentation", "Autonomous Driving", "Deep Learning", "Computer Vision"]
link: ""
---

# Introduction

Semantic segmentation is a core component of autonomous driving perception: it assigns a class label to every pixel (e.g., road, vehicle, pedestrian). Unlike image classification, segmentation requires both (1) high-level semantics and (2) precise spatial localization.

This project (“Driving Practice”) was conducted for the **AIKUTHON** competition, where participants built an end-to-end deep learning pipeline (data loading → training → evaluation) under **limited data and resources**. Our goal was to improve segmentation performance in this constrained setting through systematic debugging and targeted model/optimization choices.

---

# Motivation

In our first attempt at AIKUTHON, results were weaker than expected. The main issues were not only model capacity, but also basic pipeline reliability and training setup.

We decided to revisit the entire workflow—starting from the dataset split and training loop—and then test a small set of techniques that are known to work well for segmentation in practice.

---

# Code Review & Lessons Learned

Before adding new methods, we audited our initial code and experiments.

* **Dataset split**

  * We fixed an issue where train/validation separation was not handled correctly, which made validation scores unreliable.

* **Augmentation (small-data behavior)**

  * Surprisingly, aggressive augmentations did not help in our setting.
  * Keeping only **Random Crop** (required for DeepLab V3+ input size) produced more stable results, suggesting that heavy augmentation may have introduced noise the model could not resolve given the dataset size.

* **Optimizer & training stability**

  * We switched to **AdamW** and tuned the learning rate/schedule, which improved convergence stability.
  * (Learning-rate values were not logged in this note; add them here if you have a run config.)

* **Baseline**

  * We used DeepLab V3+ (EfficientNet backbone) as a starting point.
  * Some configurations (e.g., partially frozen backbones) underperformed and were dropped early.
  * *(If you want this section to be more useful, add concrete run IDs + scores here.)*

---

# Methods

We focused on four areas: architecture, spatial priors, optimization, and loss/scheduling.

## 1. CoordConv: adding explicit spatial signals

Standard convolutions are translation-equivariant; without extra cues, the network does not explicitly see absolute position. In driving scenes, this can matter because objects often follow spatial priors (e.g., road near the bottom, sky near the top).

We implemented **CoordConv** by concatenating coordinate channels to features:

* add normalized coordinate maps (x) and (y) (and optionally radius (r)) as extra channels

This provides a lightweight way to inject absolute position information.

## 2. SegFormer: efficient global context

We also evaluated **SegFormer**, a transformer-based segmentation model that produces multi-scale features with a lightweight decoder. In our setting, SegFormer was attractive because it can capture global context without a heavy, high-latency decoder.

## 3. Optimizers (RAdam, AdaBound, AdamW)

We compared three optimizers mainly for convergence behavior and final score.

* **RAdam (Rectified Adam)**: often stabilizes early training when adaptive learning-rate variance is high.
* **AdaBound**: constrains learning rates over time, aiming for Adam-like behavior early and SGD-like behavior later.
* **AdamW**: decouples weight decay from the adaptive update, often improving generalization with modern architectures.

## 4. Loss and learning-rate scheduling

We used a hybrid loss combining BCE and Dice to balance pixel-wise classification with region overlap:

[
\mathcal{L} = \lambda,\mathcal{L}*{\text{BCE}} + (1-\lambda),\mathcal{L}*{\text{Dice}}
]

We also applied **CosineAnnealingLR** to smoothly decay the learning rate during training.

---

# Results

Across our experiments, **SegFormer + AdamW** was the most consistent setup.

| Model Backbone              | Optimizer | IoU (2 Epochs) | Final IoU |
| :-------------------------- | :-------- | :--------------: | :---------: |
| **SegFormer**               | **AdamW** |     **0.749**    |  **0.763**  |
| DeepLab V3+ (CoordConv)     | AdamW     |       0.717      |    0.749    |
| DeepLab V3+ (Standard Conv) | AdamW     |       0.705      |    0.740    |
| SegFormer                   | RAdam     |       0.738      |      -      |
| SegFormer                   | AdaBound  |       0.654      |      -      |

With additional iterations and submission-time tuning, we reached a best leaderboard score of **0.793**.


---

# Conclusion

This project reinforced a practical lesson for resource-constrained segmentation: performance gains often come from **pipeline correctness and disciplined tuning**, not only from choosing a larger model.

In our setup, (1) fixing train/val separation, (2) simplifying augmentation, and (3) using **SegFormer + AdamW** with a cosine schedule produced the best overall results. Future work could explore larger SegFormer variants, stronger but controlled augmentations, and synthetic data strategies to improve robustness on rare edge cases.

