// JOY2_V158_UNITS_CAPEX_CBU: one CAPEX field, shared FX feed.
import {validateInvestment} from './joyjoy-investment-model.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
const root=document.querySelector('[data-joyjoy-admin]');
if(root){
 const form=root.querySelector('form'),holder=root.querySelector('[data-units-list]'),json=form?.elements.namedItem('unitsJson');
 if(form&&holder&&json){
 let units=[], fxState=lastFx(), fxVersion=0, fxSource='';
 const number=v=>v===''?0:Number(v);
 const uid=()=> 'unit-'+(globalThis.crypto?.randomUUID?.().slice(0,12)||Math.random().toString(36).slice(2,14));
 const fresh=()=>({id:uid(),block:'',floor:'',number:'',area:0,pricePerSqm:0,capex:0,published:true,images:[],rentalStatusText:'',investment:null});
 const keys=[['purchasePrice','Цена покупки, $'],['lettableArea','Арендуемая площадь, м²'],['monthlyRent','Ставка аренды, $/м²/мес'],['mezzanineArea','Площадь мезонина, м²'],['mezzanineRent','Ставка мезонина, $/м²/мес'],['occupancy','Заполняемость, %'],['annualExpenses','Годовые расходы, $'],['propertyTaxRate','Налог на имущество, %'],['profitTaxRate','Налог на прибыль, %'],['holdYears','Срок владения, лет'],['exitCapRate','Exit Cap Rate, %'],['annualRentGrowth','Индексация, %']];
 const initial=u=>({published:true,currency:'USD',rentCurrency:'USD',purchasePrice:Number(u.area)*Number(u.pricePerSqm)||0,fitOutCosts:0,capex:Number(u.capex)||0,lettableArea:Number(u.area)||0,monthlyRent:0,mezzanineArea:0,mezzanineRent:0,occupancy:100,annualExpenses:0,propertyTaxRate:0,profitTaxRate:0,holdYears:8,exitCapRate:12,annualRentGrowth:0,rentBasis:'assumption',asOf:new Date().toISOString().slice(0,10),sourceNote:''});
 const hasComplete=u=>u.published!==false&&u.investment?.published===true&&validateInvestment(u.investment).length===0&&String(u.investment.sourceNote||'').trim()&&String(u.investment.asOf||'').trim()&&['assumption','asking','contract'].includes(u.investment.rentBasis);
 const sync=()=>{
  json.value=JSON.stringify(units);
  const flag=form.elements.namedItem('insestproject');
  if(flag){flag.checked=units.some(hasComplete);flag.disabled=true;}
  json.dispatchEvent(new Event('input',{bubbles:true}));
 };
 const text=(tag,value)=>{const el=document.createElement(tag);el.textContent=value;return el;};
 function input(parent,label,key,obj,type='text'){
  const wrap=document.createElement('label'),name=text('span',label),el=document.createElement('input');
  el.type=type;el.value=obj[key]??'';
  if(type==='number'){el.min='0';el.step='any';}
  el.addEventListener('input',()=>{obj[key]=type==='number'?number(el.value):el.value;sync();});
  wrap.append(name,el);parent.append(wrap);return el;
 }
 function select(parent,label,key,obj,options){
  const wrap=document.createElement('label'),el=document.createElement('select');wrap.append(text('span',label));
  for(const [value,title] of options){const opt=document.createElement('option');opt.value=value;opt.textContent=title;el.append(opt);}
  el.value=obj[key]||'';el.addEventListener('change',()=>{obj[key]=el.value;sync();});wrap.append(el);parent.append(wrap);return el;
 }
 const fxInputs=new Set(),fxMessages=new Set();
 function paintFx(){
  for(const record of fxInputs){if(!record.el.isConnected){fxInputs.delete(record);continue;}record.el.value=record.model[record.key]??'';}
  const status=fxState?'ЦБ Узбекистана: '+Number(fxState.usdUzs).toLocaleString('ru-RU',{maximumFractionDigits:2})+' UZS за USD · девальвация '+Number(fxState.annualDevaluation).toFixed(2)+'% в год'+(fxState.stale?' · сохранённый курс':'')+(fxState.rateDate?' · '+fxState.rateDate:''):'Курс не загружен. Для аренды в UZS сохранённые значения не удаляются.';
  for(const el of fxMessages){if(!el.isConnected){fxMessages.delete(el);continue;}el.textContent=status;}
 }
 function applyFx(fx,version){
  if(version!==fxVersion||!fx||!(Number(fx.usdUzs)>0)||!Number.isFinite(Number(fx.annualDevaluation)))return;
  fxState=fx;let changed=false;
  for(const unit of units){if(!unit.investment)continue;
   if(unit.investment.usdUzs!==Number(fx.usdUzs)||unit.investment.uzsDevaluation!==Number(fx.annualDevaluation)){
    unit.investment.usdUzs=Number(fx.usdUzs);unit.investment.uzsDevaluation=Number(fx.annualDevaluation);changed=true;
   }
  }
  paintFx();if(changed)sync();
 }
 async function officialCbu(){
  try{
   const base='https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/';
   const then=new Date();then.setFullYear(then.getFullYear()-5);
   const responses=await Promise.all([fetch(base),fetch(base+then.toISOString().slice(0,10)+'/')]);
   if(responses.some(r=>!r.ok))return null;
   const [today,previous]=await Promise.all(responses.map(r=>r.json()));
   const usdUzs=Number(today?.[0]?.Rate),older=Number(previous?.[0]?.Rate);
   if(!(usdUzs>0&&older>0))return null;
   const rate={usdUzs,annualDevaluation:(Math.pow(usdUzs/older,1/5)-1)*100,rateDate:String(today[0].Date||''),stale:false};
   try{localStorage.setItem('joyjoy:last-valid-usd-uzs',JSON.stringify(rate));}catch{}
   return rate;
  }catch{return null;}
 }
 function draw(){
  holder.replaceChildren();fxInputs.clear();fxMessages.clear();
  units.forEach((u,index)=>{
   const card=document.createElement('section');card.className='jj-unit-admin-card';card.dataset.joy2Unit=String(index);
   card.append(text('h3','Помещение №'+(index+1)));
   const grid=document.createElement('div');grid.className='jj-admin-fields';card.append(grid);
   input(grid,'Идентификатор (уникальный)','id',u);input(grid,'Блок','block',u);input(grid,'Этаж','floor',u);
   input(grid,'Номер помещения','number',u);input(grid,'Площадь, м²','area',u,'number');input(grid,'Цена за м², $','pricePerSqm',u,'number');
   const pub=document.createElement('label'),pubbox=document.createElement('input');pubbox.type='checkbox';pubbox.checked=u.published!==false;
   pubbox.addEventListener('change',()=>{u.published=pubbox.checked;sync();});pub.append(pubbox,text('span',' Публиковать помещение'));card.append(pub);
   input(grid,'Арендный статус — текст для страницы помещения','rentalStatusText',u);
   const flag=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=u.investment?.published===true;
   check.addEventListener('change',()=>{if(check.checked)u.investment={...initial(u),...(u.investment||{}),capex:Number(u.capex)||0,published:true};else if(u.investment)u.investment.published=false;sync();draw();});
   flag.append(check,text('strong',' Инвестиционное помещение'));card.append(flag);
   if(u.investment?.published){
    const box=document.createElement('div');box.className='jj-unit-admin-model';box.append(text('h4','Финансовая модель · помещение №'+(index+1)));
    const fields=document.createElement('div');fields.className='jj-admin-fields';box.append(fields);
    for(const [key,label] of keys){
     input(fields,label,key,u.investment,'number');
     if(key==='purchasePrice'){
      const cap=input(fields,'CAPEX — первоначальные расходы, $','capex',u.investment,'number');
      cap.addEventListener('input',()=>{u.capex=Number(u.investment.capex)||0;sync();});
     }
    }
    select(fields,'Валюта аренды','rentCurrency',u.investment,[['USD','USD'],['UZS','UZS']]);
    select(fields,'Основание ставки','rentBasis',u.investment,[['assumption','Расчётное допущение'],['asking','Ставка предложения'],['contract','По договору']]);
    input(fields,'Дата исходных данных','asOf',u.investment,'date');
    for(const [key,label] of [['usdUzs','Курс ЦБ USD/UZS (автоматически)'],['uzsDevaluation','Средняя девальвация UZS за 5 лет, % годовых (автоматически)']]){
     const el=input(fields,label,key,u.investment,'number');el.readOnly=true;fxInputs.add({el,key,model:u.investment});
    }
    const status=text('small','Загрузка данных ЦБ…');status.className='joy2-unit-fx-status-v158';fields.append(status);fxMessages.add(status);
    const src=document.createElement('label');src.append(text('span','Источник и условия расчёта'));
    const note=document.createElement('textarea');note.rows=3;note.value=u.investment.sourceNote||'';
    note.addEventListener('input',()=>{u.investment.sourceNote=note.value;sync();});src.append(note);box.append(src);
    const msg=text('small','Инвестиционный статус объекта включится после заполнения корректной модели и сохранения.');box.append(msg);
    card.append(box);
   }
   const remove=document.createElement('button');remove.type='button';remove.textContent='Удалить помещение';remove.className='jj-admin-danger';
   remove.addEventListener('click',()=>{
    if(!confirm('Удалить помещение №'+(index+1)+'? Данные этого помещения и его инвестиционной модели будут удалены при сохранении объекта.'))return;
    units.splice(index,1);if(!units.length)units.push(fresh());sync();draw();
   });
   card.append(remove);holder.append(card);
  });
  paintFx();
 }
 root.querySelector('[data-add-unit]')?.addEventListener('click',()=>{units.push(fresh());sync();draw();});
 window.addEventListener('joyjoy:units-loaded',event=>{
  const original=event.detail?.units;
  units=Array.isArray(original)&&original.length?structuredClone(original):[fresh()];
  units.forEach(u=>{const v=Number(u.investment?.capex??u.capex??0);u.capex=Number.isFinite(v)&&v>=0?v:0;
   if(u.investment){u.investment.capex=u.capex;delete u.investment.transactionCosts;delete u.investment.otherCosts;}
  });
  draw();sync();
  const version=++fxVersion;const cached=lastFx();if(cached)applyFx(cached,version);
  loadFx().then(async fx=>{if(version!==fxVersion)return;const result=fx&&!fx.stale?fx:(await officialCbu())||fx;if(result)applyFx(result,version);else paintFx();}).catch(()=>paintFx());
 });
 }
}
