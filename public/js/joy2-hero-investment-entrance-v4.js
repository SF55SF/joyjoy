/* JOY2_HERO_INVESTMENT_ENTRANCE_V4: one click only, no global filter animations. */
(()=>{
 const init=()=>{
  const catalog=document.getElementById('catalog'), grid=document.getElementById('jj-results');
  if(!catalog||!grid||!document.querySelector('main.jj-ref-home'))return;
  if(window.__joy2HeroInvestmentEntranceV4)return;
  window.__joy2HeroInvestmentEntranceV4=true;
  const cards=()=>Array.from(grid.querySelectorAll('.jj-property-card'));
  const ranks=(()=>{try{return JSON.parse(document.getElementById('jj-hero-investment-ranks')?.textContent||'{}')}catch{return {}}})();
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardRank=c=>ranks[c.dataset.slug]||{};
  // Server-supplied state wins over legacy badge/quick-filter inference.
  function applyData(){for(const c of cards()){const r=cardRank(c);if(Object.prototype.hasOwnProperty.call(r,'investment'))c.dataset.investment=String(r.investment===true);c.dataset.irr=r.irr==null?'':String(r.irr);c.dataset.profit=r.profit==null?'':String(r.profit)}}
  applyData();
  let running=false;
  const investmentInputs=()=>Array.from(document.querySelectorAll('#jj-investment-only, .jj-rf-invest-input')).filter((n,i,a)=>a.indexOf(n)===i);
  const eligible=c=>c.dataset.investment==='true';
  const byIrr=(a,b)=>{
   const rA=Number(a.dataset.irr),rB=Number(b.dataset.irr),hasA=a.dataset.irr!==''&&Number.isFinite(rA),hasB=b.dataset.irr!==''&&Number.isFinite(rB);
   if(hasA!==hasB)return hasA?-1:1;
   if(hasA&&rA!==rB)return rB-rA;
   const pA=Number(a.dataset.profit)||0,pB=Number(b.dataset.profit)||0;
   return pB-pA||Number(a.dataset.index||0)-Number(b.dataset.index||0);
  };
  const scrollToCatalog=()=>{
   // Catalog starts at its own top, not below an imagined sticky header.
   catalog.style.setProperty('scroll-margin-top','0px','important');
   const position=catalog.getBoundingClientRect().top+window.scrollY;
   window.scrollTo({top:Math.max(0,position),behavior:'instant'});
  };
  function overlayClone(c,r,host){
   const copy=c.cloneNode(true);copy.removeAttribute('id');
   for(const e of copy.querySelectorAll('[id]'))e.removeAttribute('id');
   copy.removeAttribute('hidden');
   copy.style.cssText='position:fixed!important;display:flex!important;left:'+r.left+'px!important;top:'+r.top+'px!important;width:'+r.width+'px!important;height:'+r.height+'px!important;min-width:0!important;max-height:'+r.height+'px!important;overflow:hidden!important;margin:0!important;opacity:1!important;box-sizing:border-box!important;pointer-events:none!important;transform-origin:center!important;';
   host.append(copy);return copy;
  }
  function play(){
   applyData();
   const all=cards(),current=all.filter(c=>getComputedStyle(c).display!=='none'&&!c.hidden);
   const initial=new Map(current.map(c=>[c,c.getBoundingClientRect()]));
   const fade=current.filter(c=>!eligible(c));
   const host=document.createElement('div');host.className='jj-investment-v4-overlay';
   host.style.cssText='position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;';
   const ghosts=[];
   if(!reduced()){
    for(const c of fade){const r=initial.get(c);if(r&&r.width>2&&r.height>2)ghosts.push(overlayClone(c,r,host));}
    if(ghosts.length)document.body.append(host);
   }
   const inv=investmentInputs();
   for(const el of inv)el.checked=true;
   // Update native marketplace first (counts/map/favorites), then enforce exact ranking.
   const type=document.getElementById('jj-type');
   if(type)type.dispatchEvent(new Event('change',{bubbles:true}));
   else if(inv[0])inv[0].dispatchEvent(new Event('change',{bubbles:true}));
   const sorted=all.filter(eligible).sort(byIrr);
   const selected=new Set(sorted);
   for(const c of all)c.hidden=!selected.has(c);
   sorted.forEach(c=>grid.append(c));
   const counter=document.getElementById('jj-count');
   if(counter)counter.textContent=(counter.textContent||'Найдено объектов: 0').replace(/\d+\s*$/,String(sorted.length));
   const empty=document.getElementById('jj-empty');if(empty)empty.hidden=sorted.length>0;
   const url=new URL(location.href);url.searchParams.set('investment','1');url.hash='catalog';history.replaceState(history.state,'',url);
   window.dispatchEvent(new CustomEvent('joyjoy:filter-change',{detail:{slugs:sorted.map(c=>c.dataset.slug),joy2EntranceV4:true}}));
   const animations=[];
   if(!reduced()&&typeof Element.prototype.animate==='function'){
    for(const c of sorted){
     const to=c.getBoundingClientRect(),from=initial.get(c);
     if(!to.width||!to.height)continue;
     if(from){
      const dx=from.left-to.left,dy=from.top-to.top;
      if(Math.abs(dx)>1||Math.abs(dy)>1)animations.push(c.animate([{transform:'translate('+dx+'px,'+dy+'px)',opacity:.78},{transform:'translate(0px,0px)',opacity:1}],{duration:950,easing:'cubic-bezier(.2,.75,.18,1)'}));
     }else animations.push(c.animate([{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'translateY(0px)'}],{duration:650,easing:'ease-out'}));
    }
    for(const ghost of ghosts)animations.push(ghost.animate([{opacity:1,filter:'blur(0px)',transform:'scale(1)'},{opacity:0,filter:'blur(7px)',transform:'scale(.965)'}],{duration:650,easing:'ease-in',fill:'forwards'}));
   }
   Promise.allSettled(animations.map(a=>a.finished)).then(()=>host.remove());
   setTimeout(()=>{host.remove();running=false},1200);
  }
  const investmentHeroLink=el=>!!el?.matches?.('.jj-ref-actions > a.jj-ref-cta:not(.jj-ref-cta-secondary)');
  // The earliest event phase (window/capture) wins over installed older document listeners.
  window.addEventListener('click',event=>{
   const a=event.target?.closest?.('a[href]');
   if(!investmentHeroLink(a))return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   if(running)return;running=true;
   const workspace=document.querySelector('.jj-workspace');
   if(workspace?.dataset.jjMode==='map')document.querySelector('[data-jj-view="list"]')?.click();
   // Click-triggered animation only. No listeners on regular filter changes.
   scrollToCatalog();
   requestAnimationFrame(()=>requestAnimationFrame(()=>{try{play()}catch(error){console.error('Joy² investment entrance:',error);running=false}}));
  },true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
