/* JOY2_V180: align real H1 with rendered card, vertically centered in the remaining gap. */
(()=>{
 const mobile=()=>matchMedia('(max-width:900px)').matches;
 let pending=false;
 function update(){
  pending=false;
  const title=document.querySelector('main.jj-ref-home > .jj-ref-hero .jj-hero-left-v2 > h1');
  if(!title)return;
  if(!mobile()){title.style.removeProperty('transform');return;}
  const logo=document.querySelector('header.jj-ref-header .jj-brand-logo')||document.querySelector('header.jj-ref-header .jj-wordmark');
  const stage=document.querySelector('main.jj-ref-home > .jj-ref-hero .jj-hero-stage-v6');
  const card=stage&&(stage.querySelector('.jj-hero-slide-v6:not([hidden]) > .jj-property-card')||stage.querySelector('.jj-hero-slide-v6 > .jj-property-card'));
  if(!logo||!card)return;
  // Clear previous offset before measuring: no accumulating transformations.
  title.style.setProperty('transform','none','important');
  const l=logo.getBoundingClientRect(),c=card.getBoundingClientRect(),t=title.getBoundingClientRect();
  if(!Number.isFinite(l.bottom+c.top+t.left+c.left))return;
  const x=c.left-t.left;
  const available=c.top-l.bottom;
  // Keep text within the gap if possible; do not shift the card.
  const y=available>t.height+4?(l.bottom+c.top-t.height)/2-t.top:0;
  title.style.setProperty('transform','translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px)','important');
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(update)}
 function init(){
  schedule();
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  addEventListener('load',schedule,{once:true});
  document.fonts?.ready?.then(schedule);
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(hero){
   new MutationObserver(schedule).observe(hero,{childList:true,subtree:true});
   if(typeof ResizeObserver!=='undefined'){
    const ro=new ResizeObserver(schedule);
    const stage=hero.querySelector('.jj-hero-stage-v6');if(stage)ro.observe(stage);
   }
  }
  requestAnimationFrame(()=>requestAnimationFrame(schedule));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();