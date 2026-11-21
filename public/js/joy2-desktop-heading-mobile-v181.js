/* JOY2 V181: position the real Astro H1; no word or mark generation. */
(()=>{
 let queued=false;
 function render(){
  queued=false;
  const heading=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-left-v2>h1');
  if(!heading)return;
  if(!matchMedia('(max-width:900px)').matches){heading.style.removeProperty('transform');return;}
  const logo=document.querySelector('header.jj-ref-header .jj-brand-logo');
  const stage=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-stage-v6');
  const card=stage?.querySelector('.jj-hero-slide-v6:not([hidden])>.jj-property-card')||stage?.querySelector('.jj-hero-slide-v6>.jj-property-card');
  if(!logo||!card)return;
  heading.style.setProperty('transform','none','important');
  const t=heading.getBoundingClientRect(),l=logo.getBoundingClientRect(),c=card.getBoundingClientRect();
  if(!Number.isFinite(t.left+c.left+l.bottom+c.top))return;
  // Heading starts on the exact left edge of the visible card.
  const dx=c.left-t.left;
  // Preserve vertical centering in the gap below the logo.
  const gap=c.top-l.bottom;
  const dy=gap>t.height+12?(l.bottom+c.top-t.height)/2-t.top:0;
  heading.style.setProperty('transform','translate('+dx.toFixed(2)+'px,'+dy.toFixed(2)+'px)','important');
 }
 function queue(){if(queued)return;queued=true;requestAnimationFrame(render)}
 function init(){
  queue();addEventListener('resize',queue,{passive:true});addEventListener('orientationchange',queue,{passive:true});
  addEventListener('load',queue,{once:true});document.fonts?.ready?.then(queue);
  const stage=document.querySelector('main.jj-ref-home>.jj-ref-hero .jj-hero-stage-v6');
  if(stage)new MutationObserver(queue).observe(stage,{childList:true,subtree:false});
  requestAnimationFrame(()=>requestAnimationFrame(queue));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();