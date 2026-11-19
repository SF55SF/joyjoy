/* JOY2_HERO_NATIVE_CATALOG_V72: one native catalog card inside hero, never body overlay. */
(()=>{
 if(window.__joy2HeroNativeV72)return;
 window.__joy2HeroNativeV72=true;
 const hero=document.querySelector('main.jj-ref-home .jj-ref-hero');
 const grid=document.getElementById('jj-results');
 if(!hero||!grid)return;
 const cards=()=>[...grid.querySelectorAll('.jj-property-card[data-slug]')];
 const cssId='joy2-hero-native-v72-css';
 if(!document.getElementById(cssId)){
  const st=document.createElement('style');st.id=cssId;
  st.textContent=`
    main.jj-ref-home .jj-ref-hero .joy2-native-hero-card-v72{position:absolute!important;z-index:8!important;box-sizing:border-box!important;max-width:none!important;margin:0!important;transform:none!important;translate:none!important;opacity:1!important;visibility:visible!important;display:flex!important;overflow:hidden!important;}
    main.jj-ref-home .jj-ref-hero .joy2-native-hero-card-v72 .jj-property-card-image{flex-shrink:0}
    @media(max-width:999px){main.jj-ref-home .jj-ref-hero .joy2-native-hero-card-v72{display:none!important}}
  `;
  document.head.append(st);
 }
 let shell=null, original=null, index=0, box=null, lastSlug='';
 const viewportRect=el=>el.getBoundingClientRect();
 function findOriginal(){
  // The v71 original was marked before it was hidden. Prefer that exact element.
  const tagged=document.querySelector('[data-joy2-v71-original]');
  if(tagged&&tagged.isConnected)return tagged;
  const heading=hero.querySelector('h1');
  const minRight=heading?.getBoundingClientRect().right||0;
  const selectors='article,[class*="hero-card"],[class*="feature-card"],[class*="spotlight"],[class*="carousel-card"],[class*="property-card"]';
  const candidates=[...document.querySelectorAll('main.jj-ref-home '+selectors)].filter(el=>hero.contains(el)&&!el.closest('#catalog')&&!el.classList.contains('joy2-native-hero-card-v72'));
  const valid=candidates.map(el=>({el,r:viewportRect(el)})).filter(({r})=>r.width>=270&&r.width<=580&&r.height>=350&&r.height<=850&&r.left>=minRight-65);
  valid.sort((a,b)=>a.r.width*b.r.height-b.r.width*a.r.height);
  return valid[0]?.el||null;
 }
 function locate(){
  if(shell?.isConnected)return true;
  original=findOriginal();
  if(!original)return false;
  const r=viewportRect(original),h=viewportRect(hero);
  if(r.width<250||r.height<300)return false;
  box={left:r.left-h.left-67,top:r.top-h.top,width:r.width,height:r.height};
  // No second painted card: the old hero's image/text is removed from layout and view.
  original.style.setProperty('display','none','important');
  original.setAttribute('aria-hidden','true');
  // A single catalog card is inserted into the actual hero DOM.
  shell=document.createElement('article');
  shell.className='jj-property-card joy2-native-hero-card-v72';
  hero.append(shell);
  return true;
 }
 function refresh(){
  const list=cards();if(!list.length||!locate())return;
  const source=list[index%list.length];if(!source)return;
  const next=source.cloneNode(true);
  // Clone the exact catalog card contents and attributes, not a redesigned card.
  for(const a of [...shell.attributes])if(a.name!=='class')shell.removeAttribute(a.name);
  for(const a of [...next.attributes])if(a.name!=='class'&&a.name!=='id')shell.setAttribute(a.name,a.value);
  shell.className=next.className+' joy2-native-hero-card-v72';
  shell.removeAttribute('hidden');
  shell.style.cssText=`left:${box.left}px!important;top:${box.top}px!important;width:${box.width}px!important;height:${box.height}px!important;`;
  shell.replaceChildren(...[...next.childNodes]);
  shell.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  shell.dataset.slug=source.dataset.slug;
  lastSlug=source.dataset.slug;
 }
 const boot=()=>{
  if(!cards().length)return;
  refresh();
  if(!shell?.isConnected)return;
  // A single live card, replaced in place every four seconds.
  setInterval(()=>{
   const all=cards();if(all.length<2)return;
   index=(index+1)%all.length;
   refresh();
  },4000);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,900),{once:true});
 else setTimeout(boot,900);
})();
