this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/servicewrokerdemo/',
        '/servicewrokerdemo/index.html',
        '/servicewrokerdemo/style.css',
        '/servicewrokerdemo/app.js',
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log(event);
});
