# Cloudflare setup for the complete booking system

The visual website works immediately as static files. These steps activate shared booking data, owner authentication, analytics and public media uploads.

## 1. Put the website on GitHub

1. Create a new GitHub repository.
2. Upload the contents of this website folder to the repository root.
3. Confirm index.html, functions, cloudflare and assets are all visible at the repository root.

## 2. Create the Cloudflare Pages project

1. Open Cloudflare Dashboard.
2. Open Workers & Pages and choose Create application.
3. Choose Pages, connect GitHub and select the repository.
4. Use Production branch: main.
5. Framework preset: None.
6. Build command: leave blank.
7. Build output directory: .
8. Deploy once. This first deployment can show the website before database bindings exist.

The file functions/api/[[path]].js makes every /api route run on Cloudflare Pages. The included _routes.json limits Function invocation to /api/* so static image, CSS and HTML requests remain static.

## 3. Create the D1 database

Install Node.js if it is not already installed, then open PowerShell in the repository folder.

Run:

    npx wrangler login

    npx wrangler d1 create new-hira-fieldcraft

Run the saved schema against the new remote database:

    npx wrangler d1 execute new-hira-fieldcraft --remote --file=cloudflare/schema.sql

In Cloudflare Dashboard, open the Pages project, then Settings, Bindings, Add binding, D1 database.

- Variable name: DB
- Database: new-hira-fieldcraft

Save the binding for Production and Preview if both are offered.

## 4. Create R2 media storage

In Cloudflare Dashboard open R2 Object Storage and create a bucket:

- Bucket name: new-hira-fieldcraft-media

Return to the Pages project, open Settings, Bindings, Add binding, R2 bucket.

- Variable name: MEDIA
- Bucket: new-hira-fieldcraft-media

R2 is used only for owner-uploaded campaign images and videos. Their searchable title, slot and publish status stay in D1.

## 5. Add private owner secrets

In the Pages project, open Settings, Variables and Secrets.

Add these as encrypted secrets:

- ADMIN_PIN: enter the same private six-digit PIN chosen for this project.
- ADMIN_SESSION_SECRET: enter a long random value of at least 32 characters.
- RATE_LIMIT_SECRET: enter a second long random value.

Do not put these values in app.js, index.html, GitHub variables or the README.

Add this as a normal environment variable:

- ALLOWED_ORIGINS: your Pages address and custom domain separated by commas.

Example format:

    https://your-project.pages.dev,https://yourdomain.com,https://www.yourdomain.com

## 6. Redeploy and test

Open Deployments in the Pages project and retry the latest deployment, or push a small GitHub commit.

Test in this order:

1. Open https://your-project.pages.dev/api/health.
2. It should show an OK response with service new-hira-fieldcraft.
3. Submit one public booking.
4. Open Owner desk and enter the private PIN.
5. Confirm the booking appears in Bookings and Overview.
6. Upload a small test image in Media, select Campaign gallery, publish it, then reload the public website.

## 7. Connect a domain

In the Pages project open Custom domains, choose Set up a custom domain and enter the domain. If the domain already uses Cloudflare DNS, Cloudflare can create the record automatically.

After the domain works, add it to ALLOWED_ORIGINS and redeploy.

## 8. Updating the website later

Edit the files in GitHub and push to main. Cloudflare Pages redeploys automatically. If styling appears unchanged, verify the version after styles.css?v= and app.js?v= in index.html was increased.

## Troubleshooting

- Owner desk says backend is not connected: verify the Pages deployment includes the functions folder and DB binding.
- API health says DB is not configured: add the D1 binding with the exact variable name DB and redeploy.
- Upload says R2 is not configured: add the R2 binding with the exact variable name MEDIA and redeploy.
- Owner login says secrets are not configured: add ADMIN_PIN and ADMIN_SESSION_SECRET as encrypted secrets.
- Website is old after upload: purge Cloudflare cache once and hard-refresh the browser, then confirm the version query in index.html changed.
- Booking works on WhatsApp but not in admin: the public site is running as static GitHub Pages or the /api Function is not deployed.
