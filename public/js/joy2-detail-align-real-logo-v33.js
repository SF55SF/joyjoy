/* JOY2 DETAIL REAL SVG LOGO ALIGN V33 */
(()=>{
  /* JOY2_V214_DESKTOP_ONLY: mobile logo aligns to property title, not the reverse. */
  if(window.matchMedia && window.matchMedia("(max-width:760px)").matches)return;
  const logo=document.querySelector('.jj-detail-sitebar .jj-brand-logo');
  const title=document.querySelector('.jj-detail .jj-detail-heading h1');
  if(!logo||!title)return;
  const group=title.parentElement;
  if(!group)return;
  // public/joy2-logo.svg: viewBox="230 100 1330 720", black left outline starts at x=300.
  // The img is constrained by max-height and object-fit:contain, so the SVG artwork
  // can be narrower than the CSS img box. Account for the contain letterboxing.
  const viewWidth=1330,viewHeight=720,artStartX=300,viewX=230;
  let raf=0;
  function align(){
    group.style.setProperty('transform','none','important');
    group.style.setProperty('margin-left','0px','important');
    const rect=logo.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const ratio=viewWidth/viewHeight;
    const contentWidth=Math.min(rect.width,rect.height*ratio);
    const contentLeft=rect.left+(rect.width-contentWidth)/2;
    const paintedLogoLeft=contentLeft+(artStartX-viewX)/viewWidth*contentWidth;
    const titleLeft=title.getBoundingClientRect().left;
    const shift=Math.max(-240,Math.min(240,paintedLogoLeft-titleLeft));
    if(Number.isFinite(shift))group.style.setProperty('margin-left',shift.toFixed(3)+'px','important');
  }
  function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;align()})}
  schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('resize',schedule,{passive:true});
  logo.addEventListener('load',schedule,{once:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
  if(window.ResizeObserver){const ro=new ResizeObserver(schedule);ro.observe(logo);}
})();
