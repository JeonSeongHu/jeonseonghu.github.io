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

<div class="pf-home">

<section class="pf-hero" id="hero">
	<div class="pf-hero-text">
		<div class="pf-eyebrow">Integrated M.S./Ph.D. Student<span class="pf-eyebrow-sep">, </span><span class="pf-eyebrow-org">KAIST CVLAB</span></div>
		<h1 class="pf-h1">Seonghu Jeon<span class="pf-blue">.</span></h1>
		<p class="pf-deck">
			I explore intelligence, aiming to connect agentic robotics, 3D/4D world modeling, and human-robot interaction. My work so far spans <span class="pf-nowrap">multi-view</span> generation, geometric foundation models, and visuomotor policy learning.
		</p>
	</div>
	<nav class="pf-hero-nav" aria-label="Quick links">
		<div class="pf-hero-group pf-hero-group--ext">
			<span class="pf-hero-label">Elsewhere</span>
			<a href="{{ site.baseurl }}/cv/">{% include icon.html name="cv" size=15 %}CV<span class="pf-arr" aria-hidden="true">↗</span></a>
			<a href="https://scholar.google.com/citations?user=XavKlZQAAAAJ" target="_blank" rel="noopener">{% include icon.html name="scholar" size=15 %}<span><span class="pf-hide-sm">Google&nbsp;</span>Scholar</span><span class="pf-arr" aria-hidden="true">↗</span></a>
			<a href="https://github.com/JeonSeongHu" target="_blank" rel="noopener">{% include icon.html name="github" size=15 %}GitHub<span class="pf-arr" aria-hidden="true">↗</span></a>
		</div>
	</nav>
	<div class="pf-portrait">
		<img src="{{ site.baseurl }}/assets/images/profile_400.png" alt="Portrait of Seonghu Jeon" width="400" height="500" loading="eager" fetchpriority="high" decoding="async">
	</div>
</section>

<section class="pf-sec pf-hsec" id="news">
	{% assign news = site.data.news %}
	<header class="pf-hhead pf-hhead--row">
		<h2 class="pf-sec-title">News &amp; notes</h2>
		<div class="pf-pills" role="group" aria-label="Filter news by category">
			<button type="button" class="pf-pill-f is-active" data-filter="all" aria-pressed="true">All</button>
			{% assign cats = "Paper,Honor,Career,Education" | split: "," %}{% for cat in cats %}
			<button type="button" class="pf-pill-f" data-filter="{{ cat | downcase }}" aria-pressed="false">{{ cat }}</button>
			{% endfor %}
		</div>
	</header>
	{% assign months = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec" | split: "," %}
	{% assign years = news | group_by_exp: "n", "n.date | slice: 0, 4" %}
	{% assign latest_done = false %}
	<ol class="pf-ntl" data-news>
		{% for y in years %}
		<li class="pf-nyear{% if forloop.first %} is-open{% endif %}" data-year="{{ y.name }}">
			<button type="button" class="pf-nyear-head" aria-expanded="{% if forloop.first %}true{% else %}false{% endif %}" aria-controls="news-{{ y.name }}">
				<span class="pf-nyear-year">{{ y.name }}</span>
				<span class="pf-nyear-track" aria-hidden="true"><i></i></span>
				<span class="pf-nyear-rule"><span class="pf-nyear-count" data-count>{{ y.size }} {% if y.size == 1 %}item{% else %}items{% endif %}</span>{% include icon.html name="chevron-down" size=16 %}</span>
			</button>
			<div class="pf-nyear-body" id="news-{{ y.name }}"><div>
				<ol class="pf-nyear-list">
					{% for n in y.items %}
					{% assign cat = n.category | downcase %}
					{% assign parts = n.date | split: "." %}
					<li class="pf-nrow{% unless latest_done %} is-latest{% endunless %}" data-cat="{{ cat }}">
						{% assign latest_done = true %}
						<span class="pf-nrow-date">{% if parts.size > 1 %}{% assign mi = parts[1] | plus: 0 | minus: 1 %}<time datetime="{{ parts[0] }}-{{ parts[1] }}">{{ months[mi] }}</time>{% endif %}</span>
						<span class="pf-nrow-track" aria-hidden="true"><i></i></span>
						<span class="pf-nrow-cat pf-cat--{{ cat }}">{% include icon.html name=cat size=14 %}{{ n.category }}</span>
						<div class="pf-nrow-body">
							<p class="pf-nrow-text">{{ n.text }}</p>
							{% if n.detail %}
							<div class="pf-nrow-more"><div>
								<p class="pf-nrow-detail">{{ n.detail }}</p>
								{% if n.links %}<p class="pf-nrow-links">{% for l in n.links %}{% assign first = l.url | slice: 0 %}{% if first == "#" %}<a href="{{ l.url }}">{{ l.label }}<span class="pf-arr" aria-hidden="true">↓</span></a>{% else %}<a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.label }}<span class="pf-arr" aria-hidden="true">↗</span></a>{% endif %}{% endfor %}</p>{% endif %}
							</div></div>
							{% endif %}
						</div>
					</li>
					{% endfor %}
				</ol>
			</div></div>
		</li>
		{% endfor %}
	</ol>
	<div class="pf-ntoggle-row">
		<button type="button" class="pf-ntoggle" data-news-toggle aria-expanded="false"><span data-label>Show all</span>{% include icon.html name="chevron-down" size=16 %}</button>
	</div>
</section>

