/* JOY2 V187: enforce styles on the ONE existing H1 and cloned cards. */
(()=>{
 const mq=matchMedia('(max-width:900px)');
 let queued=false;
 function apply(){
  queued=false;
  if(!mq.matches)return;
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(!hero)return;
  const heading=hero.querySelector('.jj-hero-left-v2 > h1');
  const stage=hero.querySelector('.jj-hero-stage-v6');
  if(!heading||!stage)return;
  // The real heading, not a new node; remove any stale inline downscaling.
  heading.style.setProperty('font-size','clamp(62px, 13vw, 100px)','important');
  heading.style.setProperty('max-width','none','important');
  heading.style.setProperty('width','max-content','important');
  const mark=heading.querySelector('mark.jj-concept-highlight');
  if(mark)mark.style.setProperty('transform','skew(-8deg)','important');
  // Force the visible card to cast the shadow; styles copied onto cards are inline.
  stage.style.setProperty('overflow','visible','important');
  const viewport=stage.querySelector('.jj-hero-rotator-v6');
  if(viewport)viewport.style.setProperty('overflow','visible','important');
  stage.querySelectorAll('.jj-hero-slide-v6').forEach(slide=>{
   slide.style.setProperty('overflow','visible','important');
   const card=slide.querySelector(':scope > .jj-property-card');
   if(!card)return;
   card.style.setProperty('box-shadow','0 0 0 1px rgba(20,23,30,.12), 0 0 24px 8px rgba(20,23,30,.30), 0 18px 42px 6px rgba(20,23,30,.26)','important');
   card.style.setProperty('filter','none','important');
  });
 }
 function queue(){if(queued)return;queued=true;requestAnimationFrame(apply)}
 function init(){
  queue();window.addEventListener('load',queue,{once:true});window.addEventListener('resize',queue,{passive:true});
  document.fonts?.ready?.then(queue);
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  const stage=hero?.querySelector('.jj-hero-stage-v6');
  if(stage)new MutationObserver(queue).observe(stage,{subtree:true,childList:true});
  requestAnimationFrame(()=>requestAnimationFrame(queue));
  console.info('JOY2 V187 diagnostic: headers='+document.querySelectorAll('header.jj-ref-header').length+', hero headings='+document.querySelectorAll('main.jj-ref-home>.jj-ref-hero h1').length+', slides='+(stage?.querySelectorAll('.jj-hero-slide-v6').length||0));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();