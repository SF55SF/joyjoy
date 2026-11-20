/* JOY2_REFERENCE_RESTORE_V106: layout and precise money; no model mutations */
(()=>{
 const lang=(document.documentElement.lang||'ru').toLowerCase();
 const locale=lang.startsWith('ru')?'ru-RU':lang.startsWith('uz')?'uz-UZ':'en-US';
 const suffix=lang.startsWith('ru')?'млн':lang.startsWith('uz')?'mln':'m';
 const format=n=>(n<0?'−':'')+'$'+(Math.abs(n)/1e6).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
 function apply(drawer){
  if(!drawer)return;
  const main=drawer.querySelector('.joy2-v91-main');
  const body=main?.querySelector('.joy2-v97-body');
  const kpis=main?.querySelector('.jj-rinv-kpis');
  const chartArea=main?.querySelector('.joy2-v97-chart-area');
  const right=drawer.querySelector('.joy2-v93-right');
  if(!main||!body||!kpis||!chartArea||!right)return;
  drawer.classList.add('joy2-v106-drawer');
  if(kpis.parentElement!==body)body.prepend(kpis);
  let stack=main.querySelector('.joy2-v99-chart-stack');
  if(!stack){stack=document.createElement('div');stack.className='joy2-v99-chart-stack';chartArea.before(stack);}
  if(chartArea.parentElement!==stack)stack.prepend(chartArea);
  const under=drawer.querySelector('.joy2-v98-underchart');
  if(under&&under.parentElement!==stack)stack.append(under);
  if(stack.parentElement!==body)body.append(stack);
  const boxes=[...kpis.children].filter(el=>el.nodeType===1);
  for(const box of boxes){box.style.removeProperty('order');box.style.removeProperty('grid-area');box.style.removeProperty('width');}
  // Unwind earlier conflicting order rules: IRR, purchase, sale, profit.
  const irr=boxes.find(b=>/IRR/i.test(b.querySelector('small')?.textContent||''));
  const purchase=boxes.find(b=>/Цена покупки|Purchase price|Sotib/i.test(b.querySelector('small')?.textContent||''));
  const sale=boxes.find(b=>/Цена продажи|Sale price|Sotish/i.test(b.querySelector('small')?.textContent||''));
  const profit=boxes.find(b=>/Прогнозируемая|Profit|Foyda/i.test(b.querySelector('small')?.textContent||''));
  if([irr,purchase,sale,profit].every(Boolean)){[irr,purchase,sale,profit].forEach(b=>kpis.append(b));}
  // Values come from numeric model attributes, never from rounded '$8 млн' strings.
  kpis.querySelectorAll('strong[data-jj-v100-value]').forEach(el=>{
    const raw=el.getAttribute('data-jj-v100-value');const n=Number(raw);
    if(raw!==null&&raw.trim()!==''&&Number.isFinite(n))el.textContent=format(n);
  });
  const status=drawer.querySelector('.jj-rental-status-card');if(status&&status.parentElement!==right)right.append(status);
 }
 function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v99-drawer').forEach(apply);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]')){setTimeout(run,0);setTimeout(run,220);}});
})();