// USD/UZS official CBU reference rates. Optional Cloudflare KV binding: JOYJOY_FX_KV.
const HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=3600'};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:HEADERS});
const key='joyjoy:fx:usd-uzs:five-years';
function tashkentDate(){const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tashkent',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const x=Object.fromEntries(p.map(v=>[v.type,v.value]));return x.year+'-'+x.month+'-'+x.day;}
function anniversary(today,yearsBack){const [y,m,d]=today.split('-').map(Number);const last=new Date(Date.UTC(y-yearsBack,m,0)).getUTCDate();return [y-yearsBack,String(m).padStart(2,'0'),String(Math.min(d,last)).padStart(2,'0')].join('-');}
async function rate(requestDate,signal){const url='https://cbu.uz/ru/arkhiv-kursov-valyut/json/USD/'+(requestDate?requestDate+'/':'');const r=await fetch(url,{signal,headers:{Accept:'application/json'}});if(!r.ok)throw Error('CBU '+r.status);const data=await r.json();const item=Array.isArray(data)?data.find(x=>x.Ccy==='USD'):null;const n=Number(String(item?.Rate??'').replace(',','.'))/Number(item?.Nominal||1);if(!Number.isFinite(n)||n<1000||n>1000000)throw Error('Invalid CBU rate');return {value:n,date:item.Date||requestDate||''};}
export async function onRequestGet({env}){
 let old=null;try{if(env.JOYJOY_FX_KV)old=await env.JOYJOY_FX_KV.get(key,'json');}catch{}
 const today=tashkentDate();
 if(old?.day===today&&Number.isFinite(old.usdUzs)&&Number.isFinite(old.annualDevaluation))return json({...old,stale:false});
 const ctl=new AbortController();const timeout=setTimeout(()=>ctl.abort(),9000);
 try{
  // Six anniversary exchange-rate observations give five annual percentage changes.
  const dates=Array.from({length:6},(_,i)=>anniversary(today,i));
  const [latest,...years]=await Promise.all([rate(null,ctl.signal),...dates.map(d=>rate(d,ctl.signal))]);
  const rates=years.map(x=>x.value);
  const annualRates=Array.from({length:5},(_,i)=>(rates[i]/rates[i+1]-1)*100);
  const annualDevaluation=annualRates.reduce((a,b)=>a+b,0)/5;
  if(!Number.isFinite(annualDevaluation)||annualDevaluation<=-100||annualDevaluation>100)throw Error('Invalid historical devaluation');
  const fresh={usdUzs:latest.value,rateDate:latest.date,annualDevaluation,annualRates,observationDates:dates,day:today,calculatedAt:new Date().toISOString(),source:'CBU Uzbekistan'};
  try{if(env.JOYJOY_FX_KV)await env.JOYJOY_FX_KV.put(key,JSON.stringify(fresh));}catch{}
  return json({...fresh,stale:false});
 }catch(error){if(old?.usdUzs>0&&Number.isFinite(old.annualDevaluation))return json({...old,stale:true});return json({error:'CBU unavailable; no previously saved exchange rate'},503);}finally{clearTimeout(timeout);}
}
