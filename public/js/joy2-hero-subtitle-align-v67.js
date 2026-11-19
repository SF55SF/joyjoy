/* Joy² v67: align subtitle glyph edge to headline glyph edge on the final card hero. */
(()=>{
 const boot=()=>{
  const hero=document.querySelector('main.jj-ref-home section.jj-ref-hero');
  if(!hero)return;
  const subtitle=hero.querySelector('p.joy2-subtitle-aligned-v67');
  if(!subtitle)return;
  let pending=false;
  function textLeft(el){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let n=walker.nextNode();n;n=walker.nextNode()){
    if(!n.textContent||!n.textContent.trim())continue;
    const range=document.createRange();range.selectNodeContents(n);
    const r=range.getBoundingClientRect();
    if(r.width>0&&Number.isFinite(r.left))return r.left;
   }
   return el.getBoundingClientRect().left;
  }
  function align(){
   const h=hero.querySelector('h1');if(!h)return;
   subtitle.style.removeProperty('--joy2-subtitle-offset-v67');
   const headlineLeft=textLeft(h),subtitleLeft=textLeft(subtitle);
   if(!Number.isFinite(headlineLeft)||!Number.isFinite(subtitleLeft))return;
   const delta=headlineLeft-subtitleLeft;
   if(Math.abs(delta)>.5)subtitle.style.setProperty('--joy2-subtitle-offset-v67',delta.toFixed(2)+'px');
  }
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;align()})};
  schedule();window.addEventListener('load',schedule,{once:true});window.addEventListener('resize',schedule,{passive:true});
  if('ResizeObserver' in window){const ro=new ResizeObserver(schedule);ro.observe(hero);const h=hero.querySelector('h1');if(h)ro.observe(h);}
  const mo=new MutationObserver(schedule);mo.observe(hero,{childList:true,subtree:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
