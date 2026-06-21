const CACHE_NAME = 'nexvy-app-v2.6.2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/input_file_0.png'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell static assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Delete old caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Caching Strategy: Cache First for static, Network-First for main assets/APIs with graceful offline fallback)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Bypass Appwrite and other dynamic API endpoints from standard service caching to prevent transaction conflicts
  if (
    url.pathname.startsWith('/api') || 
    url.hostname.includes('appwrite') || 
    url.href.includes('cloud.appwrite.io') ||
    e.request.method !== 'GET'
  ) {
    return; // Let the browser handle standard dynamic network operations
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache, but fetch fresh in the background for assets
        fetch(e.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => { /* Ignore background fetch failures while offline */ });

        return cachedResponse;
      }

      // Fallback to network
      return fetch(e.request)
        .then((networkResponse) => {
          // Cache successful GET requests for any static assets/images encountered
          if (
            networkResponse && 
            networkResponse.status === 200 && 
            (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|json)$/) || url.pathname === '/')
          ) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
          }
          return networkResponse;
        })
        .catch(() => {
          // For HTML navigation requests while fully offline, serve the main index.html (App Shell)
          if (e.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline content unavailable.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
    })
  );
});
