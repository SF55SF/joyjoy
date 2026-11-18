/* JOY2_INVESTMENT_ENTRANCE_V5: exclusively hero investment button, delayed visible FLIP */
(()=>{
 const start=()=>{
  const catalog=document.getElementById('catalog'),grid=document.getElementById('jj-results');
  if(!catalog||!grid||!document.querySelector('main.jj-ref-home')||window.__joy2InvestmentV5)return;
  window.__joy2InvestmentV5=true;
  const ranks=(()=>{try{return JSON.parse(document.getElementById('jj-hero-investment-ranks')?.textContent||'{}')}catch{return {}}})();
  const cards=()=>[...grid.querySelectorAll('.jj-property-card')];
  const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const active=c=>c.dataset.investment==='true';
  const rank=(a,b)=>{
   const x=Number(a.dataset.irr),y=Number(b.dataset.irr),validX=a.dataset.irr!==''&&Number.isFinite(x),validY=b.dataset.irr!==''&&Number.isFinite(y);
   if(validX!==validY)return validX?-1:1;
   if(validX&&x!==y)return y-x;
   return (Number(b.dataset.profit)||0)-(Number(a.dataset.profit)||0)||Number(a.dataset.index||0)-Number(b.dataset.index||0);
  };
  const sync=()=>cards().forEach(c=>{const r=ranks[c.dataset.slug];if(!r)return;c.dataset.investment=String(r.investment===true);c.dataset.irr=r.irr==null?'':String(r.irr);c.dataset.profit=r.profit==null?'':String(r.profit)});
  sync();
  const switches=()=>[...new Set(document.querySelectorAll('#jj-investment-only,.jj-rf-invest-input'))];
  let busy=false;
  const delay=ms=>new Promise(res=>setTimeout(res,ms));
  const nextFrame=()=>new Promise(res=>requestAnimationFrame(()=>res()));
  const headerHeight=()=>0; // The header scrolls normally; never change it.
  const rect=c=>c.getBoundingClientRect();
  const visible=c=>!c.hidden&&getComputedStyle(c).display!=='none';
  const ghost=(c,r,host)=>{
   const el=c.cloneNode(true);el.removeAttribute('id');el.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));el.removeAttribute('hidden');
   el.style.cssText='position:fixed!important;display:flex!important;left:'+r.left+'px!important;top:'+r.top+'px!important;width:'+r.width+'px!important;height:'+r.height+'px!important;margin:0!important;overflow:hidden!important;box-sizing:border-box!important;pointer-events:none!important;opacity:1!important;transform-origin:center!important;';
   host.append(el);return el;
  };
  async function run(){
   try{
    // First complete the jump. Wait for all filters' layout and the browser to paint the original catalogue.
    const y=rect(catalog).top+window.scrollY;
    window.scrollTo({top:Math.max(0,y-headerHeight()),behavior:'instant'});
    await nextFrame();await nextFrame();await delay(420);
    sync();
    // If the first card row is outside the viewport, scroll just enough to show the animation.
    const first=cards().find(visible),firstRect=first?rect(first):null;
    if(firstRect&&firstRect.top>window.innerHeight-190){
     const desired=Math.min(window.innerHeight*.58,430);
     window.scrollTo({top:Math.max(0,window.scrollY+firstRect.top-desired),behavior:'smooth'});
     await delay(460);await nextFrame();
    }
    const all=cards(),shown=all.filter(visible),positions=new Map(shown.map(c=>[c,rect(c)]));
    const removed=shown.filter(c=>!active(c)),selected=all.filter(active).sort(rank),keep=new Set(selected);
    const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;';
    const copies=[];
    if(!reduce())for(const c of removed){const r=positions.get(c);if(r&&r.width>5&&r.height>5&&r.bottom>0&&r.top<window.innerHeight)copies.push(ghost(c,r,overlay))}
    if(copies.length)document.body.append(overlay);
    // Keep native counter, map and other filters coherent; do not animate any later filter changes.
    for(const input of switches())input.checked=true;
    const type=document.getElementById('jj-type');if(type)type.dispatchEvent(new Event('change',{bubbles:true}));
    all.forEach(c=>{c.hidden=!keep.has(c)});
    selected.forEach(c=>grid.append(c));
    const count=document.getElementById('jj-count');if(count)count.textContent=(count.textContent||'Найдено объектов: 0').replace(/\d+\s*$/,String(selected.length));
    const empty=document.getElementById('jj-empty');if(empty)empty.hidden=selected.length>0;
    const url=new URL(location.href);url.searchParams.set('investment','1');url.hash='catalog';history.replaceState(history.state,'',url);
    window.dispatchEvent(new CustomEvent('joyjoy:filter-change',{detail:{slugs:selected.map(c=>c.dataset.slug),joy2EntranceV5:true}}));
    await nextFrame();
    const animations=[];
    if(!reduce()&&Element.prototype.animate){
     for(let i=0;i<selected.length;i++){
      const c=selected[i],a=positions.get(c),b=rect(c);if(b.width<4||b.height<4)continue;
      const dx=a?a.left-b.left:0,dy=a?a.top-b.top:32;
      // Even if a card is already in its final position, give it a visible but subtle arrival.
      const fromX=Math.abs(dx)>2?dx:(i%2===0?-19:19);
      const fromY=Math.abs(dy)>2?dy:24;
      animations.push(c.animate([{transform:'translate('+fromX+'px,'+fromY+'px) scale(.97)',opacity:.5,filter:'blur(3px)'},{transform:'translate(0px,0px) scale(1)',opacity:1,filter:'blur(0px)'}],{duration:950,delay:i*90,easing:'cubic-bezier(.16,1,.3,1)'}));
     }
     for(const c of copies)animations.push(c.animate([{opacity:1,transform:'scale(1)',filter:'blur(0px)'},{opacity:0,transform:'scale(.94)',filter:'blur(9px)'}],{duration:740,easing:'ease-in',fill:'forwards'}));
    }
    await Promise.race([Promise.allSettled(animations.map(a=>a.finished)),delay(2100)]);
    overlay.remove();
   }catch(error){console.error('Joy² investment entrance V5',error);document.querySelectorAll('.jj-property-card').forEach(c=>c.style.removeProperty('opacity'))}
   finally{busy=false}
  }
  // Capture before legacy document handlers; only the hero CTA owns this animation.
  window.addEventListener('click',event=>{
   const a=event.target?.closest?.('.jj-ref-actions > a.jj-ref-cta:not(.jj-ref-cta-secondary)');if(!a)return;
   event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
   if(busy)return;busy=true;run();
  },true);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
