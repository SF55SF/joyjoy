/* JOY2_V111 — One isolated layout and one data-driven chart. */
(()=>{
 const NS='http://www.w3.org/2000/svg';
 const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':'en-US';
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 const svgEl=(tag,props={},text)=>{const n=document.createElementNS(NS,tag);Object.entries(props).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n};
 const whole=n=>Math.round(Math.abs(n)).toLocaleString('ru-RU');
 const tick=n=>(n<0?'−':'')+whole(n);
 function valuesFrom(native){
  return [...native.querySelectorAll('.jj-rinv-year')].map(y=>{
   const raw=y.querySelector('[data-joy2-flow-value]')?.getAttribute('data-joy2-flow-value');
   if(raw!==null&&raw!==undefined&&Number.isFinite(Number(raw)))return Number(raw)/1000;
   const txt=y.querySelector('strong')?.textContent||'0';
   const neg=y.classList.contains('is-negative')||/^\s*[(−-]/.test(txt);
   const n=Number(txt.replace(/[^0-9,.]/g,'').replace(/[,.](?=\d{3}(?:\D|$))/g,'').replace(',','.'))||0;
   return neg?-n:n;
  });
 }
 function renderChart(native, target){
  const vals=valuesFrom(native); if(vals.length===0)return;
  const W=1000,H=440,L=85,R=987,TOP=42,BOTTOM=389;
  const pos=Math.max(0,...vals), neg=Math.max(0,...vals.map(v=>-v));
  const scaleBase=Math.max(pos,neg,1);const step=Math.pow(10,Math.floor(Math.log10(scaleBase)));
  const unit=step/2; const UP=Math.max(unit,Math.ceil((pos*1.08)/unit)*unit), DOWN=neg?Math.max(unit,Math.ceil((neg*1.08)/unit)*unit):0;
  const ky=(BOTTOM-TOP)/(UP+DOWN),y0=TOP+UP*ky, Y=v=>y0-v*ky;
  const svg=svgEl('svg',{viewBox:`0 0 ${W} ${H}`,preserveAspectRatio:'xMidYMid meet',class:'joy2-v111-svg',role:'img','aria-label':'Денежные потоки по годам'});
  for(let i=0;i<=4;i++){
   const v=UP*i/4,y=Y(v);
   svg.append(svgEl('line',{x1:L,x2:R,y1:y,y2:y,class:i===0?'zero':'gridline'}));
   svg.append(svgEl('text',{x:L-13,y:y+5,'text-anchor':'end',class:'tick'},tick(v)));
  }
  if(DOWN>0)for(let i=1;i<=4;i++){const v=-DOWN*i/4,y=Y(v);svg.append(svgEl('line',{x1:L,x2:R,y1:y,y2:y,class:'gridline'}));svg.append(svgEl('text',{x:L-13,y:y+5,'text-anchor':'end',class:'tick'},tick(v)));}
  const dx=(R-L)/vals.length;
  vals.forEach((v,i)=>{
   const cx=L+(i+.5)*dx,w=Math.min(76,dx*.73),vy=Y(v);
   const y=v>=0?vy:y0,h=Math.max(2,Math.abs(vy-y0));
   const special=i===0||i===vals.length-1;
   svg.append(svgEl('rect',{x:cx-w/2,y,width:w,height:h,rx:5,fill:special?'#192c4c':'#cbd1d9'}));
   const ty=v<0?Math.min(BOTTOM-11,y+h*.64):Math.max(23,y-9);
   svg.append(svgEl('text',{x:cx,y:ty,'text-anchor':'middle',class:v<0?'value negative':'value'},tick(v)));
   svg.append(svgEl('text',{x:cx,y:420,'text-anchor':'middle',class:'year'},'Год '+i));
   if(i===vals.length-1)svg.append(svgEl('text',{x:cx,y:436,'text-anchor':'middle',class:'year'},'(Выход)'));
  });
  target.replaceChildren(svg);
 }
 function money(kpis){
  [...kpis.querySelectorAll('strong')].forEach(strong=>{
   if((strong.parentElement?.querySelector('small')?.textContent||'').toUpperCase()==='IRR')return;
   const raw=strong.dataset.jjV100Value||strong.dataset.joy2Amount;
   if(raw!==undefined&&raw!==''&&Number.isFinite(+raw)){
    const n=Number(raw);strong.textContent=(n<0?'−':'')+'$'+(Math.abs(n)/1e6).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' млн';
    return;
   }
   const t=strong.textContent||'';
   const match=t.match(/^\s*([−-]?)\s*\$\s*([\d\s,.]+)\s*(млн|mln|m)\s*$/i);
   if(match){const n=Number(match[2].replace(/\s/g,'').replace(',','.'));if(Number.isFinite(n))strong.textContent=(match[1]?'−':'')+'$'+n.toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' млн';}
  });
 }
 function install(drawer){
  if(drawer.dataset.joy2V111Ready==='1')return;
  const kpis=drawer.querySelector('.jj-rinv-kpis'),native=drawer.querySelector('.jj-rinv-flow-strip'),inputs=drawer.querySelector('.jj-rinv-inputs'),footer=drawer.querySelector('.jj-rinv-footer');
  if(!kpis||!native||!inputs||!footer)return;
  drawer.dataset.joy2V111Ready='1';drawer.classList.add('joy2-v111');
  // Remove old version classes from this root: they own incompatible grid-area rules.
  [...drawer.classList].filter(c=>/^joy2-v\d+-(?:drawer|root)$/.test(c)).forEach(c=>drawer.classList.remove(c));
  const wrapper=el('div','joy2-v111-shell');
  const heading=el('h2','joy2-v111-title','Инвестиционный расчёт');
  const row=el('div','joy2-v111-grid');
  const left=el('section','joy2-v111-kpis'),center=el('section','joy2-v111-center'),right=el('aside','joy2-v111-right');
  const graph=el('div','joy2-v111-graph');
  const graphHead=el('div','joy2-v111-graph-head');graphHead.append(el('h3','', 'Денежные потоки по годам'),el('span','','тыс. $'));
  const chart=el('div','joy2-v111-chart');renderChart(native,chart);graph.append(graphHead,chart);
  // Original values and model stay in the original DOM; only their presentation is moved.
  const cards=[...kpis.children].filter(e=>e.nodeType===1);
  const find=re=>cards.find(c=>re.test(c.querySelector('small')?.textContent||''));
  [find(/IRR/i),find(/Цена покупки|Purchase|Sotib/i),find(/Цена продажи|Sale|Sotish/i),find(/Прогнозируемая|Profit|Foyda/i)].filter(Boolean).forEach(c=>kpis.append(c));
  left.append(kpis); money(kpis);
  const oldSide=inputs.closest('.joy2-v91-side');
  const param=el('section','joy2-v111-params');param.append(el('h3','','Исходные параметры'),inputs);right.append(param);
  const status=drawer.querySelector('.jj-rental-status-card');if(status){status.classList.add('joy2-v111-status');right.append(status);}
  const actions=el('div','joy2-v111-actions');
  let tax=drawer.querySelector('details.joy2-v93-tax');
  if(!tax){tax=el('details','joy2-v93-tax');tax.append(el('summary','', 'Допущения и налоги'));const notes=footer.querySelector('.jj-rinv-footer-notes');if(notes)tax.append(notes);}
  actions.append(tax);
  const pdf=footer.querySelector('[data-jj-investment-print]');if(pdf)actions.append(pdf);
  center.append(graph,actions);row.append(left,center,right);wrapper.append(heading,row);
  // Hide old wrappers but preserve native cashflow data and original button handlers.
  drawer.prepend(wrapper);
  [...drawer.children].filter(e=>e!==wrapper).forEach(e=>{e.classList.add('joy2-v111-legacy');});
  if(oldSide&&oldSide.isConnected&&oldSide!==param)oldSide.classList.add('joy2-v111-legacy');
 }
 const run=()=>document.querySelectorAll('.jj-detail .jj-unit-finance-drawer').forEach(install);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0)});
})();