// One deterministic model for the website, the editor and server-side validation.
export const investmentFields = ['purchasePrice','transactionCosts','fitOutCosts','otherCosts','lettableArea','monthlyRent','occupancy','annualExpenses','capex','holdYears','exitCapRate','annualRentGrowth'];
// New fields default for previously saved properties; blank CAPEX is always zero.
export const investmentDefaults={capex:0,holdYears:8,exitCapRate:12,annualRentGrowth:0,rentCurrency:'USD',usdUzs:null,uzsDevaluation:null};
function investmentInputs(m){return {...investmentDefaults,...m,capex:m?.capex??0,holdYears:m?.holdYears??8,exitCapRate:m?.exitCapRate??12,annualRentGrowth:m?.annualRentGrowth??0,occupancy:m?.occupancy??0,monthlyRent:m?.monthlyRent??0,annualExpenses:m?.annualExpenses??0,otherCosts:m?.otherCosts??0,fitOutCosts:m?.fitOutCosts??0,transactionCosts:m?.transactionCosts??0,mezzanineArea:m?.mezzanineArea??0,mezzanineRent:m?.mezzanineRent??0,propertyTaxRate:m?.propertyTaxRate??0,profitTaxRate:m?.profitTaxRate??0};}
function netPresentValue(flows,rate){return flows.reduce((s,v,i)=>s+v/Math.pow(1+rate,i),0);}
export function investmentIRR(flows){
 if(!Array.isArray(flows)||flows.length<2||!(flows[0]<0))return null;
 let low=-0.9999,high=1;let lo=netPresentValue(flows,low),hi=netPresentValue(flows,high);
 while(hi>0&&high<1e6){high=high*2+1;hi=netPresentValue(flows,high);}
 if(!Number.isFinite(lo)||!Number.isFinite(hi)||lo*hi>0)return null;
 for(let i=0;i<160;i++){const mid=(low+high)/2,v=netPresentValue(flows,mid);if(v>0)low=mid;else high=mid;}
 return (low+high)/2*100;
}
export function validateInvestment(model) {
  model=investmentInputs(model);
  const errors = [];
  if (!model || typeof model !== 'object' || Array.isArray(model)) return ['model'];
  for (const key of investmentFields) {
    const n = model[key];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > 1e12) errors.push(key);
  }
  if (!(model.purchasePrice > 0)) errors.push('purchasePrice');
  if (!(model.lettableArea > 0)) errors.push('lettableArea');
  for(const key of ['mezzanineArea','mezzanineRent','propertyTaxRate','profitTaxRate'])if(!Number.isFinite(model[key])||model[key]<0||model[key]>1e12)errors.push(key);
  if(model.propertyTaxRate>100||model.profitTaxRate>100)errors.push('taxRates');
  if (model.occupancy > 100) errors.push('occupancy');
  if (model.currency !== 'USD') errors.push('currency');
  if(!Number.isInteger(model.holdYears)||model.holdYears<1||model.holdYears>40)errors.push('holdYears');
  if(model.exitCapRate<=0||model.exitCapRate>100)errors.push('exitCapRate');
  if(model.annualRentGrowth>100)errors.push('annualRentGrowth');
  if(!['USD','UZS'].includes(model.rentCurrency))errors.push('rentCurrency');
  if(model.rentCurrency==='UZS'&&(!(model.usdUzs>0)||!Number.isFinite(model.usdUzs)||!Number.isFinite(model.uzsDevaluation)||model.uzsDevaluation<=-100||model.uzsDevaluation>100))errors.push('fx');
  return [...new Set(errors)];
}
export function calculateInvestment(raw) {
 // JOY2_TAX_REALISM_CLEAN_UI_V7. Simplified corporate owner on general tax regime.
 // Buildings: tax depreciation 5% straight-line, capped at 20 years.
 // 2026 legal-person property tax 1.5%, minimum floor per m²; floors are held constant
 // for future years as an illustrative assumption. Tax FX defaults to 12,000 UZS/USD.
 // VAT, land tax, regional multipliers, financing, incentives and acquisition basis
 // adjustments are outside this indicative model.
 const m=investmentInputs(raw);
 const errors=validateInvestment(m);if(errors.length)return {ok:false,errors,irrPercent:null};
 const purchase=Number(m.purchasePrice);
 const transactionCosts=Number(m.transactionCosts||0),fitOutCosts=Number(m.fitOutCosts||0),otherCosts=Number(m.otherCosts||0),capex=Number(m.capex||0);
 const annualExpenses=Number(m.annualExpenses||0);
 const totalInvestment=purchase+transactionCosts+fitOutCosts+otherCosts+capex;
 const fxRent=m.rentCurrency==='UZS'?Number(m.usdUzs):1;
 const annualRent=(Number(m.lettableArea)*Number(m.monthlyRent||0)+Number(m.mezzanineArea||0)*Number(m.mezzanineRent||0))*12*Number(m.occupancy||0)/100/fxRent;
 const effectiveAnnualGrowth=m.rentCurrency==='UZS'?((1+Number(m.annualRentGrowth)/100)/(1+Number(m.uzsDevaluation)/100)-1)*100:Number(m.annualRentGrowth||0);
 const nYears=Number(m.holdYears);
 const annualDepreciation=purchase/20;
 // Property tax is deducted as an operating expense; the income tax on rental profit
 // is deducted afterwards. Deductible building depreciation is a NON-cash expense.
 const location=String(m.taxCity||m.city||'Ташкент').toLowerCase();
 const floorUzsPerSqm=location.includes('ташкент')||location.includes('tashkent')?3530000:(location.includes('нукус')||location.includes('nukus')?2350000:1390000);
 const taxFx=Number(m.taxUsdUzs)>0?Number(m.taxUsdUzs):(Number(m.usdUzs)>0?Number(m.usdUzs):12000);
 const taxArea=Number(m.propertyTaxArea)>0?Number(m.propertyTaxArea):Number(m.lettableArea);
 const minPropertyBase=taxArea*floorUzsPerSqm/taxFx;
 const costAtTime=years=>purchase*Math.max(0,1-years/20);
 const propertyTaxForYear=year=>{
  const avgResidual=(costAtTime(year-1)+costAtTime(year))/2;
  return Math.max(avgResidual,minPropertyBase)*0.015;
 };
 const rentAtYear=year=>annualRent*Math.pow(1+effectiveAnnualGrowth/100,year-1);
 const cashFlows=[-totalInvestment],schedule=[];
 for(let year=1;year<=nYears;year++){
   const revenue=rentAtYear(year);
   const propertyTax=propertyTaxForYear(year);
   const expenses=annualExpenses+propertyTax;
   const noi=revenue-expenses;
   const taxableRentProfit=Math.max(0,noi-(year<=20?annualDepreciation:0));
   const rentalProfitTax=taxableRentProfit*0.15;
   const cashFlow=noi-rentalProfitTax;
   schedule.push({year,revenue,expenses,otherExpenses:annualExpenses,propertyTax,noi,taxableRentProfit,rentalProfitTax,sale:0,cashFlow});
 }
 const nextYearNOI=rentAtYear(nYears+1)-annualExpenses-propertyTaxForYear(nYears+1);
 // Sale at end of holding year = gross annual rental revenue earned during that same year / exit cap rate.
 // Profit tax on sale is deducted after calculating this sale price.
 const exitAnnualRent=rentAtYear(nYears);
 const salePrice=exitAnnualRent>0?exitAnnualRent/(Number(m.exitCapRate)/100):0;
 const remainingBasis=costAtTime(nYears);
 const taxableSaleGain=Math.max(0,salePrice-remainingBasis);
 const saleTax=taxableSaleGain*0.15;
 const netSale=salePrice-saleTax;
 const last=schedule[schedule.length-1];last.sale=salePrice;last.saleTax=saleTax;last.netSale=netSale;last.cashFlow+=netSale;
 cashFlows.push(...schedule.map(row=>row.cashFlow));
 const irrPercent=investmentIRR(cashFlows);
 const netProfit=cashFlows.reduce((a,b)=>a+b,0);
 const annualNet=schedule[0].noi-schedule[0].rentalProfitTax;
 return {ok:true,totalInvestment,annualRent,annualNet,yieldPercent:totalInvestment>0?annualNet/totalInvestment*100:null,paybackYears:annualNet>0?totalInvestment/annualNet:null,irrPercent,salePrice,netSale,saleTax,taxableSaleGain,remainingBasis,saleTransactionCosts:0,nextYearNOI,cashFlows,schedule,holdYears:nYears,netProfit,propertyTaxRate:1.5,rentalProfitTaxRate:15,saleTaxRate:15,propertyTaxFloorUzsPerSqm:floorUzsPerSqm,propertyTaxFx:taxFx};
}

