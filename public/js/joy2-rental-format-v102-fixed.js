/* JOY2_UNIT_RENTAL_TEXT_V102_FIXED: render purchase, sale, profit with 2 decimals */
(()=>{
  function fix(){
    document.querySelectorAll('.jj-detail .joy2-v99-drawer strong[data-jj-v100-value]').forEach(el=>{
      const n=Number(el.dataset.jjV100Value);
      if(!Number.isFinite(n))return;
      const language=(document.documentElement.lang||'ru').toLowerCase();
      const locale=language.startsWith('ru')?'ru-RU':language.startsWith('uz')?'uz-UZ':'en-US';
      const suffix=language.startsWith('ru')?'млн':language.startsWith('uz')?'mln':'m';
      const sign=n<0?'−':'';
      el.textContent=sign+'$'+(Math.abs(n)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fix,{once:true}); else fix();
  document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))queueMicrotask(fix);});
})();
