/* V189: style only the real Astro heading and cloned property cards. */
(()=>{
 const mq=matchMedia('(max-width:900px)');let scheduled=false;
 function paint(){
  scheduled=false;if(!mq.matches)return;
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');if(!hero)return;
  const title=hero.querySelector('.jj-hero-left-v2 > h1');
  if(title)title.style.setProperty('font-size','clamp(35.65px, 7.475vw, 57.5px)','important');
  const stage=hero.querySelector('.jj-hero-stage-v6');if(!stage)return;
  stage.style.setProperty('overflow','visible','important');
  stage.querySelectorAll('.jj-hero-rotator-v6,.jj-hero-slide-v6').forEach(el=>el.style.setProperty('overflow','visible','important'));
  stage.querySelectorAll('.jj-hero-slide-v6').forEach(slide=>{
   slide.style.setProperty('filter','drop-shadow(0 0 13px rgba(17,22,29,.34)) drop-shadow(0 15px 24px rgba(17,22,29,.27))','important');
   const card=slide.querySelector(':scope > .jj-property-card');if(!card)return;
   card.style.setProperty('border-radius','22px','important');
   card.style.setProperty('overflow','hidden','important');
   card.style.setProperty('filter','none','important');
   card.style.setProperty('box-shadow','0 0 0 1px rgba(255,255,255,.9)','important');
  });
 }
 function queue(){if(scheduled)return;scheduled=true;requestAnimationFrame(paint)}
 function boot(){
  queue();addEventListener('resize',queue,{passive:true});addEventListener('load',queue,{once:true});
  document.fonts?.ready?.then(queue);
  const stage=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-stage-v6');
  if(stage)new MutationObserver(queue).observe(stage,{subtree:true,childList:true});
  requestAnimationFrame(()=>requestAnimationFrame(queue));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();