/* JOY2_REFERENCE_107: layout stabilization and honest linear cashflow; no model mutations */
(()=>{
 const NS='http://www.w3.org/2000/svg';
 const lang=(document.documentElement.lang||'ru').toLowerCase();
 const ru=lang.startsWith('ru');
 const locale=ru?'ru-RU':lang.startsWith('uz')?'uz-UZ':'en-US';
 const suffix=ru?'млн':lang.startsWith('uz')?'mln':'m';
 const fInt=n=>Math.round(Math.abs(n)).toLocaleString(ru?'ru-RU':'en-US');
 const fAxis=n=>(n<0?'−':'')+fInt(n);
 const mk=(tag,attrs={},txt)=>{const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,String(v));if(txt!==undefined)el.textContent=txt;return el;};
 const fMoney=n=>(n<0?'−':'')+'$'+(Math.abs(n)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' '+suffix;
 function getValues(native){
  return [...native.querySelectorAll('.jj-rinv-year strong')].map(el=>{
   const raw=(el.textContent||'').trim();
   const neg=raw.startsWith('(')||raw.startsWith('-')||raw.startsWith('−');
   const digits=raw.replace(/[^\d]/g,'');
   const n=Number(digits);
   return Number.isFinite(n)?(neg?-n:n):0;
  });
 }
 function renderChart(drawer){
  const chart=drawer.querySelector('.joy2-v90-chart');
  const native=drawer.querySelector('.jj-rinv-flow-strip');
  if(!chart||!native)return;
  const values=getValues(native);
  if(values.length<2)return;
  const maxP=Math.max(0,...values),maxN=Math.max(0,...values.map(v=>-v));
  if(maxP<=0&&maxN<=0)return;
  const W=1000,H=430,left=82,right=984,top=34,bottom=378;
  // Linear, zero-anchored, truthful scale. Both signs use the same pixels per dollar.
  const maxAbs=Math.max(maxP,maxN,1);
  const step=Math.pow(10,Math.floor(Math.log10(maxAbs)));
  const nice=Math.ceil(maxAbs/step*2)/2*step;
  const up=Math.max(step,Math.ceil(maxP/(nice/4))*(nice/4));
  const down=maxN?Math.max(step,Math.ceil(maxN/(nice/4))*(nice/4)):0;
  const usable=bottom-top;
  const ppu=usable/(up+down);
  const y0=top+up*ppu;
  const yFor=v=>y0-v*ppu;
  const svg=mk('svg',{viewBox:'0 0 '+W+' '+H,class:'joy2-v107-svg joy2-v93-svg',role:'img','aria-label':native.getAttribute('aria-label')||'Денежные потоки по годам',preserveAspectRatio:'none'});
  const axisCount=5;
  for(let i=0;i<=axisCount;i++){
   const val=up*i/axisCount,y=yFor(val);
   svg.append(mk('line',{x1:left,x2:right,y1:y,y2:y,class:i===0?'axis-zero':'axis-grid'}));
   svg.append(mk('text',{x:left-12,y:y+5,'text-anchor':'end',class:'axis-tick'},fAxis(val)));
  }
  if(down>0){for(let i=1;i<=4;i++){
   const val=-down*i/4,y=yFor(val);
   svg.append(mk('line',{x1:left,x2:right,y1:y,y2:y,class:'axis-grid'}));
   svg.append(mk('text',{x:left-12,y:y+5,'text-anchor':'end',class:'axis-tick'},fAxis(val)));
  }}
  const barStep=(right-left)/values.length;
  for(let i=0;i<values.length;i++){
   const v=values[i],x=left+(i+.5)*barStep,w=Math.min(78,barStep*.80);
   const vY=yFor(v),h=Math.max(2,Math.abs(vY-y0)),barY=v>=0?vY:y0;
   const paint=i===0||i===values.length-1?'#182c50':'#cbd1d9';
   svg.append(mk('rect',{x:x-w/2,y:barY,width:w,height:h,rx:5,fill:paint}));
   let valueY,labelClass='bar-label';
   if(v<0){valueY=Math.min(bottom-7,y0+Math.max(21,h*.67));labelClass+=' inverse';}
   else{valueY=Math.max(top+6,barY-10);}
   svg.append(mk('text',{x,y:valueY,'text-anchor':'middle',class:labelClass},fAxis(v)));
   svg.append(mk('text',{x,y:406,'text-anchor':'middle',class:'year-label'},(ru?'Год ':'Year ')+i));
   if(i===values.length-1)svg.append(mk('text',{x,y:423,'text-anchor':'middle',class:'year-label'},ru?'(Выход)':'(Exit)'));
  }
  chart.replaceChildren(svg);
 }
 function enhance(drawer){
  if(!drawer)return;
  const main=drawer.querySelector('.joy2-v91-main');
  const body=main?.querySelector('.joy2-v97-body');
  const kpis=main?.querySelector('.jj-rinv-kpis');
  const chartArea=main?.querySelector('.joy2-v97-chart-area');
  const right=drawer.querySelector('.joy2-v93-right');
  if(!main||!body||!kpis||!chartArea||!right)return;
  drawer.classList.add('joy2-v107-drawer');
  let title=drawer.querySelector('.joy2-v104-heading');
  if(!title){title=document.createElement('h2');title.className='joy2-v104-heading';drawer.prepend(title);}
  title.textContent=ru?'Инвестиционный расчёт':lang.startsWith('uz')?'Investitsiya hisobi':'Investment analysis';
  if(title.parentElement!==drawer)drawer.prepend(title);
  if(kpis.parentElement!==body)body.prepend(kpis);
  let stack=main.querySelector('.joy2-v99-chart-stack');
  if(!stack){stack=document.createElement('div');stack.className='joy2-v99-chart-stack';chartArea.before(stack);}
  if(chartArea.parentElement!==stack)stack.prepend(chartArea);
  const under=drawer.querySelector('.joy2-v98-underchart');if(under&&under.parentElement!==stack)stack.append(under);
  if(stack.parentElement!==body)body.append(stack);
  const status=drawer.querySelector('.jj-rental-status-card');if(status&&status.parentElement!==right)right.append(status);
  const arr=[...kpis.children].filter(e=>e.nodeType===1);
  const match=q=>arr.find(e=>q.test(e.querySelector('small')?.textContent||''));
  const ordering=[match(/IRR/i),match(/Цена покупки|Purchase price|Sotib/i),match(/Цена продажи|Sale price|Sotish/i),match(/Прогнозируемая|Profit|Foyda/i)];
  if(ordering.every(Boolean))ordering.forEach(e=>kpis.append(e));
  kpis.querySelectorAll('strong[data-jj-v100-value]').forEach(el=>{
   const raw=el.getAttribute('data-jj-v100-value');
   const n=Number(raw);if(raw!==null&&raw.trim()!==''&&Number.isFinite(n))el.textContent=fMoney(n);
  });
  renderChart(drawer);
 }
 function run(){document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v93-drawer').forEach(enhance);}
 const schedule=()=>{setTimeout(run,80);setTimeout(run,350);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]')){setTimeout(run,100);setTimeout(run,500);}});
})();