// JOY2_V241_WORKERS_API_ROUTER
// Reuse existing Pages Functions handlers in the Cloudflare Worker runtime.
import { verifySession } from '../functions/_auth.js';
import { onRequestPost as login } from '../functions/api/admin/login.js';
import { onRequestPost as logout } from '../functions/api/admin/logout.js';
import { onRequestGet as getProperties, onRequestPost as saveProperties, onRequestDelete as deleteProperty } from '../functions/api/admin/properties.js';
import { onRequestPost as uploadMedia } from '../functions/api/admin/property-media.js';
import { onRequestPost as translate } from '../functions/api/admin/translate.js';
import { onRequestGet as getFx } from '../functions/api/fx.js';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const routes={
 '/api/admin/login':{POST:login},
 '/api/admin/logout':{POST:logout},
 '/api/admin/properties':{GET:getProperties,POST:saveProperties,DELETE:deleteProperty},
 '/api/admin/property-media':{POST:uploadMedia},
 '/api/admin/translate':{POST:translate},
 '/api/fx':{GET:getFx},
};
const isAdmin=(path)=>path==='/admin'||path.startsWith('/admin/');
const isAdminApi=(path)=>path.startsWith('/api/admin/');
const isPublicAdminApi=(path)=>path==='/api/admin/login'||path==='/api/admin/logout';
const sameOrigin=(request,url)=>{const o=request.headers.get('origin');return !o||o===url.origin};

export default {
 async fetch(request,env,ctx){
  const url=new URL(request.url);
  // JOY2_V244_STAGE2_WWW: canonical redirect, only if www routes to this Worker.
  if(url.hostname.toLowerCase()==='www.joyjoy.uz'){const dest=new URL(url);dest.hostname='joyjoy.uz';return Response.redirect(dest.toString(),301);}
  const path=url.pathname.length>1&&url.pathname.endsWith('/')?url.pathname.slice(0,-1):url.pathname;
  // JOY2_V243_STAGE1: permanent redirect of deprecated project routes.
  const projectLanding=path==='/projects'?'/':path==='/uz/projects'?'/uz/':path==='/en/projects'?'/en/':null;
  if(projectLanding){
   const target=new URL(projectLanding,url);target.search='?investment=1';target.hash='#catalog';
   return Response.redirect(target.toString(),301);
  }
  const route=routes[path];
  if(route){
   if(!route[request.method])return json({error:'Method not allowed'},405);
   if(isAdminApi(path)&&!isPublicAdminApi(path)){
    if(!await verifySession(request,env))return json({error:'Authentication required'},401);
   }
   if(isAdminApi(path)&&request.method!=='GET'&&!sameOrigin(request,url))return json({error:'Origin mismatch'},403);
   // JOY2_V243_STAGE1: Cloudflare's managed, approximate per-location rate-limit binding.
   if(path==='/api/admin/login'&&request.method==='POST'){
    if(!env.ADMIN_LOGIN_LIMITER||typeof env.ADMIN_LOGIN_LIMITER.limit!=='function')
     return json({error:'Login protection is not configured in Cloudflare'},503);
    try{
     const key='joy2-login:'+String(request.headers.get('cf-connecting-ip')||'unknown');
     const decision=await env.ADMIN_LOGIN_LIMITER.limit({key});
     if(!decision.success)return new Response(JSON.stringify({error:'Слишком много попыток входа. Повторите через минуту.'}),{status:429,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','retry-after':'60'}});
    }catch(error){console.error('Login limiter unavailable',error);return json({error:'Login protection unavailable'},503);}
   }
   try{return await route[request.method]({request,env,params:{},data:{},waitUntil:ctx?.waitUntil?.bind(ctx)});}
   catch(error){console.error('Joy2 API route failed',path,error);return json({error:'Server error'},500);}
  }
  if(isAdminApi(path)||path.startsWith('/api/'))return json({error:'Unknown API endpoint'},404);
  if(isAdmin(path)){
   const session=await verifySession(request,env);
   if(!session){const loginUrl=new URL('/admin-login/',url);loginUrl.searchParams.set('next',path);return Response.redirect(loginUrl.toString(),302);}
   const response=await env.ASSETS.fetch(request);
   const headers=new Headers(response.headers);
   headers.set('Cache-Control','no-store');
   headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
   return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }
  return env.ASSETS.fetch(request);
 }
};
