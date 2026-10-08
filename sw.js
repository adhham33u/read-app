const V='read-v2';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.hostname.endsWith('.supabase.co'))return; /* لا نخزّن أبدًا بيانات الحساب أو الـ API أو الملفات */
 if(r.mode==='navigate'){
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put('index.html',c));return res}).catch(()=>caches.match('index.html')));return}
 if(u.origin===location.origin||/(^|\.)jsdelivr\.net$|^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith(caches.open(V).then(async c=>{
   const hit=await c.match(r);
   const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>hit);
   return hit||net}))}
});
