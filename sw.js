const CACHE_NAME = 'f1-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/scripts.js',
  '/manifest.json',
  '/img/Logo-F1.svg',       
  '/img/fia.svg',           
  '/img/f1_tv.svg',
  '/news/index.html',      
  '/results/index.html',  
  '/drivers/index.html',   
  '/reviews/index.html',   
  '/todolist/index.html'
];

// Установка сервис-воркера и кэширование ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Активация и удаление старого кэша
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


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      
      return Promise.all(
        ASSETS.map((url) => {
          return cache.add(url).catch((err) => {
            console.error(`Не удалось загрузить в кэш: ${url}`, err);
          });
        })
      );
    })
  );
});
