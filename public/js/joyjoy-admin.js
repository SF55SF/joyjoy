import {calculateInvestment,investmentFields,validateProperty,propertyErrorMessage} from './joyjoy-investment-model.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
const root=document.querySelector('[data-joyjoy-admin]');
if(root){
 const form=root.querySelector('form'),status=root.querySelector('[data-save-status]'),list=root.querySelector('[data-property-list]'),listStatus=root.querySelector('[data-list-status]'),save=form.querySelector('[data-save-property]');
 let current=null,sha=null,isNew=false,dirty=false,busy=false,loadId=0;
 const field=k=>form.elements.namedItem(k);
 const nullable=k=>field(k).value.trim()===''?null:field(k).valueAsNumber;
 const lines=k=>field(k).value.split('\n').map(x=>x.trim()).filter(Boolean);
 const showInvestment=()=>{const v=field('showProjects').checked;root.querySelector('[data-investment-editor]').hidden=!v;field('modelPublished').checked=v;};
 function setStatus(text,error=false){status.textContent=text;status.dataset.error=String(error);}
 async function api(url,options){const res=await fetch(url,{credentials:'same-origin',...options});let body;try{body=await res.json();}catch{throw Error('API недоступен. В StackBlitz preview доступны страницы, но сохранение работает на Cloudflare Pages.');}if(!res.ok)throw Error(res.status===401?'Сессия истекла. Откройте /admin-login/ и войдите снова.':body.error||'Ошибка API');return body;}
 function read(){
  const p={...current,slug:field('slug').value.trim(),published:field('published').checked,showCatalog:field('showCatalog').checked,showProjects:field('showProjects').checked};
  for(const key of ['title','city','district','address','description','type','status','sourceUrl'])p[key]=field(key).value.trim();
  for(const key of ['area','priceUsd'])p[key]=nullable(key);
  for(const key of ['lat','lng'])p[key]=nullable(key);
  p.images=lines('images');p.features=lines('features');
  p.translations={};for(const lang of ['uz','en']){const row={};for(const key of ['title','city','district','address','description','features']){const value=field(lang+'_'+key).value.trim();if(value)row[key]=key==='features'?lines(lang+'_'+key):value;}if(Object.keys(row).length)p.translations[lang]=row;}
  p.investment={...(current.investment||{}),currency:'USD',published:field('modelPublished').checked};
  for(const key of investmentFields)p.investment[key]=nullable(key);
  for(const key of ['rentBasis','asOf','sourceNote','rentCurrency'])p.investment[key]=field(key).value.trim();
  for(const key of ['usdUzs','uzsDevaluation'])p.investment[key]=nullable(key);
  return p;
 }
 function preview(){const r=calculateInvestment(read().investment);root.querySelector('[data-admin-model-status]').textContent=r.ok?'Предпросмотр по введённым параметрам':'Для расчёта заполните все числовые параметры. Цена и площадь — больше нуля; заполняемость 0–100%.';for(const el of root.querySelectorAll('[data-admin-result]')){const k=el.dataset.adminResult;el.textContent=!r.ok?'—':k==='paybackYears'?(r[k]===null?'Не окупается':r[k].toLocaleString('ru-RU',{maximumFractionDigits:1})+' лет'):['yieldPercent','irrPercent'].includes(k)?(r[k]===null?'—':r[k].toLocaleString('ru-RU',{maximumFractionDigits:2})+'%'):r[k].toLocaleString('ru-RU',{style:'currency',currency:'USD',maximumFractionDigits:0});}}
 function render(p,version,creating=false){
  form.reset();current=p;sha=version;isNew=creating;
  for(const key of ['slug','title','city','district','address','description','type','status','sourceUrl','area','priceUsd','lat','lng'])field(key).value=p[key]??'';
  field('slug').readOnly=!creating;for(const key of ['published','showCatalog'])field(key).checked=p[key]!==false;field('showProjects').checked=p.showProjects===true;
  for(const k of ['images','features'])field(k).value=(p[k]||[]).join('\n');
  for(const lang of ['uz','en'])for(const k of ['title','city','district','address','description','features']){const value=p.translations?.[lang]?.[k];field(lang+'_'+k).value=Array.isArray(value)?value.join('\n'):value??'';}
  const m=p.investment||{};for(const k of investmentFields)field(k).value=m[k]??'';
  for(const k of ['rentBasis','asOf','sourceNote','rentCurrency'])field(k).value=m[k]??(k==='rentCurrency'?'USD':'');
  for(const k of ['usdUzs','uzsDevaluation'])field(k).value=m[k]??'';field('modelPublished').checked=m.published===true;showInvestment();const fx=lastFx();if(fx){field('usdUzs').value=fx.usdUzs;field('uzsDevaluation').value=fx.annualDevaluation;}
  root.querySelector('[data-editor-title]').textContent=p.title||'Новый объект';form.hidden=false;dirty=false;preview();
 }
 function discard(){return !dirty||window.confirm('Есть несохранённые правки. Перейти без сохранения?');}
 async function load(slug){if(busy||!discard())return;const id=++loadId;setStatus('Загружаем актуальную версию…');try{const data=await api('/api/admin/properties?slug='+encodeURIComponent(slug));if(id!==loadId)return;render(data.property,data.sha);setStatus('Загружено из GitHub. Изменения пока не сохранены.');list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',b.dataset.slug===slug?'true':'false'));}catch(e){setStatus(e.message,true);}}
 async function loadList(){try{const data=await api('/api/admin/properties');list.replaceChildren();for(const item of data.items){const b=document.createElement('button');b.type='button';b.textContent=item.title||item.slug;b.dataset.slug=item.slug;b.addEventListener('click',()=>load(item.slug));list.append(b);}listStatus.textContent=data.items.length+' объектов';return data.items.map(item=>item.slug);}catch(e){listStatus.textContent=e.message;return [];}}
 form.addEventListener('input',()=>{dirty=true;preview();});form.addEventListener('change',e=>{if(e.target===field('showProjects'))showInvestment();if(e.target===field('modelPublished')&&!e.target.checked){field('showProjects').checked=false;showInvestment();}dirty=true;preview();});
 form.addEventListener('submit',async e=>{e.preventDefault();if(busy)return;const p=read(),errors=validateProperty(p);if(errors.length){setStatus(propertyErrorMessage(errors),true);return;}busy=true;save.disabled=true;form.querySelectorAll('input,textarea,select').forEach(el=>el.disabled=true);setStatus('Сохраняем в GitHub…');try{const data=await api('/api/admin/properties',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({slug:p.slug,sha,create:isNew,property:p})});current=p;sha=data.sha;isNew=false;dirty=false;field('slug').readOnly=true;setStatus(data.unchanged?'Изменений нет.':('Сохранено в GitHub · '+data.commit.slice(0,7)+'. На сайте изменения появятся после успешной сборки и публикации Cloudflare Pages.'));await loadList();}catch(e){setStatus(e.message,true);}finally{busy=false;save.disabled=false;form.querySelectorAll('input,textarea,select').forEach(el=>el.disabled=false);}});
 root.querySelector('[data-new-property]').addEventListener('click',()=>{if(busy||!discard())return;++loadId;render({slug:'',title:'',city:'',district:'',address:'',description:'',area:null,priceUsd:null,type:'office',status:'existing',images:[],features:[],published:false,showCatalog:true,showProjects:false,order:Date.now()},null,true);setStatus('Новый объект. Заполните данные и переводы. Публикация по умолчанию отключена.');dirty=true;field('slug').focus();});
 root.querySelector('[data-admin-logout]').addEventListener('click',async()=>{if(busy||!discard())return;try{await api('/api/admin/logout',{method:'POST'});dirty=false;location.assign('/admin-login/');}catch(e){setStatus(e.message,true);}});
 window.addEventListener('beforeunload',e=>{if(dirty||busy){e.preventDefault();e.returnValue='';}});
 const applyFx=d=>{if(!d)return;for(const key of ['usdUzs','uzsDevaluation'])field(key).value=d[key];root.querySelector('[data-fx-status]').textContent='ЦБ Узбекистана: 1 USD = '+d.usdUzs.toLocaleString('ru-RU',{maximumFractionDigits:2})+' UZS · девальвация '+d.annualDevaluation.toFixed(2)+'% в год · '+(d.stale?'последние сохранённые данные':'актуальные данные')+' · '+(d.rateDate||'');preview();};
 const saved=lastFx();
 const initialFx=saved?{...saved,uzsDevaluation:saved.annualDevaluation}:null;
 const slugs=await loadList();if(slugs.length)await load(slugs[0]);
 const latest=await loadFx();if(latest){const fx={...latest,uzsDevaluation:latest.annualDevaluation};applyFx(fx);}else if(initialFx)applyFx(initialFx);else root.querySelector('[data-fx-status]').textContent='ЦБ недоступен. Последнего курса нет: для модели с арендой в UZS необходим официальный курс.';
}
