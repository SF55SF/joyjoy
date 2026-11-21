/* V190. Works on the existing DOM; no replacement headings or cards. */
(()=>{
 const mq=matchMedia('(max-width:900px)');let pending=false;
 const font='clamp(40.9975px, 8.59625vw, 66.125px)';
 const shadow='drop-shadow(0 0 13px rgba(17,22,29,.442)) drop-shadow(0 15px 24px rgba(17,22,29,.351))';
 function apply(){pending=false;if(!mq.matches)return;
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');if(!hero)return;
  const h=hero.querySelector('.jj-hero-left-v2 > h1');if(h)h.style.setProperty('font-size',font,'important');
  const stage=hero.querySelector('.jj-hero-stage-v6');if(!stage)return;
  stage.style.setProperty('overflow','visible','important');
  stage.querySelectorAll('.jj-hero-rotator-v6,.jj-hero-slide-v6').forEach(el=>el.style.setProperty('overflow','visible','important'));
  stage.querySelectorAll('.jj-hero-slide-v6').forEach(slide=>{
   slide.style.setProperty('filter',shadow,'important');
   const card=slide.querySelector(':scope > .jj-property-card');if(!card)return;
   card.style.setProperty('overflow','hidden','important');card.style.setProperty('border-radius','22px','important');
   card.style.setProperty('filter','none','important');card.style.setProperty('box-shadow','0 0 0 1px rgba(255,255,255,.9)','important');
  });
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(apply)}
 function boot(){schedule();addEventListener('resize',schedule,{passive:true});document.fonts?.ready?.then(schedule);
  const stage=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-stage-v6');
  if(stage)new MutationObserver(schedule).observe(stage,{subtree:true,childList:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();