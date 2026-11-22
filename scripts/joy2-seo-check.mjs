/* JOY2 V240 SEO verification: run after npm run build */
import fs from 'node:fs';
const must=(condition,message)=>{if(!condition)throw Error('JOY2 SEO CHECK FAILED: '+message)};
const file=p=>fs.readFileSync(p,'utf8');
must(fs.existsSync('dist/index.html'),'missing home page');
must(fs.existsSync('dist/robots.txt'),'missing robots.txt');
must(fs.existsSync('dist/sitemap-index.xml'),'missing sitemap index');
const robots=file('dist/robots.txt'),map=file('dist/sitemap-index.xml'),home=file('dist/index.html');
must(!/^Disallow:\s*\/\s*$/m.test(robots),'site-wide disallow');
must(robots.includes('Sitemap: https://joyjoy.uz/sitemap-index.xml'),'wrong robots sitemap');
must(map.includes('joyjoy.uz')&&!map.includes('trilliant.uz'),'wrong sitemap domain');
must(/rel=["']canonical["'][^>]*joyjoy\.uz|joyjoy\.uz[^>]*rel=["']canonical["']/.test(home),'canonical missing');
must(!/<meta[^>]*name=["']robots["'][^>]*content=["']noindex/i.test(home),'homepage noindex');
must(!fs.existsSync('dist/sitemap.xml'),'stale sitemap.xml');
for(const p of ['dist/en/index.html','dist/uz/index.html'])must(fs.existsSync(p),'missing localized page '+p);
console.log('JOY2 SEO V240 CHECK OK');
