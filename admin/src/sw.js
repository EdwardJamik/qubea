// export default function swDev() {
//     function urlBase64ToUint8Array(base64String) {
//         const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//         const base64 = (base64String + padding)
//             .replace(/\-/g, "+")
//             .replace(/_/g, "/");
//
//         const rawData = window.atob(base64);
//         const outputArray = new Uint8Array(rawData.length);
//
//         for (let i = 0; i < rawData.length; ++i) {
//             outputArray[i] = rawData.charCodeAt(i);
//         }
//         return outputArray;
//     }
//
//     function determineAppServerKey() {
//         const vapidPublicKey =
//             "BJjiKLISnJg2MOAzy0HrmQWQEzMUkVhqK--HZQt7iOQxp5NrB1JKnJihmx0MN5Z_Fcuv_phKal4xab3YFD8f82w";
//         return urlBase64ToUint8Array(vapidPublicKey);
//     }
//
//     let swURL = `https://77c4-37-54-4-171.ngrok-free.app/sw.js`;
//     if (navigator&&navigator.serviceWorker.controller) {
//
//         console.log("Active service worker found");
//     } else {
//         console.log('tut')
//         navigator.serviceWorker.register("sw.js", { scope: "./"}).then(
//             function (reg) {
//                 console.log("Service worker registered");
//             }
//         );
//     }
//     // navigator.serviceWorker.register(swURL).then((resp) => {
//     //     console.warn("resp", resp);
//     //
//     //     return resp.pushManager.getSubscription().then((subscription) => {
//     //         resp.pushManager.subscribe({
//     //             userVisibleOnly: true,
//     //             applicationServerKey: determineAppServerKey(),
//     //         });
//     //     });
//     // });
// }