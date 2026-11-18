/* JOY2_INVESTMENT_CTA_ONESHOT_V1: animation runs ONLY after clicking the hero/header investment link. */
(()=>{
 const init=()=>{
  const home=document.querySelector('main.jj-ref-home');
  const catalog=document.getElementById('catalog');
  const grid=document.getElementById('jj-results');
  if(!home||!catalog||!grid||window.__joy2InvestmentEntranceOnce)return;
  window.__joy2InvestmentEntranceOnce=true;
  let playing=false;
  const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const heading=()=>catalog.querySelector('.jj-catalog-head')||catalog;
  const cards=()=>[...grid.querySelectorAll('.jj-property-card')];
  const published=c=>c.dataset.investment==='true';
  const coordinates=()=>{const y=window.scrollY+heading().getBoundingClientRect().top;return Math.max(0,y)};
  const scroll=()=>window.scrollTo({top:coordinates(),behavior:'instant'});
  const box=c=>c.getBoundingClientRect();
  const setFilters=()=>{
   const switches=[...document.querySelectorAll('#jj-investment-only, #jj-filters .jj-rf-invest-input')];
   for(const input of switches)input.checked=true;
   // This drives the native marketplace's filtering, counters, map and IRR sort.
   const type=document.getElementById('jj-type');
   if(type)type.dispatchEvent(new Event('change',{bubbles:true}));
   else if(switches[0])switches[0].dispatchEvent(new Event('change',{bubbles:true}));
   const u=new URL(location.href);u.searchParams.set('investment','1');u.hash='catalog';history.replaceState(history.state,'',u);
  };
  function showEntrance(){
   // Skip the one-shot animation if the catalogue is already in investment mode.
   const visible=cards().filter(c=>!c.hidden&&getComputedStyle(c).display!=='none');
   const before=new Map(visible.map(c=>[c,box(c)]));
   const disappearing=visible.filter(c=>!published(c));
   const ghosts=[];
   const overlay=document.createElement('div');overlay.className='jj-investment-entrance-overlay';overlay.style.cssText='position:fixed;inset:0;z-index:999;pointer-events:none;overflow:hidden;';
   if(!reduce()){
    for(const c of disappearing){
     const r=before.get(c);if(!r||r.width<1||r.height<1)continue;
     const clone=c.cloneNode(true);clone.removeAttribute('id');clone.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
     clone.classList.add('jj-investment-entrance-ghost');clone.removeAttribute('hidden');
     clone.style.cssText+=';left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;max-height:'+r.height+'px;overflow:hidden;';
     overlay.appendChild(clone);ghosts.push(clone);
    }
    if(ghosts.length)document.body.appendChild(overlay);
   }
   setFilters();
   const staying=cards().filter(c=>!c.hidden&&published(c)&&getComputedStyle(c).display!=='none');
   // The marketplace sorts published investments by descending IRR; this is only the FLIP animation.
   if(!reduce()){
    const animations=[];
    for(const c of staying){
     const a=before.get(c),b=box(c);if(!b.width||!b.height)continue;
     if(a){
      const dx=a.left-b.left,dy=a.top-b.top;
      if(Math.abs(dx)>2||Math.abs(dy)>2)animations.push(c.animate([{transform:'translate('+dx+'px,'+dy+'px)',opacity:.82},{transform:'translate(0px,0px)',opacity:1}],{duration:750,easing:'cubic-bezier(.22,1,.36,1)'}));
     }else animations.push(c.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:480,easing:'ease-out'}));
    }
    for(const g of ghosts)animations.push(g.animate([{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:0,transform:'scale(.965)',filter:'blur(5px)'}],{duration:460,easing:'ease-in',fill:'forwards'}));
    Promise.allSettled(animations.map(a=>a.finished)).then(()=>overlay.remove());
    setTimeout(()=>overlay.remove(),1100);
   }
  }
  const isInvestmentNav=a=>{
   if(!a)return false;
   if(a.matches('.jj-ref-actions .jj-ref-cta:first-child'))return true;
   if(!a.closest('.jj-sitebar,.jj-ref-header'))return false;
   const text=(a.textContent||'').toLocaleLowerCase();
   return /инвестиц|investment propert|investment project|investitsiya/.test(text)&&!a.closest('.jj-lang');
  };
  // Capture above the legacy scroll handler that stops target-level click propagation.
  document.addEventListener('click',event=>{
   const a=event.target?.closest?.('a[href]');
   if(!isInvestmentNav(a))return;
   const u=new URL(a.href,location.href);
   if(u.origin!==location.origin)return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   if(playing)return;
   playing=true;
   // If the map-only mode hides cards, switch to visible catalogue cards first.
   const view=document.querySelector('.jj-workspace');
   if(view?.dataset.jjMode==='map')document.querySelector('[data-jj-view="list"]')?.click();
   scroll();
   // Scroll first, then animate while the rows are in the user's viewport.
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    try{showEntrance()}finally{setTimeout(()=>{playing=false},850)}
   }));
  },true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
