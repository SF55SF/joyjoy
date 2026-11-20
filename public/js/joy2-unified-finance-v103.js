/* JOY2_UNIFIED_FINANCE_V103: fix investment amounts using source numbers, not rounded text */
(()=>{
 const getLocale=()=>{
  const lang=(document.documentElement.lang||'ru').toLowerCase();
  return {locale:lang.startsWith('ru')?'ru-RU':lang.startsWith('uz')?'uz-UZ':'en-US',suffix:lang.startsWith('ru')?'млн':lang.startsWith('uz')?'mln':'m'};
 };
 function update(){
  const {locale,suffix}=getLocale();
  document.querySelectorAll('.jj-detail .jj-unit-finance-drawer strong[data-jj-v100-value]').forEach(el=>{
   const value=Number(el.getAttribute('data-jj-v100-value'));
   if(!Number.isFinite(value))return;
   const desired=(value<0?'−':'')+'$'+(Math.abs(value)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
   if(el.textContent!==desired)el.textContent=desired;
  });
 }
 let queued=false;
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;update();});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))schedule();});
 const root=document.querySelector('.jj-detail');
 if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true,characterData:true});
})();