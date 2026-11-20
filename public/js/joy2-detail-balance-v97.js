/* JOY2_KPI_GRAPH_BALANCE_V97 — read-only chart and DOM layout */
(()=>{
 const NS='http://www.w3.org/2000/svg';
 const mk=(tag,attrs={},txt)=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(txt!==undefined)el.textContent=txt;return el;};
 const lang=(document.documentElement.lang||'ru').startsWith('ru')?'ru':'en';
 const fmt=n=>Math.round(Math.abs(n)).toLocaleString(lang==='ru'?'ru-RU':'en-US');
 const label=n=>(n<0?'−':'')+fmt(n);
 function build(drawer){
  const main=drawer.querySelector('.joy2-v91-main'),kpis=main?.querySelector('.jj-rinv-kpis'),head=main?.querySelector('.joy2-v93-chart-head'),chart=main?.querySelector('.joy2-v90-chart'),native=main?.querySelector('.jj-rinv-flow-strip');
  if(!main||!kpis||!head||!chart||!native)return;
  drawer.classList.add('joy2-v97-drawer');
  let body=main.querySelector('.joy2-v97-body');
  if(!body){body=document.createElement('div');body.className='joy2-v97-body';const graph=document.createElement('div');graph.className='joy2-v97-chart-area';kpis.before(body);body.append(kpis,graph);graph.append(head,chart);}
  const vals=[...native.querySelectorAll('.jj-rinv-year strong')].map(el=>{const s=(el.textContent||'').trim();const neg=/^\s*\(/.test(s)||/^\s*[−-]/.test(s);const amount=Number(s.replace(/[^0-9]/g,''));return Number.isFinite(amount)?(neg?-amount:amount):0;});
  if(!vals.length)return;
  const maxPos=Math.max(0,...vals),maxNeg=Math.max(0,...vals.map(x=>-x));
  // Adapt the full scale to each unit; gently compress the exit year so yearly rentals stay visible.
  // All labels remain the genuine cash-flow values. Axis ticks use the inverse of the exact scale.
  const exponent=.60,top=20,zero=165,bottom=250,left=71,right=879;
  const yp=v=>zero-(maxPos?Math.pow(Math.max(0,v)/maxPos,exponent)*(zero-top):0);
  const yn=v=>zero+(maxNeg?Math.pow(Math.max(0,-v)/maxNeg,exponent)*(bottom-zero):0);
  const Y=v=>v<0?yn(v):yp(v);
  const svg=mk('svg',{viewBox:'0 0 900 292',class:'joy2-v93-svg joy2-v97-svg',role:'img','aria-label':native.getAttribute('aria-label')||'Денежные потоки по годам'});
  for(let i=0;i<=4;i++){
    const y=zero-i*(zero-top)/4;
    svg.append(mk('line',{x1:left,x2:right,y1:y,y2:y,class:i===0?'axis-zero':'axis-grid'}));
    svg.append(mk('text',{x:60,y:y+4,'text-anchor':'end',class:'axis-tick'},label(maxPos*Math.pow(i/4,1/exponent))));
  }
  if(maxNeg>0){for(let i=1;i<=2;i++){const y=zero+i*(bottom-zero)/2;svg.append(mk('line',{x1:left,x2:right,y1:y,y2:y,class:'axis-grid'}));svg.append(mk('text',{x:60,y:y+4,'text-anchor':'end',class:'axis-tick'},label(-maxNeg*Math.pow(i/2,1/exponent))));}}
  const step=(right-left)/vals.length;
  vals.forEach((v,i)=>{
    const x=left+(i+.5)*step,w=Math.min(65,step*.76),barY=Y(v),h=Math.max(4,Math.abs(barY-zero)),y=v>=0?zero-h:zero;
    svg.append(mk('rect',{x:x-w/2,y,width:w,height:h,rx:4,fill:'#c6cbd0'}));
    let labelY=v>=0?Math.max(16,y-7):Math.min(bottom-4,y+h/2+4);
    svg.append(mk('text',{x,y:labelY,'text-anchor':'middle',class:'bar-label'},label(v)));
    svg.append(mk('text',{x,y:268,'text-anchor':'middle',class:'year-label'},(lang==='ru'?'Год ':'Year ')+i));
    if(i===vals.length-1)svg.append(mk('text',{x,y:281,'text-anchor':'middle',class:'year-label'},lang==='ru'?'(Выход)':'(Exit)'));
  });
  chart.replaceChildren(svg);
 }
 function run(){document.querySelectorAll('.jj-detail .joy2-v93-drawer').forEach(build);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0);});
})();
