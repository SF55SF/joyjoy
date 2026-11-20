/* JOY2_V114: footer notes span KPI + chart; PDF stays right */
(()=>{
  function apply(drawer){
    const shell=drawer.querySelector('.joy2-v111-shell');
    const grid=shell?.querySelector('.joy2-v111-grid');
    if(!grid)return;
    const notes=shell.querySelector('.joy2-v113-notes');
    const pdfBox=shell.querySelector('.joy2-v113-pdf-box');
    if(!notes||!pdfBox)return;
    if(notes.parentElement!==grid)grid.append(notes);
    if(pdfBox.parentElement!==grid)grid.append(pdfBox);
    notes.classList.add('joy2-v114-notes-wide');
    pdfBox.classList.add('joy2-v114-pdf-bottom');
    drawer.classList.add('joy2-v114');
  }
  function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v111').forEach(apply)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,30)});
})();