self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.webmanifest',
                '/qubea.svg',
                '/icon-48x48.png',
                '/icon-72x72.png',
                '/icon-96x96.png',
                '/icon-128x128.png',
                '/icon-144x144.png',
                '/icon-152x152.png',
                '/icon-192x192.png',
                '/icon-384x384.png',
                '/icon-512x512.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    // Обробка кліку на сповіщення
    event.notification.close();
    // Додайте додаткову логіку, яку ви хочете виконати при кліку
});

self.addEventListener('notificationclose', (event) => {
    // Обробка закриття сповіщення без кліку
    // Додайте додаткову логіку, яку ви хочете виконати при закритті
});

// Реєстрація Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Запит дозволу на сповіщення
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            } else {
                console.warn('Notification permission denied');
            }
        });
    }).catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
}
