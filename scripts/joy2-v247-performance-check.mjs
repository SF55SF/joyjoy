import assert from 'node:assert/strict';
import fs from 'node:fs';
const home=fs.readFileSync('dist/index.html','utf8');
const en=fs.readFileSync('dist/en/index.html','utf8');
assert.match(home,/rel="preload" as="image" href="\/images\/joy2-concrete-ribs-hq\.png" fetchpriority="high"/);
assert.match(en,/rel="preload" as="image" href="\/images\/joy2-concrete-ribs-hq\.png" fetchpriority="high"/);
const leaf='dist/listing';
if(fs.existsSync(leaf)){const subs=fs.readdirSync(leaf,{withFileTypes:true}).filter(x=>x.isDirectory());if(subs.length){const detail=fs.readFileSync(leaf+'/'+subs[0].name+'/index.html','utf8');assert.ok(!detail.includes('rel="preload" as="image" href="/images/joy2-concrete-ribs-hq.png"'),'listing must not preload the homepage background')}}
console.log('JOY2 V247 PERFORMANCE CHECK OK | Targeted preload, no Sharp dependency');
