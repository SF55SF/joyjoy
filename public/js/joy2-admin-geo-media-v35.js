/* JOY2 ADMIN MAP & THREE MEDIA WINDOWS V35 */
(() => {
  const init = () => {
    const root = document.querySelector('[data-joyjoy-admin]');
    const form = root?.querySelector('form[data-property-editor]');
    if (!form || root.dataset.geoMediaV35) return;
    root.dataset.geoMediaV35 = '1';
    const find = n => form.elements.namedItem(n);
    const lineValues = n => String(find(n)?.value || '').split('\n').map(v => v.trim()).filter(Boolean);
    const mediaSection = root.querySelector('.jj-admin-media-tools');
    const imagesField = find('images');
    if (!imagesField) return;
    const localMode = ['localhost','127.0.0.1'].includes(location.hostname) || location.hostname.endsWith('.webcontainer.io') || location.hostname.endsWith('.local-corp.webcontainer.io');
    const title = root.querySelector('[data-editor-title]');
    const safeSrc = s => /^https:\/\//i.test(s) || s.startsWith('/images/') || s.startsWith('blob:');
    const make = (tag,cls,text) => {const n = document.createElement(tag); if(cls)n.className=cls;if(text)n.textContent=text;return n};
    const changed = el => {el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
    const slug = () => find('slug')?.value.trim() || 'new';
    let drafts = {main:[],extra:[],plan:[]};
    // Keep the original fields for older editor scripts and property JSON compatibility.
    for (const key of ['district','lat','lng']) {
      const el=find(key);
      if(el?.closest('label'))el.closest('label').hidden=true;
    }
    const address=find('address');
    const locationBox=make('section','jj-admin-geo-v35 jj-admin-wide');
    const locTitle=make('h3',null,'Расположение объекта');
    const hint=make('p','jj-v35-hint','Удерживайте Ctrl для перемещения карты; Ctrl + колёсико для масштаба. Нажмите на карту, чтобы поставить точку, затем подтвердите её.');
    const map=make('div','jj-v35-map'); map.id='jj-admin-map-v35';
    const locationStatus=make('p','jj-v35-status','Загружаем карту…');
    const bar=make('div','jj-v35-map-bar');
    const confirm=make('button','jj-v35-confirm','Подтвердить точку');confirm.type='button';confirm.disabled=true;
    const cancel=make('button','jj-v35-cancel','Отменить выбор');cancel.type='button';cancel.disabled=true;
    bar.append(confirm,cancel);
    locationBox.append(locTitle,hint,map,bar,locationStatus);
    // Put the actual existing address field after the map to keep admin read/write in one place.
    if(address?.closest('label')) {const wrap=address.closest('label');wrap.classList.add('jj-v35-address');wrap.querySelector('span').textContent='Адрес, определённый по карте (можно уточнить)'; locationBox.append(wrap);}
    const first=form.querySelector('[name="city"]')?.closest('label');
    const objectGrid=first?.parentElement;
    if(objectGrid) objectGrid.insertBefore(locationBox,first.nextSibling); else form.querySelector('fieldset')?.append(locationBox);
    // Leave data inputs hidden but available to validation, translation, and later publication.
    const lat=find('lat'),lng=find('lng');
    let mlmap=null,pending=null,marker=null,currentPoint=null;
    const savedPoint=()=>{const a=Number(lat?.value),b=Number(lng?.value);return Number.isFinite(a)&&Number.isFinite(b)&&lat?.value!==''&&lng?.value!==''&&Math.abs(a)<=90&&Math.abs(b)<=180?[b,a]:null};
    const showPending=point=>{
      pending=point;confirm.disabled=false;cancel.disabled=false;
      locationStatus.textContent='Точка выбрана. Нажмите «Подтвердить точку», чтобы сохранить расположение.';
      if(mlmap&&window.maplibregl){if(marker)marker.remove();marker=new window.maplibregl.Marker({color:'#9FEB00'}).setLngLat(point).addTo(mlmap)}
    };
    function refreshPoint(){currentPoint=savedPoint();if(mlmap&&currentPoint){mlmap.flyTo({center:currentPoint,zoom:15,essential:false}); if(marker)marker.remove();marker=new window.maplibregl.Marker({color:'#111'}).setLngLat(currentPoint).addTo(mlmap)}pending=null;confirm.disabled=true;cancel.disabled=true;locationStatus.textContent=currentPoint?'Точка расположения сохранена. Нажмите на карту для изменения.':'Нажмите на карту и подтвердите расположение объекта.'}
    async function reverse(point){
      try{
        const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),5500);
        const u='https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat='+encodeURIComponent(point[1])+'&lon='+encodeURIComponent(point[0]);
        let res;try{res=await fetch(u,{signal:controller.signal,headers:{Accept:'application/json'}})}finally{clearTimeout(timeout)}
        if(!res.ok)throw Error('Сервис адресов не ответил'); const data=await res.json();
        if(data.display_name&&address){address.value=data.display_name;changed(address);locationStatus.textContent='Точка подтверждена. Адрес определён автоматически — при необходимости уточните его ниже.'}
      }catch{locationStatus.textContent='Точка подтверждена. Адрес не определился автоматически — введите его в поле ниже.'}
    }
    confirm.addEventListener('click',()=>{if(!pending)return;currentPoint=pending;lat.value=String(+pending[1].toFixed(7));lng.value=String(+pending[0].toFixed(7));changed(lat);changed(lng);pending=null;confirm.disabled=true;cancel.disabled=true;locationStatus.textContent='Точка подтверждена. Уточняем адрес…';void reverse(currentPoint)});
    cancel.addEventListener('click',refreshPoint);
    const mapCss=document.createElement('link');mapCss.rel='stylesheet';mapCss.href='https://unpkg.com/maplibre-gl@5.3.0/dist/maplibre-gl.css';document.head.append(mapCss);
    const startMap=()=>{
      try {
        mlmap=new window.maplibregl.Map({container:map,style:'https://tiles.openfreemap.org/styles/positron',center:savedPoint()||[69.2401,41.2995],zoom:savedPoint()?15:11,cooperativeGestures:true,dragRotate:false,pitchWithRotate:false});
        mlmap.addControl(new window.maplibregl.NavigationControl({showCompass:false}),'top-right');
        mlmap.on('click',e=>showPending([e.lngLat.lng,e.lngLat.lat]));
        mlmap.on('load',refreshPoint);mlmap.on('error',()=>{if(!mlmap?.loaded())locationStatus.textContent='Проверьте подключение к картографическому серверу.'});
        mlmap.dragPan.disable();
        const holder=mlmap.getCanvasContainer();let drag=null;
        holder.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||!e.ctrlKey||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};holder.setPointerCapture(e.pointerId);e.stopPropagation()},true);
        holder.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;if(dx||dy){drag.moved=true;mlmap.panBy([-dx,-dy],{duration:0})}e.preventDefault()},true);
        for(const ev of ['pointerup','pointercancel'])holder.addEventListener(ev,()=>{drag=null},true);
        new ResizeObserver(()=>mlmap.resize()).observe(map);
      }catch(e){locationStatus.textContent='Не удалось открыть карту: '+e.message}
    };
    if(window.maplibregl)startMap();else{const scr=document.createElement('script');scr.src='https://unpkg.com/maplibre-gl@5.3.0/dist/maplibre-gl.js';scr.onload=startMap;scr.onerror=()=>locationStatus.textContent='Карта временно недоступна (проверьте интернет).';document.head.append(scr)}

    // Images: keep original low-level upload form hidden for compatibility with old admin code.
    if(mediaSection)mediaSection.classList.add('jj-v35-original-hidden');
    if(imagesField.closest('label'))imagesField.closest('label').hidden=true;
    let plans=find('planImages');
    if(!plans){plans=document.createElement('textarea');plans.name='planImages';plans.hidden=true;form.append(plans)}
    const mediaBox=make('section','jj-admin-v35-media jj-admin-wide');mediaBox.append(make('h3',null,'Изображения объекта'));
    mediaBox.append(make('p','jj-v35-hint','Выберите файлы для каждого окна. Фотографии автоматически кадрируются по центру; планировки вписываются целиком. Все файлы сжимаются в JPEG. Предпросмотр — 20% размера обработанного файла.'));
    const grids=make('div','jj-v35-media-grid');mediaBox.append(grids);
    const categories=[['main','Главное фото','Одно изображение · 1200 × 675'],['extra','Дополнительные фото','Несколько изображений · 1200 × 675'],['plan','Планировка','Без обрезания чертежа · до 1200 × 900']];
    const viewers={};const notices={};
    for(const [kind,name,description] of categories){
      const card=make('div','jj-v35-media-card'); card.append(make('h4',null,name),make('p',null,description));
      const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.multiple=kind!=='main';input.className='jj-v35-file';input.dataset.kind=kind;
      const preview=make('div','jj-v35-preview');viewers[kind]=preview;
      const notice=make('p','jj-v35-notice','');notices[kind]=notice;
      card.append(input,preview,notice);grids.append(card);
      input.addEventListener('change',async()=>{const files=[...input.files];input.value='';if(!files.length)return;notice.textContent='Подготавливаем изображения…';
        try{
          const values=[];
          for(const file of files){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Поддерживаются только JPG, PNG и WebP');
            const processed=await prepare(file,kind);let resultUrl=processed.dataUrl;
            if(!localMode){
              const propertySlug=slug();if(propertySlug==='new')throw Error('Сначала сохраните новый объект');
              const response=await fetch('/api/admin/property-media',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({slug:propertySlug,dataUrl:processed.dataUrl})});
              let data={};try{data=await response.json()}catch{}
              if(!response.ok||!data.path)throw Error(data.error||'Не удалось загрузить изображение'); resultUrl=data.path;
            }
            values.push(resultUrl);drafts[kind].push(processed.dataUrl);
          }
          if(!localMode){
            if(kind==='main'){const all=lineValues('images');imagesField.value=[values[0],...all.filter(v=>v!==values[0])].join('\n');}
            if(kind==='extra'){const all=lineValues('images');imagesField.value=[...all,...values.filter(v=>!all.includes(v))].join('\n');}
            if(kind==='plan'){const all=lineValues('planImages');plans.value=[...all,...values.filter(v=>!all.includes(v))].join('\n');}
            changed(kind==='plan'?plans:imagesField);
          }
          refreshImages();notice.textContent=localMode?'Локальный предпросмотр готов. Облако отключено; файлы не отправлены и не опубликованы.':'Изображения загружены. Сохраните объект для применения изменений.';
        }catch(error){notice.textContent=error.message||'Ошибка обработки изображения'}
      });
    }
    async function prepare(file,kind){
      const bitmap=await createImageBitmap(file);try{
        const w=1200,h=kind==='plan'?900:675;
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
        const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas недоступен');
        ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
        const scale=kind==='plan'?Math.min(w/bitmap.width,h/bitmap.height):Math.max(w/bitmap.width,h/bitmap.height);
        const drawW=bitmap.width*scale,drawH=bitmap.height*scale;
        ctx.drawImage(bitmap,(w-drawW)/2,(h-drawH)/2,drawW,drawH);
        const dataUrl=canvas.toDataURL('image/jpeg',0.78);
        return {dataUrl,w,h};
      }finally{bitmap.close()}
    }
    function previewItem(src,type,index,label){
      if(!safeSrc(src)&&!src.startsWith('data:image/jpeg;base64,'))return;
      const frame=make('figure','jj-v35-media-figure');const img=document.createElement('img');img.src=src;img.alt=label;img.loading='lazy';
      frame.append(img,make('figcaption',null,label));
      if(!src.startsWith('data:')&&!src.startsWith('blob:')){const btn=make('button','jj-v35-remove','Удалить');btn.type='button';btn.onclick=()=>{const source=type==='plan'?plans:imagesField;const all=lineValues(source.name);if(type==='main'){all.splice(0,1)}else if(type==='extra'){all.splice(index+1,1)}else {all.splice(index,1)}source.value=all.join('\n');changed(source);refreshImages()};frame.append(btn)}
      return frame;
    }
    function refreshImages(){
      const images=lineValues('images'),planImgs=lineValues('planImages');
      for(const [kind,viewer] of Object.entries(viewers))viewer.replaceChildren();
      if(images[0]){const f=previewItem(images[0],'main',0,'Главное фото');if(f)viewers.main.append(f)}
      images.slice(1).forEach((v,i)=>{const f=previewItem(v,'extra',i,'Дополнительное '+(i+1));if(f)viewers.extra.append(f)});
      planImgs.forEach((v,i)=>{const f=previewItem(v,'plan',i,'Планировка '+(i+1));if(f)viewers.plan.append(f)});
      for(const kind of ['main','extra','plan'])drafts[kind].forEach((v,i)=>{const f=previewItem(v,kind,i,'Предпросмотр');if(f)viewers[kind].append(f)});
    }
    const section=mediaSection?.closest('fieldset');if(mediaSection?.parentElement) mediaSection.parentElement.insertBefore(mediaBox,mediaSection);
    else section?.append(mediaBox);
    let lastSlug='';const onRecord=()=>{const active=slug();if(active!==lastSlug){lastSlug=active;drafts={main:[],extra:[],plan:[]}}setTimeout(()=>{refreshImages();refreshPoint()},0)};
    new MutationObserver(onRecord).observe(title||form,{subtree:true,childList:true,characterData:true});
    form.addEventListener('input',e=>{if(e.target===imagesField||e.target===plans)refreshImages()});
    setTimeout(onRecord,300);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
