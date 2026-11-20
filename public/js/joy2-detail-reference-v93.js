/* JOY2_REFERENCE_CHART_V93: uses existing native cash flows, does not change calculations or PDF */
(()=>{
 const NS='http://www.w3.org/2000/svg';
 function makeSvgNode(tag,attributes={},body=''){
   const node=document.createElementNS(NS,tag);
   for(const [k,v] of Object.entries(attributes))node.setAttribute(k,String(v));
   if(body)node.textContent=body;
   return node;
 }
 function setup(drawer){
  if(drawer.dataset.joy2V93==='1')return;
  const chart=drawer.querySelector('.joy2-v90-chart');
  const strip=drawer.querySelector('.jj-rinv-flow-strip');
  if(!chart||!strip)return;
  const cells=[...strip.querySelectorAll('.jj-rinv-year')];if(!cells.length)return;
  const values=cells.map(cell=>{
    const raw=(cell.querySelector('strong')?.textContent||'').trim();
    const clean=raw.replace(/\s|\u00a0|\u202f/g,'').replace(/[−–—]/g,'-').replace(',','.');
    const parsed=Number(clean.replace(/[^\d.\-]/g,''));
    return Number.isFinite(parsed)?parsed*(/^\(/.test(clean)?-1:1):0;
  });
  const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':'en-US';
  const nice=n=>Math.round(Math.abs(n)).toLocaleString(locale);
  const max=Math.max(12000,...values.filter(v=>v>0));
  const min=Math.min(-8000,...values.filter(v=>v<0));
  const low=Math.floor(min/4000)*4000,high=Math.ceil(max/4000)*4000;
  const svg=makeSvgNode('svg',{viewBox:'0 0 900 240',class:'joy2-v93-svg',role:'img','aria-label':strip.getAttribute('aria-label')||'Годовые денежные потоки'});
  const top=12,bottom=207,zero=top+(high/(high-low))*(bottom-top),left=73,right=884;
  const yy=v=>top+(high-v)/(high-low)*(bottom-top);
  for(let value=low;value<=high;value+=4000){
    const y=yy(value);svg.append(makeSvgNode('line',{x1:left,x2:right,y1:y,y2:y,class:value===0?'axis-zero':'axis-grid'}));
    svg.append(makeSvgNode('text',{x:61,y:y+4,'text-anchor':'end',class:'axis-tick'},value<0?'−'+nice(value):nice(value)));
  }
  const step=(right-left)/values.length;
  values.forEach((value,i)=>{
    const x=left+step*i+step/2,w=Math.min(57,step*.68);
    const y=value>=0?yy(value):zero;
    const height=Math.max(3,Math.abs(yy(value)-zero));
    svg.append(makeSvgNode('rect',{x:x-w/2,y,width:w,height,rx:5,fill:'#c9cdd1'}));
    const number=value<0?'−'+nice(value):nice(value);
    svg.append(makeSvgNode('text',{x,y:value>=0?y-7:Math.min(bottom-8,y+height/2+4),'text-anchor':'middle',class:'bar-label'},number));
    svg.append(makeSvgNode('text',{x,y:224,'text-anchor':'middle',class:'year-label'},(document.documentElement.lang||'ru').startsWith('ru')?'Год '+i:'Year '+i));
    if(i===values.length-1)svg.append(makeSvgNode('text',{x,y:238,'text-anchor':'middle',class:'year-label'},(document.documentElement.lang||'ru').startsWith('ru')?'(Выход)':'(Exit)'));
  });
  chart.replaceChildren(svg);
  drawer.dataset.joy2V93='1';
 }
 const run=()=>document.querySelectorAll('.jj-detail .joy2-v93-drawer').forEach(setup);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();