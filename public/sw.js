const CACHE_NAME='ecofleet-v1';const urlsToCache=['/','/login','/upload','/reports','/vehicles','/company','/billing'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(urlsToCache)))});
self.addEventListener('fetch',event=>{event.respondWith(caches.match(event.request).then(response=>response||fetch(event.request)))});
