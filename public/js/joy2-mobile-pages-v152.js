/* JOY2_MOBILE_PAGE_V152: filter-aware pagination, four cards on mobile, independent of map mode. */
(()=>{
 const boot=()=>{
  const grid=document.getElementById('jj-results'),section=document.getElementById('catalog-results');
  const workspace=section?.querySelector('.jj-workspace');
  if(!grid||!section||!workspace||document.getElementById('joy2-mobile-pagination-v152'))return;
  const language=document.documentElement.lang;
  const t=language==='en'?['Back','Next','Page','of']:language==='uz'?['Orqaga','Keyingi','Sahifa','/']:['Назад','Далее','Страница','из'];
  const nav=document.createElement('nav');nav.id='joy2-mobile-pagination-v152';nav.className='joy2-mobile-pagination-v152';nav.setAttribute('aria-label',t[2]);
  workspace.insertAdjacentElement('afterend',nav);
  const mq=window.matchMedia('(max-width:700px)');
  let page=1,allowed=null;
  const cards=()=>[...grid.children].filter(e=>e.classList?.contains('jj-property-card'));
  const mobile=()=>mq.matches;
  function make(label,target,disabled,selected){const b=document.createElement('button');b.type='button';b.className='joy2-page-v152';b.textContent=label;b.disabled=disabled;
   if(selected){b.classList.add('active');b.setAttribute('aria-current','page')}
   b.addEventListener('click',()=>{page=target;paint();section.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});return b;}
  function paint(){
   const all=cards();for(const c of all)c.removeAttribute('data-joy2-paged-v152');
   if(!mobile()){nav.hidden=true;nav.replaceChildren();return;}
   // Marketplace filter-change reports the complete filtered dataset. Do not alter its own hidden flags.
   const filtered=all.filter(c=>allowed!==null?allowed.has(c.dataset.slug):!c.hidden);
   const pages=Math.max(1,Math.ceil(filtered.length/4));page=Math.min(Math.max(1,page),pages);
   filtered.forEach((c,i)=>{if(i<4*(page-1)||i>=4*page)c.dataset.joy2PagedV152='yes'});
   nav.hidden=filtered.length<=4;nav.replaceChildren();if(nav.hidden)return;
   nav.append(make('‹ '+t[0],page-1,page===1,false));
   const begin=Math.max(1,Math.min(page-1,pages-3));
   for(let n=begin;n<=Math.min(pages,begin+3);n++)nav.append(make(String(n),n,false,n===page));
   nav.append(make(t[1]+' ›',page+1,page===pages,false));
   const txt=document.createElement('span');txt.className='joy2-page-count-v152';txt.textContent=t[2]+' '+page+' '+t[3]+' '+pages;nav.append(txt);
  }
  window.addEventListener('joyjoy:filter-change',e=>{if(Array.isArray(e.detail?.slugs)){allowed=new Set(e.detail.slugs);page=1;paint()}});
  const refresh=()=>requestAnimationFrame(paint);
  for(const button of document.querySelectorAll('[data-jj-view]'))button.addEventListener('click',refresh);
  if(mq.addEventListener)mq.addEventListener('change',()=>{if(mq.matches){const list=document.querySelector('[data-jj-view="list"]');if(list&&workspace.dataset.jjMode==='map')list.click()}paint()});
  else mq.addListener(paint);
  window.addEventListener('pageshow',paint);
  if(mobile()&&workspace.dataset.jjMode==='map')document.querySelector('[data-jj-view="list"]')?.click();
  paint();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
