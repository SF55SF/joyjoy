/* JOY2_FILTER_OVERLAY_CLEANUP_V1: close popovers on pointer exit, click outside, Escape or scrolling away. */
(()=>{
 function init(){
  const form=document.getElementById('jj-filters');if(!form||form.dataset.joy2OverlayClose==='1')return;
  form.dataset.joy2OverlayClose='1';
  const timers=new WeakMap();
  const getWraps=()=>[...form.querySelectorAll('.jj-rf-wrap')];
  function closeQuick(except){for(const wrap of getWraps()){
    if(wrap===except||!wrap.classList.contains('is-open'))continue;
    const btn=wrap.querySelector('.jj-rf-trigger');if(btn?.getAttribute('aria-expanded')==='true')btn.click();
  }}
  function closeAdvanced(){const panel=document.getElementById('jj-advanced-filters'),btn=document.getElementById('jj-more-filters');
    if(panel&&!panel.hidden&&btn)btn.click();
  }
  document.addEventListener('pointerdown',e=>{
    if(!(e.target instanceof Node))return;
    if(!form.contains(e.target)){closeQuick();closeAdvanced();return;}
    if(!e.target.parentElement?.closest('.jj-rf-wrap'))closeQuick();
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeQuick();closeAdvanced();}},true);
  function arm(wrap){if(timers.has(wrap))clearTimeout(timers.get(wrap));
    timers.set(wrap,setTimeout(()=>{if(!wrap.matches(':hover'))closeQuick();},260));
  }
  // Delegation so existing and future popovers get the same behavior.
  form.addEventListener('pointerout',e=>{
    if(e.pointerType!=='mouse')return;
    const wrap=e.target?.closest?.('.jj-rf-wrap');if(!wrap||wrap.contains(e.relatedTarget))return;
    arm(wrap);
  });
  form.addEventListener('pointerover',e=>{
    const wrap=e.target?.closest?.('.jj-rf-wrap');if(!wrap)return;
    const timer=timers.get(wrap);if(timer)clearTimeout(timer);
  });
  let previousTop=null;
  window.addEventListener('scroll',()=>{
    const top=form.querySelector('.jj-rf-top');if(!top)return;
    const rect=top.getBoundingClientRect();
    if(rect.bottom<0||rect.top>window.innerHeight){closeQuick();closeAdvanced();}
    previousTop=rect.top;
  },{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