<section class="pf-sec pf-hsec" id="publications">
	<header class="pf-hhead">
		<h2 class="pf-sec-title">Featured research</h2>
		<a class="pf-sec-link" href="{{ site.baseurl }}/publications/">All publications<span class="pf-link-arrow" aria-hidden="true">→</span></a>
	</header>

	{% assign pubs = site.projects | where: "type", "publication" | sort: "date" | reverse %}
	<div class="pf-pub-list">
		{% for pub in pubs limit: 4 %}
		{% assign venue_lower = pub.venue | downcase %}
		{% assign featured = false %}
		{% if venue_lower contains "cvpr" or venue_lower contains "iccv" or venue_lower contains "eccv" or venue_lower contains "neurips" or venue_lower contains "siggraph" %}
			{% assign featured = true %}
		{% endif %}
		<article class="pf-pub{% if featured %} is-featured{% endif %}">
			<a class="pf-pub-thumb" href="{{ site.baseurl }}{{ pub.url }}" tabindex="-1" aria-hidden="true">
				{% if pub.image and pub.image != "" %}
				<img src="{{ pub.image }}" alt="" loading="lazy">
				{% endif %}
			</a>
			<div class="pf-pub-body">
				<div class="pf-pub-venue{% if featured %} is-hi{% endif %}">
					{{ pub.venue }}
					{% if pub.oral %}<span class="pf-oral-badge">{% include icon.html name="honor" size=13 %}Long Oral</span>{% endif %}
				</div>
				<h3 class="pf-pub-title"><a href="{{ site.baseurl }}{{ pub.url }}">{{ pub.title }}</a></h3>
				<button type="button" class="pf-details" aria-expanded="false" aria-controls="pub-more-{{ forloop.index }}">Details{% include icon.html name="chevron-down" size=14 %}</button>
				<div class="pf-pub-more" id="pub-more-{{ forloop.index }}">
					<p class="pf-pub-authors">
						{% assign authors = pub.authors | split: ", " %}
						{% for author in authors %}{% if author contains "Seonghu Jeon" %}<span class="pf-pub-me">{{ author }}</span>{% else %}{{ author }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}
					</p>
					<div class="pf-pub-links">
						{% if pub.link and pub.link != "" %}<a href="{{ pub.link }}" target="_blank" rel="noopener">paper</a>{% endif %}
						{% if pub.project_link and pub.project_link != "" %}<a href="{{ pub.project_link }}" target="_blank" rel="noopener">project</a>{% endif %}
						{% if pub.code and pub.code != "" %}<a href="{{ pub.code }}" target="_blank" rel="noopener">code</a>{% endif %}
					</div>
				</div>
			</div>
		</article>
		{% endfor %}
	</div>
</section>

<section class="pf-sec pf-hsec" id="focus">
	<header class="pf-hhead">
		<h2 class="pf-sec-title">Focus</h2>
	</header>
	<div class="pf-hub" data-focus>
		{% include focus-hub.html %}
		<div class="pf-hub-cards">
			<div class="pf-hcard" data-side="plan">
				<h3 class="pf-hcard-term">Agentic Robotics</h3>
				<p class="pf-hcard-desc"><b>Prefrontal cortex:</b> planning what to do and in what order.</p>
			</div>
			<div class="pf-hcard" data-side="talk">
				<h3 class="pf-hcard-term">Human-Robot Interaction</h3>
				<p class="pf-hcard-desc"><b>Language areas:</b> communicating with people.</p>
			</div>
			<div class="pf-hcard" data-side="predict">
				<h3 class="pf-hcard-term">3D/4D World Modeling</h3>
				<p class="pf-hcard-desc"><b>Cerebellum:</b> geometric understanding and world modeling, for predicting the future and precise manipulation.</p>
			</div>
		</div>
	</div>
</section>

<section class="pf-sec pf-hsec" id="experience">
	<header class="pf-hhead">
		<h2 class="pf-sec-title">Experience</h2>
	</header>
	<ol class="pf-xtl">
		{% for e in site.data.experience %}
		<li class="pf-xrow{% if e.now %} is-now{% endif %}">
			<span class="pf-xrow-date">{{ e.dates }}</span>
			<span class="pf-nrow-track" aria-hidden="true"><i></i></span>
			<div class="pf-xrow-body">
				<h3 class="pf-xrow-role">{{ e.role }}</h3>
				<p class="pf-xrow-org">{{ e.org }}</p>
				<button type="button" class="pf-details" aria-expanded="false" aria-controls="exp-more-{{ forloop.index }}">Details{% include icon.html name="chevron-down" size=14 %}</button>
				<ul class="pf-xrow-bullets" id="exp-more-{{ forloop.index }}">
					{% for b in e.bullets %}<li>{{ b }}</li>{% endfor %}
				</ul>
			</div>
		</li>
		{% endfor %}
	</ol>
</section>

<div class="pf-fab" data-fab>
	<div class="pf-fab-panel" id="pf-fab-panel" hidden>
		<a href="#news">News<span class="pf-arr" aria-hidden="true">↓</span></a>
		<a href="#publications">Research<span class="pf-arr" aria-hidden="true">↓</span></a>
		<a href="#focus">Focus<span class="pf-arr" aria-hidden="true">↓</span></a>
		<a href="#experience">Experience<span class="pf-arr" aria-hidden="true">↓</span></a>
	</div>
	<button type="button" class="pf-fab-btn" aria-expanded="false" aria-controls="pf-fab-panel" aria-label="Jump to a section">
		<span class="pf-fab-open">{% include icon.html name="menu" size=18 %}</span>
		<span class="pf-fab-close">{% include icon.html name="close" size=18 %}</span>
	</button>
</div>

</div>

<script src="{{ site.baseurl }}/assets/js/home.js" defer></script>
