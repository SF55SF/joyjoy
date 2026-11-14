/* JOYJOY_UNSLOP_STAGE4_SMOKE_V1: static checks on built site. */
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const assert=(condition,message)=>{if(!condition)throw new Error('[JoyJoy smoke] '+message)};
const required=[
  'src/components/JoyCatalog.astro','src/components/JoyDetail.astro','src/styles/joyjoy.css',
  'src/data/listings.ts','public/js/joyjoy-marketplace.js','public/js/joyjoy-maplibre.js',
  'public/js/joyjoy-detail.js','dist/index.html','dist/en/index.html','dist/uz/index.html'
];
required.forEach(p=>assert(fs.existsSync(path.join(root,p)),'Missing '+p));
const source=read('src/data/listings.ts');
const slugs=[...source.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(x=>x[1]);
assert(slugs.length>=1,'No listings found');
assert(new Set(slugs).size===slugs.length,'Duplicate listing slugs');
const css=read('src/styles/joyjoy.css');
assert(css.includes('JOYJOY_UNSLOP_STAGE4_MAP_FIX_V1'),'Missing stage-4 layout fix');
assert(css.includes('.jj-map-wrap>#jj-map'),'Missing corrected map sizing');
const home=read('src/components/JoyCatalog.astro');
assert(home.includes('id="jj-results"')&&home.includes('id="jj-map"'),'Missing catalog or map');
assert(home.includes('joyjoy-maplibre.js'),'MapLibre not linked from catalog');
for(const lang of ['','en/','uz/']){
 const output='dist/'+lang+'index.html';const html=read(output);
 assert(html.includes('jj-results'),'Catalog missing in '+output);
 assert(html.includes('jj-map'),'Map missing in '+output);
 assert(html.includes('joyjoy-marketplace.js'),'Filter script missing in '+output);
 assert(html.includes('joyjoy-maplibre.js'),'Map script missing in '+output);
 for(const slug of slugs){const file='dist/'+lang+'listing/'+slug+'/index.html';assert(fs.existsSync(path.join(root,file)),'Missing listing page '+file)}
}
for(const filename of ['public/js/joyjoy-marketplace.js','public/js/joyjoy-maplibre.js','public/js/joyjoy-detail.js','public/js/joyjoy-unslop-stage1.js']){
 if(!fs.existsSync(path.join(root,filename)))continue;
 const result=cp.spawnSync(process.execPath,['--check',path.join(root,filename)],{encoding:'utf8'});
 assert(result.status===0,'JavaScript syntax invalid: '+filename+' '+(result.stderr||''));
}
console.log('[JoyJoy smoke] OK: '+slugs.length+' unique listings, RU/UZ/EN catalogs and '+(slugs.length*3)+' listing pages, map, filters, scripts, layout.');
console.log('[JoyJoy smoke] Note: browser interaction and remote map tile loading require a manual browser check.');
