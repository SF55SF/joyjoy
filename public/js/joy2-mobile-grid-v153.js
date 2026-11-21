/* JOY2_MOBILE_GRID_2X2_V153: pagination uses marketplace's complete filtered results. */
(()=>{
 const start=()=>{
  const grid=document.getElementById('jj-results');
  const section=document.getElementById('catalog-results');
  const workspace=section?.querySelector('.jj-workspace');
  if(!grid||!section||!workspace||document.getElementById('joy2-mobile-pagination-v153'))return;
  const t=document.documentElement.lang==='en'?['Back','Next','Page','of']:document.documentElement.lang==='uz'?['Orqaga','Keyingi','Sahifa','/']:['Назад','Далее','Страница','из'];
  const nav=document.createElement('nav');nav.id='joy2-mobile-pagination-v153';nav.className='joy2-mobile-pagination-v153';nav.setAttribute('aria-label',t[2]);
  workspace.insertAdjacentElement('afterend',nav);
  const mq=matchMedia('(max-width:900px)');
  let page=1,allowed=null;
  const allCards=()=>Array.from(grid.children).filter(x=>x.classList?.contains('jj-property-card'));
  const isMobile=()=>mq.matches;
  const go=(label,num,disabled,active)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;if(active)b.setAttribute('aria-current','page');
   b.addEventListener('click',()=>{page=num;render();section.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});return b};
  function render(){
   const all=allCards();
   // Clear old pagination attributes even if earlier patches were installed.
   for(const c of all){c.removeAttribute('data-joy2-paged-v151');c.removeAttribute('data-joy2-paged-v152');c.removeAttribute('data-joy2-paged-v153')}
   if(!isMobile()){nav.hidden=true;nav.replaceChildren();return}
   const list=all.filter(c=>allowed===null?!c.hidden:allowed.has(c.dataset.slug));
   const total=Math.max(1,Math.ceil(list.length/4));page=Math.min(Math.max(page,1),total);
   list.forEach((c,i)=>{if(Math.floor(i/4)+1!==page)c.dataset.joy2PagedV153='yes'});
   nav.replaceChildren();nav.hidden=list.length<=4;if(nav.hidden)return;
   nav.append(go('‹ '+t[0],page-1,page===1,false));
   const first=Math.max(1,Math.min(page-1,total-3));
   for(let i=first;i<=Math.min(total,first+3);i++)nav.append(go(String(i),i,false,i===page));
   nav.append(go(t[1]+' ›',page+1,page===total,false));
   const status=document.createElement('span');status.textContent=t[2]+' '+page+' '+t[3]+' '+total;nav.append(status);
  }
  window.addEventListener('joyjoy:filter-change',e=>{if(Array.isArray(e.detail?.slugs)){allowed=new Set(e.detail.slugs);page=1;render()}});
  if(mq.addEventListener)mq.addEventListener('change',render);else mq.addListener(render);
  window.addEventListener('pageshow',render);
  for(const b of document.querySelectorAll('[data-jj-view]'))b.addEventListener('click',()=>requestAnimationFrame(render));
  if(isMobile() && workspace.dataset.jjMode==='map')document.querySelector('[data-jj-view="list"]')?.click();
  render();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
