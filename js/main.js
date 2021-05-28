$(document).ready(function () {
  // // mengambil dari api yang telah di buat
  var _url = "https://my-json-server.typicode.com/FarizAditya/pwa-project/univ";

  var dataResults = "";
  var catResults = "";
  var categories = [];
  // render pages
  function renderPage(data) {
    $.each(data, function (key, items) {
      _cat = items.job;

      dataResults += "<div>" + "<h3>" + items.name + "</h3>" + "<p>" + _cat + "</p>";

      ("<div>");

      if ($.inArray(_cat, categories) == -1) {
        categories.push(_cat);
        catResults += "<option value '" + _cat + "'>" + _cat + "</option>";
      }
    });

    $("#products").html(dataResults);
    $("#cat_select").html("<option value='all'>all</option>" + catResults);
  }

  var networkDataReceived = false;

  //fresh data dari online
  var networkUpdate = fetch(_url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      networkDataReceived = true;
      renderPage(data);
    });

  // Mengembalikan data dari cache
  caches
    .match(_url)
    .then(function (response) {
      if (!response) throw Error("Tidak ada Data di Cache");
      return response.json();
    })
    .then(function (data) {
      if (!networkDataReceived) {
        renderPage(data);
        console.log("render data dari cache");
      }
    })
    .catch(function () {
      return networkUpdate;
    });

  // function filter

  $("#cat_select").on("change", function () {
    updateProduct($(this).val());
  });

  function updateProduct(cat) {
    var dataResults = "";
    var _newUrl = _url;

    if (cat != "all") _newUrl = _url + "?job=" + cat;

    $.get(_newUrl, function (data) {
      $.each(data, function (key, items) {
        _cat = items.job;

        dataResults += "<div>" + "<h3>" + items.name + "</h3>" + "<p>" + _cat + "</p>";

        ("<div>");
      });

      $("#products").html(dataResults);
    });
  }
});
//register serviceworker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").then(
      function (registration) {
        // Registration was successful
        console.log("ServiceWorker registration successful with scope: ", registration.scope);
      },
      function (err) {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}
