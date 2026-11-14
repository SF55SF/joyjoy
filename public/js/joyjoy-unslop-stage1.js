// Filter disclosure and removable selections. No controls are hidden by breakpoint.
(() => {
 const form=document.getElementById('jj-filters');if(!form)return;
 const button=document.getElementById('jj-more-filters'),panel=document.getElementById('jj-advanced-filters'),counter=document.getElementById('jj-filter-counter'),chips=document.getElementById('jj-active-filters');
 const ids=['jj-area-min','jj-area-max','jj-price-min','jj-price-max','jj-status','jj-unknown'];
 const text=document.documentElement.lang==='en'?{remove:'Remove',unknown:'Exclude price on request'}:document.documentElement.lang==='uz'?{remove:'O‘chirish',unknown:'Narxi ko‘rsatilmaganlarsiz'}:{remove:'Убрать',unknown:'Без цен по запросу'};
 function refresh(){
  let advanced=0;chips.replaceChildren();
  ['jj-q','jj-type',...ids].forEach(id=>{const el=document.getElementById(id);const checked=id==='jj-unknown';if(checked?el.checked:!el.value)return;
   if(ids.includes(id))advanced++;
   const chip=document.createElement('button');chip.type='button';chip.className='jj-filter-chip';
   const label=checked?text.unknown:el.tagName==='SELECT'?el.selectedOptions[0].textContent:((el.getAttribute('aria-label')||el.closest('label').querySelector('span')?.textContent||'')+': '+el.value);
   chip.textContent=label+' ×';chip.setAttribute('aria-label',text.remove+': '+label);
   chip.addEventListener('click',()=>{if(checked)el.checked=true;else el.value='';el.dispatchEvent(new Event('change',{bubbles:true}));refresh()});chips.append(chip);
  });counter.textContent=String(advanced);counter.hidden=!advanced;chips.hidden=!chips.childElementCount;
 }
 button.addEventListener('click',()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden))});
 form.addEventListener('input',refresh);form.addEventListener('change',refresh);form.addEventListener('reset',()=>queueMicrotask(()=>{panel.hidden=true;button.setAttribute('aria-expanded','false');refresh()}));refresh();
 if(ids.some(id=>{const e=document.getElementById(id);return id==='jj-unknown'?!e.checked:!!e.value})){panel.hidden=false;button.setAttribute('aria-expanded','true')}
})();
