/* JOYJOY_YANDEX_MAP_V4 — Yandex JS API 3, monochrome, verified coordinates only */
(() => {
  const el = document.getElementById('jj-yandex-map');
  if (!el) return;
  const state = document.getElementById('jj-map-state');
  const counter = document.getElementById('jj-map-count');
  const searchArea = document.getElementById('jj-map-search-area');
  const i18nNode = document.getElementById('jj-i18n-data');
  const language = i18nNode ? JSON.parse(i18nNode.textContent || '{}') : {};
  let items = [];
  try { items = JSON.parse(document.getElementById('jj-map-data')?.textContent || '[]'); } catch {}
  items = items.filter(x => Number.isFinite(x.lat) && Number.isFinite(x.lng) && x.lat>=-90 && x.lat<=90 && x.lng>=-180 && x.lng<=180);
  window.joyjoyMapCoordinates = Object.fromEntries(items.map(x => [x.slug, {lat:x.lat,lng:x.lng}]));
  const key = (el.dataset.yandexKey || '').trim();
  const allBySlug = new Map(items.map(x => [x.slug,x]));
  let map = null, collection = null, markers = [], highlighted = '', appliedBounds = null, currentBounds = null, mapZoom = 11, ignoreMove = false;
  const money = n => n == null ? '●' : n >= 1000000 ? '$'+(n/1000000).toFixed(n%1000000===0?0:1)+'M' : '$'+Math.round(n/1000)+'K';
  function showState(message, keepMap=false) {
    if (state) { state.hidden=false; state.classList.toggle('has-map',keepMap); const p=state.querySelector('p'); if(p) p.textContent=message; }
    el.style.visibility=keepMap?'visible':'hidden';
  }
  function hideState() { if(state)state.hidden=true;el.style.visibility='visible'; }
  function visibleSlugs(){return new Set(window.joyjoyVisibleSlugs?.() || items.map(x=>x.slug));}
  function popup(item){
    const box=document.createElement('div');box.className='jj-map-popup jj-yandex-popup';
    if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';img.loading='lazy';box.append(img);}
    const title=document.createElement('strong');title.textContent=item.title;box.append(title);
    const p=document.createElement('p');p.textContent=Number(item.area).toLocaleString('ru-RU')+' м² · '+(item.price==null?(language.price||'По запросу'):'$'+Number(item.price).toLocaleString('en-US'));box.append(p);
    const link=document.createElement('a');link.href=item.url;link.textContent=(language.detail||'Подробнее')+' →';box.append(link);return box;
  }
  function dropMarkers(){for(const marker of markers)collection.removeChild(marker);markers=[];}
  function render(){
    if(!map)return;
    dropMarkers();const selected=items.filter(x=>visibleSlugs().has(x.slug));
    if(counter)counter.textContent=selected.length+' / '+items.length;
    // Compact grid clustering, recalculated at the current zoom.
    const step=mapZoom<=9?.035:mapZoom<=11?.018:mapZoom<=13?.007:mapZoom<=15?.0025:.00005;
    const groups=new Map();
    for(const item of selected){const k=Math.round(item.lat/step)+':'+Math.round(item.lng/step);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(item);}
    for(const group of groups.values()){
      const item=group[0], lng=group.reduce((a,x)=>a+x.lng,0)/group.length, lat=group.reduce((a,x)=>a+x.lat,0)/group.length;
      const button=document.createElement('button');button.type='button';button.className='jj-yandex-pin';button.textContent=group.length>1?String(group.length):money(item.price);button.title=group.length>1?group.length+' objects':item.title;
      if(item.slug===highlighted)button.classList.add('is-active');
      const marker=new window.ymaps3.YMapMarker({coordinates:[lng,lat]},button);
      button.addEventListener('click',e=>{e.stopPropagation();if(group.length>1){ignoreMove=true;map.setLocation({center:[lng,lat],zoom:Math.min(mapZoom+2,18),duration:200});setTimeout(()=>ignoreMove=false,500);return;}
        const old=el.querySelector('.jj-yandex-popup-open');if(old)old.remove();const content=popup(item);content.classList.add('jj-yandex-popup-open');button.append(content);
        window.dispatchEvent(new CustomEvent('joyjoy:highlight-card',{detail:{slug:item.slug,scroll:true}}));
      });collection.addChild(marker);markers.push(marker);
    }
    if(!selected.length&&items.length)showState(language.noCoords||'Нет объектов на карте',true);else hideState();
  }
  function fitVisible(){
    if(!map)return;const selected=items.filter(x=>visibleSlugs().has(x.slug));
    if(selected.length){const longs=selected.map(x=>x.lng),lats=selected.map(x=>x.lat);const minLng=Math.min(...longs),maxLng=Math.max(...longs),minLat=Math.min(...lats),maxLat=Math.max(...lats);ignoreMove=true;
      if(selected.length===1)map.setLocation({center:[minLng,minLat],zoom:14});else map.setLocation({bounds:[[minLng-.008,minLat-.008],[maxLng+.008,maxLat+.008]]});setTimeout(()=>ignoreMove=false,500);
    }else if(!appliedBounds){ignoreMove=true;map.setLocation({center:[69.2401,41.2995],zoom:11});setTimeout(()=>ignoreMove=false,500);}
  }
  function refresh(fit){if(!map)return;render();if(fit)fitVisible();}
  window.addEventListener('joyjoy:filter-change',()=>refresh(!appliedBounds));
  window.addEventListener('joyjoy:highlight-map',event=>{highlighted=event.detail.slug;el.querySelectorAll('.jj-yandex-pin').forEach(n=>n.classList.remove('is-active'));const target=items.find(x=>x.slug===highlighted);if(target){for(const m of markers){if(Math.abs(m.coordinates[0]-target.lng)<.002&&Math.abs(m.coordinates[1]-target.lat)<.002)m.element?.classList.add('is-active');}}});
  window.addEventListener('joyjoy:map-resize',()=>{if(map)refresh(false);});
  window.addEventListener('joyjoy:clear-map-bounds',()=>{appliedBounds=null;if(searchArea)searchArea.hidden=true;refresh(true);});
  if(!key){showState(language.mapMissing||'Добавьте ключ Yandex Maps API');if(counter)counter.textContent='0 / '+items.length;return;}
  async function init(){
    try{
      if(!window.ymaps3)throw Error('Yandex Maps SDK unavailable');await ymaps3.ready;
      const {YMap,YMapDefaultSchemeLayer,YMapDefaultFeaturesLayer,YMapMarker,YMapCollection,YMapListener}=ymaps3;
      const customization=[{elements:'geometry',stylers:[{saturation:-1}]},{elements:'label.icon',stylers:[{saturation:-1}]},{tags:{any:['water']},elements:'geometry',stylers:[{color:'#d2d7d8'}]},{tags:{any:['road']},elements:'geometry',stylers:[{color:'#ffffff'}]},{tags:{any:['building']},elements:'geometry',stylers:[{color:'#e3e3e3'}]},{elements:'label.text.fill',stylers:[{color:'#585858'}]}];
      // Yandex Maps v3 coordinates are [longitude, latitude].
      map=new YMap(el,{location:{center:[69.2401,41.2995],zoom:11},mode:'vector',theme:'light'});
      map.addChild(new YMapDefaultSchemeLayer({customization}));map.addChild(new YMapDefaultFeaturesLayer());collection=new YMapCollection({});map.addChild(collection);
      map.addChild(new YMapListener({onUpdate:({location})=>{if(location?.zoom)mapZoom=location.zoom;if(location?.bounds)currentBounds=location.bounds;if(!ignoreMove&&searchArea)searchArea.hidden=false;},onActionEnd:()=>{if(!ignoreMove&&searchArea)searchArea.hidden=false;}}));
      hideState();refresh(true);if(items.length===0)showState(language.noCoords||'Пока нет объектов с координатами',true);
      searchArea?.addEventListener('click',()=>{if(!currentBounds)return;const [a,b]=currentBounds;appliedBounds={west:Math.min(a[0],b[0]),east:Math.max(a[0],b[0]),south:Math.min(a[1],b[1]),north:Math.max(a[1],b[1])};searchArea.hidden=true;window.dispatchEvent(new CustomEvent('joyjoy:apply-map-bounds',{detail:appliedBounds}));});
    }catch(e){console.error('JoyJoy Yandex Maps:',e);showState(language.mapFailed||'Не удалось загрузить Яндекс Карты');}
  }
  const script=document.createElement('script');script.async=true;script.src='https://api-maps.yandex.ru/v3/?apikey='+encodeURIComponent(key)+'&lang='+(location.pathname.startsWith('/en/')?'en_US':location.pathname.startsWith('/uz/')?'ru_RU':'ru_RU');
  script.onload=init;script.onerror=()=>showState(language.mapFailed||'Не удалось загрузить Яндекс Карты');document.head.append(script);
})();
