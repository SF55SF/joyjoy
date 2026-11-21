/* JOY2_SUBTITLE_STABLE_V141: show caption only after accurate first-letter alignment. */
(()=>{
 const boot=()=>{
  const hero=document.querySelector('main.jj-ref-home section.jj-ref-hero');
  const heading=hero?.querySelector('h1');
  const subtitle=hero?.querySelector('p.joy2-subtitle-aligned-v67');
  if(!heading||!subtitle)return;
  let pending=false;
  function glyphLeft(el){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let node=walker.nextNode();node;node=walker.nextNode()){
    const m=/\S/.exec(node.textContent||'');if(!m)continue;
    const range=document.createRange();range.setStart(node,m.index);range.setEnd(node,m.index+1);
    const box=range.getBoundingClientRect();
    if(box.width>0&&Number.isFinite(box.left))return box.left;
   }
   return el.getBoundingClientRect().left;
  }
  function align(){
   pending=false;
   // Reset only OUR measured offset before measuring; never accumulate translations.
   subtitle.style.setProperty('--joy2-subtitle-offset-v141','0px');
   const delta=glyphLeft(heading)-glyphLeft(subtitle);
   if(!Number.isFinite(delta))return;
   subtitle.style.setProperty('--joy2-subtitle-offset-v141',Math.round(delta*100)/100+'px');
   subtitle.setAttribute('data-joy2-caption-ready','yes');
  }
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(align)};
  schedule();window.addEventListener('load',schedule,{once:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
  if(typeof ResizeObserver!=='undefined'){
   const observer=new ResizeObserver(schedule);observer.observe(heading);observer.observe(hero);
  }
  const mutation=new MutationObserver(schedule);mutation.observe(hero,{subtree:true,childList:true});
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
