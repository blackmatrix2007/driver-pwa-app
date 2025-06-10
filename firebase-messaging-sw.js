importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification?.title || 'Chuyến xe mới';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có chuyến xe mới cần xác nhận',
    icon: '/td.png',
    badge: '/td.png',
    data: {
      shipmentId: payload.data?.shipmentId,
      url: payload.data?.url || '/',
      click_action: payload.data?.click_action || '/',
      ...payload.data
    },
    actions: [
      {
        action: 'view',
        title: 'Xem chi tiết'
      },
      {
        action: 'dismiss',
        title: 'Đóng'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'shipment-notification'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked: ', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const shipmentId = event.notification.data?.shipmentId;
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Tìm tab đã mở ứng dụng
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin)) {
            // Focus và gửi message để navigate
            client.focus();
            client.postMessage({
              type: 'NAVIGATE_TO_SHIPMENT',
              shipmentId: shipmentId
            });
            return;
          }
        }
        // Mở tab mới nếu chưa có
        return clients.openWindow(urlToOpen);
      })
  );
});