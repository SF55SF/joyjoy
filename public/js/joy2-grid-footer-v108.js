/* JOY2_FIXED_THREE_COLUMNS_V108 — DOM and SVG proportions only, no model edits */
(()=>{
 function apply(){
  document.querySelectorAll('.jj-detail .jj-unit-finance-drawer').forEach(drawer=>{
   if(!drawer.querySelector('.joy2-v97-body')||!drawer.querySelector('.joy2-v99-chart-stack'))return;
   drawer.classList.add('joy2-v108-drawer');
   const svg=drawer.querySelector('svg.joy2-v107-svg');
   if(svg){svg.setAttribute('preserveAspectRatio','xMidYMid meet');}
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(apply,500)},{once:true});
 else setTimeout(apply,500);
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]')){setTimeout(apply,180);setTimeout(apply,650);}});
})();