/* JOY2_SINGLE_UNIT_TOTAL_PRICE_V2 | Set displayed total for a property with exactly one published unit. */
(()=>{
 function apply(){
  const data=document.getElementById('jj-single-unit-price-data');
  const grid=document.getElementById('jj-results');
  if(!data||!grid)return;
  let values;try{values=JSON.parse(data.textContent||'[]')}catch(e){console.warn('Joy2: price data could not be parsed',e);return}
  for(const row of values){
   const card=Array.from(grid.querySelectorAll('.jj-property-card')).find(c=>c.dataset.slug===row.slug);
   if(!card)continue;
   const price=Number(row.price);if(!Number.isFinite(price)||price<=0)continue;
   const summary=card.querySelector('.jj-property-summary');
   const target=card.querySelector('.jj-card-price')||summary?.children?.[1];
   if(!target){console.warn('Joy2: cannot locate price display for',row.slug);continue}
   const text='$'+price.toLocaleString('en-US',{maximumFractionDigits:0});
   const child=target.querySelector?.('.jj-card-price,.jj-price-value,[data-price-value]');
   (child||target).textContent=text;
   (child||target).classList?.remove('is-request');
   card.dataset.price=String(price);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
