const CACHE_NAME = 'ryze-v6.1-mobile';
const STATIC_CACHE = 'ryze-static-v6.1';
const RUNTIME_CACHE = 'ryze-runtime-v6.1';
const MEDIA_CACHE = 'ryze-media-v6.1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

const staticAssets = [
  '/assets/index.css',
  '/assets/vendor.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Enhanced fetch handler with mobile optimization
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API calls: NetworkFirst with fallback to cache
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request, { timeout: 5000 })
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Offline: return cached response or error message
          return caches.match(request) || new Response(
            JSON.stringify({ error: 'Offline - Using Cache', status: 503 }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Static assets: CacheFirst for performance
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          const cache = caches.open(STATIC_CACHE);
          cache.then(c => c.put(request, response.clone()));
          return response;
        });
      })
    );
    return;
  }

  // Images/Media: CacheFirst with size limits for mobile
  if (request.destination === 'image' || request.destination === 'media') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(response => {
          // Only cache images under 1MB for mobile
          if (response.headers.get('content-length') < 1048576) {
            const cache = caches.open(MEDIA_CACHE);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: CacheFirst for HTML/other
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});

self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.message || 'RYZE Alert',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      data: { url: data.url || '/' }
    };
    event.waitUntil(
      self.registration.showNotification('RYZE Alert', options)
    );
  } catch (err) {
    console.log('Push notification error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'PRECACHE') {
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache));
  }
});
