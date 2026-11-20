/* JOY2_SINGLE_GRID_V110: stable grid; move real DOM children, not their display-only ancestors */
(()=>{
 const run=()=>{
  document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v93-drawer').forEach(drawer=>{
   const main=drawer.querySelector('.joy2-v91-main');
   const kpis=drawer.querySelector('.jj-rinv-kpis');
   const stack=drawer.querySelector('.joy2-v99-chart-stack');
   const right=drawer.querySelector('.joy2-v93-right');
   if(!main||!kpis||!stack||!right)return;
   let layout=drawer.querySelector(':scope > .joy2-v110-grid');
   if(!layout){layout=document.createElement('div');layout.className='joy2-v110-grid';const heading=drawer.querySelector(':scope > .joy2-v104-heading');if(heading)heading.after(layout);else drawer.append(layout);}
   drawer.classList.add('joy2-v110-drawer');
   if(kpis.parentElement!==layout)layout.append(kpis);
   if(stack.parentElement!==layout)layout.append(stack);
   if(right.parentElement!==layout)layout.append(right);
   const side=right.querySelector('.joy2-v91-side');if(side&&side.parentElement!==right)right.prepend(side);
   const status=drawer.querySelector('.jj-rental-status-card');if(status&&status.parentElement!==right)right.append(status);
   const area=stack.querySelector('.joy2-v97-chart-area');
   const under=drawer.querySelector('.joy2-v98-underchart');
   if(area&&area.parentElement!==stack)stack.prepend(area);
   if(under&&under.parentElement!==stack)stack.append(under);
   const tax=drawer.querySelector('details.joy2-v93-tax');
   const footer=drawer.querySelector('.jj-rinv-footer');
   if(under&&tax&&tax.parentElement!==under)under.append(tax);
   if(under&&footer&&footer.parentElement!==under)under.append(footer);
   const svg=drawer.querySelector('svg.joy2-v107-svg');
   if(svg){svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.style.removeProperty('height');svg.style.removeProperty('width');svg.style.removeProperty('aspect-ratio');}
   const lang=(document.documentElement.lang||'ru').toLowerCase(),locale=lang.startsWith('ru')?'ru-RU':lang.startsWith('uz')?'uz-UZ':'en-US',suffix=lang.startsWith('ru')?'млн':lang.startsWith('uz')?'mln':'m';
   kpis.querySelectorAll('strong[data-jj-v100-value]').forEach(el=>{const raw=el.getAttribute('data-jj-v100-value');const n=Number(raw);if(raw!==null&&raw.trim()!==''&&Number.isFinite(n))el.textContent=(n<0?'−':'')+'$'+(Math.abs(n)/1e6).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;});
  });
 };
 const later=()=>{setTimeout(run,520);setTimeout(run,1000);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',later,{once:true});else later();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))later();});
})();