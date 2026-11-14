import assert from 'node:assert/strict';
import fs from 'node:fs';
// Keep the existing financial and collection checks, including all three project routes.
await import('./joyjoy-investment-check.mjs');
for(const prefix of ['', 'en/', 'uz/']){
 const home=fs.readFileSync('dist/'+prefix+'index.html','utf8');
 const projects=fs.readFileSync('dist/'+prefix+'projects/index.html','utf8');
 assert.ok(home.indexOf('class="jj-filter-shell"')<home.indexOf('class="jj-ref-panels"'),'Search must precede category photos');
 assert.ok(home.includes('jj-mobile-sections'),'Missing accessible mobile sections');
 assert.ok(projects.includes('jj-mobile-sections'),'Projects need mobile navigation too');
 assert.ok(!home.includes('photo-1500382017468-9049fed747ef'),'Do not present stock land as inventory');
}
const properties=fs.readdirSync('src/content/properties').filter(x=>x.endsWith('.json')).map(x=>JSON.parse(fs.readFileSync('src/content/properties/'+x,'utf8')));
for(const p of properties.filter(x=>x.published!==false&&(x.showCatalog!==false||x.showProjects===true))){
 const file='dist/listing/'+p.slug+'/index.html';assert.ok(fs.existsSync(file));
 if(p.status==null){const page=fs.readFileSync(file,'utf8');assert.ok(!page.includes('class="jj-detail-status"'),'Unknown construction stage must not create an empty badge');}
}
console.log('JoyJoy: project routes, mobile section navigation, search order, no stock inventory and unknown stage rendering passed.');
