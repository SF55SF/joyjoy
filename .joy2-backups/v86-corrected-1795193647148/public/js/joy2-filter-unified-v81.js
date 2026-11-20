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

/* JOY2_FILTER_STATUS_V83: use existing construction status field as the fifth top-row filter. */
(()=>{
 function init(){
  const form=document.getElementById('jj-filters');
  const top=form?.querySelector(':scope > .jj-rf-top');
  const all=top?.querySelector(':scope > .jj-rf-all');
  const status=document.getElementById('jj-status');
  const advanced=document.getElementById('jj-advanced-filters');
  const unknown=document.getElementById('jj-unknown');
  const legacyMore=document.getElementById('jj-more-filters');
  if(!top||!all||!status||!advanced||!unknown||!legacyMore||form.dataset.joy2StatusV83==='1')return;
  const oldStatusLabel=status.closest('label');
  const label=document.createElement('label');
  label.className='joy2-v83-status';
  const text=document.createElement('span');
  const lang=document.documentElement.lang?.slice(0,2)||'ru';
  text.className='joy2-v83-status-caption';
  text.textContent=lang==='en'?'Construction status':lang==='uz'?'Qurilish holati':'Стадия строительства';
  status.setAttribute('aria-label',text.textContent);
  label.append(text,status);
  all.replaceWith(label);
  if(oldStatusLabel&&oldStatusLabel!==label&&oldStatusLabel.parentNode)oldStatusLabel.remove();
  // Keep the unknown-price option enabled internally so listing search behaves
  // as before, while removing the user-facing switch entirely.
  if(!unknown.checked){unknown.checked=true;unknown.dispatchEvent(new Event('change',{bubbles:true}));}
  advanced.hidden=true;
  legacyMore.setAttribute('aria-expanded','false');
  form.dataset.joy2StatusV83='1';
  form.addEventListener('reset',()=>queueMicrotask(()=>{
    if(!unknown.checked){unknown.checked=true;unknown.dispatchEvent(new Event('change',{bubbles:true}));}
    advanced.hidden=true;
    legacyMore.setAttribute('aria-expanded','false');
  }));
 }
 const schedule=()=>requestAnimationFrame(()=>requestAnimationFrame(init));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
})();


/* JOY2_FILTER_STATUS_MATCH_V84: use the same trigger/menu as neighboring filters. */
(()=>{
 function init(){
   const form=document.getElementById('jj-filters');
   const top=form?.querySelector(':scope > .jj-rf-top');
   const status=document.getElementById('jj-status');
   const oldLabel=top?.querySelector(':scope > .joy2-v83-status');
   if(!form||!top||!status||!oldLabel||form.dataset.joy2StatusV84==='1')return;
   const lang=(document.documentElement.lang||'ru').slice(0,2);
   const title=lang==='en'?'Construction status':lang==='uz'?'Qurilish holati':'Стадия строительства';
   const wrap=document.createElement('div');wrap.className='jj-rf-wrap joy2-v84-status-wrap';
   const button=document.createElement('button');
   button.type='button';button.className='jj-rf-trigger';
   button.setAttribute('aria-haspopup','true');
   button.setAttribute('aria-expanded','false');
   button.setAttribute('aria-label',title);
   button.setAttribute('aria-controls','joy2-v84-status-menu');
   const caption=document.createElement('span');caption.className='jj-rf-caption';
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
   svg.innerHTML='<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
   button.append(caption,svg);
   const menu=document.createElement('div');
   menu.id='joy2-v84-status-menu';menu.className='jj-rf-menu';menu.hidden=true;menu.setAttribute('role','menu');
   function refresh(){
     caption.textContent=status.value ? (status.selectedOptions[0]?.textContent||title) : title;
     menu.replaceChildren();
     for(const option of status.options){
       const item=document.createElement('button');item.type='button';
       const selected=option.value===status.value;
       item.className='jj-rf-option'+(selected?' is-current':'');
       item.textContent=option.textContent;
       item.setAttribute('role','menuitemradio');item.setAttribute('aria-checked',String(selected));
       item.addEventListener('click',()=>{
         status.value=option.value;
         status.dispatchEvent(new Event('input',{bubbles:true}));
         status.dispatchEvent(new Event('change',{bubbles:true}));
         close();refresh();button.focus();
       });
       menu.append(item);
     }
   }
   function close(){menu.hidden=true;button.setAttribute('aria-expanded','false');wrap.classList.remove('is-open');}
   button.addEventListener('click',()=>{
     const opening=menu.hidden;
     // Close other top-row dropdowns by their real button (preserves their state).
     for(const other of top.querySelectorAll('.jj-rf-wrap.is-open:not(.joy2-v84-status-wrap) > .jj-rf-trigger')){
       if(other.getAttribute('aria-expanded')==='true')other.click();
     }
     if(opening){refresh();menu.hidden=false;button.setAttribute('aria-expanded','true');wrap.classList.add('is-open');}
     else close();
   });
   wrap.append(button,menu);
   oldLabel.before(wrap);
   oldLabel.classList.add('joy2-v84-native-status-hidden');
   // Keep the actual #jj-status select and its existing filter listeners alive.
   // No duplicate status state and no change to the marketplace filtering engine.
   form.dataset.joy2StatusV84='1';
   status.addEventListener('change',refresh);
   form.addEventListener('reset',()=>queueMicrotask(()=>{close();refresh()}));
   top.addEventListener('click',e=>{
     if(!wrap.contains(e.target)&&e.target.closest('.jj-rf-trigger'))close();
   },true);
   document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close();},true);
   document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasOpen=!menu.hidden;close();if(wasOpen)button.focus();}},true);
   refresh();
 }
 const schedule=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(init)));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
 else schedule();
})();

