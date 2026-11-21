/* JOY2_V179: live midpoint of logo bottom and visible card top. */
(()=>{
 let pending=false;
 function place(){
  pending=false;
  const title=document.querySelector('main.jj-ref-home > .jj-ref-hero .jj-hero-left-v2 > h1');
  const logo=document.querySelector('header.jj-ref-header .jj-brand-logo,header.jj-ref-header .jj-wordmark');
  const stage=document.querySelector('main.jj-ref-home > .jj-ref-hero .jj-hero-stage-v6');
  if(!title||!logo||!stage)return;
  if(!matchMedia('(max-width:900px)').matches){title.style.removeProperty('transform');return;}
  const slide=stage.querySelector('.jj-hero-slide-v6:not([hidden]) > .jj-property-card')||stage.querySelector('.jj-hero-slide-v6 > .jj-property-card');
  if(!slide)return;
  title.style.setProperty('transform','none','important');
  const logoBottom=logo.getBoundingClientRect().bottom;
  const cardTop=slide.getBoundingClientRect().top;
  const rect=title.getBoundingClientRect();
  if(!Number.isFinite(logoBottom+cardTop+rect.height)||cardTop-logoBottom<rect.height+12)return;
  const shift=(logoBottom+cardTop)/2-(rect.top+rect.height/2);
  title.style.setProperty('transform','translateY('+shift.toFixed(2)+'px)','important');
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(place);}
 function init(){
  schedule();
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  addEventListener('load',schedule,{once:true});
  document.fonts?.ready?.then(schedule);
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(hero){
   new MutationObserver(schedule).observe(hero,{subtree:true,childList:true});
   const stage=hero.querySelector('.jj-hero-stage-v6');
   if(stage&&typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(stage);
  }
  requestAnimationFrame(()=>requestAnimationFrame(schedule));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();