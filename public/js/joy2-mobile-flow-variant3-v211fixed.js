/* JOY2 V211 FIX: mobile cash flow format 3, from live underlying model. */
(()=>{
 'use strict';
 const mq=window.matchMedia('(max-width: 780px)');
 const lang=(document.documentElement.lang||'ru').slice(0,2);
 const labels={ru:['Покупка · Год 0','Выход · Год 8','Ежегодные поступления','Год'],uz:['Xarid · 0-yil','Chiqish · 8-yil','Yillik tushumlar','Yil'],en:['Purchase · Year 0','Exit · Year 8','Annual cash flows','Year']}[lang]||['Purchase · Year 0','Exit · Year 8','Annual cash flows','Year'];
 const locale=lang==='ru'?'ru-RU':'en-US';
 const format=n=>(n<0?'−':n>0?'+':'')+Math.round(Math.abs(n)).toLocaleString(locale);
 function readValue(row){
   const node=row.querySelector('[data-joy2-flow-value]');const raw=node?.getAttribute('data-joy2-flow-value');
   if(raw!=null&&raw.trim()!==''&&Number.isFinite(Number(raw)))return Number(raw)/1000;
   const txt=row.querySelector('strong')?.textContent||'0';
   const neg=row.classList.contains('is-negative')||/^[\s(−-]/.test(txt);
   const v=Number(txt.replace(/[^0-9,.]/g,'').replace(/[,.](?=\d{3}(?:\D|$))/g,'').replace(',','.'))||0;
   return neg?-v:v;
 }
 function install(drawer){
  if(!mq.matches)return;
  const graph=drawer.querySelector('.joy2-v111-graph');
  const flow=drawer.querySelector('.jj-rinv-flow-strip');
  if(!graph||!flow)return;
  const rows=[...flow.querySelectorAll('.jj-rinv-year')];
  if(rows.length<3)return;
  const vals=rows.map(readValue);
  const signature=vals.join('|');
  if(drawer.dataset.joy2V211Fixed===signature)return;
  let wrap=graph.querySelector('.joy2-v211-fixed');
  if(!wrap){
   wrap=document.createElement('div');wrap.className='joy2-v211-fixed';
   graph.appendChild(wrap);
  }
  wrap.replaceChildren();
  const major=document.createElement('div');major.className='joy2-v211-fixed-major';
  [[0,'buy',labels[0]],[vals.length-1,'exit',labels[1]]].forEach(([i,kind,label])=>{
   const card=document.createElement('div');card.className='joy2-v211-fixed-card is-'+kind;
   const caption=document.createElement('span');caption.className='joy2-v211-fixed-label';caption.textContent=label;
   const value=document.createElement('strong');value.textContent=format(vals[i]);
   card.append(caption,value);major.appendChild(card);
  });
  const section=document.createElement('div');section.className='joy2-v211-fixed-subtitle';section.textContent=labels[2];
  const years=document.createElement('div');years.className='joy2-v211-fixed-years';
  vals.slice(1,-1).forEach((n,j)=>{
   const tile=document.createElement('div');tile.className='joy2-v211-fixed-year';
   const title=document.createElement('span');title.textContent=labels[3]+' '+(j+1);
   const amount=document.createElement('strong');amount.textContent=format(n);
   tile.append(title,amount);years.append(tile);
  });
  wrap.append(major,section,years);
  drawer.dataset.joy2V211Fixed=signature;
 }
 function run(){if(mq.matches)document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v111').forEach(install)}
 let pending=false;
 function schedule(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;run()})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 function start(){run();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0)});
 mq.addEventListener?.('change',schedule);
})();