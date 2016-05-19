this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/serviceworkerdemo/',
        '/serviceworkerdemo/index.html',
        '/serviceworkerdemo/style.css',
        '/serviceworkerdemo/app.js',
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log(event);
});

this.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found response in cache:', response);

        return response;
      }
      console.log('No response found in cache. About to fetch from network...');

      return fetch(event.request).then(function(response) {
        console.log('Response from network is:', response);

        return response;
      }).catch(function(error) {
        console.error('Fetching failed:', error);

        throw error;
      });
    })
  );
});