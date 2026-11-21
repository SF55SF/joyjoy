/* JOY2 V205: mobile year cash-flow cards sourced from the native model. */
(()=>{
 'use strict';
 const mq=window.matchMedia('(max-width: 780px)');
 const locale=(document.documentElement.lang||'ru').startsWith('ru')?'ru-RU':'en-US';
 const lang=(document.documentElement.lang||'ru').slice(0,2);
 const lex={ru:{year:'Год',exit:'Выход',units:'тыс. $'},uz:{year:'Yil',exit:'Chiqish',units:'ming $'},en:{year:'Year',exit:'Exit',units:'USD th.'}}[lang]||{year:'Year',exit:'Exit',units:'USD th.'};
 const format=n=>(n<0?'−':n>0?'+':'')+Math.round(Math.abs(n)).toLocaleString(locale);
 function readValue(y){
  const val=y.querySelector('[data-joy2-flow-value]');
  const raw=val&&val.getAttribute('data-joy2-flow-value');
  if(raw!==null&&raw!==undefined&&raw.trim()!==''&&Number.isFinite(Number(raw)))return Number(raw)/1000;
  const str=(y.querySelector('strong')?.textContent||'0').trim();
  const negative=y.classList.contains('is-negative')||/^[\s(−-]/.test(str);
  let value=str.replace(/[^\d,.]/g,'').replace(/\s/g,'');
  if(/[,\.]\d{3}$/.test(value))value=value.replace(/[,.]/g,'');
  else value=value.replace(',','.');
  const n=Number(value)||0;return negative?-n:n;
 }
 function install(drawer){
  if(!mq.matches || drawer.dataset.joy2V205Ready==='1')return;
  const host=drawer.querySelector('.joy2-v111-graph');
  if(!host)return;
  const flow=drawer.querySelector('.jj-rinv-flow-strip');
  const rows=flow?[...flow.querySelectorAll('.jj-rinv-year')]:[];
  if(!rows.length)return;
  const tiles=document.createElement('div');tiles.className='joy2-v205-years';
  tiles.setAttribute('role','list');tiles.setAttribute('aria-label',host.querySelector('h3')?.textContent||'Cash flows by year');
  rows.forEach((r,i)=>{
   const v=readValue(r),last=i===rows.length-1;
   const tile=document.createElement('div');tile.className='joy2-v205-year'+(i===0?' is-buy':'')+(last?' is-exit':'');tile.setAttribute('role','listitem');
   const label=document.createElement('span');label.className='joy2-v205-year-label';label.textContent=lex.year+' '+i+(last?' · '+lex.exit:'');
   const amount=document.createElement('strong');amount.className='joy2-v205-year-value';amount.textContent=format(v);
   tile.append(label,amount);tiles.append(tile);
  });
  host.append(tiles);drawer.dataset.joy2V205Ready='1';
 }
 let queued=false;
 function run(){if(!mq.matches)return;document.querySelectorAll('.jj-detail .jj-unit-finance-drawer.joy2-v111').forEach(install)}
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;run()})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{run();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})},{once:true});
 else {run();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true})}
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(run,0)});
 mq.addEventListener?.('change',schedule);
})();
