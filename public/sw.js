/**
 * Service Worker for Sporjeger PWA
 * Provides offline functionality and caching
 * iOS 26 + Modern Browser Compatible
 */

const CACHE_VERSION = 'sporjeger-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/sporjeger/',
  '/sporjeger/index.html',
  '/sporjeger/manifest.json',
  '/sporjeger/icon-192.png',
  '/sporjeger/icon-512.png',
];

// Maximum cache size for dynamic content
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_API_CACHE_SIZE = 20;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('sporjeger-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== API_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle Google Sheets API requests
  if (url.hostname === 'sheets.googleapis.com') {
    event.respondWith(
      cacheFirstWithRefresh(request, API_CACHE, MAX_API_CACHE_SIZE)
    );
    return;
  }

  // Handle Google Fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      cacheFirst(request, STATIC_CACHE)
    );
    return;
  }

  // Handle app assets
  if (url.pathname.startsWith('/sporjeger/')) {
    event.respondWith(
      cacheFirst(request, STATIC_CACHE)
        .catch(() => fetch(request))
        .catch(() => caches.match('/sporjeger/index.html'))
    );
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(
    networkFirst(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE)
  );
});

/**
 * Cache-first strategy
 * Use cached response if available, otherwise fetch from network
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  const cache = await caches.open(cacheName);
  cache.put(request, response.clone());
  return response;
}

/**
 * Network-first strategy
 * Try network first, fallback to cache if offline
 */
async function networkFirst(request, cacheName, maxSize) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());

    // Limit cache size
    limitCacheSize(cacheName, maxSize);

    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Cache-first with background refresh
 * Serve from cache immediately, update cache in background
 */
async function cacheFirstWithRefresh(request, cacheName, maxSize) {
  const cached = await caches.match(request);

  // Fetch fresh data in background
  const fetchPromise = fetch(request).then((response) => {
    const cache = caches.open(cacheName);
    cache.then((c) => {
      c.put(request, response.clone());
      limitCacheSize(cacheName, maxSize);
    });
    return response;
  });

  // Return cached data immediately, or wait for fetch
  return cached || fetchPromise;
}

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map((key) => cache.delete(key)));
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});
