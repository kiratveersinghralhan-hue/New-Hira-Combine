# New Hira Fieldcraft booking site

This is a GitHub-ready static booking website for Ram Chand & Sons / New Hira combine harvesters.

## What is included

- Premium responsive landing page with intro animation, 3D pointer tilt, model switcher and real brochure photography.
- New Hira 985 and 785 comparison with brochure-derived specifications.
- Booking form that saves a request locally and opens a pre-filled WhatsApp message to `+91 92161 07700`.
- Owner desk protected by the demo PIN `985785`.
- Owner desk views for bookings, leads & visitor pulses, and browser-local site content controls.
- CSV export for the local booking board.
- Visitor registration gate for callback leads.
- `assets/field-dusk.png`, an original cinematic field backdrop, plus the four supplied brochure photographs.

## Important static-site behavior

This first version intentionally has no exposed database credentials. GitHub Pages can run the site immediately, but local bookings, leads, visitor pulses, and uploaded admin media are stored in the browser that created them. That is useful for a single-device owner desk, but it is not a shared multi-device database.

For a real team dashboard, connect the optional Cloudflare Worker in `cloudflare/worker.js`, then set `CONFIG.analyticsEndpoint` in `app.js` to the Worker URL. The Worker example uses D1 for shared lead and visitor event storage.

## Publish from GitHub

1. Create a new GitHub repository, for example `new-hira-fieldcraft`.
2. Upload the contents of this folder to the repository root. `index.html` must be at the root level.
3. Open **Settings -> Pages** in the repository.
4. Under **Build and deployment**, choose **Deploy from a branch**, choose `main`, choose `/ (root)`, then save.
5. Wait for the Pages deployment, then open the URL GitHub shows. Test the WhatsApp button from a phone.

## Connect the GitHub repository to Cloudflare Pages

This is the cleanest setup if you want the code to stay on GitHub while Cloudflare handles the public hosting:

1. Open Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Connect GitHub and select this repository.
3. Use the `main` branch. Choose **None** as the framework preset, leave the build command blank, and use the repository root as the output directory.
4. Deploy. Cloudflare will give you a `*.pages.dev` address and will redeploy when you push changes to GitHub.
5. In the Pages project, open **Custom domains -> Set up a domain**, then add your domain.

If your domain is already on Cloudflare, Cloudflare can create the required DNS record after the Pages custom-domain flow. For an apex domain such as `example.com`, Cloudflare requires the domain to be a Cloudflare zone; for a subdomain such as `www.example.com`, create the CNAME through the Pages custom-domain flow instead of only adding a manual DNS record.

## Alternative: keep GitHub Pages as the host

You can use GitHub Pages directly and use Cloudflare only for DNS/security:

1. Finish the GitHub Pages steps above.
2. In GitHub Pages, add the custom domain and enable HTTPS after DNS resolves.
3. In Cloudflare DNS, use the GitHub Pages records shown by GitHub. The usual pattern is a `www` CNAME to `<your-username>.github.io`; GitHub recommends using `www` even when you also use an apex domain.
4. In Cloudflare SSL/TLS, use **Full (strict)** once GitHub's HTTPS certificate is active.

## Owner desk

Open **Owner desk** from the header or footer and enter `985785`. Change this PIN in `app.js` before sharing the site publicly. It is only a front-end convenience gate, not a secure authentication system.

## Editing public assets

For a change that every visitor should see, replace the file in the GitHub `assets/` folder and push the update. The admin media library is designed for local browser previews and quick temporary swaps; its files do not automatically become new GitHub files.

## Optional Cloudflare Worker

The optional Worker provides a shared event/lead endpoint. See `cloudflare/schema.sql` and `cloudflare/worker.js` for the D1 schema and endpoint. After deploying it, set:

```js
const CONFIG = { analyticsEndpoint: 'https://your-worker.your-subdomain.workers.dev/events' };
```

Do not store secrets or private API keys in `app.js`. Add rate limiting, bot protection, and an authenticated owner dashboard before treating the Worker as a production CRM.

## Brochure facts used

- New Hira 985: 4.4 m cutter bar / 4.28 m effective cutter width, 1,800 kg wheat grain tank, 5 straw walkers.
- New Hira 785: 3.7 m cutter bar / 3.6 m effective cutter width, 1,600 kg wheat grain tank, 4 straw walkers.
- Crops shown in the brochure: wheat, paddy, sunflower, soyabean, gram and pulses.
- Contact details visible in the brochure: Patiala Road, Nabha, Punjab 147201; `01765-509077`, `92170-71777`, `92161-07700`; `new.hira@yahoo.com`.

Official setup references:

- [GitHub Pages custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [GitHub Pages configuration](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
