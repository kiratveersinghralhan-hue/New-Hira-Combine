# Cloudflare setup: New Hira 18.2

The connected Cloudflare Worker should remain `newhira`. GitHub stores the source; the workers.dev address (and later your custom domain) serves the complete website and API.

## 1. Replace the GitHub repository contents

Extract the final ZIP. Remove the old repository files, then upload the extracted contents—not the ZIP itself.

Confirm the repository root contains:

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/assets/`
- `cloudflare/worker.js`
- `wrangler.jsonc`
- `package.json`

The public website now lives in `public/`. This is intentional: Cloudflare will not publish the database schema, Worker source or deployment files as static URLs.

## 2. Confirm the Worker build settings

Open **Workers & Pages > newhira > Settings > Build**.

- Production branch: `main`
- Root directory: `/`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`

Save and start a new deployment.

## 3. Confirm resource bindings

After a successful deployment, open **Bindings** and confirm:

- `DB` is a D1 database.
- `MEDIA` is an R2 bucket.

The public booking and owner desk need `DB`. Owner photo/video uploads need `MEDIA`.

If either is missing, choose **Add binding**, select its resource type, and use the exact variable name shown above. Redeploy after saving.

## 4. Add private owner secrets

Open **Settings > Variables and Secrets** and add these as encrypted secrets:

- `ADMIN_PIN`: the existing private six-digit owner PIN.
- `ADMIN_SESSION_SECRET`: a random value of at least 32 characters.
- `RATE_LIMIT_SECRET`: a different random value of at least 32 characters.

Do not add these values to GitHub or any file in `public/`.

Optional normal variable:

- `ALLOWED_ORIGINS`: comma-separated live origins, for example `https://newhira.YOUR-SUBDOMAIN.workers.dev,https://yourdomain.com`.

## 5. Verify the API

Open:

```text
https://newhira.YOUR-SUBDOMAIN.workers.dev/api/health
```

Expected result:

```json
{"ok":true,"service":"new-hira-fieldcraft","version":"18.2-worker","database":"ready","media":"ready"}
```

Then submit one test booking and open **Owner desk** to confirm it appears.

## Error guide

- `DB_INIT_FAILED`: the response now includes a safe diagnostic. Confirm the `DB` binding points to D1 and redeploy.
- `D1 database binding DB is not configured`: add the binding with variable name `DB`.
- `Owner authentication secrets are not configured`: add `ADMIN_PIN` and `ADMIN_SESSION_SECRET` as encrypted secrets.
- `Media storage is not configured`: add the R2 binding with variable name `MEDIA`.
- Old layout remains visible: confirm `public/index.html` contains `20260718-worker-v182`, redeploy, then hard-refresh once.
- GitHub check fails while Cloudflare is green: open the Cloudflare check details; the live site follows the Cloudflare Worker deployment, not GitHub Pages.

## Custom domain later

When the workers.dev site is healthy, open **Domains** in the Worker, choose **Add custom domain**, enter your domain, and let Cloudflare create the route. No code change is required. Add the final origin to `ALLOWED_ORIGINS` if you use that variable.
