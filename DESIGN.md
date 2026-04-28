# Portfolio Redesign — Design Spec

A documentation of the new editorial / Apple-flavored portfolio design that
replaces the previous "card grid" about page. This file is the single source of
truth for the visual language; SCSS tokens and page templates should mirror it.

## 1. Direction

Editorial document × Apple Today-card hybrid.

- Generous whitespace, no decorative panels — content sits on a flat parchment
  canvas separated by hairline rules and quiet section numbers.
- Type and color do all the work. There are exactly **two** chromatic accents:
  `--blue` for emphasis (links, key venues, "active" state) and the dark
  charcoal `--tile-dark` reserved for inverted "now / focus" tiles.
- Layout is column-based and dense: a 1080px shell with a 32px gutter; sections
  separated by 1px hairlines, never by background color shifts.
- Motion is restrained: 120ms color transitions, 150ms opacity/transform on
  buttons, no parallax or large entrance animations.

## 2. Color Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#FFFFFF` | Page background |
| `--parchment` | `#F5F5F7` | Frosted nav, footer, portrait, thumbnails |
| `--tile-dark` | `#1D1D1F` | Reserved for inverted/dark sections |
| `--hairline` | `#E6E7EB` | Section dividers, list rules |
| `--ink` | `#1D1D1F` | Primary text, headings |
| `--ink-2` | `#2A2C32` | Body copy |
| `--ink-3` | `#6B6E76` | Secondary copy, dates |
| `--ink-4` | `#A1A4AB` | Captions, asides |
| `--on-dark` | `#F5F5F7` | Text on dark sections |
| `--on-dark-2` | `#B8B9BD` | Secondary text on dark sections |
| `--blue` | `#0040FF` | Single accent: links, eyebrows, "now" tile |
| `--blue-on-dark` | `#5C7CFF` | Accent variant on dark surfaces |
| `--blue-soft` | `#E6EDFF` | Underline / hover wash |

The legacy indigo palette (`--color-primary` etc.) is mapped onto these tokens
so existing components keep working until they are migrated.

## 3. Typography

- Family: **DM Sans** (Google Fonts, opsz 9–40, weights 300/400/500/600/700).
  Fallback: `-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif`.
- Body: `15px / 1.55`, weight 400, `letter-spacing` neutral. Color `--ink`.
- Hero `h1`: `clamp(56px, 8vw, 88px)`, weight 500, `line-height: 0.96`,
  `letter-spacing: -0.05em`. Trailing blue period (`.`) is part of the lockup.
- Section title `h2`: `36px`, weight 500, `letter-spacing: -0.04em`.
- Section number eyebrow: `12px / 500 / blue`, format `— 02`.
- Publication title: `17px / 500`, `letter-spacing: -0.025em`.
- Body emphasis: `b` is `font-weight: 600` and bumps to `--ink`.
- Numerals are tabular (`font-variant-numeric: tabular-nums`) in dates and
  bylines so columns line up.

## 4. Layout

- Page shell: `max-width: 1080px`, horizontal padding `32px` (16px on mobile).
- Section vertical rhythm: `padding: 72px 0`, separated by a 1px `--hairline`.
- Hero is `padding: 88px 0 72px`, two-column grid `1fr 220px` (collapses below
  860px). Right column is a 4:5 portrait tile.
- News / experience / focus / publications all share a strict
  `grid-template-columns` schema rather than ad-hoc flex spacing:
  - News: `80px 1fr`
  - Publications: `140px 1fr auto`
  - Focus: `200px 1fr`
  - Experience: `200px 1fr 100px`
- Mobile breakpoint at **860px** collapses every grid to a single column and
  drops the secondary nav links (the brand and contact pill remain).

## 5. Components

### Top nav
- Sticky, `height: 52px`, `background: rgba(245,245,247,0.78)` with a 20px
  `backdrop-filter: blur` and 1px hairline bottom.
- Brand on the left in 16px / 600, blue period after the name.
- Center: 13px / 400 nav links — `About`, `News`, `Publications`, `Focus`,
  `Experience`. Active state derived from `IntersectionObserver` and rendered
  in `--blue`.
