/* JOY2_HERO_FINAL_VISUAL_V9 — changes presentation only, no replacement cards */
(()=>{
 function update(){
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(!hero)return;
  const bar=hero.querySelector('.jj-hero-left-v2 .jj-ref-actions, .jj-ref-actions');
  if(bar){
   const links=[...bar.querySelectorAll('a.jj-ref-cta')];
   const inv=links.find(a=>/investment=1/.test(a.getAttribute('href')||''));
   const all=links.find(a=>!(/investment=1/.test(a.getAttribute('href')||'')) && (/^#catalog/.test(a.getAttribute('href')||'')||/Все объекты|All properties|Barcha obyektlar/i.test(a.textContent||'')));
   function apply(a,bg,fg,arrow){
    if(!a)return;
    a.style.setProperty('background',bg,'important');
    a.style.setProperty('background-image',bg,'important');
    a.style.setProperty('color',fg,'important');
    for(const span of a.querySelectorAll('.joy2-hero-cta-label'))span.style.setProperty('color',fg,'important');
    for(const svg of a.querySelectorAll('svg.joy2-cta-real-arrow')){
     svg.style.setProperty('color',arrow,'important');
     svg.style.setProperty('stroke',arrow,'important');
     svg.querySelectorAll('path').forEach(p=>p.style.setProperty('stroke',arrow,'important'));
    }
   }
   apply(all,'linear-gradient(#292929,#111)','#ffffff','#ffffff');
   apply(inv,'linear-gradient(#fff,#f9f9fb)','#101112','#b8ff28');
  }
  const stage=hero.querySelector(':scope > .jj-hero-right-v2');
  if(!stage)return;
  stage.style.setProperty('box-shadow','none','important');
  stage.style.setProperty('background','transparent','important');
  stage.style.setProperty('padding','0','important');
  stage.style.setProperty('border','0','important');
  stage.style.setProperty('overflow','visible','important');
  for(const frame of stage.querySelectorAll('.jj-hero-rotator-v6, .jj-hero-rotator-v5, .jj-hero-rotator-v2'))frame.style.setProperty('overflow','visible','important');
  for(const card of stage.querySelectorAll('.jj-property-card')){
   card.style.setProperty('box-shadow','0 24px 52px rgba(18,22,30,.26),0 8px 18px rgba(18,22,30,.10)','important');
   card.style.setProperty('border-radius','22px','important');
  }
 }
 function start(){
  update();
  window.setTimeout(update,1100);
  window.setTimeout(update,2300);
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  if(hero){
   let scheduled=false;
   new MutationObserver(()=>{
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;update();});
   }).observe(hero,{childList:true,subtree:true});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
