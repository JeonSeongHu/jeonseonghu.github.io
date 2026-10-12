# Portfolio Design Spec

The visual language of the portfolio layout (`_layouts/portfolio.html`), used by
the About, Publications, Projects, CV and blog pages. Shared SCSS lives in
`_sass/pages/_about.scss`; the home page components (hero links, News, Focus,
Experience, mobile menu) live in `_sass/pages/_portfolio-home.scss`. This file
must mirror both. The Figma source is the "jeonseonghu.github.io" page, frames
"Home / Desktop 1440 (v10)" and "Home / Mobile 375 (light)".

Type Lab (`_includes/type-lab.html`, dev only) still tunes the shared type
scale; its `DEFAULTS` in `assets/js/type-lab.js` and the fallbacks in
`_sass/components/_type-lab.scss` match the values below. It does not cover the
home page components.

## 1. Direction

Editorial document, flat and quiet.

- White canvas, no shadows. Sections are separated by 1px hairlines. The only
  tinted surfaces are the Focus cards, the brain regions and the active filter
  pill.
- One family (Wanted Sans) in three weights: 400 for text, 500 for meta, links
  and titles, 600 for the hero name, the nav name and experience roles.
- One accent, Cobalt (`--pf-blue`), for the active nav item, venues, honors,
  "Present", the newest news item and interactive highlights.
- One emphasis per line: in a news sentence the subject is ink 500 and the
  venue is blue 400; nothing else is bold.
- Line icons (2px stroke on a 24px grid, `currentColor`) from
  `_includes/icon.html`.
- Motion is restrained: 120 to 250ms color, opacity and height transitions.

## 2. Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--pf-canvas` | `#FFFFFF` | Page background |
| `--pf-parchment` | `#F5F5F7` | Footer, portrait and thumbnail tiles |
| `--pf-hairline` | `#E6E7EB` | Section dividers, timeline lines |
| `--pf-ink` | `#0A0A0A` | Names, titles, emphasis |
| `--pf-ink-2` | `#2A2C32` | Body copy (intro, news) |
| `--pf-ink-3` | `#6E6E6E` | Authors, descriptions, nav links |
| `--pf-ink-4` | `#75757A` | Dates and labels (at least 4.5:1 on white) |
| `--pf-blue` | `#2F58C9` | Cobalt accent |
| `--pf-blue-soft` | `#EAEEF9` | Active filter pill, Contact hover |
| `--pf-blue-on-dark` | `#9DB3F0` | Accent on dark surfaces |

Home-only tokens on `.pf-home`: `--h-hover #F6F7F9` (news row hover),
`--h-dot #C9CBD1` (timeline dot), `--h-chip #F3F4F6` (idle pill),
`--h-model-bg #F5F5F7` (Focus cards) and `--h-plan-bg #EEF2FC` (the hovered
card), `--h-line #B4B7BF` (brain outline). Brain regions are Cobalt at 20%
opacity, 40% when their card is hovered.

| Role | Size / weight / line-height |
| --- | --- |
| Hero name `.pf-h1`, page title | 40px / 600 / 1.1, -0.025em, blue trailing period |
| Eyebrow | 13px / 500, blue |
| Intro `.pf-deck` | 17px / 400 / 1.6 |
| Section title | 25px / 500 / 1.25, -0.02em |
| Nav links | 16px / 400, grey; active blue |
| Hero "Elsewhere" links | 14.5px / 400 / 1.3, `--pf-ink-2`, arrows only on hover; label 12.5px / 500 grey |
| News sentence | 15px / 400 / 24px; newest item 16px / 500 ink |
| News detail | 14px / 400 / 1.55 grey; links 13px / 500 blue |
| News category | 13px / 500 with 14px icon; Paper and Honor blue |
| Publication venue | 13px / 500 blue; "/ Long Oral" with honor icon |
| Publication title | 17px / 500 / 1.4 |
| Authors | 14px / 400 / 1.55 grey; own name ink 500 |
| Focus label "Intelligence" | 13px / 500, blue |
| Focus card term / description | 18px / 500; 14.5px / 400 / 1.6 |
| Experience role / org / bullets | 16px / 600; 14px grey; 14.5px / 1.6 grey |
| Dates | 14px / 400, tabular numbers, `--pf-ink-4` |

