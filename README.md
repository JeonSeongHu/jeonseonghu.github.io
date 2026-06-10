# jeonseonghu.github.io

Personal academic blog for **Seonghu Jeon** (M.S. Student @ KAIST CVLAB). Built with Jekyll 4 on a customized Mediumish theme. Bilingual Korean/English support is handled with jekyll-polyglot and DeepL automation.

## Quick Start

```bash
# Recommended: starts Jekyll, Decap CMS proxy, and image upload server
./start.sh

# Or manually:
bundle install
bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

Dev server runs on **http://localhost:4000**.

## Blog Editor

- Local editor: **http://localhost:4000/admin/**
- Public path: **/admin/**
- Local Decap proxy: **http://localhost:8081**
- Clipboard image upload status: **http://localhost:3001/status**

Use `./start.sh` for local editing so the Jekyll server, Decap local backend, and clipboard image upload server all start together. If image paste fails, check the upload badge in the CMS helper panel or open the `/status` endpoint above.

## Features

- **Bilingual**: Korean default with English translation automation
- **Publications & Projects**: Collection-based pages with tag filtering
- **Blog**: Category/subcategory sidebar filtering, series system, TOC, reading progress
- **Search**: Client-side full-text search with Fuse.js
- **Comments**: Utterances, backed by GitHub Issues
- **CMS**: Decap CMS at `/admin/` for visual editing
- **Performance**: WebP image conversion, lazy loading, deferred assets
- **Interactive**: Grid warp background canvas and smooth navigation

## Architecture

```text
_posts/             Blog posts
_projects/          Projects and publications
_pages/             Static pages such as about, CV, projects, publications
_sass/              SCSS tokens, base, layout, components, pages, utilities
assets/             CSS, JavaScript, images, PDFs
.github/workflows/  Translation and image optimization workflows
admin/              Decap CMS config and local upload server
```

## Deployment

- `main` branch: GitHub Pages source and development branch

## License

Theme based on [Mediumish](https://github.com/wowthemesnet/mediumish-theme-jekyll) by [Sal](https://www.wowthemes.net) (MIT). Site content (c) Seonghu Jeon.
