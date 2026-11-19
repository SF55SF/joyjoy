/* JOY2_DETAIL_LAYOUT_V27: move location to the existing property sidebar; discard unrelated property recommendations. */
(()=>{
 function apply(){
  const detail=document.querySelector('main.jj-detail');if(!detail)return;
  const sidebar=detail.querySelector('.jj-detail-sidebar');
  const location=detail.querySelector('.jj-detail-location-wide');
  if(!sidebar||!location)return;
  const related=detail.querySelector('.jj-related-grid');
  if(related){const section=related.closest('section');if(section)section.remove();else related.remove();}
  if(!sidebar.contains(location)){sidebar.append(location);}
  sidebar.classList.add('joy2-sidebar-location-v27');
  location.classList.add('joy2-location-in-sidebar-v27');
  // Map libraries may have measured the original container. Resize after relocation.
  requestAnimationFrame(()=>{requestAnimationFrame(()=>{
   try{window.dispatchEvent(new Event('resize'));}catch{}
  });});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
