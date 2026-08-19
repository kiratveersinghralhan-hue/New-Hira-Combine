# GitHub upload - no folders required

This release contains only loose files, so GitHub cannot skip or flatten any required folder.

1. Extract `New-Hira-18.5-FLAT-GITHUB-UPLOAD.zip`.
2. In the GitHub repository, delete the current old files.
3. Open **Add file > Upload files > choose your files**.
4. Open the extracted folder, press `Ctrl+A`, and select every file.
5. Wait for all files to finish uploading, then commit to `main`.

Before committing, confirm GitHub lists at least these files:

```text
.assetsignore
index.html
styles.css
app.js
fieldcraft-3d.js
three.module.min.js
worker.js
wrangler.jsonc
package.json
cutout-985-three-quarter.png
cutout-785-brochure-model.png
field-01-harvesting.jpg
```

There should be approximately 35 loose files and no `public` or `cloudflare` folder. After the Cloudflare build turns green, open `https://newhira.com/api/health` and confirm it reports `18.5-worker`.
