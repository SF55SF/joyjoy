/* JOY2_DETAIL_VISIBLE_LOGO_LINE_V31
   Match the title and address to the visible BLACK left border of Joy² logo,
   not to the logo link/image bounding box (which includes SVG transparent space).
*/
(()=>{
  const logo=document.querySelector('.jj-detail-sitebar .jj-brand-logo');
  const title=document.querySelector('.jj-detail .jj-detail-heading h1');
  if(!logo||!title)return;
  const group=title.parentElement;
  if(!group)return;
  let raf=0;
  function align(){
    // Reset old V29 translation before taking each measurement (no cumulative drift).
    group.style.setProperty('transform','none','important');
    const r=logo.getBoundingClientRect();
    // joy2-logo.svg has viewBox 230..1560; first black path starts at x=300.
    // Its artwork starts 70/1330 of the rendered SVG width after the image's left edge.
    const actualLogoLeft=r.left+r.width*(70/1330);
    const textLeft=title.getBoundingClientRect().left;
    if(!Number.isFinite(actualLogoLeft)||!Number.isFinite(textLeft))return;
    const offset=Math.max(-160,Math.min(160,actualLogoLeft-textLeft));
    group.style.setProperty('transform',`translateX(${offset.toFixed(2)}px)`,'important');
  }
  function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;align();});}
  schedule();
  window.addEventListener('load',schedule,{once:true});
  window.addEventListener('resize',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
})();
