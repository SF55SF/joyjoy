import {calculateInvestment,investmentFields,validateProperty,propertyErrorMessage} from './joyjoy-investment-model.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
const root=document.querySelector('[data-joyjoy-admin]');
if(root){
 const form=root.querySelector('form'),status=root.querySelector('[data-save-status]'),list=root.querySelector('[data-property-list]'),listStatus=root.querySelector('[data-list-status]'),save=form.querySelector('[data-save-property]');
 let current=null,sha=null,isNew=false,dirty=false,busy=false,loadId=0;
 const field=k=>form.elements.namedItem(k);
 // JOY2_ADMIN_TENANCY_V13: UI fields are created once in the actual live admin form.
 const tenantSelectOptions=[['','Без статуса'],['leased','С арендаторами'],['preliminary','Предварительные условия аренды']];
 function ensureTenancyUI(){
  if(!form)return;
  if(!form.querySelector('[name="tenancyStatus"]')){
   const fs=document.createElement('fieldset');fs.dataset.joy2PropertyTenancy='';
   const legend=document.createElement('legend');legend.textContent='Арендный статус объекта';fs.append(legend);
   const label=document.createElement('label');label.className='jj-admin-wide';
   const title=document.createElement('span');title.textContent='Дополнительный флаг на карточке';
   const select=document.createElement('select');select.name='tenancyStatus';
   for(const [value,name] of tenantSelectOptions){const opt=document.createElement('option');opt.value=value;opt.textContent=name;select.append(opt);}
   label.append(title,select);fs.append(label);
   const target=form.querySelector('[data-investment-editor]')||form.querySelector('.jj-admin-model-preview');
   if(target)target.before(fs);else form.append(fs);
  }
  if(!form.querySelector('[data-joy2-investment-unit-tenancies]')){
   const fs=document.createElement('fieldset');fs.dataset.joy2InvestmentUnitTenancies='';fs.hidden=true;
   const legend=document.createElement('legend');legend.textContent='Арендный статус инвестиционных помещений';fs.append(legend);
   const content=document.createElement('div');content.dataset.joy2InvestmentUnitFields='';content.className='jj-admin-fields';fs.append(content);
   const target=form.querySelector('[data-investment-editor]')||form.querySelector('.jj-admin-model-preview');
   if(target)target.after(fs);else form.append(fs);
  }
 }
 ensureTenancyUI();
 function renderUnitTenancies(p){
  ensureTenancyUI();
  const section=form.querySelector('[data-joy2-investment-unit-tenancies]');
  const holder=form.querySelector('[data-joy2-investment-unit-fields]');
  if(!section||!holder)return;
  holder.replaceChildren();
  const rows=(Array.isArray(p.units)?p.units:[]).map((u,i)=>({u,i})).filter(({u})=>u.investment&&u.investment.published===true);
  section.hidden=rows.length===0;
  for(const {u,i} of rows){
   const label=document.createElement('label');const title=document.createElement('span');
   title.textContent=[u.block,u.number].filter(Boolean).join(' · ')||('Помещение '+(i+1));
   const select=document.createElement('select');select.dataset.unitTenancy=String(i);
   for(const [value,name] of tenantSelectOptions){const opt=document.createElement('option');opt.value=value;opt.textContent=name;select.append(opt);}
   select.value=u.tenancyStatus||'';label.append(title,select);holder.append(label);
  }
 }

 const nullable=k=>field(k).value.trim()===''?null:field(k).valueAsNumber;
 const lines=k=>field(k).value.split('\n').map(x=>x.trim()).filter(Boolean);
 const showInvestment=()=>{let group=false;try{group=JSON.parse(field('unitsJson')?.value||'[]').length>0;}catch{}const v=field('insestproject').checked&&!group;root.querySelector('[data-investment-editor]').hidden=!v;};
 function setStatus(text,error=false){status.textContent=text;status.dataset.error=String(error);}
 async function api(url,options){const res=await fetch(url,{credentials:'same-origin',...options});let body;try{body=await res.json();}catch{throw Error('API недоступен. В StackBlitz preview доступны страницы, но сохранение работает на Cloudflare Pages.');}if(!res.ok)throw Error(res.status===401?'Сессия истекла. Откройте /admin-login/ и войдите снова.':body.error||'Ошибка API');return body;}
 function read(){
  const p={...current,slug:field('slug').value.trim(),published:field('published').checked,showCatalog:true,insestproject:field('insestproject').checked};
  // JOY2_CONTACTS_TELEGRAM_V2: saved in the same property JSON.
  p.contacts={...(current?.contacts||{}),name:field('contactName').value.trim(),phone:field('contactPhone').value.trim(),telegram:field('contactTelegram').value.trim()};
  for(const key of ['title','city','district','address','description','type','status','sourceUrl'])p[key]=field(key).value.trim();
  for(const key of ['area','priceUsd'])p[key]=nullable(key);
  for(const key of ['lat','lng'])p[key]=nullable(key);
  p.images=lines('images');p.planImages=lines('planImages');p.features=lines('features');
  p.translations={};for(const lang of ['uz','en']){const row={};for(const key of ['title','city','district','address','description','features']){const value=field(lang+'_'+key).value.trim();if(value)row[key]=key==='features'?lines(lang+'_'+key):value;}if(Object.keys(row).length)p.translations[lang]=row;}
  p.investment={...(current.investment||{}),currency:'USD',published:field('modelPublished').checked};
  for(const key of investmentFields)p.investment[key]=nullable(key);
  for(const key of ['rentBasis','asOf','sourceNote','rentCurrency'])p.investment[key]=field(key).value.trim();
  for(const key of ['usdUzs','uzsDevaluation'])p.investment[key]=nullable(key);
  if(field('unitsJson'))p.units=JSON.parse(field('unitsJson').value||'[]');
  p.tenancyStatus=field('tenancyStatus')?.value||null;
  if(Array.isArray(p.units)){for(const selector of form.querySelectorAll('[data-unit-tenancy]')){const index=Number(selector.dataset.unitTenancy);if(p.units[index]){if(selector.value)p.units[index].tenancyStatus=selector.value;else delete p.units[index].tenancyStatus;}}}
  return p;
 }
 function preview(){const r=calculateInvestment(read().investment);root.querySelector('[data-admin-model-status]').textContent=r.ok?'Предпросмотр по введённым параметрам':'Для расчёта заполните все числовые параметры. Цена и площадь — больше нуля; заполняемость 0–100%.';for(const el of root.querySelectorAll('[data-admin-result]')){const k=el.dataset.adminResult;el.textContent=!r.ok?'—':k==='paybackYears'?(r[k]===null?'Не окупается':r[k].toLocaleString('ru-RU',{maximumFractionDigits:1})+' лет'):['yieldPercent','irrPercent'].includes(k)?(r[k]===null?'—':r[k].toLocaleString('ru-RU',{maximumFractionDigits:2})+'%'):r[k].toLocaleString('ru-RU',{style:'currency',currency:'USD',maximumFractionDigits:0});}}
 function render(p,version,creating=false){
  queueMicrotask(()=>{ensureTenancyUI();const selected=field('tenancyStatus');if(selected)selected.value=p.tenancyStatus||'';renderUnitTenancies(p);});
  form.reset();field('slug').dataset.manuallyEdited='false';current=p;sha=version;isNew=creating;
  // JOY2_CONTACTS_TELEGRAM_V2: legacy contact keys remain readable.
  field('contactName').value=p.contacts?.name||p.contactName||'';
  field('contactPhone').value=p.contacts?.phone||p.contactPhone||p.phone||'';
  field('contactTelegram').value=p.contacts?.telegram||p.telegramUrl||p.telegram||'';
  for(const key of ['slug','title','city','district','address','description','type','status','sourceUrl','area','priceUsd','lat','lng'])field(key).value=p[key]??'';
  field('slug').readOnly=!creating;field('published').checked=p.published!==false;field('insestproject').checked=p.insestproject===true;
  for(const k of ['images','features','planImages'])field(k).value=(p[k]||[]).join('\n');
  for(const lang of ['uz','en'])for(const k of ['title','city','district','address','description','features']){const value=p.translations?.[lang]?.[k];field(lang+'_'+k).value=Array.isArray(value)?value.join('\n'):value??'';}
  if(field('unitsJson')){field('unitsJson').value=JSON.stringify(p.units||[]);window.dispatchEvent(new CustomEvent('joyjoy:units-loaded',{detail:{units:p.units||[]}}));}
  const m=p.investment||{};for(const k of investmentFields)field(k).value=m[k]??'';
  for(const k of ['rentBasis','asOf','sourceNote','rentCurrency'])field(k).value=m[k]??(k==='rentCurrency'?'USD':'');
  for(const k of ['usdUzs','uzsDevaluation'])field(k).value=m[k]??'';field('modelPublished').checked=m.published===true;showInvestment();const fx=lastFx();if(fx){field('usdUzs').value=fx.usdUzs;field('uzsDevaluation').value=fx.annualDevaluation;}
  root.querySelector('[data-editor-title]').textContent=p.title||'Новый объект';form.hidden=false;dirty=false;preview();refreshMedia();refreshPlanMedia();refreshPreview();
 }
 function discard(){return !dirty||window.confirm('Есть несохранённые правки. Перейти без сохранения?');}
 async function load(slug){if(busy||!discard())return;const id=++loadId;setStatus('Загружаем актуальную версию…');try{const data=await api('/api/admin/properties?slug='+encodeURIComponent(slug));if(id!==loadId)return;render(data.property,data.sha);setStatus('Загружено из GitHub. Изменения пока не сохранены.');list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.slug===slug?'true':'false'));}catch(e){setStatus(e.message,true);}}
 async function loadList(){try{const data=await api('/api/admin/properties');list.replaceChildren();for(const item of data.items){const b=document.createElement('button');b.type='button';b.textContent=item.title||item.slug;b.dataset.slug=item.slug;b.addEventListener('click',()=>load(item.slug));list.append(b);}listStatus.textContent=data.items.length+' объектов';return data.items.map(item=>item.slug);}catch(e){listStatus.textContent=e.message;return [];}}
 form.addEventListener('input',()=>{dirty=true;preview();});form.addEventListener('change',e=>{if(e.target===field('insestproject'))showInvestment();dirty=true;preview();});
 form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const p=read(),errors=validateProperty(p);if(errors.length){setStatus(propertyErrorMessage(errors),true);return;}busy=true;save.disabled=true;form.querySelectorAll('input,textarea,select').forEach(el=>el.disabled=true);setStatus('Сохраняем в GitHub…');try{const data=await api('/api/admin/properties',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slug:p.slug,sha,create:isNew,property:p})});current=p;sha=data.sha;isNew=false;dirty=false;field('slug').readOnly=true;setStatus(data.unchanged?'Изменений нет.':('Сохранено в GitHub · '+data.commit.slice(0,7)+'. На сайте изменения появятся после успешной сборки и публикации Cloudflare Pages.'));await loadList();}catch(e){setStatus(e.message,true);}finally{busy=false;save.disabled=false;form.querySelectorAll('input,textarea,select').forEach(el=>el.disabled=false);}});
 root.querySelector('[data-new-property]').addEventListener('click',()=>{if(busy||!discard())return;++loadId;render({slug:'',title:'',city:'',district:'',address:'',description:'',area:null,priceUsd:null,type:'office',status:'existing',images:[],features:[],published:false,showCatalog:true,insestproject:false,order:Date.now()},null,true);setStatus('Новый объект. Заполните данные и переводы. Публикация по умолчанию отключена.');dirty=true;field('slug').focus();});
 root.querySelector('[data-admin-logout]').addEventListener('click',async()=>{if(busy||!discard())return;try{await api('/api/admin/logout',{method:'POST'});dirty=false;location.assign('/admin-login/');}catch(e){setStatus(e.message,true);}});
 window.addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
 const applyFx=d=>{if(!d)return;for(const key of ['usdUzs','uzsDevaluation'])field(key).value=d[key];root.querySelector('[data-fx-status]').textContent='ЦБ Узбекистана: 1 USD = '+d.usdUzs.toLocaleString('ru-RU',{maximumFractionDigits:2})+' UZS · девальвация '+d.annualDevaluation.toFixed(2)+'% в год · '+(d.stale?'последние сохранённые данные':'актуальные данные')+' · '+(d.rateDate||'');preview();};
 const saved=lastFx();
 const initialFx=saved?{...saved,uzsDevaluation:saved.annualDevaluation}:null;

 // JOY2_SINGLE_ADMIN_V1: safe media, translation and preview tools.
 function refreshPreview(){
  const slug=field('slug').value.trim();const safe=/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  const paths={ru:'/listing/'+encodeURIComponent(slug)+'/',uz:'/uz/listing/'+encodeURIComponent(slug)+'/',en:'/en/listing/'+encodeURIComponent(slug)+'/'};
  for(const language of ['ru','uz','en']){const a=root.querySelector('[data-joy-preview-'+language+']');a.href=safe?paths[language]:'/';a.setAttribute('aria-disabled',String(!safe));}
  const frame=root.querySelector('[data-joy-preview-frame]');if(safe&&!isNew)frame.src=paths.ru;else frame.removeAttribute('src');
 }
 function refreshMedia(){
  const gallery=root.querySelector('[data-joy-gallery]');gallery.replaceChildren();
  const urls=lines('images');for(const [idx,url] of urls.entries()){
   const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),remove=document.createElement('button');
   img.src=url;img.alt='Фото '+(idx+1);img.loading='lazy';caption.textContent=idx===0?'Главное фото':'Фото '+(idx+1);
   remove.type='button';remove.textContent='Убрать из карточки';remove.addEventListener('click',()=>{const arr=lines('images');arr.splice(idx,1);field('images').value=arr.join('\n');dirty=true;refreshMedia();});
   figure.append(img,caption,remove);gallery.append(figure);
  }
 }
 field('images').addEventListener('input',refreshMedia);
 function refreshPlanMedia(){
  const target=root.querySelector('[data-joy-plan-gallery]');if(!target)return;target.replaceChildren();
  for(const [idx,url] of lines('planImages').entries()){
   const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),button=document.createElement('button');
   img.src=url;img.alt='Планировка '+(idx+1);img.loading='lazy';caption.textContent='Планировка '+(idx+1);
   button.type='button';button.textContent='Убрать планировку';button.addEventListener('click',()=>{const arr=lines('planImages');arr.splice(idx,1);field('planImages').value=arr.join('\n');dirty=true;refreshPlanMedia()});
   figure.append(img,caption,button);target.append(figure);
  }
 }
 field('planImages').addEventListener('input',refreshPlanMedia);

 const mediaInput=root.querySelector('[data-joy-images]');
 mediaInput.addEventListener('change',async()=>{
  const files=[...mediaInput.files];mediaInput.value='';if(!files.length)return;
  if(isNew||!current?.slug){setStatus('Сначала сохраните новый объект, затем загрузите фотографии.',true);return;}
  if(dirty){setStatus('Сначала сохраните изменения в объекте, затем загружайте изображения.',true);return;}
  const state=root.querySelector('[data-media-status]');mediaInput.disabled=true;
  try{for(const file of files){
   if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Поддерживаются JPG, PNG и WebP.');
   const bitmap=await createImageBitmap(file),canvas=document.createElement('canvas');canvas.width=1200;canvas.height=675;
   const ctx=canvas.getContext('2d');if(!ctx){bitmap.close();throw Error('Canvas недоступен');}
   ctx.fillStyle='#fff';ctx.fillRect(0,0,1200,675);
   const mode=root.querySelector('[data-joy-upload-kind]')?.value||'photo';const k=(mode==='plan'?Math.min:Math.max)(1200/bitmap.width,675/bitmap.height),w=bitmap.width*k,h=bitmap.height*k;
   ctx.drawImage(bitmap,(1200-w)/2,(675-h)/2,w,h);bitmap.close();
   const dataUrl=canvas.toDataURL('image/jpeg',0.82);state.textContent='Загружаем '+file.name+'…';
   const result=await api('/api/admin/property-media',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slug:current.slug,dataUrl})});
   const destination=mode==='plan'?'planImages':'images';const all=lines(destination);if(!all.includes(result.path))all.push(result.path);
   field(destination).value=all.join('\n');dirty=true;refreshMedia();refreshPlanMedia();
  }state.textContent='Фотографии загружены в Joy². Нажмите «Сохранить в GitHub», чтобы добавить их в карточку.';
  }catch(e){state.textContent=e.message||'Ошибка загрузки';}finally{mediaInput.disabled=false;}
 });
 for(const button of root.querySelectorAll('[data-joy-translate]'))button.addEventListener('click',async()=>{
  const lang=button.dataset.joyTranslate,keys=['title','city','district','address','description','features'];
  const pending=keys.filter(k=>!field(lang+'_'+k).value.trim()&&field(k).value.trim());
  const status=root.querySelector('[data-translate-status]');if(!pending.length){status.textContent='Все поля '+lang.toUpperCase()+' уже заполнены.';return;}
  const texts={};for(const key of pending)texts[key]=key==='features'?lines('features'):field(key).value.trim();
  button.disabled=true;status.textContent='Переводим '+lang.toUpperCase()+'…';
  try{const response=await api('/api/admin/translate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({target:lang,texts})});
    let filled=0;for(const key of pending){const input=field(lang+'_'+key),value=response.translations?.[key];if(!input.value.trim()&&value){input.value=Array.isArray(value)?value.join('\n'):String(value);filled++;}}
    dirty=dirty||filled>0;status.textContent='Заполнено полей: '+filled+'. Проверьте перевод перед сохранением.';
  }catch(e){status.textContent=e.message||'Ошибка перевода';}finally{button.disabled=false;}
 });
 // Automatic slug generation only for new properties; never changes existing URLs.
 const slugify=value=>{const from='абвгдежзийклмнопрстуфхцчшщыэюяьъё',to=['a','b','v','g','d','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','kh','ts','ch','sh','shch','y','e','yu','ya','','','yo'];return String(value||'').toLowerCase().split('').map(ch=>{const idx=from.indexOf(ch);return idx>=0?to[idx]:ch}).join('').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)};
 field('title').addEventListener('input',()=>{if(!isNew||field('slug').dataset.manuallyEdited==='true')return;const s=slugify(field('title').value);if(s){field('slug').value=s;dirty=true;refreshPreview();}});
 field('slug').addEventListener('input',()=>{field('slug').dataset.manuallyEdited='true';refreshPreview();});

 const slugs=await loadList();if(slugs.length)await load(slugs[0]);
 const latest=await loadFx();if(latest){const fx={...latest,uzsDevaluation:latest.annualDevaluation};applyFx(fx);}else if(initialFx)applyFx(initialFx);else root.querySelector('[data-fx-status]').textContent='ЦБ недоступен. Последнего курса нет: для модели с арендой в UZS необходим официальный курс.';
}
