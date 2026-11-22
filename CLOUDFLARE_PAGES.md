<!-- TRILL_CLOUDFLARE_PAGES_START -->
# Cloudflare Pages

- Production branch: main
- Build command: npm run build
- Build output directory: dist
- Environment variable: NODE_VERSION=22
<!-- TRILL_CLOUDFLARE_PAGES_END -->

<!-- JOY2_V239_RELEASE_DOC_START -->
## Joy² release to joyjoy.uz
- Cloudflare Pages production branch: main; build command: npm run build; output: dist; NODE_VERSION: 22.
- Attach the custom domain joyjoy.uz in Cloudflare Pages > Custom domains and verify DNS/SSL.
- Optional www.joyjoy.uz: add as another custom domain and set a 301 redirect to https://joyjoy.uz in Cloudflare Redirect Rules. The patch does not change DNS.
- Configure production secrets ADMIN_USERS, SESSION_SECRET, JOYJOY_GITHUB_TOKEN for the admin panel, only in Cloudflare environment variables / secrets (never commit credentials).
- Test /, /en/, /uz/, property pages, catalog, map, calculator, /api/fx, login, password session, and mobile layouts after deployment.
- Verify that https://joyjoy.uz/robots.txt and https://joyjoy.uz/sitemap-index.xml are live.
- Add the property in Google Search Console and submit the sitemap. Search indexing is not immediate.
<!-- JOY2_V239_RELEASE_DOC_END -->
