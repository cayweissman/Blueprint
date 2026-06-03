# Deploy Blueprint (static, 24/7, no server)

This site is **fully static**: HTML, CSS, JS, videos, and cached JSON under `api/`. No backend required.

## Recommended: GitHub Pages (free)

1. Create a GitHub repo and push this folder.
2. In the repo: **Settings → Pages → Build and deployment**
   - Source: **GitHub Actions**
3. Push to `main` (or `master`). The workflow `.github/workflows/pages.yml` publishes the site.
4. Your site will be live at `https://<user>.github.io/<repo>/` within a few minutes.

### Root URL (simplest)

For `https://<user>.github.io/<repo>/`, edit `index.html`:

```html
<meta name="blueprint-base" content="/<repo>" />
```

Replace `<repo>` with your repository name (e.g. `/HedgeFund`). Leave empty if you use a **custom domain** or a **user site** repo named `<user>.github.io`.

### What works without a server

| Feature | How |
|--------|-----|
| Home, portfolio, theses, about, principles | Client-side routing + static files |
| Returns vs S&P | `api/holdings-since-launch.json` and `api/sp500-since-launch.json` (committed to repo) |
| Admin / localStorage | Runs in the browser only |
| Deep links (`/portfolio/NBIS`) | `404.html` + sessionStorage redirect |

### Updating market data (no server)

Returns are **not** fetched live on the public site. Refresh locally, then push:

```bash
python3 benchmark.py
git add api/
git commit -m "Update benchmark cache"
git push
```

Re-run the GitHub Pages deploy (automatic on push).

## Alternatives (also free, 24/7)

- **Cloudflare Pages** — connect repo, build command: none, output directory: `/`
- **Netlify** — same; add SPA redirect rule for deep links if needed

## Local preview (static)

```bash
python3 serve.py
# or
./sync-spa-routes.sh && python3 -m http.server 8080
```

Open `http://localhost:8080`
