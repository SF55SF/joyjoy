/* JOY2_BALANCE_ROW_V98 — move tax/pdf under chart and rebalance layout */
(()=>{
  function rebalance(drawer){
    if(!drawer || !drawer.classList.contains('joy2-v97-drawer')) return;
    drawer.classList.add('joy2-v98-drawer');
    const main = drawer.querySelector('.joy2-v91-main');
    const chartArea = main?.querySelector('.joy2-v97-chart-area');
    const right = drawer.querySelector('.joy2-v93-right');
    const side = right?.querySelector('.joy2-v91-side');
    const tax = drawer.querySelector('.joy2-v93-tax');
    const footer = drawer.querySelector('.jj-rinv-footer');
    if(!main || !chartArea || !right || !side || !tax || !footer) return;

    let row = main.querySelector('.joy2-v98-underchart');
    if(!row){
      row = document.createElement('div');
      row.className = 'joy2-v98-underchart';
      chartArea.insertAdjacentElement('afterend', row);
    }
    if(tax.parentElement !== row) row.appendChild(tax);
    if(footer.parentElement !== row) row.appendChild(footer);
    if(side.parentElement !== right) right.prepend(side);
  }
  function run(){ document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v93-drawer').forEach(rebalance); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once:true });
  else run();
  document.addEventListener('click', (e)=>{ if(e.target.closest('[data-jj-unit-select]')) setTimeout(run, 0); });
})();