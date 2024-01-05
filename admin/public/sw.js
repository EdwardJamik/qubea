// let cacheData = "appV1";
// this.addEventListener("install", (event) => {
//     event.waitUntil(
//         caches.open(cacheData).then((cache) => {
//             cache.addAll([
//                 "/manifest.webmanifest",
//                 "/main.js",
//                 "/index.html",
//                 "/",
//             ]);
//         })
//     );
// });
//
// this.addEventListener("fetch", (event) => {
//     console.log("url", event.request.url);
//     if (!navigator.onLine) {
//         if (event.request.url === "http://localhost:3000/manifest.json") {
//             event.waitUntil(
//                 this.registration.showNotification("Internet", {
//                     body: "Internet not working",
//                 })
//             );
//         }
//
//         event.respondWith(
//             caches.match(event.request).then((resp) => {
//                 if (resp) {
//                     return resp;
//                 }
//                 let requestURL = event.request.clone();
//                 fetch(requestURL);
//             })
//         );
//     }
// });