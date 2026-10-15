---
layout: project
type: project
title: IConZIC (Image-Conditioned Zero-shot Image Captioning)
short_title: IConZIC
description: "Zero-shot image captioning that samples words with an image-conditioned masked VLM (ViLT) instead of text-only BERT, matching ConZIC's accuracy about four times faster. COSE461 (NLP) term project."
authors: Seonghu Jeon, Jiwon Jeong, Byeongwoo Jeon, Seongmin Ko
role: Project Lead, Idea reification, Experiments, Report
image: /assets/images/projects/iconzic-image-conditioned-zero-shot-image-captioning/architecture.webp
tags:
  - NLP
  - VLM
  - Image Captioning
date: 2023-03-01
categories: ["Vision"]
---

# **Introduction**

Image Captioning (IC), the task of generating descriptive text for images, has traditionally relied on massive datasets of paired image-text examples (like MSCOCO). While effective, this supervised approach struggles with "outlier" images that deviate from the training distribution. This limitation has shifted research interest toward **Zero-Shot Image Captioning (ZIC)**—methods capable of captioning images without explicit pre-training on caption pairs.

In this post, I introduce **IConZIC (Image-Conditioned Zero-shot Image Captioning)**, a project developed for the Korea University COSE461 Final Project. Our work builds upon existing state-of-the-art methods to address significant bottlenecks in initialization and generation efficiency.

## **The Problem: The "Blind" Initialization of ConZIC**


![image-1766233548862.webp](/assets/images/posts/image-1766233548862.webp)

The starting point for our research was **ConZIC**, a leading zero-shot model. ConZIC operates by using a pre-trained Masked Language Model (MLM), specifically Gibbs-BERT, to generate caption candidates via iterative sampling.

However, we identified a fundamental structural inefficiency in ConZIC. Because BERT is a text-only model, it does not "see" the image during the candidate generation phase. It relies on random masks and requires a secondary CLIP model to filter the best options later.

This creates an **initialization problem**:

1. **High computational cost:** Since the initial candidates are blind to the visual context, the model must keep a large number of candidate words per position (a large top-*k*) to find relevant ones.
2. **Sensitivity:** The model becomes highly sensitive to hyperparameter settings. Improper tuning often results in random word sequences or descriptions that ignore visual content.

# **The Solution: IConZIC and Gibbs-ViLT**

To solve the initialization problem, we proposed **IConZIC**. The core innovation lies in replacing the text-only Gibbs-BERT with **Gibbs-ViLT**, a sampling method utilizing a Vision-Language Pre-training (VLP) encoder.

Unlike BERT, ViLT is trained with an **Image-Conditioned Masked Language Modeling (ICMLM)** objective. This allows the model to predict masked tokens based on *both* textual context and visual tokens simultaneously.

## **How It Works:**


![image-1766233660908.webp](/assets/images/posts/image-1766233660908.webp)

* **Visual-aware sampling:** Instead of starting with random guesses, IConZIC samples words from a distribution conditioned on the image from the very first step.
* **Refinement:** We retained the CLIP-guided scoring mechanism to ensure high image-text alignment, selecting the best token by a weighted sum of the ViLT probability and the CLIP score (step 6, weighted by α and β).

This hypothesis was straightforward: if the model considers visual tokens from the start, we can generate accurate captions with significantly fewer candidates.

# **Experimental Results**

We evaluated IConZIC against ConZIC using the MSCOCO validation set, focusing on accuracy (CLIPScore), diversity, and generation time.

**1. Efficiency and speed**

![Top-k candidate size: accuracy, diversity, and time](/assets/images/posts/image-1766233714512.webp)

Both models pick each word from the top-*k* candidates of their masked model (step 3 of the algorithm). ConZIC needs a large candidate set: its CLIP-S rises from 0.85 at *k* = 10 to 1.03 at *k* = 200, where generation takes 36.0 s per image.

* IConZIC reaches 1.01 at *k* = 20 in 9.2 s per image, about **four times faster** than ConZIC at *k* = 200 for nearly the same score.
* IConZIC scores higher than ConZIC at every *k*, and its accuracy has nearly converged by *k* = 50 (1.04, against 1.05 at *k* = 100 and 200). At the same *k*, each IConZIC run is slightly slower (8.1 s against 6.8 s at *k* = 10), so the speed-up comes from needing a smaller *k*.

**2. Robustness**

![Weight α: accuracy and diversity](/assets/images/posts/image-1766233688363.webp)

The weight α in step 6 balances the masked model's word probability against the CLIP score. As α grows, ConZIC's CLIP-S drops from 0.95 to 0.61 at α = 2.0, while IConZIC still keeps 0.75; at α = 0.2 the scores are 0.81 and 0.89.

**3. Qualitative results on out-of-distribution images**

![Captions on out-of-distribution images](/assets/images/posts/image-1766233850919.webp)

We also captioned images that look unlike standard photo datasets, such as a Minecraft screenshot and Van Gogh's *The Starry Night*. ConZIC often produced broken sentences ("image of is large scale image from to."), while IConZIC's captions stayed closer to the image content ("image of night the view on the canvas paintings").

# **Limitations and Trade-offs**

It is important to note the trade-offs involved in this approach. Our experiments showed that IConZIC exhibits lower vocabulary diversity than ConZIC: at *k* = 200 it used 5,921 distinct words against ConZIC's 9,434. This is attributed to the pre-training data: BERT is trained on vast, diverse internet text, whereas ViLT is trained on curated, human-annotated caption datasets. While this results in less varied vocabulary, the trade-off yields higher accuracy and relevance to the image content.

# **Conclusion**

The IConZIC project demonstrates that **ICMLMs can not only "see" but also "speak"**. By integrating visual conditioning into the generative sampling process, we successfully resolved the initialization bottlenecks of previous zero-shot methods. This work highlights the potential of Vision-Language Pre-training models to create more efficient, robust, and accurate image captioning systems without the need for extensive supervised fine-tuning.
