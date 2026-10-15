---
layout: project
type: publication
title: "ReMoTE: A Benchmark for Object Motion Transfer"
short_title: "ReMoTE"
description: "A benchmark dataset and evaluation protocol for object motion transfer, introducing improved metrics that better correlate with human perception."
image: "/assets/images/projects/remote-figure1.webp"
authors: "Seonghu Jeon, Jinhyeok Choi, Junghyun Hwang, Seungryong Kim†"
venue: "ITC-CSCC 2025"
date: 2025-06-01
role: "First Author"
link: "https://ieeexplore.ieee.org/document/11137589"
pdf: "https://ieeexplore.ieee.org/document/11137589"
tags: ["Benchmark", "Motion Transfer", "Computer Vision"]
bibtex: |
  @inproceedings{jeon2025remote,
    title     = {ReMoTE: A Benchmark for Object Motion Transfer},
    author    = {Jeon, Seonghu and Choi, Jinhyeok and Hwang, Junghyun and Kim, Seungryong},
    booktitle = {International Technical Conference on Circuits/Systems, Computers and Communications (ITC-CSCC)},
    year      = {2025}
  }
---

## Abstract

**ReMoTE** (Refining the object Motion Transfer Evaluation) is a benchmark for object motion transfer, presented as an oral at ITC-CSCC 2025. Prior work did not distinguish whether the object's structure changes during transfer, and relied on the motion fidelity (MF) score, whose validity had not been checked. We show that MF has near-zero correlation with human perception and propose a new dataset and two metrics that track human judgment more closely.

## Benchmark

* **Two sub-tasks.** The dataset splits object motion transfer into *intra-category* transfer, where the target keeps roughly the source object's structure, and *cross-category* transfer, where the structure changes substantially.
* **Why MF fails.** MF matches each source trajectory to the generated trajectory with the highest correlation, which can pair trajectories from unrelated regions of the video and produce false positives. When the generated object's structure differs from the source, MF can also undervalue transfers that people judge as successful.

## Metrics

* **Masked Local Motion Fidelity (MLMF)** restricts trajectory matching to local correspondences and samples trajectories only inside the object mask, so objects are no longer matched to the background.
* **Video Motion Distance (VMD)** compares the two videos with quantized motion histograms built per sub-volume, following Fréchet Video Motion Distance. It covers the whole scene and is robust to structural changes, which makes it suitable for the cross-category setting.

In our experiments, both metrics stayed robust in the cross-category setting while still distinguishing different motions, and a user study showed a stronger correlation with human perception than MF.

## Links

- [Paper](https://ieeexplore.ieee.org/document/11137589)
