// JOY2_V239_RELEASE_CHECK - run after astro build
import fs from 'node:fs';
import path from 'node:path';
const assert=(ok,msg)=>{if(!ok)throw new Error('JOY2 RELEASE CHECK: '+msg)};
const read=p=>fs.readFileSync(p,'utf8');
assert(fs.existsSync('dist/index.html'),'dist/index.html missing');
assert(fs.existsSync('dist/robots.txt'),'dist/robots.txt missing');
assert(fs.existsSync('dist/sitemap-index.xml'),'sitemap-index.xml missing');
const robots=read('dist/robots.txt');
assert(robots.includes('Sitemap: https://joyjoy.uz/sitemap-index.xml'),'robots sitemap address incorrect');
assert(!/Disallow:\s*\/\s*$/m.test(robots),'indexing blocked');
const map=read('dist/sitemap-index.xml');
assert(map.includes('joyjoy.uz'),'sitemap has wrong domain');
assert(!map.includes('trilliant.uz'),'old domain remains in sitemap');
const html=read('dist/index.html');
assert(/<link[^>]+rel=["']canonical["'][^>]+joyjoy\.uz|<link[^>]+joyjoy\.uz[^>]+rel=["']canonical["']/.test(html),'production canonical missing');
assert(!/<meta[^>]+name=["']robots["'][^>]+content=["']noindex/i.test(html),'home page is noindex');
assert(fs.existsSync('dist/_headers'),'Cloudflare headers missing');
console.log('JOY2 RELEASE CHECK OK');
