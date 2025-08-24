const CACHE_NAME = 'sporjeger-v1';
const STATIC_CACHE_URLS = [
  '/sporjeger/',
  '/sporjeger/manifest.json'
];

const SHEETS_API_CACHE = 'sheets-api-cache';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME && cacheName !== SHEETS_API_CACHE)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache Google Sheets API responses
  if (url.hostname === 'sheets.googleapis.com') {
    event.respondWith(
      caches.open(SHEETS_API_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // Serve from cache but also fetch fresh data in background
            fetch(request)
              .then(freshResponse => {
                if (freshResponse.ok) {
                  cache.put(request, freshResponse.clone());
                }
              })
              .catch(() => {
                // Ignore fetch errors when updating cache
              });
            return response;
          }
          
          // Not in cache, fetch from network
          return fetch(request).then(response => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Return offline response if available
            return cache.match(request);
          });
        });
      })
    );
    return;
  }

  // For other requests, try cache first then network
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request);
        })
        .catch(() => {
          // Return offline page or cached content
          if (request.destination === 'document') {
            return caches.match('/sporjeger/');
          }
          return new Response('Offline', { status: 503 });
        })
    );
  }
});