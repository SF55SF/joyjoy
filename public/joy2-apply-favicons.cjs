/* Joy² favicon verification, cache-bust and preview. No git commit/push. */
const fs = require('node:fs');
const cp = require('node:child_process');
const path = require('node:path');
const required = [
  'public/favicon.svg','public/favicon.ico','public/favicon-16x16.png',
  'public/favicon-32x32.png','public/favicon-48x48.png',
  'public/favicon-96x96.png','public/favicon-192x192.png',
  'public/apple-touch-icon.png','public/android-chrome-192x192.png',
  'public/android-chrome-512x512.png',
  'public/android-chrome-maskable-192x192.png',
  'public/android-chrome-maskable-512x512.png',
  'public/logo-mark-256.png','public/logo-mark-512.png','public/site.webmanifest'
];
const missing=required.filter(x=>!fs.existsSync(x));
if(missing.length) { console.error('MISSING FILES — copy public/ folder first:\n'+missing.join('\n')); process.exit(1); }
const svg=fs.readFileSync('public/favicon.svg','utf8');
if(!svg.includes('Joy squared favicon') || !svg.includes('1254 1254')) {
  console.error('WRONG favicon.svg — expected the new black J² icon. STOPPED.'); process.exit(1);
}
const layout='src/layouts/BaseLayout.astro';
if(!fs.existsSync(layout)) { console.error('Missing BaseLayout.astro. STOPPED'); process.exit(1); }
let code=fs.readFileSync(layout,'utf8');
const paths=['/favicon.svg','/favicon.ico','/favicon-16x16.png','/favicon-32x32.png','/apple-touch-icon.png','/site.webmanifest'];
let changed=false;
for(const item of paths) {
  // Only adjust hrefs of explicitly known favicon files, without touching other links.
  const pattern=new RegExp('href=["\\\']'+item.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?:\\?v=[^"\\\']*)?["\\\']','g');
  const replacement='href="'+item+'?v=joy2-icon-20261117"';
  const next=code.replace(pattern,replacement);
  if(next!==code){ code=next;changed=true; }
}
if(changed) {
  fs.mkdirSync('.joy2-backups',{recursive:true});
  const save=path.join('.joy2-backups','BaseLayout.before-icon-refresh-'+new Date().toISOString().replace(/[:.]/g,'-')+'.astro');
  fs.copyFileSync(layout,save);
  fs.writeFileSync(layout,code);
  console.log('Updated cache-busting icon URLs; BaseLayout backup:',save);
} else console.log('No favicon URL changes required.');
const run=(bin,args)=>cp.spawnSync(bin,args,{stdio:'inherit',shell:false});
console.log('Checking Astro build...');
const build=run('npm',['run','build']);
if(build.status!==0) {console.error('BUILD FAILED. No push performed.');process.exit(build.status||1)}
console.log('BUILD OK. Starting preview at port 4322. Ctrl+C to stop preview.');
const preview=run('npm',['run','preview','--','--host','0.0.0.0','--port','4322']);
process.exit(preview.status||0);
