/* JOY2_UNIFIED_CARDS_V1 */
(()=>{
 function mount(){
  const payload=document.getElementById('joy2-unified-card-data-v1');
  const grid=document.getElementById('jj-results');
  if(!payload||!grid)return;
  let data;try{data=JSON.parse(payload.textContent||'[]');}catch{return;}
  const models=new Map(data.map(x=>[x.slug,x]));
  const locale=document.documentElement.lang||'ru';
  const words={
   ru:{irr:'IRR',profit:'Прибыль проекта',status:'Статус проекта',ready:'Существующий',building:'Строящийся',ribbon:'Инвестиционный расчёт'},
   uz:{irr:'IRR',profit:'Loyiha foydasi',status:'Loyiha holati',ready:'Mavjud',building:'Qurilmoqda',ribbon:'Investitsiya hisobi'},
   en:{irr:'IRR',profit:'Project profit',status:'Project status',ready:'Completed',building:'Under construction',ribbon:'Investment analysis'}
  }[locale]||null;
  const t=words||{irr:'IRR',profit:'Прибыль проекта',status:'Статус проекта',ready:'Существующий',building:'Строящийся',ribbon:'Инвестиционный расчёт'};
  const money=v=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.round(v));
  const pct=v=>new Intl.NumberFormat(locale==='en'?'en-US':'ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1}).format(v)+'%';
  for(const card of grid.querySelectorAll('.jj-property-card')){
   const d=models.get(card.dataset.slug);if(!d)continue;
   card.classList.add('jj-u-card');
   const cover=card.querySelector('.jj-property-card-image');
   if(cover){
     cover.querySelectorAll('.jj-invest-ribbon,.jj-label-status,.jj-tenancy-ribbon').forEach(n=>n.remove());
     if(d.investment){const badge=document.createElement('span');badge.className='jj-invest-ribbon jj-u-ribbon';badge.textContent=t.ribbon;cover.append(badge);}
   }
   const main=card.querySelector('.jj-property-card-main');if(!main)continue;
   const required=['.jj-card-overline','h3','.jj-property-summary','.jj-property-address'].map(sel=>main.querySelector(sel));
   if(required.some(x=>!x))continue;
   const bottom=document.createElement('div');bottom.className='jj-u-bottom';
   if(d.investment){
     const metrics=document.createElement('div');metrics.className='jj-u-metrics';
     for(const [label,val] of [[t.irr,pct(d.irr)],[t.profit,'$'+money(d.profit)]]){
      const cell=document.createElement('div');const small=document.createElement('span');small.textContent=label;const strong=document.createElement('strong');strong.textContent=val;cell.append(small,strong);metrics.append(cell);
     }
     bottom.append(metrics);
   }else if(d.status==='existing'||d.status==='under_construction'){
     const label=document.createElement('span');label.className='jj-u-bottom-label';label.textContent=t.status;
     const strong=document.createElement('strong');strong.className='jj-u-status';strong.textContent=d.status==='existing'?t.ready:t.building;
     bottom.append(label,strong);
   }else{bottom.classList.add('jj-u-empty');}
   main.replaceChildren(...required,bottom);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(mount),{once:true});else requestAnimationFrame(mount);
})();
