/* JOY2_CATALOG_FOUR_LIME_V2: quick controls; amounts in source data untouched */
(()=>{
 const $=id=>document.getElementById(id),form=$('jj-filters');if(!form)return;
 if($('jj-price-quick'))return;
 const lang=document.documentElement.lang||'ru';
 const t=(ru,uz,en)=>lang==='en'?en:lang==='uz'?uz:ru;
 const makeSelect=(id,cls,aria,opts)=>{
  const label=document.createElement('label');label.className='jj-quick-field '+cls;
  const select=document.createElement('select');select.id=id;select.setAttribute('aria-label',aria);
  for(const [value,text] of opts){const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o)}
  label.append(select);return label;
 };
 const priceLabel=t('Цена, $','Narx, $','Price, $');
 const price=makeSelect('jj-price-quick','jj-quick-price',priceLabel,[
  ['',priceLabel],['1000000',t('До $1 млн','$1 mln gacha','Under $1M')],['5000000',t('До $5 млн','$5 mln gacha','Under $5M')],['5000001',t('От $5 млн','$5 mln dan','From $5M')]]);
 const areaLabel=t('Площадь, м²','Maydon, m²','Area, m²');
 const area=makeSelect('jj-area-quick','jj-quick-area',areaLabel,[
  ['',areaLabel],['500',t('До 500 м²','500 m² gacha','Under 500 m²')],['3000',t('До 3 000 м²','3 000 m² gacha','Under 3,000 m²')],['3001',t('От 3 000 м²','3 000 m² dan','Over 3,000 m²')]]);
 const inv=document.createElement('label');inv.className='jj-quick-invest';
 const cb=document.createElement('input');cb.type='checkbox';cb.id='jj-investment-only';
 const track=document.createElement('span');track.className='jj-quick-track';track.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.textContent=t('Только инвестиционные','Faqat investitsiyalar','Investments only');
 inv.append(cb,track,label);
 const more=$('jj-more-filters');more.before(price,area,inv);
 // Existing marker is authoritative: never invent or recalculate investment figures.
 document.querySelectorAll('#jj-results .jj-property-card').forEach(card=>{
  card.dataset.investment=String(!!card.querySelector('.jj-invest-ribbon'));
 });
 const minP=$('jj-price-min'),maxP=$('jj-price-max'),minA=$('jj-area-min'),maxA=$('jj-area-max'),reset=$('jj-reset');
 const emit=()=>minP.dispatchEvent(new Event('change',{bubbles:true}));
 const apply=()=>{
  const p=price.querySelector('select').value,a=area.querySelector('select').value;
  minP.value=p==='5000001'?'5000001':'';
  maxP.value=p==='1000000'?'1000000':p==='5000000'?'5000000':'';
  minA.value=a==='3001'?'3001':'';
  maxA.value=a==='500'?'500':a==='3000'?'3000':'';
  emit();
 };
 price.addEventListener('change',apply);area.addEventListener('change',apply);cb.addEventListener('change',emit);
 const search=form.querySelector('.jj-field-search'),advanced=$('jj-advanced-filters');if(search&&advanced)advanced.prepend(search);
 const fromFields=()=>{
  const loP=Number(minP.value)||0,hiP=maxP.value?Number(maxP.value):Infinity;
  const loA=Number(minA.value)||0,hiA=maxA.value?Number(maxA.value):Infinity;
  price.querySelector('select').value=loP===5000001?'5000001':hiP===1000000?'1000000':hiP===5000000?'5000000':'';
  area.querySelector('select').value=loA===3001?'3001':hiA===500?'500':hiA===3000?'3000':'';
 };
 for(const x of [minP,maxP,minA,maxA])x.addEventListener('change',fromFields);
 reset?.addEventListener('click',()=>{price.querySelector('select').value='';area.querySelector('select').value='';cb.checked=false;emit()});
 form.addEventListener('reset',()=>queueMicrotask(()=>{price.querySelector('select').value='';area.querySelector('select').value='';cb.checked=false}));
 fromFields();
})();