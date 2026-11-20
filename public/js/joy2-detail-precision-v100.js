/* JOY2_UNITS_AND_CASHFLOW_V100: display-only monetary formatting */
(()=>{
 const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':(document.documentElement.lang||'').startsWith('uz')?'uz-UZ':'en-US';
 const language=(document.documentElement.lang||'ru').toLowerCase();
 const suffix=language.startsWith('ru')?'млн':language.startsWith('uz')?'mln':'m';
 function apply(){
  document.querySelectorAll('.jj-detail .joy2-v99-drawer').forEach(drawer=>{
   drawer.classList.add('joy2-v100-drawer');
   drawer.querySelectorAll('strong[data-jj-v100-value]').forEach(el=>{
    const raw=Number(el.dataset.jjV100Value);
    if(!Number.isFinite(raw))return;
    const sign=raw<0?'−':'';
    el.textContent=sign+'$'+(Math.abs(raw)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
   });
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(apply,0)});
})();