/* JOY2_HERO_LIVE_CATALOG_MIRROR_V71 */
(()=>{
 if(window.__joy2HeroMirrorV71)return;
 window.__joy2HeroMirrorV71=true;
 const grid=()=>document.getElementById('jj-results');
 const catalogCards=()=>[...(grid()?.querySelectorAll('.jj-property-card')||[])];
 const hero=()=>document.querySelector('main.jj-ref-home .jj-ref-hero');
 const findExisting=()=>{
  const h=hero();if(!h)return null;
  const heading=h.querySelector('h1');const headingRight=heading?.getBoundingClientRect().right||0;
  const candidates=[...document.querySelectorAll('main.jj-ref-home article,main.jj-ref-home [class*=hero-card],main.jj-ref-home [class*=feature-card],main.jj-ref-home [class*=spotlight],main.jj-ref-home [class*=carousel-card],main.jj-ref-home [class*=property-card]')].filter(x=>!x.closest('#catalog')&&!x.closest('#jj-results'));
  const findCard=x=>{
   let el=x;
   for(let n=0;n<5&&el;n++,el=el.parentElement){
    const r=el.getBoundingClientRect();
    if(r.width>=270&&r.width<=580&&r.height>=350&&r.height<=850&&r.left>=headingRight-30&&r.top<innerHeight&&r.bottom>0)return el;
   }
   return null;
  };
  for(const c of candidates){const found=findCard(c);if(found)return found;}
  // Unmarked hero cards: locate the exact rendered title of a real catalog property.
  const titles=catalogCards().map(c=>c.querySelector('h3')?.textContent?.trim()).filter(Boolean);
  const walker=document.createTreeWalker(document.querySelector('main.jj-ref-home'),NodeFilter.SHOW_TEXT);
  let node;
  while(node=walker.nextNode()){
   if(node.parentElement?.closest('#catalog'))continue;
   const t=node.textContent?.trim();if(!t||!titles.includes(t))continue;
   const found=findCard(node.parentElement);if(found)return found;
  }
  return null;
 };
 let old=null,mirror=null,currentIndex=0;
 const resize=()=>{
  if(!old||!mirror||!old.isConnected)return;
  const r=old.getBoundingClientRect();
  const shift=innerWidth>=1000?67:0;
  Object.assign(mirror.style,{left:(r.left+scrollX-shift)+'px',top:(r.top+scrollY)+'px',width:r.width+'px',height:r.height+'px'});
 };
 const update=()=>{
  if(!old||!old.isConnected||!mirror)return;
  const cards=catalogCards();if(!cards.length)return;
  const src=cards[currentIndex%cards.length];
  if(!src)return;
  const copy=src.cloneNode(true);
  copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
  copy.removeAttribute('hidden');copy.classList.add('joy2-v71-catalog-clone');
  copy.style.setProperty('display','flex','important');
  copy.style.setProperty('width','100%','important');
  copy.style.setProperty('height','100%','important');
  copy.style.setProperty('margin','0','important');
  mirror.replaceChildren(copy);
  resize();
 };
 const mount=()=>{
  if(mirror||!grid()||!hero())return;
  old=findExisting();if(!old)return;
  const oldTitle=old.querySelector('h3')?.textContent?.trim()||'';
  const cards=catalogCards();
  const found=cards.findIndex(c=>(c.querySelector('h3')?.textContent?.trim()||'')===oldTitle);
  if(found>=0)currentIndex=found;
  mirror=document.createElement('div');mirror.className='joy2-v71-hero-mirror';
  const style=document.createElement('style');style.textContent=`
   .joy2-v71-hero-mirror{position:absolute!important;z-index:90!important;box-sizing:border-box!important;overflow:visible;filter:none;}
   .joy2-v71-hero-mirror .jj-property-card{min-width:0!important;max-width:none!important;box-sizing:border-box!important;overflow:hidden!important;}
   .joy2-v71-hero-mirror .jj-property-card-image{flex-shrink:0;}
   @media(max-width:999px){.joy2-v71-hero-mirror{display:none!important}}
  `;
  document.head.append(style);document.body.append(mirror);
  old.dataset.joy2V71Original='1';old.style.setProperty('visibility','hidden','important');
  old.style.setProperty('pointer-events','none','important');
  update();
  addEventListener('resize',resize,{passive:true});
  // Reuse the catalog card as-is, including its image, metrics and detail link.
  setInterval(()=>{if(!mirror?.isConnected)return;const count=catalogCards().length;if(count<2)return;currentIndex=(currentIndex+1)%count;update()},6500);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,450),{once:true});
 else setTimeout(mount,450);
})();
