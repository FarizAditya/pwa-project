var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = ["/", "./index.html", "./api.html", "./fallback.json", "./css/style.css", "./js/jquery.min.js", "./js/main.js", "./images/logo.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      // fichiers souhaités en cache
      staticCache.addAll(["./index.html", "./api.html", "./fallback.json", "./css/style.css", "./js/main.js", "./js/jquery.min.js"]);
      // fichiers à mettre impérativement en cache
      return staticCache.addAll(["./index.html", "./api.html", "./fallback.json", "./css/style.css", "./js/main.js", "./    js/jquery.min.js"]);
    })
  );
});

// Menyimpan cache dan mengembalikan permintaan
self.addEventListener("fetch", function (event) {
  var request = event.request;
  var url = new URL(request.url);

  // Memisahkan request API dan Internal
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(function (response) {
        return response || fetch(request);
      })
    );
  } else {
    event.respondWith(
      caches.open("project-cache").then(function (cache) {
        return fetch(request)
          .then(function (LiveResponse) {
            cache.put(request, LiveResponse.clone());
            return LiveResponse;
          })
          .catch(function () {
            return caches.match(request).then(function (response) {
              if (response) return response;
              return caches.match("/fallback.json");
            });
          });
      })
    );
  }
});
// update serviceworker
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            return cacheName != CACHE_NAME;
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
