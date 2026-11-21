/* JOY2 V183: original desktop hero card shadow, mobile only. */
(()=>{
 const shadow='0 22px 44px rgba(19,22,29,.23), 0 7px 15px rgba(19,22,29,.1)';
 const apply=()=>{
  if(!matchMedia('(max-width:900px)').matches)return;
  const stage=document.querySelector('main.jj-ref-home .jj-hero-stage-v6');
  if(!stage)return;
  stage.querySelectorAll('.jj-hero-slide-v6 > .jj-property-card').forEach(card=>card.style.setProperty('box-shadow',shadow,'important'));
 };
 const start=()=>{
  apply();
  const stage=document.querySelector('main.jj-ref-home .jj-hero-stage-v6');
  if(stage)new MutationObserver(apply).observe(stage,{childList:true,subtree:true});
  addEventListener('resize',apply,{passive:true});
  addEventListener('load',apply,{once:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();