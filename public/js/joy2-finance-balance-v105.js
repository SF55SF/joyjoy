/* JOY2_BALANCED_FINANCE_V105 — exact two-decimal millions from numeric model */
(()=>{
 const lang=(document.documentElement.lang||'ru').toLowerCase();
 const locale=lang.startsWith('ru')?'ru-RU':lang.startsWith('uz')?'uz-UZ':'en-US';
 const suffix=lang.startsWith('ru')?'млн':lang.startsWith('uz')?'mln':'m';
 function fix(){
  document.querySelectorAll('.jj-detail .jj-unit-finance-drawer .jj-rinv-kpis strong[data-jj-v100-value]').forEach(el=>{
   const n=Number(el.getAttribute('data-jj-v100-value'));
   if(!Number.isFinite(n))return;
   const out=(n<0?'−':'')+'$'+(Math.abs(n)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
   if(el.textContent!==out)el.textContent=out;
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))queueMicrotask(fix)});
})();