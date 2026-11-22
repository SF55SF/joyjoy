// JOY2 V251 published-investment row highlights persist before interaction.
import assert from 'node:assert/strict';import fs from 'node:fs';
const css=fs.readFileSync('src/styles/investment.css','utf8');
assert.match(css,/JOY2_V251_MOBILE_INVESTMENT_ROW/);
assert.match(css,/JOY2_V251_MOBILE_TWO_LINE_RESERVE/);
assert.match(css,/-webkit-line-clamp:2!important/);
assert.match(css,/height:2\.46em!important/);
assert.match(css,/max-width:900px/);
assert.match(css,/\.jj-unit-data-row:has\(\.jj-unit-col-flag \.jj-unit-finance-flag\):not\(\.is-active\)/);
assert.match(css,/background-color:#f0ffda!important/);
assert.match(css,/animation:none!important/);
assert.ok(fs.existsSync('dist/index.html'),'Astro build output missing');
console.log('JOY2 V251 MOBILE HIGHLIGHT AND TWO-LINE CHECK OK');
