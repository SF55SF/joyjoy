/* JOY2_FILTER_UNIFIED_V81: one place for price and area controls. */
(()=>{
  function init(){
    const form=document.getElementById('jj-filters');
    const top=form?.querySelector(':scope > .jj-rf-top');
    const advanced=document.getElementById('jj-advanced-filters');
    if(!form||!top||!advanced||form.dataset.joy2FiltersV81==='1')return;
    const wraps=[...top.querySelectorAll(':scope > .jj-rf-wrap')];
    const minP=document.getElementById('jj-price-min');
    const maxP=document.getElementById('jj-price-max');
    const minA=document.getElementById('jj-area-min');
    const maxA=document.getElementById('jj-area-max');
    const priceField=minP?.closest('fieldset.jj-range');
    const areaField=minA?.closest('fieldset.jj-range');
    const more=document.getElementById('jj-more-filters');
    const quickAll=top.querySelector('.jj-rf-all');
    if(wraps.length<3||!priceField||!areaField||!maxP||!maxA||!more||!quickAll)return;
    form.dataset.joy2FiltersV81='1';
    // Existing dropdowns retain their presets. The same real min/max inputs now
    // appear within the corresponding dropdown, never duplicated on the page.
    function connectRange(wrap,field){
      const button=wrap.querySelector('.jj-rf-trigger');
      const menu=wrap.querySelector('.jj-rf-menu');
      if(!button||!menu)return;
      field.classList.add('joy2-v81-range');
      const add=()=>{if(!menu.hidden&&field.parentElement!==menu)menu.append(field)};
      // Earlier listener rebuilds the choices on every opening. Append afterward.
      button.addEventListener('click',add);
      // The menu may be painted as a result of other filters; leave it intact.
      if(!menu.hidden)add();
    }
    connectRange(wraps[1],priceField);
    connectRange(wraps[2],areaField);
    // The investment switch now follows property type, as requested.
    const invest=top.querySelector('.jj-rf-invest');
    if(invest&&wraps[1])top.insertBefore(invest,wraps[1]);
    // Include unknown-price offers: same checkbox and same filtering engine.
    const unknown=document.getElementById('jj-unknown');
    const unknownLabel=unknown?.closest('.jj-price-unknown');
    if(unknownLabel&&!unknownLabel.querySelector('.joy2-v81-switch-track')){
      const track=document.createElement('span');
      track.className='joy2-v81-switch-track';track.setAttribute('aria-hidden','true');
      unknown.after(track);
      for(const node of [...unknownLabel.childNodes]){
        if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim()){
          const content=document.createElement('span');
          content.className='joy2-v81-switch-label';content.textContent=node.textContent.trim();
          node.replaceWith(content);
        }
      }
    }
    // Additional filters are initially collapsed, including after navigation.
    advanced.hidden=true;
    more.setAttribute('aria-expanded','false');
    quickAll.setAttribute('aria-expanded','false');
    // Keep the visible disclosure indicator in sync with the existing toggle.
    const sync=()=>quickAll.setAttribute('aria-expanded',String(!advanced.hidden));
    more.addEventListener('click',()=>queueMicrotask(sync));
    form.addEventListener('reset',()=>queueMicrotask(sync));
    // Any changes made in an opened range use the original input/change events.
    for(const input of [minP,maxP,minA,maxA]){
      input.addEventListener('input',()=>{input.dataset.joy2V81Custom='1';});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(init),{once:true});
  else requestAnimationFrame(init);
})();
