/* JOYJOY_GOOGLE_MAP_V3 — Google Maps only, grayscale, no invented markers */
(() => {
  const el=document.getElementById('jj-google-map');if(!el)return;
  const state=document.getElementById('jj-map-state'), counter=document.getElementById('jj-map-count'), searchArea=document.getElementById('jj-map-search-area');
  const i18nNode=document.getElementById('jj-i18n-data');const language=i18nNode?JSON.parse(i18nNode.textContent):{};
  const dataNode=document.getElementById('jj-map-data');let items=[];try{items=JSON.parse(dataNode?.textContent||'[]')}catch{}
  window.joyjoyMapCoordinates=Object.fromEntries(items.map(x=>[x.slug,{lat:x.lat,lng:x.lng}]));
  const key=el.dataset.googleKey,mapId=el.dataset.googleMapId,allBySlug=new Map(items.map(x=>[x.slug,x]));let map,markers=[],infoWindow,ignoreIdle=false,userMoved=false,appliedBounds=null,highlighted=null;
  const grayscale=[{elementType:'geometry',stylers:[{color:'#ececec'}]},{elementType:'labels.text.fill',stylers:[{color:'#555555'}]},{elementType:'labels.text.stroke',stylers:[{color:'#ffffff'}]},{featureType:'administrative',elementType:'geometry.stroke',stylers:[{color:'#d5d5d5'}]},{featureType:'landscape',elementType:'geometry',stylers:[{color:'#f3f3f3'}]},{featureType:'poi',stylers:[{visibility:'off'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},{featureType:'road',elementType:'geometry.stroke',stylers:[{color:'#dddddd'}]},{featureType:'transit',stylers:[{visibility:'off'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#d0d0d0'}]}];
  function showState(message,keepMap=false){if(state){state.hidden=false;state.classList.toggle('has-map',keepMap);const p=state.querySelector('p');if(p)p.textContent=message}el.style.visibility=keepMap?'visible':'hidden'}
  function hideState(){if(state)state.hidden=true;el.style.visibility='visible'}
  const money=n=>n==null?'●':n>=1000000?'$'+(n/1000000).toFixed(n%1000000===0?0:1)+'M':'$'+Math.round(n/1000)+'K';
  function iconFor(item,selected=false){return {path:google.maps.SymbolPath.CIRCLE,scale:selected?21:18,fillColor:selected?'#d18b2d':'#182a28',fillOpacity:1,strokeColor:'#fff',strokeWeight:2,labelOrigin:new google.maps.Point(0,0)}}
  function boundsOf(arr){const bounds=new google.maps.LatLngBounds();arr.forEach(x=>bounds.extend({lat:x.lat,lng:x.lng}));return bounds}
  function popup(item){const wrap=document.createElement('div');wrap.className='jj-map-popup';if(item.image){const img=document.createElement('img');img.src=item.image;img.alt='';img.loading='lazy';wrap.append(img)}const title=document.createElement('strong');title.textContent=item.title;wrap.append(title);const meta=document.createElement('p');meta.textContent=item.area.toLocaleString('ru-RU')+' м² · '+(item.price===null?language.price:'$'+item.price.toLocaleString('en-US'));wrap.append(meta);const link=document.createElement('a');link.href=item.url;link.textContent=(language.detail||'View property')+' →';wrap.append(link);return wrap}
  function clearMarkers(){markers.forEach(m=>m.setMap(null));markers=[]}
  function render(visible){if(!map)return;clearMarkers();const selected=items.filter(item=>visible.has(item.slug));if(counter)counter.textContent=selected.length+' / '+items.length;
    // Grid-based aggregation for visual clarity at low zoom, without third-party dependencies.
    const zoom=map.getZoom()||11;const step=zoom<=9?.035:zoom<=11?.018:zoom<=13?.007:zoom<=15?.0025:.00005;const buckets=new Map();
    for(const item of selected){const k=Math.round(item.lat/step)+':'+Math.round(item.lng/step);if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(item)}
    for(const bucket of buckets.values()){const lat=bucket.reduce((s,x)=>s+x.lat,0)/bucket.length,lng=bucket.reduce((s,x)=>s+x.lng,0)/bucket.length;const item=bucket[0];const marker=new google.maps.Marker({map,position:{lat,lng},title:bucket.length===1?item.title:bucket.length+' properties',label:{text:bucket.length>1?String(bucket.length):money(item.price),color:'#ffffff',fontSize:'11px',fontWeight:'700'},icon:iconFor(item,highlighted===item.slug)});marker.__slug=item.slug;marker.addListener('click',()=>{if(bucket.length>1){map.setCenter({lat,lng});map.setZoom(Math.min((map.getZoom()||11)+2,18));return}infoWindow.setContent(popup(item));infoWindow.open({anchor:marker,map});window.dispatchEvent(new CustomEvent('joyjoy:highlight-card',{detail:{slug:item.slug,scroll:true}}))});markers.push(marker)}
    if(!selected.length&&items.length)showState(language.noCoords||'No mapped properties',true);else hideState();
  }
  function visibleSlugs(){return new Set(window.joyjoyVisibleSlugs?.()||items.map(x=>x.slug))}
  function refresh({fit=false}={}){if(!map)return;const selected=items.filter(item=>visibleSlugs().has(item.slug));if(fit&&selected.length){ignoreIdle=true;map.fitBounds(boundsOf(selected),65);google.maps.event.addListenerOnce(map,'idle',()=>{ignoreIdle=false})}render(visibleSlugs())}
  window.addEventListener('joyjoy:filter-change',()=>refresh({fit:!appliedBounds}));
  window.addEventListener('joyjoy:highlight-map',event=>{highlighted=event.detail.slug;markers.forEach(m=>m.setIcon(iconFor({},m.__slug===highlighted)))});
  window.addEventListener('joyjoy:map-resize',()=>{if(!map)return;setTimeout(()=>{google.maps.event.trigger(map,'resize');refresh()},130)});
  window.addEventListener('joyjoy:clear-map-bounds',()=>{appliedBounds=null;searchArea.hidden=true;userMoved=false;refresh({fit:true})});
  if(!key){showState(language.mapMissing||'Configure Google Maps API key');if(counter)counter.textContent='0 / '+items.length;return}
  function initialize(){if(!window.google?.maps){showState(language.mapFailed||'Map failed');return}map=new google.maps.Map(el,{center:{lat:41.2995,lng:69.2401},zoom:11,gestureHandling:'cooperative',mapTypeControl:false,streetViewControl:false,fullscreenControl:true, ...(mapId?{mapId}:{styles:grayscale})});infoWindow=new google.maps.InfoWindow();hideState();map.addListener('dragend',()=>{userMoved=true;searchArea.hidden=false});map.addListener('zoom_changed',()=>{userMoved=true;searchArea.hidden=false;render(visibleSlugs())});map.addListener('idle',()=>{if(ignoreIdle)return;if(userMoved)searchArea.hidden=false});
    searchArea?.addEventListener('click',()=>{const b=map.getBounds();if(!b)return;const ne=b.getNorthEast(),sw=b.getSouthWest();appliedBounds={north:ne.lat(),east:ne.lng(),south:sw.lat(),west:sw.lng()};searchArea.hidden=true;userMoved=false;window.dispatchEvent(new CustomEvent('joyjoy:apply-map-bounds',{detail:appliedBounds}))});
    refresh({fit:true});if(!items.length)showState(language.noCoords||'No mapped listings',true)}
  const script=document.createElement('script');script.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(key)+'&v=weekly&loading=async&callback=joyjoyGoogleMapReady';script.async=true;script.onerror=()=>showState(language.mapFailed||'Google Maps failed');window.joyjoyGoogleMapReady=initialize;document.head.append(script);
})();
