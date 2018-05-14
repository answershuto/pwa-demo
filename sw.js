const cacheName = 'pwa-demo1'

const cacheList = [
    '/',
    'index.html',
    'index.css',
    'icon.png'
]

self.addEventListener('install', (e) => {
    console.log('install')
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('add all caches')
            return cache.addAll(cacheList)
        })
        .then(() => {
            return self.skipWaiting()
        })
    )
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
        Promise.all(
            caches.keys().then(cacheNames => {
              return cacheNames.map(name => {
                name !== cacheName && caches.delete(name)
              })
            })
          ).then(() => {
            return self.clients.claim()
          })
    )
})

self.addEventListener('fetch', (e) => {
    e.respondWith(
      caches.match(e.request).then((response) => {
        if (response != null) {
          console.log('use cache:', e.request.url)
          return response
        }
        console.log('fetch:', e.request.url)
        return fetch(e.request.url)
      })
    )
  })
  