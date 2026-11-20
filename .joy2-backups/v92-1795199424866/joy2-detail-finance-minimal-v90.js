/* JOY2_DETAIL_FINANCE_MINIMAL_V90 – presentation-only, data/model/print unchanged */
(()=>{
  function formatChart(drawer){
    if(drawer.dataset.joy2V90==='1')return;
    const strip=drawer.querySelector('.jj-rinv-flow-strip');
    if(!strip)return;
    const years=[...strip.querySelectorAll('.jj-rinv-year')];
    if(years.length<2)return;
    const vals=years.map(y=>{
      let s=(y.querySelector('strong')?.textContent||'').replace(/\s|\u00a0|\u202f/g,'').replace(/[−–—]/g,'-').replace(',','.');
      const n=Number(s.replace(/[^0-9.\-]/g,''));
      return Number.isFinite(n)?n:0;
    });
    const maxPos=Math.max(1,...vals.filter(x=>x>0));
    const maxNeg=Math.max(1,...vals.filter(x=>x<0).map(x=>-x));
    const chart=document.createElement('div');chart.className='joy2-v90-chart';
    chart.setAttribute('role','img');chart.setAttribute('aria-label',strip.getAttribute('aria-label')||'Cash flows');
    chart.style.setProperty('--v90-years',String(years.length));
    const zero=document.createElement('div');zero.className='joy2-v90-zero';chart.append(zero);
    years.forEach((y,i)=>{
      const col=document.createElement('div');col.className='joy2-v90-col';
      const pos=vals[i]>=0;
      const label=document.createElement('span');label.className='joy2-v90-value';label.textContent=y.querySelector('strong')?.textContent||'—';
      const bar=document.createElement('span');bar.className='joy2-v90-bar '+(pos?'is-positive':'is-negative');
      const spanPercent=pos?Math.max(4,vals[i]/maxPos*88):Math.max(4,-vals[i]/maxNeg*75);
      bar.style.height=spanPercent+'%';
      const top=document.createElement('div');top.className='joy2-v90-positive-slot';
      const bottom=document.createElement('div');bottom.className='joy2-v90-negative-slot';
      (pos?top:bottom).append(bar);
      const year=document.createElement('span');year.className='joy2-v90-label';year.textContent=(y.querySelector('.jj-rinv-year-label')?.textContent||'').trim();
      col.append(top,bottom,label,year);chart.append(col);
    });
    strip.before(chart);
    drawer.dataset.joy2V90='1';
    // The existing cash-flow cells remain intact for the print/PDF engine.
  }
  const enhance=()=>document.querySelectorAll('.jj-detail .jj-unit-finance-drawer').forEach(formatChart);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance,{once:true});else enhance();
})();