## 3. Layout

- Shell: `.pf-main` max 1024px with 32px side padding (content box 960px).
  Nav inner and footer inner use the same box.
- Section order on the home page: Hero, News & notes, Featured research,
  Focus, Experience. Sections use `padding: 40px 0` and a 20px gap under the
  title.
- Hero grid: text, "Elsewhere" links (CV, Google Scholar, GitHub), 148px 4:5
  portrait, 48px gaps, bottoms aligned.
- Timelines (News and Experience) share one rail: 128px right-aligned date,
  28px track with the dot and a 1px line, then content. News adds a 104px
  category column.
- Featured research row: text column on the left, 232 by 148 thumbnail on the
  right, 24px vertical padding, hairline between rows.
- Focus: a brain drawing centred above three equal cards (16px gap, 14px
  radius, 20px by 22px padding). Lines run from each brain region to the top
  centre of its card.

## 4. Components

- **Nav**: sticky, 52px. Name (15px / 600) left, links middle, outlined
  "Contact" pill right.
- **News**: filter pills (All, Paper, Honor, Career, Education, Community) on the right of
  the title. Entries come from `_data/news.yml` (date, category, text with
  `<b>` subject and `.v` venue, detail, links; a link starting with `#` jumps
  within the page). The newest entry is open with its detail. Other entries
  show their detail on hover or keyboard focus, with a grey wash and a larger
  blue dot. Entries are grouped by year: a header row (year in the date column,
  a hollow ring, a hairline, the item count and a chevron) opens and closes
  each year, and rows show the month only ("Oct"; blank when only the year is
  on record). The newest year starts open; picking a category opens every year
  with a match. "Show all" opens every year and turns into "Show less".
- **Featured research**: venue kicker, title, authors, links. The four newest
  publications from `_projects`.
- **Focus**: one brain labelled "Intelligence" with three regions, each
  joined to a card: prefrontal cortex to Agentic Robotics, the language areas
  (Broca and Wernicke, joined by a dotted arcuate fasciculus) to Human-Robot
  Interaction, the cerebellum to 3D/4D World Modeling. The brain lives in
  `_includes/focus-brain.html`; `_includes/focus-hub.html` places it with the
  lines (a 960 by 290 box whose card ends assume the 16px grid gap). Hovering
  a card darkens its region, turns its line blue, and greys out the rest.
- **Experience**: entries from `_data/experience.yml` (dates, now, role, org,
  bullets). Current positions get a blue dot and a blue "Present".
- **Floating section menu**: on tablet and phone (860px and below), a round
  ink button fixed bottom right, shown once the hero scrolls out of view. It opens a panel of section links and closes on a link click or
  Escape.
- **Behaviour**: `assets/js/home.js` runs the filter, collapse, Details
  toggles, Focus hover state and the section menu.
- **Footer**: parchment band with copyright, links and "Last updated".

## 5. Responsive

| Breakpoint | Behavior |
| --- | --- |
| `≤ 860px` | Gutter 20px. Contact pill hidden. Portrait (96px) beside the name. External links in one row. Floating section menu appears. Filter pills move under the title. Thumbnails 168px. Focus cards padding 18px. Name 34px. |
| `≤ 640px` | Focus shows the brain alone (200px, no lines) above stacked cards. Publication thumbnails 88px on the right. |
| `≤ 560px` | Gutter 16px. Portrait 76px. News shows month over sentence, no category, no detail; year headers put the ring first, then the year. Authors, links and experience bullets fold behind "Details". Name 30px, section titles 20px. Footer stacks. |
| `≤ 360px` | Name in the nav hidden. |
