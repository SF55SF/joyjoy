import {verifySession} from '../../_auth.js';
import {validateProperty,propertyErrorMessage} from '../../../public/js/joyjoy-investment-model.js';
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const slugOK=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)&&s.length<=100;
const decode=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g,'')),c=>c.charCodeAt(0)));
const encode=s=>{let b='';for(const n of new TextEncoder().encode(s))b+=String.fromCharCode(n);return btoa(b);};
function settings(env){
 const repo=env.JOYJOY_GITHUB_REPO||'SF55SF/joyjoy',branch=env.JOYJOY_GITHUB_BRANCH||'main',token=env.JOYJOY_GITHUB_TOKEN||env.GITHUB_TOKEN;
 if(repo.toLowerCase()!=='sf55sf/joyjoy'||branch!=='main')throw Error('Для кабинета JoyJoy нужны SF55SF/joyjoy и ветка main. Проверьте JOYJOY_GITHUB_REPO / JOYJOY_GITHUB_BRANCH.');
 if(!token)throw Error('Настройте JOYJOY_GITHUB_TOKEN (или GITHUB_TOKEN) с доступом Contents: read/write к SF55SF/joyjoy.');
 return {repo,branch,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+token,'User-Agent':'joyjoy-admin','X-GitHub-Api-Version':'2022-11-28'}};
}
const base=c=>'https://api.github.com/repos/'+c.repo+'/contents/src/content/properties';
async function authorized(request,env){return !!await verifySession(request,env);}
export async function onRequestGet({request,env}){
 if(!await authorized(request,env))return reply({error:'Authentication required'},401);
 let c;try{c=settings(env);}catch(e){return reply({error:e.message},503);}
 const slug=new URL(request.url).searchParams.get('slug');
 if(slug!==null&&!slugOK(slug))return reply({error:'Недопустимый адрес объекта'},400);
 try{
  const res=await fetch(base(c)+(slug?'/'+slug+'.json':'')+'?ref='+c.branch,{headers:c.headers});
  if(!res.ok)return reply({error:res.status===404?'Объект не найден':'Не удалось прочитать данные из GitHub',status:res.status},res.status===404?404:502);
  const body=await res.json();
  if(!slug){
   if(!Array.isArray(body))throw Error('Invalid collection');
   const names=body.filter(x=>x.type==='file'&&x.name.endsWith('.json')&&slugOK(x.name.slice(0,-5))).map(x=>x.name.slice(0,-5)),items=[];
   for(let offset=0;offset<names.length;offset+=5)items.push(...await Promise.all(names.slice(offset,offset+5).map(async name=>{const r=await fetch(base(c)+'/'+name+'.json?ref='+c.branch,{headers:c.headers});if(!r.ok)throw Error('Property read failed');const file=await r.json(),p=JSON.parse(decode(file.content));return {slug:name,title:p.title,city:p.city,order:p.order??0};})));
   items.sort((a,b)=>a.order-b.order||a.slug.localeCompare(b.slug));return reply({items});
  }
  const property=JSON.parse(decode(body.content));
  return reply({property,sha:body.sha});
 }catch{return reply({error:'Ошибка чтения данных. Проверьте доступ GitHub и формат объекта.'},502);}
}
export async function onRequestPost({request,env}){
 if(!await authorized(request,env))return reply({error:'Authentication required'},401);
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Origin mismatch'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Expected application/json'},415);
 let raw;try{raw=await request.text();}catch{return reply({error:'Не удалось прочитать запрос'},400);}
 if(raw.length>200000)return reply({error:'Слишком большой объект'},413);
 let payload;try{payload=JSON.parse(raw);}catch{return reply({error:'Неверный JSON'},400);}
 if(!payload||typeof payload!=='object')return reply({error:'Неверный запрос'},400);
 const p=payload.property,errors=validateProperty(p);
 if(errors.length)return reply({error:propertyErrorMessage(errors)},400);
 if(!slugOK(payload.slug)||payload.slug!==p.slug)return reply({error:'Адрес объекта не совпадает'},400);
 if(payload.create!==true&&!/^[a-f0-9]{40}$/.test(payload.sha||''))return reply({error:'Сначала загрузите текущую версию объекта'},400);
 let c;try{c=settings(env);}catch(e){return reply({error:e.message},503);}
 try{
  const url=base(c)+'/'+p.slug+'.json',current=await fetch(url+'?ref='+c.branch,{headers:c.headers});
  if(payload.create===true&&current.ok)return reply({error:'Такой адрес уже существует'},409);
  if(!current.ok&&!(payload.create===true&&current.status===404))return reply({error:'Не удалось проверить текущую версию объекта'},502);
  const file=current.ok?await current.json():null;
  if(file&&file.sha!==payload.sha)return reply({error:'Объект изменён в другом окне. Скопируйте свои правки и загрузите объект заново.'},409);
  // Merge unknown top-level fields from the current object rather than discarding them.
  const previous=file?JSON.parse(decode(file.content)):{};
  const property={...previous,...p,slug:payload.slug};
  const validation=validateProperty(property);if(validation.length)return reply({error:propertyErrorMessage(validation)},400);
  const content=JSON.stringify(property,null,2)+'\n';
  if(file&&decode(file.content).replace(/\r\n/g,'\n')===content)return reply({ok:true,unchanged:true,sha:file.sha});
  const saved=await fetch(url,{method:'PUT',headers:{...c.headers,'content-type':'application/json'},body:JSON.stringify({message:(file?'Update':'Create')+' JoyJoy property '+p.slug,content:encode(content),branch:c.branch,...(file?{sha:file.sha}:{})})});
  if(!saved.ok)return reply({error:saved.status===409?'Конфликт сохранения. Загрузите актуальную версию.':'GitHub отклонил сохранение',status:saved.status},saved.status===409?409:502);
  const result=await saved.json();return reply({ok:true,sha:result.content.sha,commit:result.commit.sha});
 }catch{return reply({error:'Ошибка соединения с GitHub. Перед повтором загрузите объект и проверьте, сохранился ли он.'},502);}
}
