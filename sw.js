const CACHE_NAME = 'f1-cache-v6';
const ASSETS = [
  '/',
  'index.html',
  'css/style.css',
  'js/scripts.js',
  'manifest.json',
  'img/Logo-F1.svg',       
  'img/fia.svg',           
  'img/f1_tv.svg',
  'news/index.html',       
  'results/index.html',   
  'drivers/index.html',   
  'reviews/index.html',    
  'todolist/index.html'
];

// кэширование
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// удаление старого кэша
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
      // Кэшируем файлы по одному, чтобы увидеть, на каком именно происходит сбой
      return Promise.all(
        ASSETS.map((url) => {
          return cache.add(url).catch((err) => {
            console.error('Не удалось кэшировать файл:', url, err);
          });
        })
      );
    })
  );
});
