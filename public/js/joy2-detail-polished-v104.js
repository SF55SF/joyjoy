/* JOY2_FINANCE_POLISHED_V104: presentation only; model and PDF unchanged */
(()=>{
 const ns='http://www.w3.org/2000/svg';
 const language=(document.documentElement.lang||'ru').toLowerCase();
 const ru=language.startsWith('ru');
 const fmt=n=>Math.round(Math.abs(n)).toLocaleString(ru?'ru-RU':'en-US');
 const label=n=>(n<0?'−':'')+fmt(n);
 const mk=(name,attrs={},txt)=>{const el=document.createElementNS(ns,name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(txt!==undefined)el.textContent=txt;return el;};
 function chart(drawer){
  const native=drawer.querySelector('.jj-rinv-flow-strip');
  const target=drawer.querySelector('.joy2-v90-chart');
  if(!native||!target)return;
  const amounts=[...native.querySelectorAll('.jj-rinv-year strong')].map(el=>{
   const s=(el.textContent||'').trim();
   const negative=/^\s*[−(-]/.test(s);
   const v=Number(s.replace(/[^\d]/g,''));
   return Number.isFinite(v)?(negative?-v:v):0;
  });
  if(amounts.length<2)return;
  const maxPositive=Math.max(1,...amounts),maxNegative=Math.max(0,...amounts.map(x=>-x));
  const W=920,x0=76,x1=897,y0=236,top=44,bottom=360,exp=.69;
  const positiveHeight=y0-top,negativeHeight=bottom-y0;
  const yFor=v=>v>=0?y0-positiveHeight*Math.pow(v/maxPositive,exp):y0+negativeHeight*Math.pow(-v/Math.max(1,maxNegative),exp);
  const svg=mk('svg',{viewBox:'0 0 920 411',class:'joy2-v93-svg joy2-v104-svg',role:'img','aria-label':native.getAttribute('aria-label')||'Денежные потоки по годам'});
  for(let i=0;i<=5;i++){
   const f=i/5,y=y0-positiveHeight*f,amount=maxPositive*Math.pow(f,1/exp);
   svg.appendChild(mk('line',{x1:x0,x2:x1,y1:y,y2:y,class:i?'axis-grid':'axis-zero'}));
   svg.appendChild(mk('text',{x:x0-14,y:y+5,'text-anchor':'end',class:'axis-tick'},label(amount)));
  }
  if(maxNegative>0){for(let i=1;i<=4;i++){
    const f=i/4,y=y0+negativeHeight*f,amount=-maxNegative*Math.pow(f,1/exp);
    svg.appendChild(mk('line',{x1:x0,x2:x1,y1:y,y2:y,class:'axis-grid'}));
    svg.appendChild(mk('text',{x:x0-14,y:y+5,'text-anchor':'end',class:'axis-tick'},label(amount)));
  }}
  const step=(x1-x0)/amounts.length;
  amounts.forEach((v,i)=>{
   const x=x0+(i+.5)*step,barWidth=Math.min(79,step*.83),barEnd=yFor(v),yy=v>=0?barEnd:y0,hh=Math.max(3,Math.abs(barEnd-y0));
   svg.appendChild(mk('rect',{x:x-barWidth/2,y:yy,width:barWidth,height:hh,rx:5,fill:'#c9ced4'}));
   const valueY=v>=0?Math.max(20,yy-10):Math.max(y0+21,Math.min(bottom-7,yy+hh*.56));
   svg.appendChild(mk('text',{x,y:valueY,'text-anchor':'middle',class:'bar-label'},label(v)));
   svg.appendChild(mk('text',{x,y:389,'text-anchor':'middle',class:'year-label'},(ru?'Год ':'Year ')+i));
   if(i===amounts.length-1)svg.appendChild(mk('text',{x,y:405,'text-anchor':'middle',class:'year-label'},ru?'(Выход)':'(Exit)'));
  });
  target.replaceChildren(svg);
 }
 function run(){
  document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v99-drawer').forEach(drawer=>{
   drawer.classList.add('joy2-v104-drawer');
   let heading=drawer.querySelector('.joy2-v104-heading');
   if(!heading){heading=document.createElement('h2');heading.className='joy2-v104-heading';drawer.prepend(heading);}
   heading.textContent=ru?'Инвестиционный расчёт':language.startsWith('uz')?'Investitsiya hisobi':'Investment analysis';
   const right=drawer.querySelector('.joy2-v93-right');
   const status=drawer.querySelector('.jj-rental-status-card');
   if(right&&status&&status.parentElement!==right)right.appendChild(status);
   chart(drawer);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0);});
})();