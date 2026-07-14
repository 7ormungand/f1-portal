const CACHE_NAME = 'f1-cache-v2';
const ASSETS = [
  './',                 
  'index.html',          
  'css/style.css',       
  'js/scripts.js',      
  'manifest.json',      
  'img/Logo-F1.svg',     
  'news/',              
  'news/index.html',    
  'results/',            
  'results/index.html',  
  'drivers/',            
  'drivers/index.html',  
  'reviews/',            
  'reviews/index.html',  
  'todolist/',           
  'todolist/index.html' 
];

// кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

//  удаление старого кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  let request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin && !url.pathname.match(/\.[A-Za-z0-9]+$/)) 
    if (!url.pathname.endsWith('/')) {
      request = new Request(url.pathname + '/index.html');
    } else {
      request = new Request(url.pathname + 'index.html');
    }
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