export function hasPublishedInvestment(property) {
  const m = property.investment;
  return property.published !== false && m?.published === true && validateInvestment(m).length === 0 &&
    typeof m.sourceNote === 'string' && m.sourceNote.trim().length > 0 &&
    ['assumption','asking','contract'].includes(m.rentBasis) && validDate(m.asOf);
}
export function hasPublishedUnitInvestment(unit){return unit?.published!==false && unit?.investment?.published===true && validateInvestment(unit.investment).length===0 && !!unit.investment.sourceNote && !!unit.investment.asOf && ['assumption','asking','contract'].includes(unit.investment.rentBasis);}
export function isPublishedProject(property) {
 if(property?.published===false)return false;
 if(Array.isArray(property?.units)&&property.units.length)return property.units.some(hasPublishedUnitInvestment);
 // Compatibility for previously published legacy properties until their first unit is saved.
 return property?.insestproject===true && hasPublishedInvestment(property);
}
function validDate(s) {return typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s+'T00:00:00Z')) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
export function validateProperty(p) {
  const errors=[];
  if (!p || typeof p!=='object' || Array.isArray(p)) return ['property'];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug||'') || p.slug.length>100) errors.push('slug');
  for (const key of ['title','city','address','description']) if(typeof p[key]!=='string'||!p[key].trim()||p[key].length>20000)errors.push(key);
  if(typeof p.district!=='string')errors.push('district');
  if(!['office','retail','warehouse','land'].includes(p.type))errors.push('type');
  if(p.status!==null&&!['existing','under_construction'].includes(p.status))errors.push('status');
  if(typeof p.area!=='number'||!Number.isFinite(p.area)||p.area<=0||p.area>1e9)errors.push('area');
  if(p.priceUsd!==null&&(typeof p.priceUsd!=='number'||!Number.isFinite(p.priceUsd)||p.priceUsd<=0||p.priceUsd>1e12))errors.push('priceUsd');
  for(const key of ['published','showCatalog','insestproject'])if(p[key]!==undefined&&typeof p[key]!=='boolean')errors.push(key);
  if(p.order!==undefined&&(!Number.isInteger(p.order)||p.order<0))errors.push('order');
  const safeUrl=(s)=>{if(typeof s!=='string'||s.length>2048)return false;try{const u=new URL(s,'https://joyjoy.invalid');return u.protocol==='https:'&&!u.username&&!u.password&&(s.startsWith('https://')||s.startsWith('/')&&!s.startsWith('//'));}catch{return false;}};
  if(!Array.isArray(p.images)||p.images.length>30||p.images.some(x=>!safeUrl(x)))errors.push('images');
  if(p.sourceUrl&&!safeUrl(p.sourceUrl))errors.push('sourceUrl');
  if(!Array.isArray(p.features)||p.features.length>100||p.features.some(x=>typeof x!=='string'||x.length>1000))errors.push('features');
  for(const [key,max] of [['lat',90],['lng',180]])if(p[key]!==undefined&&p[key]!==null&&(typeof p[key]!=='number'||!Number.isFinite(p[key])||Math.abs(p[key])>max))errors.push(key);
  if((p.lat==null)!==(p.lng==null))errors.push('coordinates');
  if(p.translations!==undefined){
    if(!p.translations||typeof p.translations!=='object'||Array.isArray(p.translations))errors.push('translations');
    else for(const [lang,row] of Object.entries(p.translations)){
      if(!['en','uz'].includes(lang)||!row||typeof row!=='object'||Array.isArray(row)){errors.push('translations');continue;}
      for(const [key,value] of Object.entries(row)){
        if(!['title','city','district','address','description','features'].includes(key))errors.push('translations.'+key);
        else if(key==='features'? !Array.isArray(value)||value.some(x=>typeof x!=='string'||x.length>1000) : typeof value!=='string'||value.length>20000)errors.push('translations.'+key);
      }
    }
  }
  if(p.units!==undefined){
    if(!Array.isArray(p.units)||p.units.length>200)errors.push('units');
    else {const ids=new Set();for(const u of p.units){
      if(!u||typeof u!=='object'||!(/^[a-z0-9][a-z0-9-]{0,70}$/.test(u.id||''))||ids.has(u.id)){errors.push('units.id');continue;}ids.add(u.id);
      if(typeof u.block!=='string'||u.block.length>80||typeof u.floor!=='string'||u.floor.length>80||typeof u.number!=='string'||u.number.length>80)errors.push('units.label');
      if(typeof u.area!=='number'||u.area<=0||!Number.isFinite(u.area)||typeof u.pricePerSqm!=='number'||u.pricePerSqm<=0||!Number.isFinite(u.pricePerSqm))errors.push('units.price');
      if(u.published!==undefined&&typeof u.published!=='boolean')errors.push('units.published');
      if(u.investment!=null){if(typeof u.investment!=='object'||Array.isArray(u.investment))errors.push('units.investment');else if(u.investment.published&&!hasPublishedUnitInvestment(u))errors.push('units.investment.incomplete');}
      if(u.planImage!==undefined&&u.planImage!==''&&(typeof u.planImage!=='string'||!u.planImage.startsWith('/images/')))errors.push('units.planImage');
      if(u.images!==undefined&&(!Array.isArray(u.images)||u.images.some(x=>!safeUrl(x))))errors.push('units.images');
    }}
  }
  if(p.investment!=null){
    const m=p.investment;
    if(typeof m!=='object'||Array.isArray(m))errors.push('investment');
    else {
      if(typeof m.published!=='boolean')errors.push('investment.published');
      for(const k of investmentFields)if(m[k]!==null&&m[k]!==undefined&&(typeof m[k]!=='number'||!Number.isFinite(m[k])||m[k]<0||m[k]>1e12))errors.push('investment.'+k);
      if(m.occupancy>100)errors.push('investment.occupancy');
      if(m.currency!=='USD')errors.push('investment.currency');
      if(m.rentCurrency!==undefined&&!['USD','UZS'].includes(m.rentCurrency))errors.push('investment.rentCurrency');
      if(m.usdUzs!=null&&(typeof m.usdUzs!=='number'||!Number.isFinite(m.usdUzs)||m.usdUzs<=0))errors.push('investment.usdUzs');
      if(m.uzsDevaluation!=null&&(typeof m.uzsDevaluation!=='number'||!Number.isFinite(m.uzsDevaluation)||m.uzsDevaluation<=-100||m.uzsDevaluation>100))errors.push('investment.uzsDevaluation');
      if(m.rentBasis&&!['assumption','asking','contract'].includes(m.rentBasis))errors.push('investment.rentBasis');
      if(m.asOf&&!validDate(m.asOf))errors.push('investment.asOf');
      if(m.sourceNote!==undefined&&(typeof m.sourceNote!=='string'||m.sourceNote.length>4000))errors.push('investment.sourceNote');
      if(m.published&&(!isPublishedProject({...p,published:true,insestproject:true})))errors.push('investment.incomplete');
    }
  }
  return [...new Set(errors)];
}
export function propertyErrorMessage(errors) {
 const labels={slug:'Адрес страницы: латинские буквы, цифры и дефисы',title:'Название',city:'Город',address:'Адрес',district:'Район',description:'Описание',area:'Общая площадь должна быть больше нуля',priceUsd:'Цена продажи должна быть больше нуля или пустой',images:'Фотографии: используйте HTTPS-ссылки или /images/…',sourceUrl:'Ссылка на источник: используйте HTTPS',features:'Характеристики',coordinates:'Укажите обе координаты или очистите обе',lat:'Широта от −90 до 90',lng:'Долгота от −180 до 180',translations:'Переводы',purchasePrice:'Цена покупки должна быть больше нуля',transactionCosts:'Расходы на сделку',fitOutCosts:'Ремонт и подготовка',otherCosts:'Прочие вложения',lettableArea:'Сдаваемая площадь должна быть больше нуля',monthlyRent:'Ставка аренды',occupancy:'Заполняемость от 0 до 100%',annualExpenses:'Годовые расходы',asOf:'Корректная дата исходных данных',currency:'Валюта модели — USD',rentBasis:'Основание ставки',sourceNote:'Источник и условия ставки','investment.incomplete':'Перед публикацией заполните всю модель, основание ставки, дату и источник',insestproject:'Для включения в инвестиционный каталог опубликуйте полную модель'};
 return 'Проверьте: '+[...new Set(errors.map(key=>labels[key]||labels[key.replace(/^investment\./,'')]||'Параметры объекта'))].join(' · ');
}
