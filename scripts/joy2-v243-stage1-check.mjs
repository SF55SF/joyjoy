// JOY2_V243_STAGE1: post-build assertions for Stage 1
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const cfg=JSON.parse(read('wrangler.jsonc'));
const lim=cfg.ratelimits.find(x=>x.name==='ADMIN_LOGIN_LIMITER');
assert.equal(lim?.simple.limit,10);assert.equal(lim?.simple.period,60);
for(const p of ['/projects','/uz/projects','/en/projects'])assert.ok(cfg.assets.run_worker_first.includes(p));
const source=read('src/data/listing-translations.ts');
assert.ok(source.includes('joy2TranslateDistrict(item.district,lang)'));
assert.ok(!source.includes("district:item.district?(lang==='uz'?'Yangi Toshkent':'New Tashkent'):'',"));
for(const lang of ['','en/','uz/']){
 const file='dist/'+lang+'projects/index.html';assert.ok(fs.existsSync(file),'Missing '+file);
 assert.ok(!read(file).includes('1%23catalog'),'Broken redirect fragment in '+file);
}
console.log('JOY2 V243 STAGE1 CHECK OK');
