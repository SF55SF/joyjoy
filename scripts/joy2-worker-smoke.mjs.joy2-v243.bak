// JOY2_V241_WORKERS_SMOKE
import assert from 'node:assert/strict';
import handler from '../worker/index.js';
const fetch=(path,method='GET',headers={})=>handler.fetch(new Request('https://joyjoy.uz'+path,{method,headers}),{ASSETS:{fetch:async()=>new Response('STATIC', {status:200})}},{});
const unauthorized=await fetch('/api/admin/properties');
assert.equal(unauthorized.status,401);
assert.match(await unauthorized.text(),/Authentication required/);
const login=await fetch('/api/admin/login','POST',{'content-type':'application/json'});
assert.equal(login.status,500);
assert.match(await login.text(),/ADMIN_USERS/);
const protectedPage=await fetch('/admin/');
assert.equal(protectedPage.status,302);
assert.match(protectedPage.headers.get('location'),/\/admin-login\/\?next=/);
const asset=await fetch('/');
assert.equal(await asset.text(),'STATIC');
const missing=await fetch('/api/admin/unrecognized');
assert.equal(missing.status,404);
console.log('JOY2 V241 WORKER API SMOKE OK');
