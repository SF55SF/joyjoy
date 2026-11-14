/* JOYJOY_LOOPNET_FILTERS_V3 */
(() => {
  const $=id=>document.getElementById(id), grid=$('jj-results'); if(!grid)return;
  const form=$('jj-filters'), cards=[...grid.querySelectorAll('.jj-property-card')];
  const fields={q:$('jj-q'),type:$('jj-type'),minArea:$('jj-area-min'),maxArea:$('jj-area-max'),minPrice:$('jj-price-min'),maxPrice:$('jj-price-max'),unknown:$('jj-unknown'),status:$('jj-status'),sort:$('jj-sort')};
  const i18n=JSON.parse($('jj-i18n-data').textContent), savedButton=$('jj-saved-only');
  const favoritesKey='joyjoy-favorites-v1';let favorites=[];
  try{const raw=JSON.parse(localStorage.getItem(favoritesKey)||'[]');if(Array.isArray(raw))favorites=raw.filter(v=>typeof v==='string')}catch{}
  let savedOnly=false, mapBounds=null, mode='list';
  const params=new URLSearchParams(location.search);for(const [key,input] of Object.entries(fields)){if(key==='unknown'){if(params.has(key))input.checked=params.get(key)==='1'}else if(params.has(key))input.value=params.get(key)}
  if(['list','map','split'].includes(params.get('view')))mode=params.get('view');
  function updateSaved(){for(const b of document.querySelectorAll('[data-jj-save]')){const on=favorites.includes(b.dataset.jjSave);b.setAttribute('aria-pressed',String(on));b.dataset.saved=String(on)}$('jj-saved-count').textContent=String(favorites.length);savedButton.setAttribute('aria-pressed',String(savedOnly))}
  function setMode(next){mode=next;document.querySelector('.jj-workspace').dataset.jjMode=mode;document.querySelectorAll('[data-jj-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.jjView===mode)));window.dispatchEvent(new Event('joyjoy:map-resize'));saveUrl()}
  function saveUrl(){const u=new URL(location.href);for(const [key,input] of Object.entries(fields)){const value=key==='unknown'?(input.checked?'':'0'):input.value;if(value)u.searchParams.set(key,value);else u.searchParams.delete(key)}if(mode!=='list')u.searchParams.set('view',mode);else u.searchParams.delete('view');history.replaceState({},'',u)}
  function isInBounds(card){if(!mapBounds)return true;const coordinates=window.joyjoyMapCoordinates?.[card.dataset.slug];return coordinates?coordinates.lat>=mapBounds.south&&coordinates.lat<=mapBounds.north&&coordinates.lng>=mapBounds.west&&coordinates.lng<=mapBounds.east:false}
  function update(){const search=fields.q.value.trim().toLocaleLowerCase(),minArea=Number(fields.minArea.value)||0,maxArea=fields.maxArea.value===''?Infinity:Number(fields.maxArea.value),minPrice=Number(fields.minPrice.value)||0,maxPrice=fields.maxPrice.value===''?Infinity:Number(fields.maxPrice.value);
    const visible=cards.filter(card=>{const p=card.dataset.price===''?null:Number(card.dataset.price),area=Number(card.dataset.area);return card.dataset.search.includes(search)&&(!fields.type.value||fields.type.value===card.dataset.type)&&(!fields.status.value||fields.status.value===card.dataset.status)&&area>=minArea&&area<=maxArea&&(p===null?fields.unknown.checked:p>=minPrice&&p<=maxPrice)&&(!savedOnly||favorites.includes(card.dataset.slug))&&isInBounds(card)});
    const priceSort=card=>card.dataset.price===''?null:Number(card.dataset.price);
    visible.sort((a,b)=>{switch(fields.sort.value){case 'priceAsc':return (priceSort(a)??Infinity)-(priceSort(b)??Infinity);case 'priceDesc':return (priceSort(b)??-Infinity)-(priceSort(a)??-Infinity);case 'areaAsc':return Number(a.dataset.area)-Number(b.dataset.area);case 'areaDesc':return Number(b.dataset.area)-Number(a.dataset.area);default:return Number(a.dataset.index)-Number(b.dataset.index)}});
    const visibleSlugs=new Set(visible.map(x=>x.dataset.slug));for(const card of cards)card.hidden=!visibleSlugs.has(card.dataset.slug);visible.forEach(x=>grid.appendChild(x));$('jj-count').textContent=i18n.found+': '+visible.length;$('jj-empty').hidden=visible.length>0;saveUrl();window.dispatchEvent(new CustomEvent('joyjoy:filter-change',{detail:{slugs:[...visibleSlugs]}}));
  }
  form.addEventListener('submit',e=>{e.preventDefault();update();$('catalog').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});Object.values(fields).forEach(el=>el.addEventListener('change',update));fields.q.addEventListener('input',update);
  function clear(){form.reset();fields.sort.value='default';mapBounds=null; savedOnly=false;window.dispatchEvent(new Event('joyjoy:clear-map-bounds'));updateSaved();update()}
  $('jj-reset').addEventListener('click',clear);$('jj-clear-empty').addEventListener('click',clear);savedButton.addEventListener('click',()=>{savedOnly=!savedOnly;updateSaved();update()});
  document.querySelectorAll('[data-jj-save]').forEach(button=>button.addEventListener('click',()=>{const slug=button.dataset.jjSave;if(favorites.includes(slug))favorites=favorites.filter(x=>x!==slug);else favorites.push(slug);try{localStorage.setItem(favoritesKey,JSON.stringify(favorites))}catch{}updateSaved();if(savedOnly)update()}));
  document.querySelectorAll('[data-jj-view]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.jjView)));
  window.addEventListener('joyjoy:apply-map-bounds',e=>{mapBounds=e.detail;update();$('jj-map-reset-area').hidden=false});
  $('jj-map-reset-area').addEventListener('click',()=>{mapBounds=null;$('jj-map-reset-area').hidden=true;window.dispatchEvent(new Event('joyjoy:clear-map-bounds'));update()});
  window.addEventListener('joyjoy:highlight-card',e=>{cards.forEach(c=>c.classList.toggle('is-highlighted',c.dataset.slug===e.detail.slug));const card=cards.find(c=>c.dataset.slug===e.detail.slug);if(card&&!card.hidden&&e.detail.scroll)card.scrollIntoView({behavior:'smooth',block:'nearest'})});
  cards.forEach(c=>{c.addEventListener('mouseenter',()=>window.dispatchEvent(new CustomEvent('joyjoy:highlight-map',{detail:{slug:c.dataset.slug}})));c.addEventListener('mouseleave',()=>window.dispatchEvent(new CustomEvent('joyjoy:highlight-map',{detail:{slug:null}})))});
  window.joyjoyVisibleSlugs=()=>cards.filter(c=>!c.hidden).map(c=>c.dataset.slug);
  updateSaved();setMode(mode);update();
})();
