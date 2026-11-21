/* JOY2_V167_LOWER_SIXTY: scale original carousel as a single element. */
(()=>{
 const start=()=>{
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(!hero)return;
  const stageSelector='.jj-hero-right-v2.jj-hero-stage-v6';
  const media=matchMedia('(max-width:900px)');
  let pending=false;
  const apply=()=>{
   pending=false;
   const stage=hero.querySelector(stageSelector);
   if(!stage)return;
   if(!media.matches){stage.style.removeProperty('zoom');stage.style.removeProperty('width');return;}
   const rotator=stage.querySelector('.jj-hero-rotator-v6');
   if(!rotator)return;
   const slides=[...rotator.querySelectorAll('.jj-hero-slide-v6')];
   const base=390;
   stage.style.setProperty('width',base+'px','important');
   stage.style.setProperty('min-width',base+'px','important');
   // Measure the real original slide, at its unscaled desktop card width.
   stage.style.setProperty('zoom','1','important');
   let tallest=0;
   for(const slide of slides){
     const card=slide.querySelector('.jj-property-card');
     if(!card)continue;
     const prior=slide.hidden;
     if(prior)slide.hidden=false;
     const h=Math.max(card.scrollHeight,card.offsetHeight);
     if(prior)slide.hidden=true;
     if(Number.isFinite(h))tallest=Math.max(tallest,h);
   }
   if(tallest<120)return;
   const height=Math.ceil(tallest+3);
   rotator.style.setProperty('height',height+'px','important');
   // The stage is in the bottom 60% of the screen; never crop or stretch its contents.
   const availableWidth=Math.max(200,hero.clientWidth);
   const availableHeight=Math.max(230,innerHeight*.60-15);
   const scale=Math.min(1.65,availableWidth/base,availableHeight/height);
   stage.style.setProperty('zoom',String(Math.max(.2,scale)),'important');
   stage.dataset.joy2ScaleV167=scale.toFixed(3);
  };
  function schedule(){if(!pending){pending=true;requestAnimationFrame(apply)}}
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  document.fonts?.ready?.then(schedule).catch(()=>{});
  const obs=new MutationObserver(mutations=>{
   if(mutations.some(m=>m.type==='childList'&&m.target.closest?.('.jj-hero-rotator-v6')))schedule();
  });
  obs.observe(hero,{childList:true,subtree:true});
  schedule();requestAnimationFrame(schedule);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
