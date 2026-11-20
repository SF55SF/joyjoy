/* JOY2_REFERENCE_PROPORTIONS_V99 — non-invasive responsive rearrangement */
(()=>{
  const loc=(document.documentElement.lang||'ru').toLowerCase();
  function apply(drawer){
    if(!drawer) return;
    const main=drawer.querySelector('.joy2-v91-main');
    const chartArea=main?.querySelector('.joy2-v97-chart-area');
    const right=drawer.querySelector('.joy2-v93-right');
    const side=right?.querySelector('.joy2-v91-side');
    const footer=drawer.querySelector('.jj-rinv-footer');
    if(!main||!chartArea||!right||!side||!footer)return;
    drawer.classList.add('joy2-v99-drawer');
    let row=drawer.querySelector('.joy2-v98-underchart');
    if(!row){row=document.createElement('div');row.className='joy2-v98-underchart';}
    // Wrap chart + actions together in the middle grid column.
    let stack=main.querySelector('.joy2-v99-chart-stack');
    if(!stack){
      stack=document.createElement('div');stack.className='joy2-v99-chart-stack';
      chartArea.insertAdjacentElement('beforebegin',stack);
    }
    if(chartArea.parentElement!==stack)stack.appendChild(chartArea);
    if(row.parentElement!==stack)stack.appendChild(row);
    let tax=drawer.querySelector('details.joy2-v93-tax');
    if(!tax){
      tax=document.createElement('details');tax.className='joy2-v93-tax';
      const summary=document.createElement('summary');
      summary.textContent=loc.startsWith('ru')?'Допущения и налоги':loc.startsWith('uz')?'Farazlar va soliqlar':'Assumptions and taxes';
      tax.appendChild(summary);
      const notes=drawer.querySelector('.jj-rinv-footer-notes');
      if(notes)tax.appendChild(notes);
      else {
        const box=document.createElement('div');box.className='jj-rinv-footer-notes';
        const msg=document.createElement('p');
        msg.textContent=loc.startsWith('ru')?'Расчёт основан на допущениях, фактические результаты могут отличаться.':loc.startsWith('uz')?'Hisob taxminlarga asoslangan.':'Calculations are based on assumptions.';
        box.appendChild(msg);tax.appendChild(box);
      }
    }
    if(tax.parentElement!==row)row.appendChild(tax);
    if(footer.parentElement!==row)row.appendChild(footer);
    if(side.parentElement!==right)right.prepend(side);
  }
  const run=()=>document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v93-drawer').forEach(apply);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0);});
})();
