/* JOY2_SUBTITLE_PIN_N_V138: align visible first glyph with the hero heading. */
(()=>{
 const boot=()=>{
  const hero=document.querySelector('main.jj-ref-home section.jj-ref-hero');
  const heading=hero?.querySelector('h1');
  const subtitle=hero?.querySelector('p.joy2-subtitle-aligned-v67');
  if(!heading||!subtitle)return;
  let queued=false,previous=null;
  function glyphLeft(el){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let node=walker.nextNode();node;node=walker.nextNode()){
    const match=/\S/.exec(node.textContent||'');if(!match)continue;
    const range=document.createRange();range.setStart(node,match.index);range.setEnd(node,match.index+1);
    const rect=range.getBoundingClientRect();if(Number.isFinite(rect.left)&&rect.width>0)return rect.left;
   }
   return el.getBoundingClientRect().left;
  }
  function align(){
   queued=false;
   // Use an absolute inline offset (not incremental) so repeated resize never drifts.
   subtitle.style.setProperty('left','0px','important');
   const target=glyphLeft(heading),actual=glyphLeft(subtitle);
   if(!Number.isFinite(target)||!Number.isFinite(actual))return;
   const delta=Math.round((target-actual)*100)/100;
   if(previous!==delta){subtitle.style.setProperty('left',delta+'px','important');previous=delta;}
   else subtitle.style.setProperty('left',delta+'px','important');
  }
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(align);}
  schedule();window.addEventListener('load',schedule,{once:true});window.addEventListener('resize',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
  if(typeof ResizeObserver!=='undefined'){
   const ro=new ResizeObserver(schedule);ro.observe(heading);ro.observe(hero);
  }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
