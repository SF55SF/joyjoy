/* JOY2_SUBTITLE_ANCHOR_V143: preserve V138 glyph alignment, no visible initial jump. */
(()=>{
 const boot=()=>{
  const hero=document.querySelector('main.jj-ref-home section.jj-ref-hero');
  const h=hero?.querySelector('h1');
  const p=hero?.querySelector('p.joy2-subtitle-aligned-v67');
  if(!h||!p)return;
  let scheduled=false;
  function glyphLeft(el){
   const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let n=w.nextNode();n;n=w.nextNode()){
    const m=/\S/.exec(n.textContent||'');if(!m)continue;
    const r=document.createRange();r.setStart(n,m.index);r.setEnd(n,m.index+1);
    const b=r.getBoundingClientRect();if(b.width>0&&Number.isFinite(b.left))return b.left;
   }
   return el.getBoundingClientRect().left;
  }
  function align(){
   scheduled=false;
   // V138 method: reset actual inline left, measure both rendered first glyphs, apply a fresh absolute offset.
   p.style.setProperty('left','0px','important');
   const goal=glyphLeft(h),actual=glyphLeft(p);
   if(!Number.isFinite(goal)||!Number.isFinite(actual))return;
   p.style.setProperty('left',(Math.round((goal-actual)*100)/100)+'px','important');
   p.style.setProperty('visibility','visible','important');
   p.dataset.joy2CaptionReady='yes';
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(align)}}
  schedule();window.addEventListener('load',schedule,{once:true});window.addEventListener('resize',schedule,{passive:true});
  document.fonts?.ready?.then(schedule).catch(()=>{});
  if(typeof ResizeObserver!=='undefined'){
   const ro=new ResizeObserver(schedule);ro.observe(h);ro.observe(hero);
  }
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
