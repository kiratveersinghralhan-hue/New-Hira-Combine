# New Hira Harvest Booking

Responsive New Hira advertisement, field-booking system and private owner desk for Ram Chand & Sons.

## Release 18.2

- Precise desktop, tablet and mobile header/hero layouts with no overlapping copy, machine controls or field metadata.
- Responsive registration, booking and owner-desk interfaces.
- English, Hindi and Punjabi onboarding.
- New Hira 985 and 785 machine stages, brochure facts, crop-flow animation and two perspective carousels.
- D1-backed bookings, leads, visitor events and owner analytics.
- R2-backed owner photo/video library.
- WhatsApp confirmation fallback if the API is temporarily unavailable.
- Cloudflare-safe batched schema initialization and a diagnostic health route.
- Only `public/` is exposed as static content; backend source and configuration are not public assets.

## Repository structure

```text
new-hira-booking/
|-- public/
|   |-- assets/
|   |-- index.html
|   |-- styles.css
|   `-- app.js
|-- cloudflare/
|   |-- worker.js
|   |-- schema.sql
|   `-- SETUP.md
|-- package.json
|-- wrangler.jsonc
|-- index.html (GitHub Pages preview redirect)
|-- .gitignore
`-- README.md
```

## Cloudflare deployment

GitHub is the source repository. Cloudflare Workers is the live host and API runtime.

The small root `index.html` only redirects a GitHub Pages preview into `public/`. Cloudflare ignores that redirect file and serves `public/index.html` directly.

1. Replace the old repository contents with this release.
2. In Cloudflare use root directory `/`, no build command, and deploy command `npx wrangler deploy`.
3. Keep the D1 binding named `DB` and R2 binding named `MEDIA`.
4. Add encrypted secrets `ADMIN_PIN`, `ADMIN_SESSION_SECRET` and `RATE_LIMIT_SECRET`.
5. Deploy and open `/api/health` on the workers.dev address.

Expected health response:

```json
{"ok":true,"service":"new-hira-fieldcraft","version":"18.2-worker","database":"ready","media":"ready"}
```

See [cloudflare/SETUP.md](cloudflare/SETUP.md) for the exact dashboard sequence and troubleshooting.

## Local development

Use Node.js 22 or newer:

```powershell
npm install
npm run dev
```

Open `http://localhost:8787`. Local private values belong in a root `.dev.vars` file and must never be committed.

## Security

The owner PIN and session secrets are not stored in public HTML, JavaScript, documentation or GitHub configuration. The Worker reads them only from encrypted Cloudflare secrets. Uploaded site assets receive restrictive security headers from the Worker.

## Verified brochure facts

- New Hira 985: 4.4 m cutter bar, 4.28 m effective cutter width, 1,800 kg wheat grain tank and 5 straw walkers.
- New Hira 785: 3.7 m cutter bar, 3.6 m effective cutter width, 1,600 kg wheat grain tank and 4 straw walkers.
- Supported crops: wheat, paddy, sunflower, soyabean, gram and pulses.
- Ram Chand & Sons, Patiala Road, Nabha, Punjab 147201.

The current cache marker is `20260718-worker-v182`.
