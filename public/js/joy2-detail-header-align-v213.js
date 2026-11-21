/* JOY2 V213: align header content with property heading after layout. */
(()=>{
 const q=s=>document.querySelector(s);
 const mq=window.matchMedia('(max-width:760px)');
 const apply=()=>{
  const header=q('.jj-detail-sitebar .jj-sitebar-in');
  const title=q('main.jj-detail .jj-detail-heading h1');
  if(!header||!title)return;
  header.style.removeProperty('--joy2-v213-side');
  if(!mq.matches)return;
  const x=title.getBoundingClientRect().left;
  if(x>0&&x<80)header.style.setProperty('--joy2-v213-side',Math.round(x)+'px');
 };
 const update=()=>requestAnimationFrame(()=>requestAnimationFrame(apply));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update,{once:true});else update();
 window.addEventListener('resize',update,{passive:true});
 if(document.fonts?.ready)document.fonts.ready.then(update).catch(()=>{});
})();