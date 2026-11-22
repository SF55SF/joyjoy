/* JOY2_V239_RELEASE_CONFIG */
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://joyjoy.uz',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/(?:admin(?:\/|$)|admin-login(?:\/|$)|api(?:\/|$))/.test(new URL(page).pathname) })],
});
