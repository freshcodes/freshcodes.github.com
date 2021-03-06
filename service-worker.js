'use strict';

const version = 'v5'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(version).then((cache) => {
    return cache.addAll([
      '/',
      '/assets/fresh-codes.svg',
      '/components/fc-fish/fc-fish.js',
      '/components/fc-fish/fc-fish.css',
      '/components/fc-fish-scene/fc-fish-scene.js',
      '/components/fc-fish-scene/fc-fish-scene.css',
      '/components/fc-fish-scene/fc-fish-scene-controller.js',
      '/components/fc-fish-scene/fc-fish-scene-fish-controller.js',
      '/components/fc-draw/fc-draw-brush-color.js',
      '/components/fc-draw/fc-draw-brush-size.js',
      '/components/fc-draw/fc-draw-cursor.js',
      '/components/fc-draw/fc-draw.js',
      '/components/fc-draw/fc-draw.css',
      '/components/fc-contact-form/fc-contact-form.js',
      '/components/fc-contact-form/fc-contact-form.css'
    ])
  }))
})

self.addEventListener('fetch', (event) => {
  // pass on non-get based requests
  if (event.request.method !== 'GET') return

  event.respondWith(caches.match(event.request).then(cached => {
    let networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve)
    return cached || networked
  }))

  function fetchedFromNetwork (response) {
    var cacheCopy = response.clone()
    caches.open(version).then(cache => cache.put(event.request, cacheCopy))
    return response
  }

  function unableToResolve () {
    return new Response('<h1>Service Unavailable</h1>', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/html'
      })
    })
  }
})

// remove older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys
      .filter(key => !key.startsWith(version))
      .map(key => caches.delete(key))
    )
  }))
})
