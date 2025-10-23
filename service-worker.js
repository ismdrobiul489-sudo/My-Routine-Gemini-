const CACHE_NAME = 'my-routine-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/components/Header.tsx',
  '/components/DaySelector.tsx',
  '/components/RoutineTable.tsx',
  '/components/DopamineChecklist.tsx',
  '/components/SideMenu.tsx',
  '/components/ReflectionModal.tsx',
  '/components/TimePicker.tsx',
  // You will need to create these icon files in an /icons/ directory
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add core app shell files. External resources will be cached on first fetch.
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Use a "Stale-While-Revalidate" strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If the fetch is successful, update the cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
            // The fetch failed, likely due to being offline.
            // If we have a cached response, we've already returned it.
            // If not, this will propagate the error.
            console.warn('Fetch failed; user is likely offline.', err);
        });

        // Return the cached response immediately if it exists,
        // and let the fetch happen in the background.
        return cachedResponse || fetchPromise;
      });
    })
  );
});