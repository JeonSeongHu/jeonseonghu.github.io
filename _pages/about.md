---
layout: portfolio
title: About
permalink: /
redirect_from:
  - /about-me/
comments: false
custom_css_class: portfolio-page
lang: en
---

<section class="pf-hero" id="hero">
	<div class="pf-hero-text">
		<div class="pf-eyebrow">M.S. Student, KAIST CVLAB</div>
		<h1 class="pf-h1">Seonghu Jeon<span class="pf-blue">.</span></h1>
		<p class="pf-deck">
			I build geometry-aware generative models for 3D/4D vision and robot learning. My work connects multi-view generation, geometric foundation models, and visuomotor policy learning.
		</p>
		<div class="pf-links">
			<a class="pf-link" href="#publications">Selected Work<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
			<a class="pf-link" href="{{ site.baseurl }}/cv/">CV<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
			<a class="pf-link" href="https://scholar.google.com/citations?user=XavKlZQAAAAJ" target="_blank" rel="noopener">Google Scholar<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
		</div>
	</div>
	<div class="pf-portrait">
		<img src="{{ site.baseurl }}/assets/images/profile_400.png" alt="Portrait of Seonghu Jeon" width="400" height="500" loading="eager" fetchpriority="high" decoding="async">
	</div>
</section>

<section class="pf-sec" id="publications">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<h2 class="pf-sec-title">Featured research</h2>
		</div>
	</header>

	{% assign pubs = site.projects | where: "type", "publication" | sort: "date" | reverse %}
	<div class="pf-pub-list">
		{% for pub in pubs limit: 3 %}
		{% assign venue_lower = pub.venue | downcase %}
		{% assign featured = false %}
		{% if venue_lower contains "cvpr" or venue_lower contains "iccv" or venue_lower contains "eccv" or venue_lower contains "neurips" or venue_lower contains "siggraph" %}
			{% assign featured = true %}
		{% endif %}
		<article class="pf-pub{% if featured %} is-featured{% endif %}">
			<a class="pf-pub-thumb" href="{{ site.baseurl }}{{ pub.url }}">
				{% if pub.image and pub.image != "" %}
				<img src="{{ pub.image }}" alt="{{ pub.title }}" loading="lazy">
				{% endif %}
			</a>
			<div class="pf-pub-body">
				<div class="pf-pub-venue{% if featured %} is-hi{% endif %}">
					<span class="pf-pub-pin"></span>{{ pub.venue }}
					{% if pub.oral %}<span class="pf-oral-badge">Long Oral</span>{% endif %}
				</div>
				<h3 class="pf-pub-title"><a href="{{ site.baseurl }}{{ pub.url }}">{{ pub.title }}</a></h3>
				<p class="pf-pub-authors">
					{% assign authors = pub.authors | split: ", " %}
					{% for author in authors %}{% if author contains "Seonghu Jeon" %}<span class="pf-pub-me">{{ author }}</span>{% else %}{{ author }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}
				</p>
			</div>
			<div class="pf-pub-links">
				{% if pub.link and pub.link != "" %}<a href="{{ pub.link }}" target="_blank" rel="noopener">paper</a>{% endif %}
				{% if pub.project_link and pub.project_link != "" %}<a href="{{ pub.project_link }}" target="_blank" rel="noopener">project</a>{% endif %}
				{% if pub.code and pub.code != "" %}<a href="{{ pub.code }}" target="_blank" rel="noopener">code</a>{% endif %}
			</div>
		</article>
		{% endfor %}
	</div>
</section>

