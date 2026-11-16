// Cache in the browser, optionally also in Cloudflare KV via /api/fx.
const storageKey='joyjoy:last-valid-usd-uzs';
let promise;
const valid=d=>d&&Number.isFinite(d.usdUzs)&&d.usdUzs>0&&Number.isFinite(d.annualDevaluation)&&d.annualDevaluation>-100&&d.annualDevaluation<=100;
export function lastFx(){try{const d=JSON.parse(localStorage.getItem(storageKey)||'null');return valid(d)?d:null;}catch{return null;}}
// JOYJOY_ADMIN_FX_PREPARED_V1
export function loadFx({force=false}={}){if(force)promise=null;if(promise)return promise;promise=(async()=>{
 let cached=lastFx();
 try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),11000);let response;try{response=await fetch('/api/fx',{cache:'no-store',signal:ctl.signal});}finally{clearTimeout(t);}
 if(!response.ok)throw Error('CBU request unavailable');const data=await response.json();if(!valid(data))throw Error('Invalid currency data');
 try{localStorage.setItem(storageKey,JSON.stringify(data));}catch{}
 return data;
 }catch{return cached?{...cached,stale:true,unavailable:true}:null;}
 })();return promise;}
