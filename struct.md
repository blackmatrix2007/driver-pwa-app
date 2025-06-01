# 📁 Cấu trúc thư mục PWA Driver App

```
driver-pwa/
├── 📁 public/
│   ├── 📄 index.html                 # File HTML chính
│   ├── 📄 manifest.json              # PWA manifest
│   ├── 📄 sw.js                      # Service Worker
│   └── 📁 icons/
│       ├── 🖼️ icon-72x72.png
│       ├── 🖼️ icon-96x96.png
│       ├── 🖼️ icon-128x128.png
│       ├── 🖼️ icon-144x144.png
│       ├── 🖼️ icon-152x152.png
│       ├── 🖼️ icon-192x192.png
│       ├── 🖼️ icon-384x384.png
│       └── 🖼️ icon-512x512.png
│
├── 📁 src/
│   ├── 📁 js/
│   │   ├── 📄 app.js                 # Logic chính của ứng dụng
│   │   ├── 📄 api.js                 # Xử lý API calls
│   │   ├── 📄 auth.js                # Xử lý đăng nhập/xác thực
│   │   ├── 📄 calendar.js            # Logic lịch tháng
│   │   ├── 📄 tripDetail.js          # Logic chi tiết chuyến
│   │   ├── 📄 history.js             # Logic lịch sử
│   │   ├── 📄 createTrip.js          # Logic tạo chuyến (Điều vận)
│   │   ├── 📄 notification.js        # Xử lý thông báo
│   │   └── 📄 utils.js               # Utility functions
│   │
│   ├── 📁 css/
│   │   ├── 📄 main.css               # CSS chính
│   │   ├── 📄 login.css              # Style cho màn đăng nhập
│   │   ├── 📄 calendar.css           # Style cho lịch tháng
│   │   ├── 📄 tripDetail.css         # Style cho chi tiết chuyến
│   │   ├── 📄 history.css            # Style cho lịch sử
│   │   ├── 📄 modal.css              # Style cho modal
│   │   └── 📄 responsive.css         # Responsive design
│   │
│   └── 📁 components/
│       ├── 📄 header.html            # Component header
│       ├── 📄 navigation.html        # Component navigation
│       ├── 📄 tripCard.html          # Component card chuyến xe
│       └── 📄 statusIndicator.html   # Component trạng thái
│
├── 📁 assets/
│   ├── 📁 images/
│   │   ├── 🖼️ logo.png
│   │   ├── 🖼️ truck-icon.svg
│   │   ├── 🖼️ calendar-icon.svg
│   │   └── 🖼️ history-icon.svg
│   │
│   └── 📁 fonts/
│       └── 📄 roboto.woff2
│
├── 📁 config/
│   ├── 📄 api-config.js             # Cấu hình API
│   └── 📄 app-config.js             # Cấu hình ứng dụng
│
├── 📁 tests/
│   ├── 📄 api.test.js               # Test API functions
│   ├── 📄 calendar.test.js          # Test calendar logic
│   └── 📄 auth.test.js              # Test authentication
│
├── 📁 docs/
│   ├── 📄 README.md                 # Hướng dẫn sử dụng
│   ├── 📄 API.md                    # Tài liệu API
│   └── 📄 DEPLOYMENT.md             # Hướng dẫn deploy
│
├── 📁 build/                        # Thư mục build (tự động tạo)
│   ├── 📄 bundle.js
│   ├── 📄 bundle.css
│   └── 📄 index.html
│
├── 📄 package.json                  # Dependencies và scripts
├── 📄 package-lock.json             # Lock file
├── 📄 webpack.config.js             # Cấu hình Webpack
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env                          # Environment variables
└── 📄 README.md                     # Tài liệu dự án
```

## 📋 Chi tiết các file chính:

### 1. **public/index.html**
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver App</title>
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="../src/css/main.css">
    <meta name="theme-color" content="#667eea">
</head>
<body>
    <!-- App content -->
    <script src="../src/js/app.js"></script>
</body>
</html>
```

### 2. **public/manifest.json**
```json
{
  "name": "Driver Management App",
  "short_name": "DriverApp",
  "description": "Ứng dụng quản lý lái xe",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 3. **public/sw.js** (Service Worker)
```javascript
const CACHE_NAME = 'driver-app-v1.0.0';
const urlsToCache = [
  '/',
  '/src/css/main.css',
  '/src/js/app.js',
  '/icons/icon-192x192.png'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
```

### 4. **package.json**
```json
{
  "name": "driver-pwa",
  "version": "1.0.0",
  "description": "PWA cho quản lý lái xe",
  "main": "public/index.html",
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "jest",
    "deploy": "npm run build && gh-pages -d build"
  },
  "dependencies": {
    "workbox-webpack-plugin": "^6.5.4"
  },
  "devDependencies": {
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.9.3",
    "html-webpack-plugin": "^5.5.0",
    "css-loader": "^6.7.1",
    "style-loader": "^3.3.1",
    "jest": "^28.1.3",
    "gh-pages": "^4.0.0"
  },
  "keywords": ["pwa", "driver", "logistics", "mobile"],
  "author": "Your Name",
  "license": "MIT"
}
```

### 5. **config/api-config.js**
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://hlv-ws.giangdc.company/Admin/GDCService.asmx',
  KEY_PASS: 'Gdc825@',
  ENDPOINTS: {
    LOGIN: 'CheckLogin',
    GET_TRIPS: 'GetInfor_ShipmentDriver',
    GET_TRIP_DETAIL: 'GetInforDetail_TruckRoute',
    UPDATE_STATUS: 'UpdateStatus_TruckRoute',
    GET_CUSTOMERS: 'GetInfor_Customer',
    GET_DRIVERS: 'GetInfor_Driver',
    GET_PAYLOADS: 'GetInfor_Payload',
    GET_TRUCKS: 'GetInfor_Truck',
    GET_ADDRESSES: 'GetInfor_ShippingAddress',
    SAVE_TRIP: 'SAVE_TruckRoute'
  }
};
```

### 6. **src/js/api.js**
```javascript
import { API_CONFIG } from '../../config/api-config.js';

export function post(api, params) {
  // Implementation của API helper function
}

export async function login(username, password) {
  // Implementation của login function
}

export async function getTrips(idLaiXe, fromDate, toDate) {
  // Implementation của get trips function
}
```

### 7. **.env**
```
# API Configuration
API_BASE_URL=http://hlv-ws.giangdc.company/Admin/GDCService.asmx
API_KEY_PASS=Gdc825@

# App Configuration
APP_NAME=Driver App
APP_VERSION=1.0.0

# Development
NODE_ENV=development
PORT=3000
```

### 8. **webpack.config.js**
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  devServer: {
    contentBase: './build',
    port: 3000,
  },
};
```

## 🚀 **Lệnh để chạy dự án:**

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build

# Chạy tests
npm test

# Deploy lên GitHub Pages
npm run deploy
```

## 📝 **Lưu ý:**
- Thư mục `build/` được tạo tự động khi build
- File `.env` chứa các biến môi trường (không commit lên git)
- Icons cần tạo các kích thước khác nhau cho PWA
- Service Worker sẽ cache các file quan trọng để hoạt động offline

Cấu trúc này giúp dự án dễ maintain, scale và deploy. Bạn có muốn tôi tạo thêm file cụ thể nào không?