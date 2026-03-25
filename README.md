# jeonseonghu.github.io

Personal academic blog for **Seonghu Jeon** (M.S. Student @ KAIST CVLAB). Built with Jekyll 4 on a heavily customized Mediumish theme. Bilingual (Korean / English via jekyll-polyglot + DeepL auto-translation).

## Quick Start

```bash
# Recommended: starts Jekyll + Decap CMS proxy + image upload server
./start.sh

# Or manually:
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

Dev server runs on **http://localhost:4000**.

## Features

- **Bilingual**: Korean (default) + auto-translated English via GitHub Actions + DeepL
- **Publications & Projects**: Collection-based pages with tag filtering
- **Blog**: Category/subcategory sidebar filtering, series system, TOC, reading progress
- **Search**: Client-side full-text search (Fuse.js)
- **Comments**: Utterances (GitHub Issues-based)
- **CMS**: Decap CMS at `/admin/` for visual editing
- **Performance**: WebP image auto-conversion via GitHub Actions, lazy loading, deferred assets
- **Interactive**: Grid warp background canvas, smooth scroll navigation

## Architecture

```
_posts/          → Blog posts (Korean markdown)
_projects/       → Projects & publications (type: publication)
_pages/          → Static pages (about, cv, projects, publications)
_sass/           → SCSS organized by tokens/base/layout/components/pages/utilities
assets/          → CSS, JS, images, PDF
.github/workflows/ → Auto-translate (DeepL), auto-optimize images (WebP)
admin/           → Decap CMS config
```

## Deployment

- `master` branch → GitHub Pages (auto-deploy)
- `main` branch → development

## License

Theme based on [Mediumish](https://github.com/wowthemesnet/mediumish-theme-jekyll) by [Sal](https://www.wowthemes.net) (MIT). Site content © Seonghu Jeon.
