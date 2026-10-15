---
layout: project
type: project
title: "MelitsUp / @tune"
short_title: "MelitsUp"
description: "AI music recommendation. MelitsUp finds Korean songs whose lyrics match a song or a sentence, using sentence embeddings over about 200,000 songs; @tune extends it to picking background music for a photo."
image: "/assets/images/projects/melitsup-thumb.webp"
date: 2022-09-01
tags: ["Music RecSys", "Sentence Embedding", "LLM", "VLM"]
categories: ["Other"]
---

## Overview

**MelitsUp** ("AI가 추천해주는 오늘의 노래", the song of the day recommended by AI) recommends Korean songs by what their lyrics say. **@tune** ("당신의 일상에 배경음악을 더하다", background music for your day) extends it from text to images and picks a song for a photo.

I led the team from September 2022 to August 2023 and worked on idea planning, data collection, model implementation and training, and prototyping. We presented both services at the KUGODS 2023 Q2 All-hands Meeting in June 2023.

## MelitsUp: text to song

* **Data.** We collected about 200,000 songs from a Korean music streaming service: every song by every artist who had entered a monthly chart at least once since 1980.
* **Song vectors.** Pretrained Korean sentence-embedding models (Ko-SBERT, KoSimCSE, KoDiffCSE) turn each song's lyrics into a vector, and an LLM augments the lyrics data.
* **Search.** The query is either a song ("similar-song search") or a free sentence ("search by sentence"). It is embedded the same way, and the most similar songs are returned, filtered by release years, genre, and artist. We built the demo with Gradio.

![MelitsUp search results for a sentence query, filtered to 2015–2021 ballads and R&B](/assets/images/projects/melitsup-ui.webp)

## @tune: image to song

@tune takes a photo instead of text. Plain similarity was not enough for this, so @tune recommends by mood and genre: a two-stage pipeline takes both the mood of the image and the genre of each song into account, with a pretrained vision-language model reading the image.