- Right: pill-shaped "Contact" CTA, blue background, white text.

### Hero portrait
- 4:5 aspect ratio, parchment background with a 135° hatched repeating
  gradient (`rgba(29,29,31,0.045)` 1px every 11px) and a 28×28 blue square in
  the top-right corner. Caption pill bottom-left.
- Replaceable with a real photograph; portrait styling is a placeholder so the
  layout reads even without an image.

### Section header
- `— NN` blue number + 36px title on the left, optional `--ink-4` aside on the
  right (entry count, "most recent first", etc.).

### News list
- Two-column rows (`80px 1fr`), 7px vertical padding, no separators between
  items. Date is `--ink-4` tabular; body uses `--ink-2` with `b` bumps to
  `--ink` and `.blue` for emphasised venues.

### Publications
- Three-column rows: thumbnail · body · links. Hairline `border-top` between
  rows; subtle `rgba(0,64,255,0.018)` hover wash on the entire row.
- Thumbnail: 16:11 aspect, parchment with hatched overlay, `fig.NN` tag in
  the top-left.
- "Featured" variant: thumbnail background swaps to solid `--blue` with a
  radial highlight; the paper short-name (e.g. CAMEO) prints in white at the
  bottom-left.
- Venue pill: 5px dot + venue text, `.hi` modifier flips it to `--blue` when
  the venue is a marquee conference (`CVPR`, `Oral`, etc.).
- Author byline: `--ink-3`, equal-contribution stars are `--ink-4`, the
  author's own name (`.me`) is `--blue` / 600.
- Links use the `↗` glyph, `--ink-3` → `--blue` on hover.

### Focus
- Three numbered rows. Left column is the label (22px / 500), right is a
  one-paragraph description (`--ink-2`, 15px / 1.6).
- Followed by a **Now card**: solid `--blue` rounded tile (`border-radius:
  12px`, `padding: 24px 28px`), `/ Now` uppercase tag, single-sentence update,
  trailing arrow link that nudges 3px right on hover.

### Experience
- Three columns: org / role+detail / time. Time uses `--ink-4`, with `now`
  rendered in `--blue`.

### Footer
- Parchment background, single horizontal row: copyright, link cluster,
  "Last updated" tag with a leading blue dot.

### Sticky bottom CTA (optional)
- Translates in once the user scrolls past the hero. Same frosted styling as
  the top nav. Holds the current paper title + a quick "read" pill.

## 6. Interaction

- Smooth scroll on the root.
- IntersectionObserver with `rootMargin: -30% 0px -65% 0px` toggles
  `.active` on nav links as the corresponding section enters the viewport.
- All hover transitions complete in ≤150ms; no easing more elaborate than
  `ease`.

## 7. Accessibility

- Color contrast: `--ink` on `--canvas` ≥ 16:1; `--ink-3` on `--canvas` ≥ 5:1.
  `--blue` on `--canvas` ≥ 7:1.
- Focus visible state inherits the platform default (no custom outline
  removal).
- Section anchors (`#hero`, `#news`, `#publications`, `#focus`, `#experience`)
  match the nav links and provide skip-target behavior.

## 8. Responsive

| Breakpoint | Behavior |
| --- | --- |
| `> 860px` | Full grid as described above. |
| `≤ 860px` | Nav links hide (brand + Contact only). Hero collapses; portrait shrinks to 200px max. Pub / focus / experience rows go single-column. Now card stacks. |

## 9. Migration notes

- Single source for the about page is `_pages/about.md`, rendered through a
  new `_layouts/portfolio.html` layout that bypasses the existing Bootstrap
  chrome. The default layout (and its nav/footer) remains for blog posts and
  project detail pages.
- Publications continue to be authored as `_projects/*.md` with
  `type: publication`. The about page consumes them via `site.projects` and
  applies the new visual treatment.
- Old SCSS in `_sass/pages/_about.scss` has been replaced wholesale; the
  legacy `.about-card` / `.exp-group` classes are no longer used.
