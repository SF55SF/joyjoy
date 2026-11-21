/* JOY2_V210_AREA_RANGE_FORMAT */
(()=>{
 const normalize=()=>{
  document.querySelectorAll('main.jj-detail .jj-detail-units-wide .jj-unit-data-row .jj-unit-col-area b').forEach(el=>{
   const t=el.textContent||'';
   const next=t.replace(/(\d)\s*[-–—]\s*(\d)/g,'$1 - $2');
   if(next!==t)el.textContent=next;
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',normalize,{once:true});else normalize();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))queueMicrotask(normalize)});
})();
