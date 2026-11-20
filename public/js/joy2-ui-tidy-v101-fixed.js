/* JOY2_UNITS_ROWS_FOOTER_V101_FIXED: keep tax and PDF under the original chart */
(()=>{
 function apply(drawer){
   const main=drawer.querySelector('.joy2-v91-main');
   const chartArea=main?.querySelector('.joy2-v97-chart-area');
   const right=drawer.querySelector('.joy2-v93-right');
   const footer=drawer.querySelector('.jj-rinv-footer');
   if(!main||!chartArea||!right||!footer)return;
   let stack=main.querySelector('.joy2-v99-chart-stack');
   if(!stack){stack=document.createElement('div');stack.className='joy2-v99-chart-stack';chartArea.before(stack);}
   if(chartArea.parentElement!==stack)stack.appendChild(chartArea);
   let row=stack.querySelector('.joy2-v98-underchart');
   if(!row){row=drawer.querySelector('.joy2-v98-underchart');if(!row){row=document.createElement('div');row.className='joy2-v98-underchart';}stack.appendChild(row);}
   let tax=drawer.querySelector('details.joy2-v93-tax');
   if(!tax){
     tax=document.createElement('details');tax.className='joy2-v93-tax';
     const summary=document.createElement('summary');
     const locale=(document.documentElement.lang||'ru').toLowerCase();
     summary.textContent=locale.startsWith('uz')?'Farazlar va soliqlar':locale.startsWith('en')?'Assumptions and taxes':'Допущения и налоги';
     tax.append(summary);
     const notes=drawer.querySelector('.jj-rinv-footer-notes');
     if(notes)tax.append(notes);
   }
   if(tax.parentElement!==row)row.append(tax);
   if(footer.parentElement!==row)row.append(footer);
   const side=drawer.querySelector('.joy2-v91-side');
   if(side&&side.parentElement!==right)right.prepend(side);
 }
 function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v99-drawer').forEach(apply);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0);});
})();