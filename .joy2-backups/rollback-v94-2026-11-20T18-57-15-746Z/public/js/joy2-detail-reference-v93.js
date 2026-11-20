/* JOY2_CHART_V94: per-property domain + separate labeled operational trend */
(()=>{
 const NS='http://www.w3.org/2000/svg';
 const node=(tag,attrs={},content)=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(content!=null)el.textContent=content;return el;};
 const lng=(document.documentElement.lang||'ru').slice(0,2),ru=lng==='ru',locale=ru?'ru-RU':'en-US';
 const nice=n=>Math.round(Math.abs(n)).toLocaleString(locale);
 function setup(drawer){
  const chart=drawer.querySelector('.joy2-v90-chart'),strip=drawer.querySelector('.jj-rinv-flow-strip');
  if(!chart||!strip)return;
  const cells=[...strip.querySelectorAll('.jj-rinv-year')];if(!cells.length)return;
  const values=cells.map(cell=>{
   const raw=(cell.querySelector('strong')?.textContent||'').trim();
   const clean=raw.replace(/[\s\u00a0\u202f]/g,'').replace(/[−–—]/g,'-');
   const numeric=Number(clean.replace(/[^\d.,-]/g,'').replace(',','.'));
   return Number.isFinite(numeric)?numeric*(/^\(/.test(clean)?-1:1):0;
  });
  const positive=values.filter(v=>v>0),negative=values.filter(v=>v<0),
        min=Math.min(0,...negative),max=Math.max(0,...positive);
  const magnitude=Math.max(Math.abs(min),Math.abs(max),1);
  const wantedStep=magnitude/2.5,exp=10**Math.floor(Math.log10(wantedStep));
  const step=[1,2,2.5,5,10].map(f=>f*exp).find(n=>n>=wantedStep)||10*exp;
  const low=Math.floor(min/step)*step,high=Math.ceil(max/step)*step;
  const lo=low===0?-step:low,hi=high===0?step:high;
  const left=66,right=873,top=22,bottom=157,baseline=top+hi/(hi-lo)*(bottom-top);
  const Y=v=>top+(hi-v)/(hi-lo)*(bottom-top);
  const svg=node('svg',{viewBox:'0 0 900 218',class:'joy2-v93-svg joy2-v94-svg',role:'img','aria-label':strip.getAttribute('aria-label')||'Annual cash flows'});
  for(let v=lo,cnt=0;v<=hi+step*.01&&cnt<12;v+=step,cnt++){
   const y=Y(v);svg.append(node('line',{x1:left,x2:right,y1:y,y2:y,class:Math.abs(v)<step*.01?'axis-zero':'axis-grid'}));
   svg.append(node('text',{x:56,y:y+3,'text-anchor':'end',class:'axis-tick'},(v<0?'−':'')+nice(v)));
  }
  const w=(right-left)/values.length;
  const minVisible=6;
  values.forEach((val,i)=>{
    const x=left+w*(i+.5),barW=Math.min(50,w*.60),trueY=Y(val);
    const height=Math.max(minVisible,Math.abs(trueY-baseline));
    const y=val<0?baseline:baseline-height;
    svg.append(node('rect',{x:x-barW/2,y,width:barW,height,rx:4,fill:'#c6cbd0'}));
    const label=val<0?'−'+nice(val):nice(val);
    const labelY=val>=0?Math.max(12,y-6):Math.min(183,baseline+height+12);
    svg.append(node('text',{x,y:labelY,'text-anchor':'middle',class:'bar-label'},label));
    svg.append(node('text',{x,y:191,'text-anchor':'middle',class:'year-label'},(ru?'Год ':'Year ')+i));
    if(i===values.length-1)svg.append(node('text',{x,y:204,'text-anchor':'middle',class:'year-label'},ru?'(Выход)':'(Exit)'));
  });
  // Detail inset has its own labeled vertical scale: keeps subtle yearly changes visible.
  const ops=values.slice(1,-1);
  if(ops.length>=2){
    const minOp=Math.min(...ops),maxOp=Math.max(...ops);
    if(maxOp>minOp){
      const a=22,b=147,x1=left+w*1.5,x2=left+w*(values.length-1.5);
      const opY=v=>b-(v-minOp)/(maxOp-minOp)*(b-a);
      // Subtle separate trend in its own legend, not falsely sharing the bar scale.
      const path=ops.map((v,i)=>(i?'L':'M')+(left+w*(i+1.5)).toFixed(1)+','+opY(v).toFixed(1)).join(' ');
      svg.append(node('path',{d:path,fill:'none',stroke:'#58616b','stroke-width':1.5,'stroke-dasharray':'3 4',opacity:'.67'}));
      ops.forEach((v,i)=>svg.append(node('circle',{cx:left+w*(i+1.5),cy:opY(v),r:2.5,fill:'#58616b'})));
      const lbl=node('text',{x:right,y:216,'text-anchor':'end',class:'year-label'},ru?'Пунктир: динамика ежегодных поступлений (отдельная шкала)':'Dotted: annual operating trend (separate scale)');
      svg.append(lbl);
    }
  }
  chart.replaceChildren(svg);drawer.dataset.joy2V94='1';
 }
 const run=()=>document.querySelectorAll('.jj-detail .joy2-v93-drawer').forEach(setup);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
