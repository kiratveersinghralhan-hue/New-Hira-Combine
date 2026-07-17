# New Hira Fieldcraft

Premium responsive advertisement and harvest-booking website for Ram Chand & Sons.

## Included

- Full-screen New Hira campaign hero with large desktop and mobile product art.
- Background-free New Hira 985 and brochure-matched 785 product stages.
- Autoplay perspective carousel with large active machine and visible 3D side previews.
- Real field-photography carousel using the supplied New Hira images.
- Brochure-derived 985 and 785 specifications.
- Three-step public booking form with reference numbers and WhatsApp confirmation.
- Mobile registration popup for contactable callback leads.
- Secure owner desk with shared bookings, pipeline status, search, CSV export and manual bookings.
- Anonymous traffic, device, crop-demand and seven-day activity analysis.
- Shared campaign image/video upload, publish, hide and delete controls.
- Cloudflare Pages Functions, D1 database and R2 media-storage implementation.
- Graceful GitHub Pages fallback: booking details can still be sent by WhatsApp when the Cloudflare API is unavailable.

## Important security behavior

The owner PIN is not present in index.html, app.js, the README or any public browser file. The same private six-digit PIN requested for this project must be added as a Cloudflare secret named ADMIN_PIN. The owner desk verifies it only inside the Cloudflare Function.

Also create ADMIN_SESSION_SECRET as a long random secret. It signs temporary eight-hour owner sessions.

## Publish

Upload everything in this folder to the root of one GitHub repository. Keep index.html at the root and do not remove the functions or cloudflare folders.

For a visual-only GitHub Pages deployment, enable GitHub Pages from the main branch and root folder. Public booking still produces a pre-filled WhatsApp message, but shared bookings, admin analytics and media management require Cloudflare.

For the complete system, connect the repository to Cloudflare Pages and follow cloudflare/SETUP.md.

## Contact and brochure facts

- Ram Chand & Sons, Patiala Road, Nabha, Punjab 147201.
- Booking contact: +91 92161 07700.
- New Hira 985: 4.4 m cutter bar, 4.28 m effective cutter width, 1,800 kg wheat grain tank and 5 straw walkers.
- New Hira 785: 3.7 m cutter bar, 3.6 m effective cutter width, 1,600 kg wheat grain tank and 4 straw walkers.
- Crops: wheat, paddy, sunflower, soyabean, gram and pulses.

## Files

- index.html: public website, booking forms, registration and owner-desk interface.
- styles.css: complete responsive visual system and motion.
- app.js: interactions, forms, analytics and admin client.
- functions/api/[[path]].js: Cloudflare Pages API entry point.
- cloudflare/worker.js: booking, lead, analytics, admin and media API.
- cloudflare/schema.sql: D1 database schema.
- cloudflare/SETUP.md: copy-paste deployment guidance.

## Cache updates

The current release uses asset version 20260717-field-v17. When manually replacing app.js or styles.css later, update that version in index.html so browsers and Cloudflare do not continue showing an older design.
