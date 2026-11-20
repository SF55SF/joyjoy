/* JOY2_FILTER_COMPACT_V82: move original range inputs out of extra panel permanently. */
(()=>{
 function init(){
  const form=document.getElementById('jj-filters');
  const top=form?.querySelector(':scope > .jj-rf-top');
  const extra=document.getElementById('jj-advanced-filters');
  if(!form||!top||!extra||form.dataset.joy2FiltersV82==='1')return;
  const wraps=[...top.querySelectorAll(':scope > .jj-rf-wrap')];
  const priceField=document.getElementById('jj-price-min')?.closest('fieldset.jj-range');
  const areaField=document.getElementById('jj-area-min')?.closest('fieldset.jj-range');
  const more=document.getElementById('jj-more-filters');
  const all=top.querySelector('.jj-rf-all');
  if(wraps.length<3||!priceField||!areaField||!more||!all)return;
  form.dataset.joy2FiltersV82='1';
  // Keep the REAL min/max inputs in their popup, not copies. Other filtering and
  // reset scripts still operate on the original element IDs and event listeners.
  function dockRange(wrap,field){
   const trigger=wrap.querySelector('.jj-rf-trigger');
   const menu=wrap.querySelector('.jj-rf-menu');
   if(!trigger||!menu)throw Error('Joy2 V82: price/area dropdown missing');
   field.classList.add('joy2-v82-range');
   // Original dropdown repaints options by menu.replaceChildren() on open.
   // Evacuate the field BEFORE that repaint; return it AFTER it completes.
   trigger.addEventListener('click',()=>{
    if(field.parentElement===menu)extra.appendChild(field);
   },true);
   trigger.addEventListener('click',()=>{
    if(field.parentElement!==menu)menu.appendChild(field);
   });
   menu.appendChild(field);
  }
  dockRange(wraps[1],priceField);
  dockRange(wraps[2],areaField);
  const invest=top.querySelector('.jj-rf-invest');
  if(invest&&wraps[1])top.insertBefore(invest,wraps[1]);
  // Compact styling of the same existing checkbox; preserve its value.
  const unknown=document.getElementById('jj-unknown');
  const label=unknown?.closest('.jj-price-unknown');
  if(label&&!label.querySelector('.joy2-v81-switch-track')){
   const track=document.createElement('span');track.className='joy2-v81-switch-track';track.setAttribute('aria-hidden','true');unknown.after(track);
   for(const node of [...label.childNodes]){
    if(node.nodeType===Node.TEXT_NODE&&node.textContent.trim()){
     const text=document.createElement('span');text.className='joy2-v81-switch-label';text.textContent=node.textContent.trim();node.replaceWith(text);
    }
   }
  }
  // The user can still open status and unknown-price options through All filters.
  extra.hidden=true;more.setAttribute('aria-expanded','false');all.setAttribute('aria-expanded','false');
  const sync=()=>all.setAttribute('aria-expanded',String(!extra.hidden));
  more.addEventListener('click',()=>queueMicrotask(sync));
  form.addEventListener('reset',()=>queueMicrotask(sync));
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(init),{once:true});
 else requestAnimationFrame(init);
})();
