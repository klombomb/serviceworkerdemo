this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/serviceworkerdemo/',
        '/serviceworkerdemo/index.html',
        '/serviceworkerdemo/style.css',
        '/serviceworkerdemos/app.js',
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log(event);
});
