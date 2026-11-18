/* JOY2_RIBBON_TEXT_V4: separate label text from historic ribbon decoration. */
(()=>{
 const translations={ru:'Инвестиционный расчёт',uz:'Investitsiya hisobi',en:'Investment analysis'};
 const lang=(document.documentElement.lang||'ru').slice(0,2);
 const normalize=()=>{
  const grid=document.getElementById('jj-results');if(!grid)return;
  for(const badge of grid.querySelectorAll('.jj-property-card-image .jj-invest-ribbon')){
   if(badge.querySelector(':scope > .jj-ribbon-label-text'))continue;
   const span=document.createElement('span');span.className='jj-ribbon-label-text';
   span.textContent=translations[lang]||translations.ru;
   badge.replaceChildren(span);
  }
 };
 const start=()=>{
  normalize();const grid=document.getElementById('jj-results');if(!grid)return;
  let pending=false;
  new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;normalize()})}).observe(grid,{subtree:true,childList:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