<section class="pf-sec" id="news">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<h2 class="pf-sec-title">News &amp; notes</h2>
		</div>
	</header>
	<div class="pf-news-list">
		<div class="pf-news-item">
			<span class="pf-news-date">2026.08</span>
			<span class="pf-news-body"><b>GAM</b> was accepted to <a href="https://eccv2026-3d-world-models.github.io/" target="_blank" rel="noopener"><b>3DWM @ ECCV 2026</b></a>.</span>
		</div>
		<div class="pf-news-item pf-news-item--oral">
			<span class="pf-news-date">2026.07</span>
			<span class="pf-news-body"><b>GLD</b> was selected for a <span class="pf-oral-highlight">Long Oral Presentation</span> at <b>ECCV 2026</b>.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2026.07</span>
			<span class="pf-news-body">Joined <b>MAUM AI</b>'s WoRV Division, Future Intelligence Lab as a research intern for Robotics Foundation Model development.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2026.03</span>
			<span class="pf-news-body">Joined <b>KAIST CVLAB</b> as an M.S. student under Prof. Seungryong Kim.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2026.02</span>
			<span class="pf-news-body"><b>CAMEO</b> accepted to <span class="pf-blue">CVPR 2026</span> for correspondence-attention alignment in multi-view diffusion.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2026.02</span>
			<span class="pf-news-body">Graduated from <b>Korea University</b>, B.S. in Computer Science &amp; Engineering, with Great Honors.</span>
		</div>
	</div>
</section>

<section class="pf-sec" id="focus">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<h2 class="pf-sec-title">Focus</h2>
		</div>
	</header>

	<div class="pf-focus-list">
		<div class="pf-focus-item">
			<span class="pf-focus-num">01</span>
			<div class="pf-focus-mid">
				<span class="pf-focus-label">3D / 4D vision</span>
				<p class="pf-focus-desc">Reconstructing static and dynamic scenes from sparse views, and studying how geometry-trained foundation models transfer to view synthesis, including GLD, an ECCV 2026 Long Oral Presentation.</p>
			</div>
		</div>
		<div class="pf-focus-item">
			<span class="pf-focus-num">02</span>
			<div class="pf-focus-mid">
				<span class="pf-focus-label">Generative models</span>
				<p class="pf-focus-desc">Diffusion and flow matching with structured conditioning across correspondence, geometry, and motion. Architecture work and better source distributions.</p>
			</div>
		</div>
		<div class="pf-focus-item">
			<span class="pf-focus-num">03</span>
			<div class="pf-focus-mid">
				<span class="pf-focus-label">Robotics</span>
				<p class="pf-focus-desc">The destination. If a robot can imagine a scene's geometry forward in time, it can plan in it, and that loop closes through generative models.</p>
			</div>
		</div>
	</div>
</section>

<section class="pf-sec" id="experience">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<h2 class="pf-sec-title">Experience</h2>
		</div>
	</header>

	<div class="pf-exp-list">
		<div class="pf-exp-item">
			<span class="pf-exp-index">01</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">Research Intern</div>
				<div class="pf-exp-meta">
					<span class="pf-exp-org">MAUM AI, WoRV Division, Future Intelligence Lab</span>
					<span class="pf-exp-time">Jul 2026 &ndash; <span class="pf-now-mark">Present</span></span>
				</div>
				<div class="pf-exp-detail">Participating in Robotics Foundation Model development.</div>
			</div>
		</div>
		<div class="pf-exp-item">
			<span class="pf-exp-index">02</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">M.S. Student</div>
				<div class="pf-exp-meta">
					<span class="pf-exp-org">KAIST CVLAB</span>
					<span class="pf-exp-time">2026 &ndash; <span class="pf-now-mark">Present</span></span>
				</div>
				<div class="pf-exp-detail">Advised by Prof. Seungryong Kim. Multi-view diffusion, geometric foundation models, 4D scene generation.</div>
			</div>
		</div>
		<div class="pf-exp-item">
			<span class="pf-exp-index">03</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">Research Intern</div>
				<div class="pf-exp-meta">
					<span class="pf-exp-org">CVLAB, Korea University → KAIST</span>
					<span class="pf-exp-time">Dec 2023 &ndash; Feb 2026</span>
				</div>
				<div class="pf-exp-detail">Pre-graduate research on motion transfer and correspondence-attention. Multiple co-authored papers from this period.</div>
			</div>
		</div>
		<div class="pf-exp-item">
			<span class="pf-exp-index">04</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">B.S., Computer Science &amp; Engineering</div>
				<div class="pf-exp-meta">
					<span class="pf-exp-org">Korea University</span>
					<span class="pf-exp-time">2022 &ndash; 2026</span>
				</div>
				<div class="pf-exp-detail">Graduated with Great Honors (4.46 / 4.50). Coursework in vision, graphics, and deep learning.</div>
			</div>
		</div>
	</div>
</section>
