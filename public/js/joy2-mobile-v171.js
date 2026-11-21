/* JOY2 V171: mobile-only external scaling of original desktop-width carousel */
(()=>{
 const mq=matchMedia('(max-width:900px)');
 function adjust(){
  const hero=document.querySelector('main.jj-ref-home>.jj-ref-hero');
  const stage=hero?.querySelector('.jj-hero-right-v2.jj-hero-stage-v6');
  if(!hero||!stage)return;
  if(!mq.matches){stage.style.removeProperty('zoom');return;}
  const track=stage.querySelector('.jj-hero-rotator-v6');if(!track)return;
  stage.style.setProperty('zoom','1','important');
  let maxHeight=0;
  for(const slide of track.querySelectorAll('.jj-hero-slide-v6')){
   const was=slide.hidden;slide.hidden=false;
   const card=slide.querySelector('.jj-property-card');
   if(card)maxHeight=Math.max(maxHeight,card.scrollHeight,card.offsetHeight);
   slide.hidden=was;
  }
  if(maxHeight<100)return;
  track.style.setProperty('height',Math.ceil(maxHeight+2)+'px','important');
  const heroWidth=hero.clientWidth||innerWidth-32;
  const availableHeight=Math.max(180,innerHeight*.59);
  const scale=Math.max(.25,Math.min(.88,(heroWidth-38)/390,availableHeight/(maxHeight+2)));
  stage.style.setProperty('zoom',String(scale),'important');
 }
 let queued=false;const refresh=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;adjust()})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
 window.addEventListener('load',refresh,{once:true});window.addEventListener('resize',refresh,{passive:true});
 document.fonts?.ready?.then(refresh);
 setTimeout(refresh,450);setTimeout(refresh,1250);
})();