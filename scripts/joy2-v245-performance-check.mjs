// JOY2_V245_PERFORMANCE static smoke assertions; run after npm run build.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const home=fs.readFileSync('dist/index.html','utf8');
const headers=fs.readFileSync('dist/_headers','utf8');
assert.match(home,/joy2-concrete-ribs-hq\.png[^>]*fetchpriority=["']high/);
assert.match(home,/api\.cmwp\.uz/);
assert.match(home,/jj-ref-panel[\s\S]*loading=["']lazy["']/);
assert.match(home,/jj-property-card-image[\s\S]*loading=["']lazy["']/);
assert.match(headers,/\/_astro\/\*[\s\S]*max-age=31536000, immutable/);
assert.doesNotMatch(headers,/\/admin\/\*[\s\S]{0,80}max-age=31536000/);
console.log('JOY2 V245 PERFORMANCE CHECK OK');
