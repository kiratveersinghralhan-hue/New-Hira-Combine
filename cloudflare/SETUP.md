# Cloudflare setup for the New Hira full booking system

The `newhira...workers.dev` project shown in the Cloudflare dashboard is the correct project. It is currently an assets-only Worker, which is why the public website works but `/api/admin/login` does not.

The updated package contains `wrangler.jsonc`. It changes that same project into a full-stack Worker: static website files remain fast assets, while `/api/*` runs `cloudflare/worker.js`.

## 1. Replace the repository files

Extract the latest Worker-ready ZIP and replace the old files in the connected GitHub repository.

Confirm these are visible at the repository root:

- `index.html`
- `app.js`
- `styles.css`
- `wrangler.jsonc`
- `.assetsignore`
- `cloudflare/worker.js`

Commit the replacement to the branch connected to Cloudflare. Do not upload the ZIP itself as the website.

## 2. Check the Worker build settings

In Cloudflare, open **Workers & Pages > newhira > Settings > Build**.

Use:

- Root directory: `/`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Production branch: `main` (or the branch containing the website)

Push the repository or choose **New deployment**. Cloudflare will read `wrangler.jsonc`, deploy the API Worker and keep serving the website assets.

The configuration requests two resource bindings:

- `DB`: D1 database for bookings, leads, visitor events and admin data.
- `MEDIA`: R2 bucket for owner-uploaded photographs and videos.

Current Wrangler versions can provision those resources automatically. After deployment, open the **Bindings** tab and confirm that `DB` and `MEDIA` appear.

## 3. Add the private owner secrets

Open **Settings > Variables and Secrets** and add these as encrypted secrets:

- `ADMIN_PIN`: the same private six-digit owner PIN chosen for the project.
- `ADMIN_SESSION_SECRET`: a random value at least 32 characters long.
- `RATE_LIMIT_SECRET`: a different random value at least 32 characters long.

Do not put these values in GitHub, `app.js`, `wrangler.jsonc` or any public file. Wrangler deployments preserve encrypted secrets.

Optional normal variable:

- `ALLOWED_ORIGINS`: your Worker address and custom domain, separated by commas.

Example format:

    https://newhira.YOUR-SUBDOMAIN.workers.dev,https://yourdomain.com

If `ALLOWED_ORIGINS` is omitted, same-site use still works.

## 4. Test and initialize the database

After the deployment succeeds, open:

    https://newhira.YOUR-SUBDOMAIN.workers.dev/api/health

The first API request automatically creates the required D1 tables and indexes. A successful response contains:

    {"ok":true,"service":"new-hira-fieldcraft","version":"18.1-worker"}

Then open the website, choose **Owner desk**, and enter the private owner PIN.

## 5. If automatic bindings did not appear

Use the **Bindings** tab visible in the project screenshot:

1. Select **Add binding**.
2. Choose **D1 database**.
3. Create or choose a database and set the variable name to `DB`.
4. Add another binding, choose **R2 bucket**, create or choose a bucket and set the variable name to `MEDIA`.
5. Redeploy, then open `/api/health` again.

The owner desk needs `DB`. Only admin photo/video uploads need `MEDIA`.

## Important hosting distinction

GitHub remains the source repository. The working full website should be opened from the `workers.dev` address or your Cloudflare custom domain. A GitHub Pages address can display the static design but cannot run this owner API.

## Troubleshooting

- **Unreadable response:** old assets-only deployment is still live, or `wrangler.jsonc` was not deployed.
- **D1 database binding DB is not configured:** add the D1 binding with the exact variable name `DB`.
- **Owner authentication secrets are not configured:** add `ADMIN_PIN` and `ADMIN_SESSION_SECRET` as encrypted secrets.
- **Media storage is not configured:** add the R2 binding with the exact variable name `MEDIA`.
- **Old design remains visible:** confirm `index.html` contains `20260718-worker-v181`, redeploy, and hard-refresh once.
