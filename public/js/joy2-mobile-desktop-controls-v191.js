/* JOY2_V191_MOBILE_DESKTOP_CONTROLS */
(()=>{
 const mobile=matchMedia('(max-width:900px)');
 let initialized=false;
 function init(){
  if(initialized)return;
  const hero=document.querySelector('main.jj-ref-home > .jj-ref-hero');
  const native=document.querySelector('#catalog .jj-rf-invest');
  const actions=document.querySelector('#catalog-results .jj-listing-actions');
  const sort=document.getElementById('jj-sort');
  if(!hero||!native||!actions||!sort)return;
  initialized=true;
  const home=actions.parentElement,marker=document.createComment('JOY2 V191 original desktop sort anchor');home.insertBefore(marker,actions);
  const bar=document.createElement('div');bar.id='joy2-mobile-desktop-controls-v191';
  const visual=native.cloneNode(true),checkbox=visual.querySelector('input');
  if(checkbox){checkbox.removeAttribute('id');checkbox.removeAttribute('name');checkbox.setAttribute('aria-label',native.textContent.trim());}
  // The actual desktop filter stays in its form and retains all event handlers.
  const original=native.querySelector('input');
  function sync(){if(checkbox&&original)checkbox.checked=original.checked}
  if(checkbox&&original){
    sync();checkbox.addEventListener('change',()=>{
      original.checked=checkbox.checked;
      original.dispatchEvent(new Event('input',{bubbles:true}));
      original.dispatchEvent(new Event('change',{bubbles:true}));
    });
    original.addEventListener('change',sync);
  }
  bar.appendChild(visual);hero.after(bar);
  function place(){
    if(mobile.matches){
      if(actions.parentElement!==bar)bar.appendChild(actions);
      const reset=actions.querySelector('#jj-reset');if(reset)reset.hidden=true;
      bar.hidden=false;
    }else{
      if(actions.parentElement!==home)marker.after(actions);
      bar.hidden=true;
    }
    sync();
  }
  mobile.addEventListener('change',place);place();
 }
 function boot(){init();if(initialized)return;
  const obs=new MutationObserver(()=>{init();if(initialized)obs.disconnect()});
  obs.observe(document.body,{subtree:true,childList:true});
  setTimeout(()=>obs.disconnect(),5000);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();