/* JOY2_V188: update the one real Astro heading and real carousel cards. */
(()=>{
  const mq=matchMedia('(max-width:900px)');
  let pending=false;
  function apply(){
    pending=false;
    if(!mq.matches)return;
    const hero=document.querySelector('main.jj-ref-home>.jj-ref-hero');
    if(!hero)return;
    const h=hero.querySelector('.jj-hero-left-v2>h1');
    if(h)h.style.setProperty('font-size','clamp(31px, 6.5vw, 50px)','important');
    const stage=hero.querySelector('.jj-hero-stage-v6');
    if(!stage)return;
    stage.style.setProperty('overflow','visible','important');
    stage.querySelectorAll('.jj-hero-rotator-v6,.jj-hero-slide-v6').forEach(el=>el.style.setProperty('overflow','visible','important'));
    stage.querySelectorAll('.jj-hero-slide-v6>.jj-property-card').forEach(card=>{
      card.style.setProperty('box-shadow','0 0 0 1px rgba(24,27,34,.22), 0 0 25px 7px rgba(24,27,34,.28), 0 18px 44px rgba(24,27,34,.28)','important');
      card.style.setProperty('filter','drop-shadow(0 0 11px rgba(24,27,34,.26))','important');
    });
  }
  function queue(){if(pending)return;pending=true;requestAnimationFrame(apply)}
  function init(){
    queue();addEventListener('load',queue,{once:true});addEventListener('resize',queue,{passive:true});
    document.fonts?.ready?.then(queue);
    const stage=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-stage-v6');
    if(stage)new MutationObserver(queue).observe(stage,{childList:true,subtree:true});
    requestAnimationFrame(()=>requestAnimationFrame(queue));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();