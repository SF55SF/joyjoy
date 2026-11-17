/* JOY2_CATALOG_REFINED_V3 -- non-destructive enhancement of existing marketplace filters */
(() => {
  const onReady = () => {
    const form = document.getElementById('jj-filters');
    const grid = document.getElementById('jj-results');
    if (!form || !grid || document.querySelector('.jj-rf-top')) return;
    const lang = document.documentElement.lang || 'ru';
    const txt = lang === 'en' ? {
      type:'Property type', price:'Price, $', area:'Area, m²', investment:'Investment properties only', all:'All filters',
      any:'All types', anyPrice:'Any price', under:'Up to $500k', over:'Over $500k',
      anyArea:'Any area', a1:'Up to 500 m²',a2:'500–1,000 m²',a3:'Over 1,000 m²'
    } : lang === 'uz' ? {
      type:'Mulk turi', price:'Narx, $', area:'Maydon, m²', investment:'Faqat investitsiya obyektlari', all:'Barcha filtrlar',
      any:'Barcha turlar', anyPrice:'Istalgan narx', under:'500 ming $ gacha', over:'500 ming $ dan yuqori',
      anyArea:'Istalgan maydon',a1:'500 m² gacha',a2:'500–1 000 m²',a3:'1 000 m² dan yuqori'
    } : {
      type:'Тип недвижимости', price:'Цена, $', area:'Площадь, м²', investment:'Только инвестиционные', all:'Все фильтры',
      any:'Все типы', anyPrice:'Любая цена', under:'До 500 тыс. $', over:'Больше 500 тыс. $',
      anyArea:'Любая площадь',a1:'До 500 м²',a2:'500–1 000 м²',a3:'Больше 1 000 м²'
    };
    const get = id => document.getElementById(id);
    const originalMore = get('jj-more-filters');
    const advanced = get('jj-advanced-filters');
    const typeSelect = get('jj-type');
    if (!originalMore || !advanced || !typeSelect) return;
    const searchField = get('jj-q')?.closest('.jj-field-search');
    if(searchField) advanced.prepend(searchField);
    const top = document.createElement('div');
    top.className = 'jj-rf-top';
    const make = (tag, cls, label) => {
      const el = document.createElement(tag);
      el.className = cls;
      if(label) el.textContent = label;
      return el;
    };
    const controls=[];
    function addPopup(title, optionsFn, choose, currentFn) {
      const wrap=make('div','jj-rf-wrap');
      const button=make('button','jj-rf-trigger');
      button.type='button';button.setAttribute('aria-haspopup','true');button.setAttribute('aria-expanded','false');
      const caption=make('span','jj-rf-caption',title);button.append(caption);
      const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';button.append(svg);
      const menu=make('div','jj-rf-menu');menu.hidden=true;menu.setAttribute('role','menu');
      function paint(){menu.replaceChildren();const selected=currentFn();for(const [value,label] of optionsFn()){
        const option=make('button','jj-rf-option'+(selected===value?' is-current':''),label);option.type='button';option.setAttribute('role','menuitemradio');option.setAttribute('aria-checked',String(selected===value));
        option.addEventListener('click',()=>{choose(value);closeAll();paint()});menu.append(option);
      }}
      const close=()=>{menu.hidden=true;button.setAttribute('aria-expanded','false');wrap.classList.remove('is-open')};
      button.addEventListener('click',()=>{const opening=menu.hidden;closeAll();if(opening){paint();menu.hidden=false;button.setAttribute('aria-expanded','true');wrap.classList.add('is-open')}});
      wrap.append(button,menu);top.append(wrap);controls.push(close);
      return {button,paint,close};
    }
    const closeAll=()=>controls.forEach(f=>f());
    const emit=(el)=>{if(!el)return;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
    const typeUI=addPopup(txt.any,()=>[["",txt.any],...[...typeSelect.options].filter(x=>x.value).map(x=>[x.value,x.textContent])],v=>{typeSelect.value=v;emit(typeSelect)},()=>typeSelect.value);
    const priceMin=get('jj-price-min'),priceMax=get('jj-price-max');
    const priceUI=addPopup(txt.price,()=>[['all',txt.anyPrice],['under',txt.under],['over',txt.over]],v=>{
      if(!priceMin||!priceMax)return;
      priceMin.value=v==='over'?'500001':'';
      priceMax.value=v==='under'?'500000':'';
      emit(priceMin);emit(priceMax);
    },()=>priceMax?.value==='500000'?'under':priceMin?.value==='500001'?'over':'all');
    const areaMin=get('jj-area-min'),areaMax=get('jj-area-max');
    const areaUI=addPopup(txt.area,()=>[['all',txt.anyArea],['under',txt.a1],['mid',txt.a2],['over',txt.a3]],v=>{
      if(!areaMin||!areaMax)return;
      areaMin.value=v==='mid'?'500':v==='over'?'1001':'';
      areaMax.value=v==='under'?'500':v==='mid'?'1000':'';
      emit(areaMin);emit(areaMax);
    },()=>areaMax?.value==='500'?'under':areaMin?.value==='500'&&areaMax?.value==='1000'?'mid':areaMin?.value==='1001'?'over':'all');
    const invWrap=make('label','jj-rf-invest');const inv=make('input','jj-rf-invest-input');inv.type='checkbox';inv.setAttribute('aria-label',txt.investment);
    const track=make('span','jj-rf-track');const invText=make('span','jj-rf-invest-label',txt.investment);invWrap.append(inv,track,invText);top.append(invWrap);
    const more=make('button','jj-rf-all');more.type='button';more.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 17h16M9 4v6M15 14v6"/></svg><span></span>';more.querySelector('span').textContent=txt.all;
    more.addEventListener('click',()=>{closeAll();originalMore.click();more.setAttribute('aria-expanded',String(!advanced.hidden));if(!advanced.hidden)advanced.scrollIntoView({block:'nearest',behavior:'smooth'})});
    top.append(more);form.prepend(top);
    // Hide old quick row while preserving the elements & their event handlers.
    for(const el of [...form.children]){
      if(el===top||el===advanced||el.id==='jj-active-filters')continue;
      el.classList.add('jj-rf-legacy-hidden');
    }
    const state={marketSlugs:null};let broadcasting=false;
    function investmentVisibility(){
      if(state.marketSlugs===null) return;
      const cards=[...grid.querySelectorAll('.jj-property-card')];
      const selected=state.marketSlugs.filter(slug=>{
        const card=cards.find(x=>x.dataset.slug===slug);
        return card&&(!inv.checked||Boolean(card.querySelector('.jj-invest-ribbon')));
      });
      for(const c of cards)c.hidden=!selected.includes(c.dataset.slug);
      const counter=get('jj-count');if(counter){const before=counter.textContent||'';counter.textContent=before.replace(/\d+\s*$/,String(selected.length));}
      const empty=get('jj-empty');if(empty)empty.hidden=selected.length>0;
      if(!broadcasting){broadcasting=true;window.dispatchEvent(new CustomEvent('joyjoy:filter-change',{detail:{slugs:selected,joy2Refined:true}}));broadcasting=false;}
    }
    window.addEventListener('joyjoy:filter-change',e=>{
      if(e.detail?.joy2Refined||!Array.isArray(e.detail?.slugs))return;
      state.marketSlugs=e.detail.slugs;
      investmentVisibility();
    });
    inv.addEventListener('change',investmentVisibility);
    document.addEventListener('click',e=>{if(!top.contains(e.target))closeAll();
      const card=e.target?.closest?.('.jj-property-card');if(!card)return;
      if(e.target.closest('a,button,input,select,textarea,label,[role="button"]'))return;
      const link=card.querySelector('h3 a')||card.querySelector('.jj-property-card-image');
      if(link?.href)window.location.assign(link.href);
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape')closeAll();
      const card=e.target?.closest?.('.jj-property-card');if(card&&(e.key==='Enter'||e.key===' ')&&e.target===card){e.preventDefault();const link=card.querySelector('h3 a');if(link?.href)window.location.assign(link.href);}
    });
    for(const card of grid.querySelectorAll('.jj-property-card')){
      card.tabIndex=0;card.setAttribute('role','link');card.classList.add('jj-rf-clickable');
      const foot=card.querySelector('.jj-card-bottom');if(foot)foot.hidden=true;
    }
    form.addEventListener('reset',()=>{inv.checked=false;setTimeout(()=>{typeUI.paint();priceUI.paint();areaUI.paint();investmentVisibility()},0)});
    document.addEventListener('click',e=>{if(e.target.closest('#jj-reset, #jj-clear-empty'))inv.checked=false},true);
    // Include original mapping whenever filters were initialized before this enhancement.
    const refreshMarket=()=>{get('jj-type')?.dispatchEvent(new Event('change',{bubbles:true}))};
    setTimeout(refreshMarket,0);
    window.addEventListener('pageshow',refreshMarket);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady,{once:true});else onReady();
})();
