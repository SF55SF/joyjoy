# Joy² — SEO Stage 2 (V244)

## Completed by patch
- Individual Open Graph and Twitter card images on RU / UZ / EN listing pages use the first existing listing image (including CMWP source URLs).
- Structured data: website/publisher graph and read-only property page/offer data. No claims of Google rich-results eligibility.
- Redirected project landing pages removed from sitemap. Existing sitemap-index.xml remains the submission URL.
- www → apex 301 in Worker code **only if requests for www.joyjoy.uz reach this Worker**.
- Images and all src/content/properties/*.json remain untouched so you can later replace photos in the admin panel.

## Manual Cloudflare www setup (not done by the patch)
Your Cloudflare zone currently has a proxied www CNAME. The repo patch cannot attach a Worker Custom Domain or create a Cloudflare Redirect Rule without zone API authorization.
**Recommended:** Cloudflare → Rules → Redirect Rules → Single Redirect: if hostname equals www.joyjoy.uz, redirect dynamically to https://joyjoy.uz preserving original path and query; 301. Check no redirect loop. If you instead attach www as a Worker custom domain, remove the conflicting www CNAME first and confirm custom-domain setup; then the Worker fallback redirect applies. Do not touch mail, ftp, MX or SPF.

## Search engine verification (manual)
1. Google Search Console → Add property → Domain joyjoy.uz; copy **your own** Google TXT token to Cloudflare DNS and verify.
2. Submit sitemap URL: https://joyjoy.uz/sitemap-index.xml.
3. Yandex Webmaster → Add https://joyjoy.uz/ → verify ownership via their supplied TXT/HTML/meta value, then submit the sitemap.
4. Use URL Inspection and monitor index coverage after the site is publicly reachable. Indexing is not immediate.

## After Cloudflare deploy
Open /robots.txt, /sitemap-index.xml, listing pages in RU/UZ/EN, view-source to verify og:image and JSON-LD; check www 301, HTTPS, /admin-login and login (never send passwords into chat).
