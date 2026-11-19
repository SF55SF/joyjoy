/* JOY2_DETAIL_LOGO_ALIGNMENT_V29: align detail title to visible logo left edge. */
(()=>{
  const header=document.querySelector('.jj-detail-sitebar .jj-wordmark');
  const title=document.querySelector('.jj-detail .jj-detail-heading h1');
  if(!header||!title)return;
  const group=title.parentElement;
  if(!group)return;
  function align(){
    group.style.transform='';
    const logoLeft=header.getBoundingClientRect().left;
    const groupLeft=group.getBoundingClientRect().left;
    if(!Number.isFinite(logoLeft)||!Number.isFinite(groupLeft))return;
    const delta=logoLeft-groupLeft;
    group.style.transform=`translateX(${delta.toFixed(2)}px)`;
  }
  let raf=0;
  const schedule=()=>{if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;align();});};
  schedule();window.addEventListener('resize',schedule,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
})();
