const CACHE_NAME = 'sporjeger-v2';
const STATIC_CACHE_URLS = [
  '/sporjeger/',
  '/sporjeger/manifest.json'
];

const SHEETS_API_CACHE = 'sheets-api-cache-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // iOS Safari sometimes fails on addAll, try individually
        return Promise.allSettled(
          STATIC_CACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn('Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .catch(err => {
        console.error('Cache installation error:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName =>
              cacheName !== CACHE_NAME &&
              cacheName !== SHEETS_API_CACHE
            )
            .map(cacheName =>
              caches.delete(cacheName).catch(err => {
                console.warn('Failed to delete cache:', cacheName, err);
                return null;
              })
            )
        );
      })
      .catch(err => {
        console.error('Cache activation error:', err);
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }

  try {
    const url = new URL(request.url);

    // Cache Google Sheets API responses with better error handling for iOS
    if (url.hostname === 'sheets.googleapis.com') {
      event.respondWith(
        caches.open(SHEETS_API_CACHE)
          .then(cache => {
            return cache.match(request)
              .then(response => {
                if (response) {
                  // Serve from cache but also fetch fresh data in background
                  fetch(request)
                    .then(freshResponse => {
                      if (freshResponse && freshResponse.ok) {
                        cache.put(request, freshResponse.clone()).catch(err => {
                          console.warn('Failed to update cache:', err);
                        });
                      }
                    })
                    .catch(() => {
                      // Silently fail background updates
                    });
                  return response;
                }

                // Not in cache, fetch from network
                return fetch(request)
                  .then(response => {
                    if (response && response.ok) {
                      cache.put(request, response.clone()).catch(err => {
                        console.warn('Failed to cache response:', err);
                      });
                    }
                    return response;
                  })
                  .catch(err => {
                    console.error('Network fetch failed:', err);
                    // Try to return cached response even if it doesn't exist
                    return cache.match(request).then(cached =>
                      cached || new Response('Network error', { status: 503 })
                    );
                  });
              })
              .catch(err => {
                console.error('Cache match failed:', err);
                return fetch(request);
              });
          })
          .catch(err => {
            console.error('Failed to open cache:', err);
            return fetch(request);
          })
      );
      return;
    }

    // For other requests, try network first (better for iOS)
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then(response => {
            // Cache successful responses
            if (response && response.ok && url.origin === self.location.origin) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone()).catch(err => {
                  console.warn('Failed to cache:', err);
                });
              }).catch(() => {
                // Silently fail cache operations
              });
            }
            return response;
          })
          .catch(() => {
            // If network fails, try cache
            return caches.match(request).then(response => {
              if (response) {
                return response;
              }
              // Return offline page for document requests
              if (request.destination === 'document') {
                return caches.match('/sporjeger/').then(cached =>
                  cached || new Response('Offline', { status: 503 })
                );
              }
              return new Response('Offline', { status: 503 });
            });
          })
      );
    }
  } catch (err) {
    console.error('Service worker fetch error:', err);
    // Fallback: just fetch normally
    event.respondWith(fetch(request));
  }
});
