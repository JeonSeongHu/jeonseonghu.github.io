---
layout: portfolio
title: About
permalink: /about-me/
comments: false
custom_css_class: portfolio-page
---

<section class="pf-hero" id="hero">
	<div class="pf-hero-text">
		<div class="pf-eyebrow">M.S. Researcher · KAIST CVLAB</div>
		<h1 class="pf-h1">Seonghu Jeon<span class="pf-blue">.</span></h1>
		<p class="pf-deck">
			I work on <b>3D &amp; 4D vision</b> and <b>generative models</b> — teaching machines to reconstruct dynamic scenes and act in them through robotics. Currently betting that diffusion, not optimization, is how this loop closes. Reach me at <a href="mailto:jsh0423@korea.ac.kr">jsh0423@korea.ac.kr</a>.
		</p>
		<div class="pf-links">
			<a class="pf-link" href="{{ site.baseurl }}/cv/">Curriculum Vitae<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
			<a class="pf-link" href="https://scholar.google.com/citations?user=XavKlZQAAAAJ&hl=ko" target="_blank" rel="noopener">Google Scholar<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
			<a class="pf-link" href="https://github.com/JeonSeongHu" target="_blank" rel="noopener">GitHub<span class="pf-link-arrow" aria-hidden="true">↗</span></a>
		</div>
	</div>
	<div class="pf-portrait">
		<img src="{{ site.baseurl }}/assets/images/seonghu_jeungsa_400.png" alt="Seonghu Jeon" loading="lazy">
		<span class="pf-portrait-corner" aria-hidden="true"></span>
	</div>
</section>

<section class="pf-sec" id="news">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<span class="pf-sec-num">— 01</span>
			<h2 class="pf-sec-title">News &amp; notes</h2>
		</div>
		<span class="pf-sec-aside">most recent first</span>
	</header>
	<div class="pf-news-list">
		<div class="pf-news-item">
			<span class="pf-news-date">2026.03</span>
			<span class="pf-news-body">Joined <b>KAIST CVLAB</b> as an M.S. student under Prof. Seungryong Kim.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2026.02</span>
			<span class="pf-news-body"><b>CAMEO</b> accepted to <span class="pf-blue">CVPR 2026</span> — correspondence-attention alignment for multi-view diffusion.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2025.07</span>
			<span class="pf-news-body"><b>ReMoTE</b> accepted to ITC-CSCC as oral presentation.</span>
		</div>
		<div class="pf-news-item">
			<span class="pf-news-date">2025.02</span>
			<span class="pf-news-body">Graduated from <b>Korea University</b>, B.S. in Computer Science &amp; Engineering, with Great Honors.</span>
		</div>
	</div>
</section>

<section class="pf-sec" id="publications">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<span class="pf-sec-num">— 02</span>
			<h2 class="pf-sec-title">Selected publications</h2>
		</div>
		{% assign pubs = site.projects | where: "type", "publication" | sort: "date" | reverse %}
		<span class="pf-sec-aside">{{ pubs | size | prepend: "0" | slice: -2, 2 }} entries</span>
	</header>

	<div class="pf-pub-list">
		{% for pub in pubs %}
		{% assign venue_lower = pub.venue | downcase %}
		{% assign featured = false %}
		{% if venue_lower contains "cvpr" or venue_lower contains "iccv" or venue_lower contains "eccv" or venue_lower contains "neurips" or venue_lower contains "siggraph" %}
			{% assign featured = true %}
		{% endif %}
		{% assign hi = false %}
		{% if featured or venue_lower contains "oral" %}
			{% assign hi = true %}
		{% endif %}
		<article class="pf-pub{% if featured %} is-featured{% endif %}">
			<a class="pf-pub-thumb" href="{{ site.baseurl }}{{ pub.url }}">
				{% if pub.image and pub.image != "" %}
				<img src="{{ pub.image }}" alt="{{ pub.title }}" loading="lazy">
				{% endif %}
				{% if featured and pub.short_title %}
				<span class="pf-pub-thumb-name">{{ pub.short_title | upcase }}</span>
				{% endif %}
			</a>
			<div class="pf-pub-body">
				<div class="pf-pub-venue{% if hi %} is-hi{% endif %}">
					<span class="pf-pub-pin"></span>{{ pub.venue }}
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

<section class="pf-sec" id="focus">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<span class="pf-sec-num">— 03</span>
			<h2 class="pf-sec-title">Focus</h2>
		</div>
		<span class="pf-sec-aside">three open threads</span>
	</header>

	<div class="pf-focus-list">
		<div class="pf-focus-item">
			<div class="pf-focus-head">
				<span class="pf-focus-num">— 01</span>
				<span class="pf-focus-label">3D / 4D vision</span>
			</div>
			<p class="pf-focus-desc">Reconstructing static and dynamic scenes from sparse views — how foundation models trained on geometry transfer to view-synthesis without optimization.</p>
		</div>
		<div class="pf-focus-item">
			<div class="pf-focus-head">
				<span class="pf-focus-num">— 02</span>
				<span class="pf-focus-label">Generative models</span>
			</div>
			<p class="pf-focus-desc">Diffusion and flow matching with structured conditioning — correspondence, geometry, motion. Architecture work and better source distributions.</p>
		</div>
		<div class="pf-focus-item">
			<div class="pf-focus-head">
				<span class="pf-focus-num">— 03</span>
				<span class="pf-focus-label">Robotics</span>
			</div>
			<p class="pf-focus-desc">The destination. If a robot can imagine a scene's geometry forward in time, it can plan in it — and that loop closes through generative models.</p>
		</div>
	</div>

	<aside class="pf-now">
		<span class="pf-now-tag">/ Now</span>
		<span class="pf-now-text">Connecting <b>3D foundation models</b> to <b>robotics</b> — turning learned geometric priors into actionable scene understanding for embodied agents.</span>
		<a class="pf-now-arrow" href="{{ site.baseurl }}/projects">read more <span aria-hidden="true">↗</span></a>
	</aside>
</section>

<section class="pf-sec" id="experience">
	<header class="pf-sec-head">
		<div class="pf-sec-lh">
			<span class="pf-sec-num">— 04</span>
			<h2 class="pf-sec-title">Experience</h2>
		</div>
	</header>

	<div class="pf-exp-list">
		<div class="pf-exp-item">
			<span class="pf-exp-org">KAIST CVLAB</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">M.S. Student</div>
				<div class="pf-exp-detail">Advised by Prof. Seungryong Kim. Multi-view diffusion, geometric foundation models, 4D scene generation.</div>
			</div>
			<span class="pf-exp-time">2026 — <span class="pf-now-mark">now</span></span>
		</div>
		<div class="pf-exp-item">
			<span class="pf-exp-org">KAIST CVLAB</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">Research Intern</div>
				<div class="pf-exp-detail">Pre-graduate research on motion transfer and correspondence-attention. Multiple co-authored papers from this period.</div>
			</div>
			<span class="pf-exp-time">2023 — 2026</span>
		</div>
		<div class="pf-exp-item">
			<span class="pf-exp-org">Korea University</span>
			<div class="pf-exp-mid">
				<div class="pf-exp-role">B.S., Computer Science &amp; Engineering</div>
				<div class="pf-exp-detail">Graduated with Great Honors (4.46 / 4.50). Coursework in vision, graphics, and deep learning.</div>
			</div>
			<span class="pf-exp-time">2022 — 2026</span>
		</div>
	</div>
</section>
