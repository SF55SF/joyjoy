/* JOY2_SINGLE_CATALOG_INVEST_V1 -- all listings + IRR sorting and motion */
(()=>{
  const homeFor = () => {
    const lang = document.documentElement.lang;
    return lang==='uz'?'/uz/':lang==='en'?'/en/':'/';
  };
  const investmentUrl = () => homeFor()+'?investment=1#catalog';
  const isProjectPath = pathname => /^\/(?:uz\/|en\/)?projects\/?$/.test(pathname);
  function rewriteLinks(){
    document.querySelectorAll('a[href]').forEach(a=>{
      try{const url=new URL(a.href,location.href);if(url.origin===location.origin&&isProjectPath(url.pathname)){
        a.href=investmentUrl();a.setAttribute('data-jj-investment-nav','');
      }}catch{}
    });
  }
  function ready(){
    rewriteLinks();
    const grid=document.getElementById('jj-results');
    const checkbox=document.querySelector('.jj-rf-invest-input');
    const sort=document.getElementById('jj-sort');
    if(!grid||!checkbox||!sort)return;
    checkbox.id='jj-investment-only';
    const cards=[...grid.querySelectorAll('.jj-property-card')];
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busy=false;
    let desired=checkbox.checked;
    let generation=0;
    const enabled=()=>checkbox.checked;
    const visible=()=>cards.filter(c=>!c.hidden);
    const cardIRR=c=>{const n=Number(c.dataset.irr);return c.dataset.irr!==''&&Number.isFinite(n)?n:-Infinity};
    function sortByIRR(){
      if(!enabled())return;
      const matches=visible().filter(c=>c.dataset.investment==='true');
      matches.sort((a,b)=>cardIRR(b)-cardIRR(a)||Number(b.dataset.profit||0)-Number(a.dataset.profit||0)||(Number(a.dataset.index)-Number(b.dataset.index)));
      matches.forEach(c=>grid.appendChild(c));
    }
    function setUrl(on){
      const url=new URL(location.href);
      if(on)url.searchParams.set('investment','1');else url.searchParams.delete('investment');
      history.replaceState(history.state,'',url.pathname+url.search+url.hash);
    }
    function rememberPositions(){const map=new Map();visible().forEach(c=>map.set(c,c.getBoundingClientRect()));return map;}
    function glide(old){
      if(reduce)return;
      for(const c of visible()){
        const before=old.get(c);const after=c.getBoundingClientRect();
        if(before){const x=before.left-after.left,y=before.top-after.top;if(Math.abs(x)>2||Math.abs(y)>2)c.animate([{transform:`translate(${x}px, ${y}px)`},{transform:'translate(0, 0)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});}
        else c.animate([{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});
      }
    }
    function refresh(){
      // Reuse native marketplace filtering, counters, favorites and map integration.
      sort.dispatchEvent(new Event('change',{bubbles:true}));
      sortByIRR();
    }
    async function apply(on,animate=true){
      const seq=++generation;
      desired=on;checkbox.checked=on;
      const old=rememberPositions();
      if(on&&animate&&!reduce){
        const outgoing=visible().filter(c=>c.dataset.investment!=='true');
        const fades=outgoing.map(c=>c.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.975)'}],{duration:220,easing:'ease-in',fill:'forwards'}));
        await Promise.all(fades.map(a=>a.finished.catch(()=>{})));
        if(seq!==generation){fades.forEach(a=>a.cancel());return;}
        refresh();fades.forEach(a=>a.cancel());setUrl(on);glide(old);return;
      }
      refresh();setUrl(on);
      glide(old);
    }
    // Stop the older checkbox handler from hiding noninvestment cards immediately.
    document.addEventListener('change',e=>{
      if(e.target!==checkbox)return;
      e.stopImmediatePropagation();
      apply(checkbox.checked,true);
    },true);
    // Other filters trigger marketplace updates. Keep IRR ordering while the filter is selected.
    window.addEventListener('joyjoy:filter-change',e=>{
      if(e.detail?.joy2Refined||!enabled())return;
      sortByIRR();
    });
    document.addEventListener('click',e=>{
      const a=e.target?.closest?.('a[href]');if(!a)return;
      let url;try{url=new URL(a.href,location.href)}catch{return}
      if(url.origin!==location.origin)return;
      if(!(a.hasAttribute('data-jj-investment-nav')||isProjectPath(url.pathname)||url.searchParams.get('investment')==='1'))return;
      if(!document.getElementById('jj-results')||url.pathname!==location.pathname)return;
      e.preventDefault();
      apply(true,true);
      const catalog=document.getElementById('catalog');
      if(catalog)catalog.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
    },true);
    // Persist filter on refresh/bookmark; old /projects links redirect here.
    if(new URLSearchParams(location.search).get('investment')==='1')apply(true,false);
    else if(enabled())apply(true,false);
    const reset=()=>{if(!enabled())return;checkbox.checked=false;setUrl(false);};
    document.getElementById('jj-reset')?.addEventListener('click',reset);
    document.getElementById('jj-clear-empty')?.addEventListener('click',reset);
    document.getElementById('jj-filters')?.addEventListener('reset',reset);
    window.addEventListener('pageshow',()=>{rewriteLinks();if(enabled())sortByIRR();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
