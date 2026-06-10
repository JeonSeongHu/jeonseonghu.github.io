# Online Editing Setup

The `/admin/` page is ready to use the GitHub backend, but GitHub Pages cannot keep an OAuth client secret. To save edits online, deploy a small OAuth proxy and add its public URL to `admin/config.yml`.

## Current CMS Backend

```yml
backend:
  name: github
  repo: JeonSeongHu/jeonseonghu.github.io
  branch: main
  site_domain: jeonseonghu.github.io
  # base_url: https://your-decap-oauth-worker.workers.dev
  # auth_endpoint: /auth

local_backend: true
```

`local_backend: true` keeps local editing working through `./start.sh`. Online editing starts working when `base_url` points to a deployed GitHub OAuth proxy.

## One-Time Online Setup

1. Deploy a Decap-compatible GitHub OAuth proxy.
   - Cloudflare Worker is the lightest option.
   - The proxy must expose `/auth` and `/callback`.
2. Create a GitHub OAuth App.
   - Homepage URL: `https://jeonseonghu.github.io`
   - Authorization callback URL: `https://YOUR_WORKER_URL/callback`
3. Store OAuth secrets in the proxy environment.
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
4. Update `admin/config.yml`.

```yml
backend:
  name: github
  repo: JeonSeongHu/jeonseonghu.github.io
  branch: main
  site_domain: jeonseonghu.github.io
  base_url: https://YOUR_WORKER_URL
  auth_endpoint: /auth
```

5. Commit and push.
6. Open `https://jeonseonghu.github.io/admin/` and sign in with GitHub.

Only GitHub users with push access to `JeonSeongHu/jeonseonghu.github.io` can save through this backend.

## Image Uploads

- Online: use the CMS Media Library. Files are committed to GitHub under the configured media folders.
- Local: Markdown image paste works through `http://localhost:3001` when `./start.sh` is running.
