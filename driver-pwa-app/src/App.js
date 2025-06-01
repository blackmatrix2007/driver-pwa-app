import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Truck, Home, History, Plus, Camera, Check, X, AlertCircle, User, LogOut, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import CalendarHomeScreen from './CalendarGridView';

// API Configuration
const API_URL = 'http://td.giangdc.company/Admin/GDCService.asmx';
const KEY_PASS = 'Gdc825@';

// Check if running in development
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Use proxy in development to avoid CORS
const getApiUrl = () => {
  // if (isDevelopment) {
  //   // Option 1: Use Create React App proxy (add "proxy" to package.json)
  //   return '/Admin/GDCService.asmx';
    
  //   // Option 2: Use CORS proxy service (uncomment to use)
  //   // return 'https://cors-anywhere.herokuapp.com/' + API_URL;
    
  //   // Option 3: Use local proxy server (uncomment to use)
  //   // return 'http://localhost:3001/api/proxy';
  // }
  return API_URL;
};

// Original post function adapted for web
export function post(api, params) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    let strParams = '';
    if (params) {
      Object.keys(params).map((param) => {
        strParams += '<' + param + '>' + params[param] + '</' + param + '>';
      });
    }

    const sr =
      '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>' +
      '<' +
      api +
      ' xmlns="http://tempuri.org/">' +
      strParams +
      '</' +
      api +
      '>' +
      '</soap:Body>' +
      '</soap:Envelope>';

    request.onload = function () {
      if (this.status === 200) {
        let responseText = this.responseText || this._response;
        let data = responseText.split('<' + api + 'Result>')[1];
        if (data) {
          data = data.split('</' + api + 'Result>')[0];
        } else {
          let dt = responseText.split('<' + api + 'Result />')[1];
          if (dt) {
            resolve({ data: [], error: false });
            return;
          }
        }
        
        try {
          data = JSON.parse(data);
        } catch (e) {
          data = data;
        }
        
        let res = {
          data: data,
          error: false,
        };
        resolve(res);
      } else {
        console.log('API Error:', this.status, this.responseText);
        resolve({
          error: true,
          status: this.status,
          message: 'Request failed'
        });
      }
    };
    
    request.onerror = function () {
      console.log('Network Error');
      resolve({
        error: true,
        status: this.status || 0,
        message: 'Network error'
      });
    };

    try {
      request.open('POST', getApiUrl(), true);
      request.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
      request.setRequestHeader('SOAPAction', '"http://tempuri.org/' + api + '"');
      
      // Remove responseType for better compatibility
      // request.responseType = 'json';
      
      request.send(sr);
    } catch (error) {
      console.error('Request setup error:', error);
      resolve({
        error: true,
        message: error.message
      });
    }
  });
}

// Fallback to mock data if CORS blocks the request
const postWithFallback = async (api, params) => {
  try {
    const result = await post(api, params);
    
    // If CORS error (status 0), use mock data
    if (result.error && (result.status === 0 || !result.status)) {
      console.warn('CORS blocked, using mock data. See console for solutions.');
      console.log('=== CORS Solutions ===');
      console.log('1. Add to package.json: "proxy": "http://hlv-ws.giangdc.company"');
      console.log('2. Run Chrome with disabled security (development only):');
      console.log('   Windows: chrome.exe --disable-web-security --user-data-dir="C:/tmp"');
      console.log('   Mac: open -n -a /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security');
      console.log('3. Use a browser extension like "CORS Unblock"');
      console.log('4. Set up a local proxy server');
      console.log('====================');
      
      return mockApiCall(api, params);
    }
    
    return result;
  } catch (error) {
    console.error('API call error:', error);
    return mockApiCall(api, params);
  }
};

// Mock API calls for development when CORS is blocking
const mockApiCall = async (api, params) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  switch (api) {
    case 'CheckLogin':
      if (params.userName === 'laixe1' && params.Password === '123456') {
        return {
          data: [{
            UserID: 100006,
            UserName: params.userName,
            type: 3,
            idLaiXe: 100002,
            typeText: 'Lái xe'
          }],
          error: false
        };
      } else if (params.userName === 'dieuvien1' && params.Password === '123456') {
        return {
          data: [{
            UserID: 100001,
            UserName: params.userName,
            type: 2,
            idLaiXe: 100001,
            typeText: 'Điều vận'
          }],
          error: false
        };
      }
      return { error: true, message: 'Sai tên đăng nhập hoặc mật khẩu' };
      
    case 'GetInfor_ShipmentDriver':
      return mockGetShipments();
      
    default:
      return { error: false, data: [] };
  }
};



