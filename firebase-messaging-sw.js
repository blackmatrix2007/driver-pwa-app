// Simple Firebase Messaging Service Worker for GitHub Pages
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCE9Hd2YKQn-xgEsObxq_y9eMMWH8HvE8",
    authDomain: "trongduan-16f32.firebaseapp.com",
    projectId: "trongduan-16f32",
    storageBucket: "trongduan-16f32.firebasestorage.app",
    messagingSenderId: "655745416209",
    appId: "1:655745416209:web:c60a7cbec954b0c6f105b0",
    measurementId: "G-5W1R2GBPXY"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification?.title || payload.data?.title || 'Thông báo mới';
    const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'Có thông báo mới từ ứng dụng',
        icon: payload.notification?.icon || payload.data?.icon || '/icon.png',
        badge: '/badge.png',
        tag: payload.data?.tag || 'default',
        data: payload.data || {},
        requireInteraction: true,
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        actions: [
            {
                action: 'open',
                title: 'Mở ứng dụng'
            },
            {
                action: 'dismiss',
                title: 'Đóng'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        // Open the app
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If no window is open, open a new one
                if (clients.openWindow) {
                    const urlToOpen = event.notification.data?.url || '/';
                    return clients.openWindow(urlToOpen);
                }
            })
        );
    }
    // 'dismiss' action just closes the notification (already done above)
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event);
    // You can track notification dismissals here if needed
});