/* JOY2_INVEST_CATALOG_NAV_FIX_V3: hero navigation and a single investment filter */
(()=>{
 const init=()=>{
  const grid=document.getElementById('jj-results'),form=document.getElementById('jj-filters'),inv=document.getElementById('jj-investment-only'),catalog=document.getElementById('catalog');
  if(!grid||!form||!inv||!catalog)return;
  const cards=[...grid.querySelectorAll('.jj-property-card')];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running=false,seq=0;
  const scope=(document.documentElement.lang==='uz'?'/uz/':document.documentElement.lang==='en'?'/en/':'/');
  const investUrl=scope+'?investment=1#catalog';
  function jump(){catalog.scrollIntoView({block:'start',behavior:'instant'});}
  function positions(){return new Map(cards.filter(c=>!c.hidden).map(c=>[c,c.getBoundingClientRect()]));}
  function updateUrl(on){const url=new URL(location.href);if(on)url.searchParams.set('investment','1');else url.searchParams.delete('investment');history.replaceState(history.state,'',url.pathname+url.search+url.hash);}
  function sortByIrr(){if(!inv.checked)return;const selected=cards.filter(c=>!c.hidden&&c.dataset.investment==='true');const irr=c=>c.dataset.irr!==''&&Number.isFinite(Number(c.dataset.irr))?Number(c.dataset.irr):-Infinity;selected.sort((a,b)=>irr(b)-irr(a)||(Number(b.dataset.profit)||0)-(Number(a.dataset.profit)||0)||Number(a.dataset.index)-Number(b.dataset.index));selected.forEach(c=>grid.append(c));}
  function updateNative(){inv.dispatchEvent(new Event('change',{bubbles:true}));sortByIrr();updateUrl(inv.checked);}
  function glide(before){if(reduce)return;for(const card of cards){if(card.hidden)continue;const was=before.get(card),now=card.getBoundingClientRect();if(was){const dx=was.left-now.left,dy=was.top-now.top;if(Math.abs(dx)>2||Math.abs(dy)>2)card.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'translate(0,0)'}],{duration:570,easing:'cubic-bezier(.2,.75,.2,1)'})}else card.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'ease-out'});}}
  async function setMode(on,animate=true){const call=++seq;if(running)return;running=true;const before=positions();try{
   if(on&&animate&&!reduce){const outgoing=cards.filter(c=>!c.hidden&&c.dataset.investment!=='true');const animations=outgoing.map(c=>c.animate([{opacity:1},{opacity:0}],{duration:230,easing:'ease-in',fill:'forwards'}));await Promise.all(animations.map(a=>a.finished.catch(()=>{})));animations.forEach(a=>a.cancel());}
   if(call!==seq)return;
   inv.checked=on;internal=true;try{updateNative()}finally{internal=false}
   requestAnimationFrame(()=>glide(before));
  }finally{running=false;}}
  let internal=false;
  // Capture user changes before the legacy checkbox listener: avoid two filtering engines firing.
  inv.addEventListener('change',e=>{if(internal)return;const value=inv.checked;e.stopImmediatePropagation();inv.checked=!value;setMode(value,true)},true);
  const hero=[...document.querySelectorAll('.jj-ref-cta')].find(a=>!a.classList.contains('jj-ref-cta-secondary'));
  const all=document.querySelector('.jj-ref-cta-secondary');
  if(hero){hero.href=investUrl;hero.addEventListener('click',e=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();jump();setMode(true,true);});}
  if(all){all.href='#catalog';all.addEventListener('click',e=>{if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();jump();setMode(false,true);});}
  // Links inside the older mobile/secondary nav go to the same unified catalogue.
  for(const a of document.querySelectorAll('a[href]')){try{const u=new URL(a.href,location.href);if(u.origin!==location.origin)continue;if(/^\/(?:uz\/|en\/)?projects\/?$/.test(u.pathname))a.href=investUrl;}catch{}}
  const initial=new URLSearchParams(location.search).get('investment')==='1';
  if(initial){inv.checked=true;internal=true;try{updateNative()}finally{internal=false}if(location.hash==='#catalog')requestAnimationFrame(jump)}
  document.getElementById('jj-reset')?.addEventListener('click',()=>{seq++;inv.checked=false;updateUrl(false)});
  document.getElementById('jj-clear-empty')?.addEventListener('click',()=>{seq++;inv.checked=false;updateUrl(false)});
  form.addEventListener('reset',()=>queueMicrotask(()=>{seq++;inv.checked=false;updateUrl(false)}));
  // Native marketplace updates still run on every other filter; keep investment order stable.
  window.addEventListener('joyjoy:filter-change',e=>{if(!e.detail?.joy2Refined&&inv.checked)queueMicrotask(sortByIrr)});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
