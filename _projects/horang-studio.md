---
layout: project
type: project
title: "Horang Studio"
short_title: "Horang Studio"
description: "AI profile picture generation service for Korea University festival — identity-preserving Stable Diffusion pipeline serving 2,000+ students."
image: "/assets/images/projects/horang-studio-thumb.webp"
date: 2023-08-01
tags: ["Generative AI", "Stable Diffusion", "Web Service"]
---

## Overview

**Horang Studio** is a personalized AI profile-photo generation service built for Korea University's campus festivals. Using a diffusion-based pipeline with identity-preserving face swap, we generated crimson-themed portrait photos that blend each student's face with Korea University's visual identity — the crimson color, tiger mascot, and cheering traditions.

The service was deployed twice: at the **2023 Korea–Yonsei Rivalry Festival** (Ver 1) and the **2024 Kutopia Spring Festival** (Ver 2), serving over **2,000 students** across both events.

![Version comparison](/assets/images/projects/horang-1.webp)

## Motivation

Korea University hosts numerous annual festivals where students actively share photos on social media. We recognized that AI-generated portrait services were gaining popularity, and envisioned leveraging the university's strong visual identity to create personalized profile images.

> *"What if a personal photo could be more than a record of myself? What if it could visually represent the community I belong to?"*

## Technical Pipeline

The system takes a user photo and demographic info as input, selects a matching pre-generated preset, and applies identity-preserving face swap using Stable Diffusion WebUI with FaceSwapLab and post-processing extensions (upscaler, frame merger).

![Pipeline](/assets/images/projects/horang-2.webp)

**Key components:**
- **Stable Diffusion WebUI** with custom extensions
- **FaceSwapLab** for identity-preserving face embedding
- Pre-generated crimson-themed presets conditioned on gender, age, and style
- Post-processing: face upscaler + frame merger for final output quality

## Team

This project was developed with **GDGoC (Google Developer Groups on Campus) Korea University**.

![Team](/assets/images/projects/horang-horang_studio_team.webp)
