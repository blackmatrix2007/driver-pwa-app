// === 1. Cập nhật firebase-messaging-sw.js ===
// File: public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js')

// Initialize app
const app = firebase.initializeApp({
    apiKey: "AIzaSyBCE9Hd2YKQn-xgEsObxq_y9eMMWH8HvE8",
    authDomain: "trongduan-16f32.firebaseapp.com",
    projectId: "trongduan-16f32",
    storageBucket: "trongduan-16f32.firebasestorage.app",
    messagingSenderId: "655745416209",
    appId: "1:655745416209:web:c60a7cbec954b0c6f105b0",
    measurementId: "G-5W1R2GBPXY"
})

// Initialize messaging
const messaging = firebase.messaging()

// Listen to background messages
messaging.onBackgroundMessage(payload => {
    console.log("Received background message: ", payload);

    const title = payload.notification?.title || payload.data?.title || 'Thông báo mới';
    const options = {
        body: payload.notification?.body || payload.data?.body || 'Có thông báo mới từ ứng dụng',
        icon: payload.notification?.icon || payload.data?.icon || '/icon.png',
        badge: '/badge.png',
        tag: payload.data?.tag || 'general',
        data: payload.data || {},
        actions: [
            {
                action: 'view',
                title: 'Xem chi tiết',
                icon: '/view-icon.png'
            },
            {
                action: 'dismiss',
                title: 'Đóng',
                icon: '/close-icon.png'
            }
        ],
        requireInteraction: true,
        vibrate: [200, 100, 200],
        timestamp: Date.now()
    };

    // Show notification
    self.registration.showNotification(title, options);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        // Open specific page based on notification data
        const urlToOpen = event.notification.data.url || '/';
        event.waitUntil(
            clients.openWindow(urlToOpen)
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default click action - open the app
        event.waitUntil(
            clients.matchAll().then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// === 2. Cập nhật firebase.client.ts thành useFirebaseMessaging hook ===
// File: src/hooks/useFirebaseMessaging.js


// === 3. Notification Service ===
// File: src/services/notificationService.js


// === 4. Component thông báo trong ứng dụng ===
// File: src/components/NotificationSystem.js


// === 5. Cập nhật App.js để tích hợp notification ===
// Thêm vào App.js:
// import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';
// import { notificationService } from './services/notificationService';
// import NotificationSystem from './components/NotificationSystem';

// // Trong component App:
// const App = () => {
//     const [userData, setUserData] = useState(null);
    
//     // Firebase messaging
//     const {
//         messagingToken,
//         permission,
//         requestPermission,
//         testNotification,
//         lastMessage,
//         error: messagingError
//     } = useFirebaseMessaging(userData);

//     // Handle incoming messages
//     useEffect(() => {
//         if (lastMessage) {
//             console.log('New message received:', lastMessage);
            
//             // Handle notification based on type
//             notificationService.handleShipmentNotification(lastMessage);
            
//             // Show success message
//             notificationService.showInAppNotification(
//                 'Thông báo mới',
//                 lastMessage.notification?.body || 'Có thông báo mới từ hệ thống',
//                 'info'
//             );
//         }
//     }, [lastMessage]);

//     // Request notification permission after login
//     useEffect(() => {
//         if (userData && permission === 'default') {
//             // Delay to avoid overwhelming user
//             setTimeout(() => {
//                 requestPermission();
//             }, 2000);
//         }
//     }, [userData, permission, requestPermission]);

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Existing components */}
            
//             {/* Notification System */}
//             <NotificationSystem />
            
//             {/* Debug info for development */}
//             {process.env.NODE_ENV === 'development' && messagingToken && (
//                 <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs max-w-xs">
//                     FCM Token: {messagingToken.substring(0, 20)}...
//                     <button 
//                         onClick={testNotification}
//                         className="ml-2 bg-blue-600 px-2 py-1 rounded"
//                     >
//                         Test
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// === 6. API Endpoints cho server (Node.js/Express) ===
// File: server/routes/notifications.js (tham khảo)
