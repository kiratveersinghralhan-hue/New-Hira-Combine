# New Hira Harvest Booking - flat upload release 18.5

This repository layout is intentionally folder-free for GitHub browser uploads. All website files, machine images, the local Three.js runtime and the Cloudflare Worker live directly in the repository root.

## Upload

Read `UPLOAD-ALL-FILES.md`. Select every extracted file and upload them together through GitHub. Do not upload the ZIP itself.

## Cloudflare

- Root directory: `/`
- Build command: blank
- Deploy command: `npx wrangler deploy`
- D1 binding: `DB`
- R2 binding: `MEDIA`
- Static assets directory: repository root, filtered by `.assetsignore`

Expected health response:

```json
{"ok":true,"service":"new-hira-fieldcraft","version":"18.5-worker","database":"ready","media":"ready"}
```

Private values remain Cloudflare encrypted secrets and are not included in this repository.
