---
layout: page
title: About Me
permalink: /about-me
comments: false
custom_css_class: about-page-custom
github: https://github.com/JeonSeongHu
linkedin: https://www.linkedin.com/in/seonghu-jeon-3a74402b1/
---

<div class="about-page">
	<div class="about-hero">
		<div class="about-hero-top">
			<img src="{{ site.baseurl }}/assets/images/seonghu_jeungsa.png" alt="Seonghu Jeon" class="about-photo">
			<div class="about-hero-info">
				<h1 class="about-name">Seonghu Jeon</h1>
				<p class="about-role">M.S. Student @ KAIST CVLAB</p>
				<div class="about-icons">
					<a href="mailto:jsh0423@korea.ac.kr" title="Email"><i class="far fa-envelope"></i></a>
					<a href="https://github.com/JeonSeongHu" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fab fa-github"></i></a>
					<a href="{{ page.linkedin }}" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
				</div>
			</div>
		</div>
		<p class="about-bio">I study the internal reasoning of <strong>generative 3D/4D models</strong> and infuse them with <strong>physical and perceptual priors</strong>, so AI can interpret and interact with dynamic environments more like humans do.</p>
	</div>

	<div class="about-grid">
		<div class="about-left">
			<div class="about-card about-news">
				<h3 class="card-title">News</h3>
				<div class="news-item"><span class="news-date">2026.03</span>Started M.S. at KAIST CVLAB</div>
				<div class="news-item"><span class="news-date">2026.02</span>One paper accepted to CVPR 2026</div>
		<div class="news-item"><span class="news-date">2025.07</span>ReMoTE accepted to ITC-CSCC (Oral)</div>
			</div>

			<div class="about-card about-exp">
				<h3 class="card-title">Experience</h3>
				<div class="exp-item">
					<div class="exp-role">M.S. Student</div>
					<div class="exp-where">KAIST CVLAB · 2026 -</div>
				</div>
				<div class="exp-item">
					<div class="exp-role">Research Intern</div>
					<div class="exp-where">KAIST CVLAB · 2023 - 2026</div>
				</div>
				<div class="exp-item">
					<div class="exp-role">B.S. in Computer Science & Engineering</div>
					<div class="exp-where">Korea University (4.46/4.50) · 2022 - 2026</div>
				</div>
			</div>

			<div class="about-card about-interests">
				<h3 class="card-title">Research Interests</h3>
				<div class="interest-tags">
					<span class="interest-tag">Generative 3D/4D Models</span>
					<span class="interest-tag">Physical Priors</span>
					<span class="interest-tag">Perceptual Alignment</span>
					<span class="interest-tag">Flow Matching</span>
				</div>
			</div>
		</div>

		<div class="about-card about-pubs">
			<h3 class="card-title card-title-main">Selected Publications</h3>

			{% assign publications = site.projects | where: "type", "publication" | sort: "date" | reverse %}
			{% for pub in publications %}
			<a href="{{ site.baseurl }}{{ pub.url }}" class="pub-item">
				{% if pub.image and pub.image != "" %}
				<img src="{{ pub.image }}" class="pub-thumb" alt="{{ pub.title }}">
				{% else %}
				<div class="pub-thumb pub-thumb-placeholder">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
				</div>
				{% endif %}
				<div class="pub-info">
					<div class="pub-title">{{ pub.title }}</div>
					<div class="pub-authors">{{ pub.authors | replace: "Seonghu Jeon", "<b>Seonghu Jeon</b>" }}</div>
					<div class="pub-meta">{{ pub.venue }} · {{ pub.date | date: "%Y" }}</div>
					<div class="pub-links">
						{% if pub.link != "" and pub.link %}<span class="pub-link-btn">Paper</span>{% endif %}
						{% if pub.project_link != "" and pub.project_link %}<span class="pub-link-btn">Project</span>{% endif %}
						{% if pub.code != "" and pub.code %}<span class="pub-link-btn">Code</span>{% endif %}
					</div>
				</div>
			</a>
			{% endfor %}

			<div class="pub-footer">
				<a href="{{ site.baseurl }}/publications">All Publications ↗</a>
				<a href="{{ site.baseurl }}/projects">All Projects ↗</a>
				<a href="{{ site.baseurl }}/cv">Curriculum Vitae ↗</a>
			</div>
		</div>
	</div>
</div>
