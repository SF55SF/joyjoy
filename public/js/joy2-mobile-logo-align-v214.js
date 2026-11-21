/* JOY2_V214 MOBILE HEADER: align painted Joy2 logo to property title */
(()=>{
 const mobile=()=>window.matchMedia('(max-width:760px)').matches;
 const header=()=>document.querySelector('header.jj-detail-sitebar .jj-sitebar-in');
 const wordmark=()=>document.querySelector('header.jj-detail-sitebar .jj-sitebar-in > .jj-wordmark');
 const logo=()=>document.querySelector('header.jj-detail-sitebar .jj-brand-logo');
 const title=()=>document.querySelector('main.jj-detail .jj-detail-heading h1');
 let raf=0;
 function align(){
  if(!mobile())return;
  const h=header(),w=wordmark(),l=logo(),t=title();if(!h||!w||!l||!t)return;
  const headingGroup=t.parentElement;
  if(headingGroup){headingGroup.style.setProperty('margin-left','0px','important');headingGroup.style.setProperty('transform','none','important');}
  // The SVG contains left transparent padding; align the actual drawn mark, not its image box.
  w.style.setProperty('margin-left','0px','important');
  w.style.setProperty('transform','none','important');
  w.style.setProperty('translate','none','important');
  const r=l.getBoundingClientRect(),wr=w.getBoundingClientRect(),tr=t.getBoundingClientRect();
  if(!(r.width>0&&r.height>0&&tr.width>0))return;
  const viewW=1330,viewH=720,drawX=300,viewX=230;
  const contentW=Math.min(r.width,r.height*viewW/viewH);
  const paintedX=r.left+(r.width-contentW)/2+((drawX-viewX)/viewW)*contentW;
  const move=tr.left-paintedX;
  if(Number.isFinite(move)&&Math.abs(move)<140){w.style.setProperty('margin-left',move.toFixed(2)+'px','important');}
  h.setAttribute('data-joy2-v214-aligned','yes');
 }
 function schedule(){if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{raf=0;align();});}
 function bootstrap(){schedule();setTimeout(schedule,80);setTimeout(schedule,400);setTimeout(schedule,1100);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap,{once:true});else bootstrap();
 window.addEventListener('load',schedule);window.addEventListener('resize',schedule,{passive:true});
 if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
})();