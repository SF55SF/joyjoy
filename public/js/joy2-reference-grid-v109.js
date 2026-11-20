/* JOY2_REFERENCE_RESET_V109 — move existing panels into one real grid */
(()=>{
 function normalize(drawer){
  const main=drawer.querySelector('.joy2-v91-main');
  const kpis=drawer.querySelector('.jj-rinv-kpis');
  const stack=drawer.querySelector('.joy2-v99-chart-stack');
  const right=drawer.querySelector('.joy2-v93-right');
  if(!main||!kpis||!stack||!right)return;
  const chartArea=stack.querySelector('.joy2-v97-chart-area');
  const chart=chartArea?.querySelector('.joy2-v90-chart');
  const svg=chart?.querySelector('svg.joy2-v107-svg');
  if(!chartArea||!chart||!svg)return;
  drawer.classList.add('joy2-v109-drawer');
  let row=drawer.querySelector(':scope > .joy2-v109-layout');
  if(!row){row=document.createElement('div');row.className='joy2-v109-layout';const title=drawer.querySelector(':scope > .joy2-v104-heading');if(title)title.after(row);else drawer.appendChild(row);}
  if(kpis.parentElement!==row)row.appendChild(kpis);
  if(stack.parentElement!==row)row.appendChild(stack);
  if(right.parentElement!==row)row.appendChild(right);
  const side=right.querySelector('.joy2-v91-side');if(side&&side.parentElement!==right)right.prepend(side);
  const status=drawer.querySelector('.jj-rental-status-card');if(status&&status.parentElement!==right)right.appendChild(status);
  const footer=stack.querySelector('.joy2-v98-underchart');
  if(footer){
   let tax=drawer.querySelector('details.joy2-v93-tax');const pdf=drawer.querySelector('.jj-rinv-footer');
   if(tax&&tax.parentElement!==footer)footer.appendChild(tax);
   if(pdf&&pdf.parentElement!==footer)footer.appendChild(pdf);
  }
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  // Remove the legacy chart's forced preserveAspectRatio=none distortion.
  svg.style.setProperty('height','auto','important');
  svg.style.setProperty('width','100%','important');
  svg.style.setProperty('aspect-ratio','1000 / 430','important');
  // Reapply source-value formatting rather than adding two zeroes to rounded millions.
  const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':'en-US';
  kpis.querySelectorAll('strong[data-jj-v100-value]').forEach(el=>{
   const v=Number(el.getAttribute('data-jj-v100-value'));
   if(!Number.isFinite(v))return;
   const suffix=(document.documentElement.lang||'ru').startsWith('ru')?'млн':'m';
   el.textContent=(v<0?'−':'')+'$'+(Math.abs(v)/1e6).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
  });
 }
 function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v93-drawer').forEach(normalize);}
 const schedule=()=>{setTimeout(run,730);setTimeout(run,1250);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]')){setTimeout(run,760);setTimeout(run,1300);}});
})();