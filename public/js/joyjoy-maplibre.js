/* JOYJOY_MAPLIBRE_V5 — free OpenFreeMap Positron, no API key, only verified coordinates */
(() => {
  const container=document.getElementById('jj-map');
  if(!container)return;
  const node=id=>document.getElementById(id);
  const panel=node('jj-map-state'), count=node('jj-map-count'), search=node('jj-map-search-area');
  const reset=node('jj-map-reset-area'), dataNode=node('jj-map-data'), tNode=node('jj-i18n-data');
  const t=tNode?JSON.parse(tNode.textContent||'{}'):{};
  let items=[];
  try{items=JSON.parse(dataNode?.textContent||'[]')}catch(error){console.warn('JoyJoy map data unavailable',error)}
  items=items.filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&Math.abs(x.lat)<=90&&Math.abs(x.lng)<=180);
  window.joyjoyMapCoordinates=Object.fromEntries(items.map(x=>[x.slug,{lat:x.lat,lng:x.lng}]));
  const mapLabel=t.noCoords||'Нет объектов с подтверждёнными координатами';
  const allBySlug=new Map(items.map(x=>[x.slug,x]));
  const priceLabel=n=>n==null?'⌖':n>=1000000?'$'+Number((n/1000000).toFixed(1))+'M':'$'+Math.round(n/1000)+'K';
  let map,markers=[],selectedSlug=null,syncingView=false,regionApplied=false,interactiveReady=false;
  const locale=location.pathname.startsWith('/en/')?'en':location.pathname.startsWith('/uz/')?'uz':'ru';
  const tell=(message,small=false)=>{if(!panel)return;panel.hidden=false;panel.classList.toggle('has-map',small);const text=panel.querySelector('p');if(text)text.textContent=message};
  const hide=()=>{if(panel)panel.hidden=true};
  const visible=()=>new Set(window.joyjoyVisibleSlugs?.()||items.map(x=>x.slug));
  function showCount(n){if(count){const all=document.querySelectorAll('.jj-property-card').length;count.textContent=n+' / '+(t.total??(all||items.length))}}
  function cleanup(){markers.forEach(m=>m.remove());markers=[]}
  function popup(item){const wrap=document.createElement('div');wrap.className='jj-map-popup';if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';img.loading='lazy';wrap.append(img)}
    const title=document.createElement('strong');title.textContent=item.title;wrap.append(title);
    const meta=document.createElement('p');meta.textContent=Number(item.area).toLocaleString(locale==='en'?'en-US':locale==='uz'?'uz-UZ':'ru-RU')+' m² · '+(item.price==null?t.price:'$'+Number(item.price).toLocaleString('en-US'));wrap.append(meta);
    const link=document.createElement('a');link.href=item.url;link.textContent=(t.detail||'Подробнее')+' →';wrap.append(link);return wrap;
  }
  function markerElement(text,cluster=false){const el=document.createElement('button');el.type='button';el.className='jj-geo-pin'+(cluster?' is-cluster':'');el.textContent=text;el.setAttribute('aria-label',cluster?(locale==='en'?'Group of '+text+' properties':locale==='uz'?text+' ta obyekt guruhi':'Группа из '+text+' объектов'):text);return el}
  function render(){if(!map)return;cleanup();const slugs=visible();const selected=items.filter(x=>slugs.has(x.slug));showCount(selected.length);
    // Group nearby listings visually; separate them automatically when zooming in.
    const zoom=map.getZoom();const cell=zoom<9?.065:zoom<11?.025:zoom<13?.009:zoom<15?.003:.0001;
    const buckets=new Map();for(const item of selected){const key=Math.round(item.lat/cell)+':'+Math.round(item.lng/cell);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(item)}
    for(const group of buckets.values()){
      const lat=group.reduce((v,i)=>v+i.lat,0)/group.length,lng=group.reduce((v,i)=>v+i.lng,0)/group.length;
      const item=group[0];const cluster=group.length>1;
      const el=markerElement(cluster?String(group.length):priceLabel(item.price),cluster);
      if(!cluster){el.dataset.slug=item.slug;el.classList.toggle('is-selected',selectedSlug===item.slug);
        el.addEventListener('mouseenter',()=>window.dispatchEvent(new CustomEvent('joyjoy:highlight-card',{detail:{slug:item.slug,scroll:false}})));
        el.addEventListener('mouseleave',()=>window.dispatchEvent(new CustomEvent('joyjoy:highlight-card',{detail:{slug:null,scroll:false}})));
      }
      const marker=new window.maplibregl.Marker({element:el,anchor:'center'}).setLngLat([lng,lat]).addTo(map);
      if(cluster){el.addEventListener('click',()=>map.easeTo({center:[lng,lat],zoom:Math.min(18,map.getZoom()+2)}))}
      else {el.addEventListener('click',()=>{new window.maplibregl.Popup({offset:18,maxWidth:'235px'}).setLngLat([lng,lat]).setDOMContent(popup(item)).addTo(map);window.dispatchEvent(new CustomEvent('joyjoy:highlight-card',{detail:{slug:item.slug,scroll:true}}))})}
      markers.push(marker);
    }
    if(!items.length)tell(mapLabel,true);else if(!selected.length)tell(t.noCoords||'Нет объектов на карте',true);else hide();
  }
  function fitVisible(){if(!map||regionApplied)return;const selected=items.filter(i=>visible().has(i.slug));if(!selected.length)return;syncingView=true;const bounds=new window.maplibregl.LngLatBounds();selected.forEach(x=>bounds.extend([x.lng,x.lat]));map.fitBounds(bounds,{padding:65,maxZoom:15,duration:350});setTimeout(()=>{syncingView=false},450)}
  function clearRegion(){regionApplied=false;if(search)search.hidden=true;if(reset)reset.hidden=true;fitVisible()}
  window.addEventListener('joyjoy:filter-change',()=>{render();if(!regionApplied)fitVisible()});
  window.addEventListener('joyjoy:highlight-map',e=>{selectedSlug=e.detail.slug;for(const marker of markers){const el=marker.getElement();el.classList.toggle('is-selected',el.dataset.slug===selectedSlug)}});
  window.addEventListener('joyjoy:map-resize',()=>{if(map)setTimeout(()=>{map.resize();render()},150)});
  window.addEventListener('joyjoy:clear-map-bounds',clearRegion);
  if(search)search.addEventListener('click',()=>{if(!map||!items.length)return;const b=map.getBounds();regionApplied=true;search.hidden=true;window.dispatchEvent(new CustomEvent('joyjoy:apply-map-bounds',{detail:{north:b.getNorth(),south:b.getSouth(),east:b.getEast(),west:b.getWest()}}))});
  const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/maplibre-gl@5.3.0/dist/maplibre-gl.css';document.head.append(css);
  const script=document.createElement('script');script.src='https://unpkg.com/maplibre-gl@5.3.0/dist/maplibre-gl.js';script.async=true;
  script.onerror=()=>tell(t.mapFailed||'Не удалось загрузить карту');
  script.onload=()=>{if(!window.maplibregl){tell(t.mapFailed||'Библиотека карты недоступна');return}
    try{
      map=new window.maplibregl.Map({container,style:'https://tiles.openfreemap.org/styles/positron',center:[69.2401,41.2995],zoom:11,attributionControl:true,dragRotate:false,pitchWithRotate:false});
      map.addControl(new window.maplibregl.NavigationControl({showCompass:false}),'top-right');
      map.on('load',()=>{interactiveReady=true;render();fitVisible();});
      map.on('error',e=>{console.warn('OpenFreeMap',e.error);if(!interactiveReady)tell(t.mapFailed||'Не удалось загрузить картографические данные')});
      map.on('zoomend',()=>render());
      map.on('dragend',()=>{if(!syncingView&&search&&items.length)search.hidden=false});
      map.on('moveend',()=>{if(!syncingView&&search&&items.length&&regionApplied)search.hidden=false});
      setTimeout(()=>{map.resize()},250);
    }catch(error){console.warn('JoyJoy map initialization error',error);tell(t.mapFailed||'Не удалось открыть карту')}
  };
  document.head.append(script);
})();
