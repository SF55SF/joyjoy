/* JOY2_MOBILE_PAGES_V151: independent mobile presentation; original filters keep their complete results. */
(()=>{
 const init=()=>{
  const grid=document.getElementById('jj-results');
  const section=document.getElementById('catalog-results');
  const workspace=section?.querySelector('.jj-workspace');
  if(!grid||!section||!workspace||document.getElementById('joy2-mobile-pagination-v151'))return;
  const lang=document.documentElement.lang;
  const copy=lang==='en'?{prev:'Previous',next:'Next',page:'Page',of:'of'}:lang==='uz'?{prev:'Oldingi',next:'Keyingi',page:'Sahifa',of:'dan'}:{prev:'Назад',next:'Далее',page:'Страница',of:'из'};
  const nav=document.createElement('nav');nav.id='joy2-mobile-pagination-v151';nav.className='joy2-mobile-pagination-v151';nav.setAttribute('aria-label',copy.page);
  workspace.insertAdjacentElement('afterend',nav);
  const mq=window.matchMedia('(max-width:700px)');
  let page=1,allowed=null;
  const cards=()=>[...grid.querySelectorAll(':scope > .jj-property-card')];
  function button(label,action,disabled,current){
   const b=document.createElement('button');b.type='button';b.className='joy2-page-button-v151';b.textContent=label;b.disabled=disabled;
   if(current){b.classList.add('is-current');b.setAttribute('aria-current','page')}
   b.addEventListener('click',()=>{if(b.disabled)return;page=action;render();const top=document.getElementById('catalog-results');if(top)top.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
   return b;
  }
  function render(){
   const all=cards();
   const mobile=mq.matches&&workspace.dataset.jjMode!=='map';
   for(const c of all)c.removeAttribute('data-joy2-page-hidden');
   if(!mobile){nav.replaceChildren();nav.hidden=true;return}
   const filtered=all.filter(c=>allowed?allowed.has(c.dataset.slug):!c.hidden);
   const total=Math.max(1,Math.ceil(filtered.length/4));page=Math.max(1,Math.min(total,page));
   filtered.forEach((c,i)=>{if(i<(page-1)*4||i>=page*4)c.dataset.joy2PageHidden='1'});
   nav.hidden=filtered.length<=4;
   nav.replaceChildren();
   if(filtered.length<=4)return;
   nav.append(button('‹ '+copy.prev,page-1,page===1,false));
   const start=Math.max(1,Math.min(page-1,total-4)),end=Math.min(total,start+4);
   for(let i=start;i<=end;i++)nav.append(button(String(i),i,false,i===page));
   nav.append(button(copy.next+' ›',page+1,page===total,false));
   const status=document.createElement('span');status.className='joy2-page-status-v151';status.textContent=copy.page+' '+page+' '+copy.of+' '+total;status.setAttribute('aria-live','polite');nav.append(status);
  }
  window.addEventListener('joyjoy:filter-change',e=>{
   const slugs=e.detail?.slugs;
   if(Array.isArray(slugs)){allowed=new Set(slugs);page=1;render();}
  });
  for(const b of document.querySelectorAll('[data-jj-view]'))b.addEventListener('click',()=>requestAnimationFrame(render));
  if(mq.addEventListener)mq.addEventListener('change',render);else mq.addListener(render);
  window.addEventListener('pageshow',render);
  render();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
