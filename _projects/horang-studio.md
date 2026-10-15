---
layout: project
type: project
title: "Horang Studio"
short_title: "Horang Studio"
description: "AI profile-photo service for Korea University festivals. Ver 1 (Sep 2023) swapped each user's face into pre-generated presets; Ver 2 (May 2024) generated every portrait from the user's own photos with IP-Adapter, ControlNet, and ReActor. 2,000+ students served."
image: "/assets/images/projects/horang-studio-thumb.webp"
date: 2023-08-01
tags: ["Generative AI", "Stable Diffusion", "IP-Adapter", "ControlNet", "Web Service"]
categories: ["Generative Models", "Systems/Web"]
---

## Overview

**Horang Studio** (호랑이 사진관, "Tiger Photo Studio") is an AI profile-photo service for Korea University students, built by GDSC Korea University with support from Kakao Brain. A student uploads a few selfies and receives a portrait on the crimson background of the university's visual identity.

The service ran twice: **Ver 1** for the Korea–Yonsei Games in September 2023, and **Ver 2** for the Seoktap Festival (Kutopia) in May 2024, serving over **2,000 students** across both events. I was an AI engineer on both editions: in Ver 1 I mainly built the presets, and in Ver 2, as one of three AI engineers, I put together the overall pipeline and ran the experiments.

![Ver 1 and Ver 2 outputs](/assets/images/projects/horang-1.webp)

## Ver 1 (Sep 2023): pre-generated presets and face swap

Generating each portrait from scratch with a diffusion model would follow the user's features more closely, but on a festival day it raised three problems: unstable outputs, long generation time and GPU cost, and the risk of producing an inappropriate image.

Ver 1 therefore generated the portraits in advance. We built **18 preset types with 5 to 10 images each**. The user's gender, glasses, ethnicity, and age selected a preset, and **FaceSwapLab** in Stable Diffusion WebUI replaced only the face, using a face embedding averaged over the uploaded photos. An upscaler and a frame merger produced the final image.

![Pre-generated presets](/assets/images/projects/horang-presets.webp)

![Ver 1 pipeline](/assets/images/projects/horang-2.webp)

Running Ver 1 surfaced two problems:

- **Results often did not look like the user.** The preset was chosen from four attributes, so face shape, build, and hairstyle never reached the image. At best, the user got the preset that happened to look most similar.
- **Many uploads could not be used.** Users sent photos with masks or sunglasses, the same photo several times, photos of things other than people, and photos of celebrities.

## Ver 2 (May 2024): generation from the user's own photos

Ver 2 dropped the preset images and generated every portrait from the user's photos. The upload page also stated clearly which photos work.

![Ver 2 pipeline (faces mosaicked)](/assets/images/projects/horang-pipeline-v2.webp)

- **IP-Adapter** uses the photo itself as an image prompt, so face shape and build carry over without being described in text.
- **Face preprocessing** with YOLO face detection, a face segmenter, and background filling keeps only the face. Without it, IP-Adapter also copied the background color and the pose of the source photo.
- **A random preset** of seed, prompt, negative prompt, and pose fixes the composition. ControlNet takes the pose, and the prompt is composed from the user's gender, glasses, and style.
- **ReActor** swaps in a mean face embedding computed from the uploaded photos, followed by the same upscaler and frame merger.

With the same prompt, pose, and seed, Ver 2 reflected each user's appearance better than the preset approach. Prompt variants could also change the hairstyle or add glasses regardless of the input photo. Testing still turned up failures: for example, some men wearing earrings were rendered as women even with "man" in the prompt, most likely because IP-Adapter read the reference photo as female.

## Lessons

- **Engineering is not research.** A research project can optimize a metric and try many ideas. A service has to satisfy as many users as possible under strict limits on compute and inference time.
- **The input decides the output.** Pre- and post-processing can only fix so much. An upload flow that guides users to good photos mattered as much as the model.

I presented the project as *Horang Studio: AI Methods Overview* at the GDSC Yonsei × Korea University collaboration session on May 10, 2024.

## Team

Horang Studio was built by an engineering team and a planning team at GDSC Korea University (now GDG on Campus Korea University).

![Team](/assets/images/projects/horang-horang_studio_team.webp)
