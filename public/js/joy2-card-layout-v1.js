/* JOY2_ARCA_CARD_STRUCTURE_V1: visual organization only; calculations untouched. */
(()=>{
  const init=()=>{
    const grid=document.querySelector('main.jj-ref-home #jj-results');
    if(!grid)return;
    const lang=(document.documentElement.lang||'ru').slice(0,2);
    const names={ru:{heading:'Статус объекта',existing:'Существующий',under_construction:'Строящийся',unknown:'Статус не указан',inv:'Инвестиционный расчёт'},uz:{heading:'Obyekt holati',existing:'Mavjud',under_construction:'Qurilmoqda',unknown:'Holat ko‘rsatilmagan',inv:'Investitsiya hisobi'},en:{heading:'Property status',existing:'Existing',under_construction:'Under construction',unknown:'Status not specified',inv:'Investment analysis'}}[lang]||{heading:'Property status',existing:'Existing',under_construction:'Under construction',unknown:'Status not specified',inv:'Investment analysis'};
    for(const card of grid.querySelectorAll('.jj-property-card')){
      if(card.dataset.jjClarityStructured==='1')continue;
      const main=card.querySelector('.jj-property-card-main');
      const summary=main?.querySelector('.jj-property-summary');
      const address=main?.querySelector('.jj-property-address');
      if(!main||!summary||!address)continue;
      const featureBox=document.createElement('div');featureBox.className='jj-cl-features';
      for(const el of [...main.querySelectorAll(':scope > .jj-card-feature')])featureBox.appendChild(el);
      summary.after(featureBox);
      const addressBox=document.createElement('div');addressBox.className='jj-cl-address';
      addressBox.appendChild(address);
      featureBox.after(addressBox);
      const bottom=document.createElement('div');bottom.className='jj-cl-bottom';
      const financial=main.querySelector('.jj-arca-inv');
      const investBadge=card.querySelector('.jj-invest-ribbon');
      if(financial){
        bottom.classList.add('is-investment');
        bottom.appendChild(financial);
      }else if(investBadge){
        bottom.classList.add('is-investment');
        const info=document.createElement('div');info.className='jj-cl-status jj-cl-invest-fallback';
        const label=document.createElement('span');label.className='jj-cl-status-label';label.textContent=names.inv;
        info.appendChild(label);bottom.appendChild(info);
      }else{
        bottom.classList.add('is-sale');
        const status=card.dataset.status||'';
        const value=status==='existing'?names.existing:status==='under_construction'?names.under_construction:names.unknown;
        const info=document.createElement('div');info.className='jj-cl-status';
        const label=document.createElement('span');label.className='jj-cl-status-label';label.textContent=names.heading;
        const result=document.createElement('strong');result.className='jj-cl-status-value';result.textContent=value;
        info.append(label,result);bottom.appendChild(info);
        card.classList.add('jj-cl-sale');
      }
      addressBox.after(bottom);
      card.dataset.jjClarityStructured='1';
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();