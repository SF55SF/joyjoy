/* JOY2_COMPACT_EXACT_MILLIONS_V112 — format from numeric Astro source, never rounded display */
(()=>{
 const locale=(document.documentElement.lang||'ru').toLowerCase().startsWith('ru')?'ru-RU':'en-US';
 function fix(){
  document.querySelectorAll('.joy2-v111-kpis .jj-rinv-kpis > div').forEach(card=>{
   const label=(card.querySelector('small')?.textContent||'').trim();
   if(label.toUpperCase()==='IRR')return;
   const strong=card.querySelector('strong');
   if(!strong)return;
   let raw=strong.getAttribute('data-joy2-usd-v112');
   if(raw===null)raw=strong.getAttribute('data-jj-v100-value');
   if(raw===null)raw=strong.getAttribute('data-joy2-amount');
   if(raw!==null&&raw!==''&&Number.isFinite(Number(raw))){
    const amount=Number(raw);
    strong.textContent=(amount<0?'−':'')+'$'+(Math.abs(amount)/1000000).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' млн';
   }else{
    const t=strong.textContent||'';
    const m=t.match(/^\s*([−-]?)\s*\$\s*([\d\s.,]+)\s*(?:млн|mln|m)\s*$/i);
    if(m){const n=Number(m[2].replace(/\s/g,'').replace(',','.'));if(Number.isFinite(n))strong.textContent=(m[1]?'−':'')+'$'+n.toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})+' млн';}
   }
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fix,{once:true});else fix();
 document.addEventListener('click',e=>{if(e.target.closest('[data-jj-unit-select]'))setTimeout(fix,60);});
})();