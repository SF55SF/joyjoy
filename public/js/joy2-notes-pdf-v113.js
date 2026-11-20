/* JOY2_V113 — move actual financial assumptions below chart, PDF to right-bottom */
(()=>{
 const fmt=(n,lang)=> (n<0?'−':'')+'$'+(Math.abs(n)/1000000).toLocaleString(lang,{minimumFractionDigits:2,maximumFractionDigits:2})+' млн';
 function update(drawer){
  const shell=drawer.querySelector('.joy2-v111-shell');
  if(!shell || shell.dataset.joy2V113==='1')return;
  const center=shell.querySelector('.joy2-v111-center');
  const right=shell.querySelector('.joy2-v111-right');
  const chart=center?.querySelector('.joy2-v111-graph');
  const actions=center?.querySelector('.joy2-v111-actions');
  if(!center||!right||!chart||!actions)return;
  const pdf=actions.querySelector('[data-jj-investment-print]') || drawer.querySelector('[data-jj-investment-print]');
  const notes=actions.querySelector('.jj-rinv-footer-notes') || drawer.querySelector('.jj-rinv-footer-notes');
  if(!pdf||!notes)return;
  let noteBox=center.querySelector('.joy2-v113-notes');
  if(!noteBox){noteBox=document.createElement('div');noteBox.className='joy2-v113-notes';chart.after(noteBox);}
  noteBox.append(notes);
  let pdfBox=right.querySelector('.joy2-v113-pdf-box');
  if(!pdfBox){pdfBox=document.createElement('div');pdfBox.className='joy2-v113-pdf-box';right.append(pdfBox);}
  pdfBox.append(pdf);
  const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':'en-US';
  shell.querySelectorAll('.joy2-v111-kpis strong[data-joy2-usd-v112],.joy2-v111-kpis strong[data-jj-v100-value],.joy2-v111-kpis strong[data-joy2-amount]').forEach(el=>{
    const s=el.getAttribute('data-joy2-usd-v112')??el.getAttribute('data-jj-v100-value')??el.getAttribute('data-joy2-amount');
    const n=Number(s);if(s!==null && s!=='' && Number.isFinite(n))el.textContent=fmt(n,locale);
  });
  shell.dataset.joy2V113='1';
 }
 function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v111').forEach(update)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,40)});
})();