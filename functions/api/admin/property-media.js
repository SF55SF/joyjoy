import {verifySession} from '../../_auth.js';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const slugOK=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)&&s.length<=100;
export async function onRequestPost({request,env}){
 if(!await verifySession(request,env))return json({error:'Authentication required'},401);
 const repo=env.JOYJOY_GITHUB_REPO||'SF55SF/joyjoy',branch=env.JOYJOY_GITHUB_BRANCH||'main',token=env.JOYJOY_GITHUB_TOKEN||env.GITHUB_TOKEN;
 if(repo.toLowerCase()!=='sf55sf/joyjoy'||branch!=='main'||!token)return json({error:'Joy² GitHub settings not configured'},503);
 let payload;try{payload=await request.json()}catch{return json({error:'Некорректный JSON'},400)}
 const slug=payload?.slug,url=payload?.dataUrl;
 if(!slugOK(slug)||typeof url!=='string'||!url.startsWith('data:image/jpeg;base64,'))return json({error:'Некорректные данные фотографии'},400);
 const b64=url.slice('data:image/jpeg;base64,'.length);if(b64.length>6500000)return json({error:'Изображение слишком большое'},413);
 let bytes;try{const b=atob(b64);bytes=Uint8Array.from(b,ch=>ch.charCodeAt(0))}catch{return json({error:'Некорректное изображение'},400)}
 if(bytes.length<4||bytes[0]!==0xff||bytes[1]!==0xd8||bytes[bytes.length-2]!==0xff||bytes[bytes.length-1]!==0xd9)return json({error:'Файл не является JPEG'},400);
 const headers={Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'User-Agent':'joyjoy-admin','X-GitHub-Api-Version':'2022-11-28'};
 // Only upload for an already existing Joy² property; do not leak files to old Trilliant repository.
 const item=await fetch('https://api.github.com/repos/'+repo+'/contents/src/content/properties/'+slug+'.json?ref='+branch,{headers});
 if(!item.ok)return json({error:'Сначала сохраните объект в Joy²'},item.status===404?404:502);
 const name='public/images/joyjoy/'+slug+'-'+crypto.randomUUID()+'.jpg';
 const res=await fetch('https://api.github.com/repos/'+repo+'/contents/'+name,{method:'PUT',headers:{...headers,'content-type':'application/json'},body:JSON.stringify({message:'Add Joy2 photo for '+slug,content:b64,branch})});
 if(!res.ok)return json({error:'Не удалось сохранить фотографию в GitHub',status:res.status},502);
 return json({ok:true,path:'/'+name.slice('public/'.length)});
}
