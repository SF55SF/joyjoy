/* JOY2 V172: only position/scale the existing 390px desktop carousel. */
(()=>{
 const media=matchMedia('(max-width:900px)');
 let last='';
 function fix(){
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  const stage=hero?.querySelector('.jj-hero-right-v2.jj-hero-stage-v6');
  const track=stage?.querySelector('.jj-hero-rotator-v6');
  if(!stage||!track)return;
  if(!media.matches){
   for(const key of ['zoom','transform','left','right','bottom','top'])stage.style.removeProperty(key);
   return;
  }
  stage.style.setProperty('zoom','1','important');
  stage.style.setProperty('left','calc(50% - 195px)','important');
  stage.style.setProperty('right','auto','important');
  stage.style.setProperty('top','auto','important');
  stage.style.setProperty('bottom','14px','important');
  let max=0;
  for(const slide of track.querySelectorAll('.jj-hero-slide-v6')){
   const card=slide.querySelector('.jj-property-card');
   if(card)max=Math.max(max,card.offsetHeight,card.scrollHeight);
  }
  max=Math.max(max,530);
  track.style.setProperty('height',Math.ceil(max)+'px','important');
  const width=hero.clientWidth||Math.max(280,innerWidth-32);
  const available=Math.max(200,Math.min(innerHeight*.59,hero.clientHeight*.59));
  const scale=Math.min(.87,(width-28)/390,available/max);
  const value='scale('+Math.max(.35,scale).toFixed(4)+')';
  if(value!==last){stage.style.setProperty('transform',value,'important');last=value;}
 }
 let scheduled=false;
 const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;fix()})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('load',schedule,{once:true});
 document.fonts?.ready?.then(schedule).catch(()=>{});
 setTimeout(schedule,300);setTimeout(schedule,1000);
})();
