# Online Editing Setup

The `/admin/` page uses the GitHub backend. GitHub Pages cannot keep an OAuth client secret, so online auth is handled by a small Cloudflare Worker OAuth proxy.

## Current CMS Backend

```yml
backend:
  name: github
  repo: JeonSeongHu/jeonseonghu.github.io
  branch: main
  site_domain: jeonseonghu.github.io
  base_url: https://jeonseonghu-decap-oauth.seonghu-jeon.workers.dev
  auth_endpoint: /auth

local_backend: true
```

`local_backend: true` keeps local editing working through `./start.sh`. The live site uses the configured Worker for GitHub OAuth.

## Deployed OAuth Proxy

- Worker name: `jeonseonghu-decap-oauth`
- Worker URL: `https://jeonseonghu-decap-oauth.seonghu-jeon.workers.dev`
- Source: `cloudflare/decap-oauth-worker.js`
- Runtime bindings:
  - `GITHUB_OAUTH_ID` as plaintext
  - `GITHUB_OAUTH_SECRET` as secret

To redeploy the Worker, run Wrangler against `cloudflare/decap-oauth-worker.js` and keep the runtime bindings configured in Cloudflare.

Open `https://jeonseonghu.github.io/admin/` and sign in with GitHub.

Only GitHub users with push access to `JeonSeongHu/jeonseonghu.github.io` can save through this backend.

## Image Uploads

- Online: use the CMS Media Library. Files are committed to GitHub under the configured media folders.
- Local: Markdown image paste works through `http://localhost:3001` when `./start.sh` is running.
