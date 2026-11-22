// JOY2_V250_CHECK: verify the scoped controls and catalog typography.
import assert from 'node:assert/strict';import fs from 'node:fs';
const css=fs.readFileSync('src/styles/investment.css','utf8'),js=fs.readFileSync('public/js/joy2-hero-investment-original-cards-v2.js','utf8');
assert.match(css,/JOY2_V250_MOBILE_REFINEMENTS/);assert.match(css,/grid-template-columns:minmax\(0,2fr\) minmax\(0,3fr\)/);
assert.match(css,/font-size:12\.65px!important/);assert.match(css,/gap:40px!important;height:66px!important/);
assert.match(js,/JOY2_V250_REMOVE_COUNTER/);assert.match(js,/controls\.append\(previous,next\)/);assert.doesNotMatch(js,/controls\.append\(previous,status,next\)/);
assert.match(css,/\.jj-card-overline\{font-size:clamp\(13\.2825px/);assert.match(css,/\.jj-property-address\{font-size:clamp\(13\.2825px/);
assert.ok(fs.existsSync('dist/index.html'));
console.log('JOY2 V250 MOBILE UI CHECK OK');
