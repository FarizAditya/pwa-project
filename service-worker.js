var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = ["/", "./index.html", "./api.html", "./fallback.json", "./css/style.css", "./js/jquery.min.js", "./js/main.js", "./images/logo.png"];

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  prefetch: "prefetch-cache-v" + CACHE_VERSION,
};

self.addEventListener("install", function (event) {
  var urlsToPrefetch = ["./index.html", "./api.html", "./css/style.css", "./images/logo.png"];

  console.log("Handling install event. Resources to pre-fetch:", urlsToPrefetch);

  event.waitUntil(
    caches
      .open(CURRENT_CACHES["prefetch"])
      .then(function (cache) {
        return cache
          .addAll(
            urlsToPrefetch.map(function (urlToPrefetch) {
              return new Request(urlToPrefetch, { mode: "no-cors" });
            })
          )
          .then(function () {
            console.log("All resources have been fetched and cached.");
          });
      })
      .catch(function (error) {
        console.error("Pre-fetching failed:", error);
      })
  );
});

// Menyimpan cache dan mengembalikan permintaan
self.addEventListener("fetch", function (event) {
  event.respondWith(
    (async function () {
      try {
        var res = await fetch(event.request);
        var cache = await caches.open("cache");
        cache.put(event.request.url, res.clone());
        return res;
      } catch (error) {
        return caches.match(event.request);
      }
    })()
  );
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
