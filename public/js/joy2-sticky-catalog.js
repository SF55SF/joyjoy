/* JOY2_CATALOG_SCROLL_NO_STICKY_V2 — scroll only; do not restyle header or change investment calculations. */
(()=>{
 const ready=()=>{
  const main=document.querySelector('main.jj-ref-home'),catalog=document.getElementById('catalog');
  if(!main||!catalog)return;
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heading=()=>catalog.querySelector('.jj-catalog-head')||catalog;
  const move=(smooth)=>{
   const el=heading();
   // Use absolute page coordinates, ignoring legacy scroll-margin-top and header offsets.
   const y=Math.max(0,window.scrollY+el.getBoundingClientRect().top);
   window.scrollTo({top:y,behavior:smooth&&!reduced()?'smooth':'instant'});
  };
  function invest(on){
   // The refined checkbox is visible; the legacy quick checkbox is hidden.
   // Sync them so both old and new catalog handlers receive their native change event.
   for(const selector of ['#jj-filters .jj-rf-invest-input','#jj-investment-only']){
    const el=document.querySelector(selector);
    if(el&&el.checked!==on){el.checked=on;el.dispatchEvent(new Event('change',{bubbles:true}));}
   }
  }
  const buttons=[...main.querySelectorAll('.jj-ref-actions a')];
  buttons.slice(0,2).forEach((a,i)=>{
   a.setAttribute('href','#catalog');
   a.addEventListener('click',e=>{
    e.preventDefault();e.stopImmediatePropagation();
    const investment=i===0;
    invest(investment);
    const u=new URL(location.href);
    u.hash='catalog';
    if(investment)u.searchParams.set('investment','1');else u.searchParams.delete('investment');
    history.replaceState(history.state,'',u);
    requestAnimationFrame(()=>move(true));
   },true);
  });
  const entry=()=>{
   const u=new URL(location.href);
   if(u.searchParams.get('investment')==='1')invest(true);
   if(u.hash==='#catalog'||u.hash==='#catalog-results'||u.searchParams.get('investment')==='1'){
    requestAnimationFrame(()=>requestAnimationFrame(()=>move(false)));
   }
  };
  entry();
  window.addEventListener('pageshow',()=>{
   if(location.hash==='#catalog'||location.hash==='#catalog-results')requestAnimationFrame(()=>move(false));
  });
  window.addEventListener('hashchange',()=>{
   if(location.hash==='#catalog'||location.hash==='#catalog-results')requestAnimationFrame(()=>move(true));
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
