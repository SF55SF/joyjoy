/* JOY2_V228_SORT_FILTER_STYLE: custom visual menu matching Joy² filters; native select owns sorting. */
(()=>{'use strict';
function init(){
 const select=document.getElementById('jj-sort');
 if(!select||document.querySelector('.joy2-sort-v228'))return;
 const label=select.closest('label');
 if(!label||!label.parentElement)return;
 const wrap=document.createElement('div');wrap.className='joy2-sort-v228';
 const trigger=document.createElement('button');trigger.type='button';trigger.className='joy2-sort-v228-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label',select.getAttribute('aria-label')||'Сортировка');
 const caption=document.createElement('span');trigger.appendChild(caption);
 const chevron=document.createElementNS('http://www.w3.org/2000/svg','svg');chevron.setAttribute('viewBox','0 0 24 24');chevron.setAttribute('fill','none');chevron.setAttribute('stroke','currentColor');chevron.setAttribute('stroke-width','2');chevron.setAttribute('stroke-linecap','round');chevron.setAttribute('stroke-linejoin','round');chevron.setAttribute('aria-hidden','true');chevron.classList.add('joy2-sort-v228-chevron');const edge=document.createElementNS('http://www.w3.org/2000/svg','path');edge.setAttribute('d','m6 9 6 6 6-6');chevron.appendChild(edge);trigger.appendChild(chevron);
 const menu=document.createElement('div');menu.className='joy2-sort-v228-menu';menu.setAttribute('role','listbox');menu.hidden=true;
 const id='joy2-sort-v228-list';menu.id=id;trigger.setAttribute('aria-controls',id);
 wrap.append(trigger,menu);label.after(wrap);
 const items=[];
 function sync(){const opt=select.selectedOptions[0];caption.textContent=opt?.textContent||'';for(const b of items)b.setAttribute('aria-selected',b.dataset.value===select.value?'true':'false')}
 function close(returnFocus=false){menu.hidden=true;wrap.classList.remove('is-open');trigger.setAttribute('aria-expanded','false');if(returnFocus)trigger.focus({preventScroll:true})}
 function open(){sync();menu.hidden=false;wrap.classList.add('is-open');trigger.setAttribute('aria-expanded','true')}
 for(const option of select.options){const button=document.createElement('button');button.type='button';button.className='joy2-sort-v228-option';button.setAttribute('role','option');button.dataset.value=option.value;button.textContent=option.textContent;button.addEventListener('click',()=>{if(select.value!==option.value){select.value=option.value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}))}sync();close(true)});menu.appendChild(button);items.push(button)}
 trigger.addEventListener('click',()=>menu.hidden?open():close());
 trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();const pos=Math.max(0,items.findIndex(b=>b.dataset.value===select.value));items[e.key==='ArrowDown'?Math.min(items.length-1,pos+1):Math.max(0,pos-1)]?.focus()}else if(e.key==='Escape'){close()}});
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close(true)}else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=items.indexOf(document.activeElement);items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus()}else if(e.key==='Home'||e.key==='End'){e.preventDefault();items[e.key==='Home'?0:items.length-1]?.focus()}else if(e.key==='Tab')close()});
 document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target))close()},{passive:true});
 select.addEventListener('change',sync);window.addEventListener('pageshow',sync);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();