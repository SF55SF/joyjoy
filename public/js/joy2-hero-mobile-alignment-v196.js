/* JOY2 V196: measure only the existing Astro heading and original rotating catalog cards. */
(()=>{
 const selector='main.jj-ref-home > .jj-ref-hero';let scheduled=false;
 const mobile=()=>matchMedia('(max-width:900px)').matches;
 function align(){
  scheduled=false;if(!mobile()||document.documentElement.hasAttribute('data-joy2-mobile-hero-v249'))return;
  const hero=document.querySelector(selector),heading=hero?.querySelector('.jj-hero-left-v2 > h1');
  if(!hero||!heading)return;
  // Reset positioning before measuring, so reruns never compound the offset.
  heading.style.setProperty('top','0px','important');
  heading.style.setProperty('translate','none','important');
  heading.style.setProperty('transform','none','important');
  const stage=hero.querySelector('.jj-hero-stage-v6');
  const logo=document.querySelector('header.jj-ref-header .jj-brand-logo');
  const active=stage?.querySelector('.jj-hero-slide-v6:not([hidden]) > .jj-property-card')||stage?.querySelector('.jj-hero-slide-v6 > .jj-property-card');
  if(logo&&active){
    const titleRect=heading.getBoundingClientRect(),logoRect=logo.getBoundingClientRect(),cardRect=active.getBoundingClientRect();
    const dx=cardRect.left-titleRect.left;
    const freeSpace=cardRect.top-logoRect.bottom;
    const dy=(freeSpace>titleRect.height+12?(logoRect.bottom+cardRect.top-titleRect.height)/2-titleRect.top:0)+10;
    if([dx,dy].every(Number.isFinite))heading.style.setProperty('transform','translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px)','important');
  }else{heading.style.setProperty('transform','translateY(10px)','important');}
  // The badge is not redrawn: use the real badge cloned by the desktop rotator.
  for(const slide of stage?.querySelectorAll('.jj-hero-slide-v6')||[]){
    const card=slide.querySelector(':scope > .jj-property-card');
    const image=card?.querySelector(':scope > .jj-property-card-image');
    if(!image)continue;
    let ribbon=image.querySelector(':scope > .jj-invest-ribbon');
    if(!ribbon&&card.dataset.investment==='true'){
      const source=[...document.querySelectorAll('#jj-results .jj-property-card')].find(el=>el.dataset.slug===card.dataset.slug);
      const original=source?.querySelector('.jj-property-card-image > .jj-invest-ribbon');
      if(original){ribbon=original.cloneNode(true);image.appendChild(ribbon);}
    }
    if(!ribbon)continue;
    const rules={'position':'absolute','inset':'auto auto 0 0','top':'auto','right':'auto','bottom':'0px','left':'0px',
      'display':'inline-flex','visibility':'visible','opacity':'1','transform':'none','translate':'none',
      'background':'#b6ff00','color':'#111','clip-path':'none','border-radius':'0 9px 0 0',
      'padding':'10px 16px','width':'max-content','max-width':'100%','box-shadow':'none','z-index':'12'};
    for(const [key,value] of Object.entries(rules))ribbon.style.setProperty(key,value,'important');
  }
 }
 function queue(){if(document.documentElement.hasAttribute('data-joy2-mobile-hero-v249'))return;if(!scheduled){scheduled=true;requestAnimationFrame(align)}}
 function init(){
  if(document.documentElement.hasAttribute('data-joy2-mobile-hero-v249'))return;
  queue();window.addEventListener('resize',queue,{passive:true});window.addEventListener('load',queue,{once:true});
  document.fonts?.ready?.then(queue);
  const stage=document.querySelector(selector+' .jj-hero-stage-v6');
  if(stage)new MutationObserver(queue).observe(stage,{childList:true,subtree:true});
  requestAnimationFrame(()=>requestAnimationFrame(queue));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