const mockGetShipments = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate sample data for the current month
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const shipments = [];
  for (let i = 0; i < 15; i++) {
    const day = Math.floor(Math.random() * 28) + 1;
    const status = Math.floor(Math.random() * 5);
    
    shipments.push({
      stt: i + 1,
      idChuyenXe: 100000 + i,
      ngaynhap: `${day < 10 ? '0' + day : day}-${month + 1 < 10 ? '0' + (month + 1) : month + 1}-${year}`,
      ngaynhan: `${day < 10 ? '0' + day : day}-${month + 1 < 10 ? '0' + (month + 1) : month + 1}-${year}`,
      soPO: '',
      trangthai: status,
      loaivantai: 1,
      bienso: '99H 03552',
      nhansu: 'Lầu Văn Quyền',
      dienthoaiLX: '0971934626',
      khachhang: 'HLV',
      diachinhan: 'Kuehne + Nagel',
      diachigiao1: 'LINGYI',
      gioLayHang: `${8 + i % 8}:00`,
      gioGiaoHang: `${10 + i % 8}:00`
    });
  }
  
  return {
    data: [
      { Status: 'Success' },
      { Message: '' },
      { Data: JSON.stringify(shipments) }
    ],
    error: false
  };
};

// Component: Login Screen
const LoginScreen = ({ onLogin }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!userName || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try actual API with fallback to mock
      const result = await postWithFallback('CheckLogin', {
        keyPass: KEY_PASS,
        userName: userName,
        passWord: password
      });
      
      if (!result.error && result.data && result.data.length > 0) {
        const userData = result.data[0];
        localStorage.setItem('userData', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Đăng Nhập</h1>
          <p className="text-gray-600 mt-2">Hệ thống quản lý vận chuyển</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo: laixe1/123456 (Lái xe)</p>
          <p>dieuvien1/123456 (Điều vận)</p>
        </div>
      </div>
    </div>
  );
};

// Component: Calendar View


// Component: Shipment Detail
const ShipmentDetail = ({ shipment, onBack, userData }) => {
  const [status, setStatus] = useState(shipment.trangthai);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (newStatus <= status) {
      alert('Không thể chuyển về trạng thái trước đó');
      return;
    }
    
    if (status === 5) {
      alert('Chuyến đã hoàn thành không thể thay đổi');
      return;
    }

    setStatus(newStatus);
    // Call API to update status
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const statusButtons = [
    { value: 1, text: 'Nhận chuyến', color: 'bg-green-600' },
    { value: 2, text: 'Đang giao', color: 'bg-yellow-600' },
    { value: 4, text: 'Đã giao', color: 'bg-gray-600' },
    { value: 5, text: 'Hoàn thành', color: 'bg-blue-600' }
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center mb-4">
            <button onClick={onBack} className="mr-4">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Chi tiết chuyến xe</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Mã chuyến</label>
                <p className="font-medium">#{shipment.idChuyenXe}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Biển số xe</label>
                <p className="font-medium">{shipment.bienso}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Lái xe</label>
                <p className="font-medium">{shipment.nhansu}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Điện thoại</label>
                <p className="font-medium">{shipment.dienthoaiLX}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Khách hàng</label>
              <p className="font-medium">{shipment.khachhang}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Địa điểm lấy hàng</label>
              <p className="font-medium">{shipment.diachinhan}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Địa điểm giao hàng</label>
              <p className="font-medium">{shipment.diachigiao1}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">Trạng thái hiện tại</label>
              <div className={`inline-block px-3 py-1 rounded-full text-white text-sm ${
                status === 0 ? 'bg-blue-500' :
                status === 1 ? 'bg-green-500' :
                status === 2 ? 'bg-yellow-500' :
                status === 4 ? 'bg-gray-500' :
                status === 5 ? 'bg-black' :
                'bg-red-500'
              }`}>
                {getStatusText(status)}
              </div>
            </div>

            {userData.type === 3 && status < 5 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Cập nhật trạng thái</h3>
                <div className="grid grid-cols-2 gap-2">
                  {statusButtons.map(btn => (
                    <button
                      key={btn.value}
                      onClick={() => handleStatusChange(btn.value)}
                      disabled={btn.value <= status}
                      className={`${btn.color} text-white py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {status >= 4 && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Upload ảnh biên bản</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-6 h-6 mr-2" />
                    <span>Chọn ảnh hoặc chụp ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function getStatusText(status) {
    switch (status) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đã nhận chuyến';
      case 2: return 'Đang giao';
      case 4: return 'Đã giao';
      case 5: return 'Hoàn thành';
      case 9: return 'Hủy';
      default: return 'Không xác định';
    }
  }
};

// Main App Component
const App = () => {
  const [userData, setUserData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const parsed = JSON.parse(savedUserData);
      setUserData(parsed);
      setCurrentScreen('calendar');
      loadShipments();
    }
    setLoading(false);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service worker registration failed:', err);
      });
    }
  }, []);

  const loadShipments = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const result = await postWithFallback('GetInfor_ShipmentDriver', {
        keyPass: KEY_PASS,
        idLaiXe: userData.idLaiXe || '',
        tungay: `${firstDay.getDate()}-${firstDay.getMonth() + 1}-${firstDay.getFullYear()}`,
        denngay: `${lastDay.getDate()}-${lastDay.getMonth() + 1}-${lastDay.getFullYear()}`
      });
      
      if (!result.error && result.data && result.data[2]) {
        const shipmentsData = JSON.parse(result.data[2].Data);
        setShipments(shipmentsData);
      }
    } catch (err) {
      console.error('Error loading shipments:', err);
    }
  };

  const handleLogin = (user) => {
    setUserData(user);
    setCurrentScreen('calendar');
    loadShipments();
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setCurrentScreen('login');
    setShipments([]);
  };

  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    setCurrentScreen('detail');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'login' && (
        <LoginScreen onLogin={handleLogin} />
      )}

      {currentScreen === 'calendar' && userData && (
        <>
          {/* <CalendarScreen userData={userData} shipments={shipments} /> */}
          <CalendarHomeScreen /> 
          <BottomNavigation
            activeScreen="calendar"
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
            userData={userData}
          />
        </>
      )}

      {currentScreen === 'detail' && selectedShipment && (
        <ShipmentDetail
          shipment={selectedShipment}
          onBack={() => setCurrentScreen('calendar')}
          userData={userData}
        />
      )}

      {currentScreen === 'history' && (
        <>
          <ShipmentHistory shipments={shipments} onSelectShipment={handleSelectShipment} />
          <BottomNavigation
            activeScreen="history"
            onNavigate={setCurrentScreen}
            onLogout={handleLogout}
            userData={userData}
          />
        </>
      )}
    </div>
  );
};

// Component: Bottom Navigation
const BottomNavigation = ({ activeScreen, onNavigate, onLogout, userData }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => onNavigate('calendar')}
          className={`flex flex-col items-center p-2 ${activeScreen === 'calendar' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Lịch</span>
        </button>
        
        <button
          onClick={() => onNavigate('history')}
          className={`flex flex-col items-center p-2 ${activeScreen === 'history' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-xs mt-1">Lịch sử</span>
        </button>
        
        <button
          onClick={onLogout}
          className="flex flex-col items-center p-2 text-gray-600"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-xs mt-1">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

// Component: Shipment History
const ShipmentHistory = ({ shipments, onSelectShipment }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const filteredShipments = shipments.filter(s => {
    const [day, month, year] = s.ngaynhan.split('-');
    return parseInt(month) === selectedMonth.getMonth() + 1 && 
           parseInt(year) === selectedMonth.getFullYear();
  });

  const sortedShipments = [...filteredShipments].sort((a, b) => {
    const dateA = new Date(a.ngaynhan.split('-').reverse().join('-'));
    const dateB = new Date(b.ngaynhan.split('-').reverse().join('-'));
    return dateB - dateA;
  });

  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold mb-4">Lịch sử chuyến xe</h2>
      
      <div className="bg-white rounded-lg p-3 mb-4 flex items-center justify-between">
        <button
          onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
          className="p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">
          Tháng {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
        </span>
        <button
          onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
          className="p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedShipments.map((shipment) => (
          <div
            key={shipment.idChuyenXe}
            onClick={() => onSelectShipment(shipment)}
            className="bg-white rounded-lg p-4 shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">#{shipment.idChuyenXe}</p>
                <p className="text-sm text-gray-600">{shipment.ngaynhan}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs text-white ${
                shipment.trangthai === 0 ? 'bg-blue-500' :
                shipment.trangthai === 1 ? 'bg-green-500' :
                shipment.trangthai === 2 ? 'bg-yellow-500' :
                shipment.trangthai === 4 ? 'bg-gray-500' :
                shipment.trangthai === 5 ? 'bg-black' :
                'bg-red-500'
              }`}>
                {getStatusText(shipment.trangthai)}
              </span>
            </div>
            <p className="text-sm">{shipment.khachhang}</p>
            <p className="text-sm text-gray-600">{shipment.diachinhan} → {shipment.diachigiao1}</p>
          </div>
        ))}
        
        {sortedShipments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không có chuyến xe trong tháng này
          </div>
        )}
      </div>
    </div>
  );
  
  function getStatusText(status) {
    switch (status) {
      case 0: return 'Chờ xác nhận';
      case 1: return 'Đã nhận chuyến';
      case 2: return 'Đang giao';
      case 4: return 'Đã giao';
      case 5: return 'Hoàn thành';
      case 9: return 'Hủy';
      default: return 'Không xác định';
    }
  }
};

export default App;