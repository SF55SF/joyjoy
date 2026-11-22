// JOY2_V244_STAGE2 checks built SEO artifacts, without touching photos.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {propertySeo} from '../src/lib/joy2-seo.js';
const photo='https://api.cmwp.uz/storage/projects/previews/example.webp';
const r=propertySeo({slug:'demo',title:'Demo',description:'Description',images:[photo],city:'Ташкент',district:'Яшнабадский',address:'Example 1',priceUsd:500000},'en');
assert.equal(r.image,photo);
assert.equal(r.structuredData.mainEntity.price,500000);
assert.equal(r.structuredData.about.address.addressCountry,'UZ');
for(const [name,lang] of [['','ru'],['uz/','uz'],['en/','en']]){
 const page='dist/'+name+'index.html';assert.ok(fs.existsSync(page),'Missing '+page);
 const html=fs.readFileSync(page,'utf8');assert.match(html,/application\/ld\+json/,'JSON-LD absent in '+page);
 assert.match(html,/joyjoy\.uz/,'Canonical origin absent in '+page);
}
for(const lang of ['','uz/','en/']){
 const page='dist/'+lang+'listing/daho-block-e/index.html';assert.ok(fs.existsSync(page),'Missing listing page '+page);
 const html=fs.readFileSync(page,'utf8');assert.match(html,/application\/ld\+json/);
 assert.match(html,/#webpage/);
}
const data=fs.readFileSync('dist/sitemap-index.xml','utf8');assert.ok(data.includes('joyjoy.uz'));
const config=fs.readFileSync('astro.config.mjs','utf8');assert.ok(config.includes('JOY2_V244_STAGE2'));
const tree=fs.readdirSync('src/content/properties').filter(x=>x.endsWith('.json'));
assert.ok(tree.length>=5,'Property collection missing');
const photos=tree.map(name=>JSON.parse(fs.readFileSync('src/content/properties/'+name,'utf8')).images||[]).flat();
assert.ok(photos.some(src=>String(src).includes('api.cmwp.uz')),'Original CMWP photos unexpectedly changed');
console.log('JOY2 V244 SEO STAGE2 CHECK OK | CMWP IMAGES PRESERVED');
