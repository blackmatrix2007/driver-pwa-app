<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver App</title>
    <link rel="manifest" href="data:application/json;base64,eyJuYW1lIjoiRHJpdmVyIEFwcCIsInNob3J0X25hbWUiOiJEcml2ZXJBcHAiLCJzdGFydF91cmwiOiIvIiwiZGlzcGxheSI6InN0YW5kYWxvbmUiLCJiYWNrZ3JvdW5kX2NvbG9yIjoiIzAwNzFiYyIsInRoZW1lX2NvbG9yIjoiIzAwNzFiYyIsImljb25zIjpbeyJzcmMiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIzYVdSMGFEMGlORGdpSUdobGFXZG9kRDBpTkRnaUlIWnBaWGRDYjNnOUlqQWdNQ0EwT0NBME9DSWdabWxzYkQwaWJtOXVaU0krUEhCaGRHZ2dZMnhwY0MxeWRXeGxQU0psZG1WdWIyUmtJaUJrUFNKTk5ERXVNVEVnTkRCakxUSXVORGdnTUMwMExqUXpJRFl1TFRFME1qa2dObE5QSUMwdU9XUXhJRFEyY2pObElITXdJRFl0TkRZMmJuUjRJRGt1TkRVaUlHWnBiR3c5SWpFMU5tRTVObU1pTHo0OEwzTjJaejQ9Iiwic2l6ZXMiOiI0OHg0OCIsInR5cGUiOiJpbWFnZS9zdmcreG1sIn1dfQ==">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .back-btn {
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        .screen {
            display: none;
        }

        .screen.active {
            display: block;
        }

        .login-form {
            padding: 40px 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #555;
            font-weight: 500;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e1e5e9;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            border-color: #667eea;
        }

        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .calendar-container {
            padding: 20px;
        }

        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .calendar-nav {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
        }

        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            background: #e1e5e9;
            border-radius: 8px;
            overflow: hidden;
        }

        .calendar-day {
            background: white;
            min-height: 80px;
            padding: 8px 4px;
            font-size: 12px;
            position: relative;
            cursor: pointer;
        }

        .calendar-day.other-month {
            background: #f8f9fa;
            color: #aaa;
        }

        .calendar-day.today {
            background: #fff3cd;
        }

        .day-number {
            font-weight: bold;
            margin-bottom: 4px;
        }

        .trip-item {
            background: #e3f2fd;
            border-left: 3px solid #2196f3;
            padding: 2px 4px;
            margin-bottom: 2px;
            font-size: 10px;
            border-radius: 2px;
            cursor: pointer;
        }

        .trip-item.status-0 { background: #ffebee; border-color: #f44336; }
        .trip-item.status-1 { background: #e8f5e8; border-color: #4caf50; }
        .trip-item.status-2 { background: #fff3e0; border-color: #ff9800; }
        .trip-item.status-4 { background: #e3f2fd; border-color: #2196f3; }
        .trip-item.status-5 { background: #f3e5f5; border-color: #9c27b0; }

        .detail-container {
            padding: 20px;
        }

        .trip-detail {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .status-indicator {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .status-0 { background: #ffebee; color: #d32f2f; }
        .status-1 { background: #e8f5e8; color: #388e3c; }
        .status-2 { background: #fff3e0; color: #f57c00; }
        .status-4 { background: #e3f2fd; color: #1976d2; }
        .status-5 { background: #f3e5f5; color: #7b1fa2; }

        .info-row {
            display: flex;
            margin-bottom: 10px;
            align-items: flex-start;
        }

        .info-label {
            min-width: 80px;
            font-weight: 600;
            color: #666;
            font-size: 14px;
        }

        .info-value {
            flex: 1;
            font-size: 14px;
        }

        .status-actions {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .status-btn {
            flex: 1;
            padding: 12px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .status-btn:hover {
            background: #667eea;
            color: white;
        }

        .status-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .photo-upload {
            margin-top: 20px;
            text-align: center;
        }

        .upload-btn {
            display: inline-block;
            padding: 12px 20px;
            background: #4caf50;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
        }

        .photo-preview {
            margin-top: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .photo-preview img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #e1e5e9;
        }

        .history-container {
            padding: 20px;
        }

        .history-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            cursor: pointer;
        }

        .history-date {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }

        .history-route {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .history-status {
            font-size: 12px;
        }

        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            max-width: 400px;
            width: 100%;
            background: white;
            border-top: 1px solid #e1e5e9;
            display: flex;
            padding: 10px 0;
        }

        .nav-item {
            flex: 1;
            text-align: center;
            padding: 10px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .nav-item:hover {
            background: #f5f5f5;
        }

        .nav-item.active {
            color: #667eea;
            background: #f0f4ff;
        }

        .nav-icon {
            font-size: 20px;
            margin-bottom: 4px;
        }

        .nav-text {
            font-size: 12px;
        }

        .error-message {
            background: #ffebee;
            color: #d32f2f;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }

        .create-trip-btn {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 100;
        }

        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 20px;
            max-width: 90%;
            max-height: 80%;
            overflow-y: auto;
        }

        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
            margin-bottom: 2px;
        }

        .weekday {
            background: #667eea;
            color: white;
            padding: 10px 4px;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
        }

        .date-picker {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .date-picker input {
            flex: 1;
            padding: 10px;
            border: 2px solid #e1e5e9;
            border-radius: 6px;
        }

        .address-section {
            margin-bottom: 20px;
        }

        .address-section h4 {
            margin-bottom: 10px;
            color: #667eea;
        }

        .address-item {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
        }

        @media (max-width: 480px) {
            .container {
                max-width: 100%;
            }
            
            .bottom-nav {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Màn hình đăng nhập -->
        <div id="loginScreen" class="screen active">
            <div class="header">
                <h2>Đăng nhập</h2>
            </div>
            <div class="login-form">
                <div id="loginError" class="error-message" style="display: none;"></div>
                <div class="form-group">
                    <label for="username">Tên đăng nhập</label>
                    <input type="text" id="username" placeholder="Nhập tên đăng nhập">
                </div>
                <div class="form-group">
                    <label for="password">Mật khẩu</label>
                    <input type="password" id="password" placeholder="Nhập mật khẩu">
                </div>
                <button class="btn" onclick="login()">Đăng nhập</button>
            </div>
        </div>

        <!-- Màn hình lịch tháng -->
        <div id="calendarScreen" class="screen">
            <div class="header">
                <h2>Lịch chuyến xe</h2>
            </div>
            <div class="calendar-container">
                <div class="calendar-header">
                    <button class="calendar-nav" onclick="previousMonth()">‹</button>
                    <h3 id="currentMonth"></h3>
                    <button class="calendar-nav" onclick="nextMonth()">›</button>
                </div>
                <div class="calendar-weekdays">
                    <div class="weekday">T2</div>
                    <div class="weekday">T3</div>
                    <div class="weekday">T4</div>
                    <div class="weekday">T5</div>
                    <div class="weekday">T6</div>
                    <div class="weekday">T7</div>
                    <div class="weekday">CN</div>
                </div>
                <div id="calendarGrid" class="calendar-grid"></div>
            </div>
            <button id="createTripBtn" class="create-trip-btn" onclick="showCreateTrip()" style="display: none;">+</button>
        </div>

        <!-- Màn hình chi tiết chuyến -->
        <div id="detailScreen" class="screen">
            <div class="header">
                <button class="back-btn" onclick="showCalendar()">‹ Quay lại</button>
                <h2>Chi tiết chuyến</h2>
            </div>
            <div id="tripDetailContent" class="detail-container">
                <!-- Nội dung chi tiết sẽ được load động -->
            </div>
        </div>

        <!-- Màn hình lịch sử -->
        <div id="historyScreen" class="screen">
            <div class="header">
                <h2>Lịch sử chuyến</h2>
            </div>
            <div class="history-container">
                <div class="date-picker">
                    <input type="month" id="historyMonth" onchange="loadHistory()">
                </div>
                <div id="historyList">
                    <!-- Danh sách lịch sử sẽ được load động -->
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="bottom-nav">
            <div class="nav-item active" onclick="showCalendar()">
                <div class="nav-icon">📅</div>
                <div class="nav-text">Lịch</div>
            </div>
            <div class="nav-item" onclick="showHistory()">
                <div class="nav-icon">📋</div>
                <div class="nav-text">Lịch sử</div>
            </div>
        </div>
    </div>

    <!-- Modal tạo chuyến -->
    <div id="createTripModal" class="modal">
        <div class="modal-content">
            <h3>Tạo chuyến mới</h3>
            <div class="form-group">
                <label>Ngày nhận hàng</label>
                <input type="date" id="tripDate">
            </div>
            <div class="form-group">
                <label>Lái xe</label>
                <select id="driverSelect">
                    <option value="">Chọn lái xe</option>
                </select>
            </div>
            <div class="form-group">
                <label>Khách hàng</label>
                <select id="customerSelect" onchange="loadCustomerAddresses()">
                    <option value="">Chọn khách hàng</option>
                </select>
            </div>
            <div class="form-group">
                <label>Địa chỉ nhận hàng</label>
                <select id="pickupAddress">
                    <option value="">Chọn địa chỉ nhận</option>
                </select>
            </div>
            <div class="form-group">
                <label>Địa chỉ giao hàng</label>
                <select id="deliveryAddress">
                    <option value="">Chọn địa chỉ giao</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tải trọng xe</label>
                <select id="payloadSelect" onchange="loadTrucks()">
                    <option value="">Chọn tải trọng</option>
                </select>
            </div>
            <div class="form-group">
                <label>Xe vận chuyển</label>
                <select id="truckSelect">
                    <option value="">Chọn xe</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn" onclick="saveTrip()">Lưu chuyến</button>
                <button class="btn" style="background: #ccc;" onclick="closeCreateTrip()">Hủy</button>
            </div>
        </div>
    </div>

    <script>
        // API Configuration
        const API_URL = 'http://hlv-ws.giangdc.company/Admin/GDCService.asmx';
        const KEY_PASS = 'Gdc825@';

        // Global variables
        let currentUser = null;
        let currentDate = new Date();
        let currentTrips = [];
        let customers = [];
        let drivers = [];
        let payloads = [];
        let trucks = [];
        let shippingAddresses = [];

        // API Helper Function
        function post(api, params) {
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
                    '<' + api + ' xmlns="http://tempuri.org/">' +
                    strParams +
                    '</' + api + '>' +
                    '</soap:Body>' +
                    '</soap:Envelope>';

                request.onload = function () {
                    if (this.status === 200) {
                        let data = this._response.split('<' + api + 'Result>')[1];
                        if (data) {
                            data = data.split('</' + api + 'Result>')[0];
                        } else {
                            let dt = this._response.split('<' + api + 'Result />')[1];
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
                        resolve({ data: data, error: false });
                    } else {
                        resolve({ error: true, status: this.status });
                    }
                };

                request.onerror = function () {
                    resolve({ error: true, status: this.status });
                };

                request.open('POST', API_URL, true);
                request.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
                request.responseType = 'json';
                request.send(sr);
            });
        }

        // Login function
        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showError('Vui lòng nhập đầy đủ thông tin');
                return;
            }

            try {
                const result = await post('CheckLogin', {
                    keyPass: KEY_PASS,
                    userName: username,
                    Password: password
                });

                if (result.error) {
                    showError('Lỗi kết nối');
                    return;
                }

                // Parse result data
                if (result.data && result.data.length > 0) {
                    const userData = result.data.find(item => item.Status === 'Success');
                    const dataItem = result.data.find(item => item.Data);
                    
                    if (userData && dataItem) {
                        const userInfo = JSON.parse(dataItem.Data)[0];
                        currentUser = {
                            userName: username,
                            idLaiXe: userInfo.idLaiXe,
                            type: userInfo.type,
                            typeText: userInfo.typeText
                        };
                        
                        // Show create button for Điều vận
                        if (currentUser.typeText === 'Điều vận') {
                            document.getElementById('createTripBtn').style.display = 'block';
                        }
                        
                        showCalendar();
                        loadCalendarData();
                    } else {
                        showError('Tên đăng nhập hoặc mật khẩu không đúng');
                    }
                } else {
                    showError('Tên đăng nhập hoặc mật khẩu không đúng');
                }
            } catch (error) {
                showError('Lỗi kết nối');
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }

        // Screen navigation
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            if (screenId === 'calendarScreen') {
                document.querySelectorAll('.nav-item')[0].classList.add('active');
            } else if (screenId === 'historyScreen') {
                document.querySelectorAll('.nav-item')[1].classList.add('active');
            }
        }

        function showCalendar() {
            showScreen('calendarScreen');
            loadCalendarData();
        }

        function showHistory() {
            showScreen('historyScreen');
            document.getElementById('historyMonth').value = formatDateForInput(currentDate);
            loadHistory();
        }

        function showTripDetail(tripId) {
            showScreen('detailScreen');
            loadTripDetail(tripId);
        }

        // Calendar functions
        function updateCalendarHeader() {
            const monthNames = [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ];
            document.getElementById('currentMonth').textContent = 
                monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
        }

        function previousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarHeader();
            loadCalendarData();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarHeader();
            loadCalendarData();
        }

        async function loadCalendarData() {
            if (!currentUser) return;
            
            updateCalendarHeader();
            
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            try {
                const result = await post('GetInfor_ShipmentDriver', {
                    keyPass: KEY_PASS,
                    idLaiXe: currentUser.idLaiXe,
                    tungay: formatDate(firstDay),
                    denngay: formatDate(lastDay)
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        currentTrips = JSON.parse(dataItem.Data);
                        renderCalendar();
                    }
                }
            } catch (error) {
                console.error('Error loading calendar data:', error);
            }
        }

        function renderCalendar() {
            const grid = document.getElementById('calendarGrid');
            grid.innerHTML = '';
            
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const startCalendar = new Date(firstDay);
            startCalendar.setDate(startCalendar.getDate() - firstDay.getDay() + 1);
            
            const today = new Date();
            
            for (let i = 0; i < 42; i++) {
                const cellDate = new Date(startCalendar);
                cellDate.setDate(startCalendar.getDate() + i);
                
                const cell = document.createElement('div');
                cell.className = 'calendar-day';
                
                if (cellDate.getMonth() !== currentDate.getMonth()) {
                    cell.classList.add('other-month');
                }
                
                if (cellDate.toDateString() === today.toDateString()) {
                    cell.classList.add('today');
                }
                
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = cellDate.getDate();
                cell.appendChild(dayNumber);
                
                // Add trips for this day
                const dayTrips = currentTrips.filter(trip => {
                    const tripDate = parseDate(trip.ngaynhan);
                    return tripDate.toDateString() === cellDate.toDateString();
                });
                
                dayTrips.forEach(trip => {
                    const tripItem = document.createElement('div');
                    tripItem.className = `trip-item status-${trip.trangthai}`;
                    tripItem.textContent = `${trip.khachhang} → ${trip.khachhang1}`;
                    tripItem.onclick = () => showTripDetail(trip.idChuyenXe);
                    cell.appendChild(tripItem);
                });
                
                grid.appendChild(cell);
            }
        }

        // Trip detail functions
        async function loadTripDetail(tripId) {
            try {
                const result = await post('GetInforDetail_TruckRoute', {
                    keyPass: KEY_PASS,
                    idChuyenXe: tripId
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        const tripDetail = JSON.parse(dataItem.Data)[0];
                        renderTripDetail(tripDetail);
                    }
                }
            } catch (error) {
                console.error('Error loading trip detail:', error);
            }
        }

        function renderTripDetail(trip) {
            const container = document.getElementById('tripDetailContent');
            const statusTexts = {
                0: 'Chờ xác nhận',
                1: 'Đã nhận chuyến', 
                2: 'Đang giao',
                4: 'Đã giao',
                5: 'Hoàn thành',
                9: 'Hủy'
            };

            container.innerHTML = `
                <div class="trip-detail">
                    <div class="status-indicator status-${trip.trangthai}">
                        ${statusTexts[trip.trangthai] || 'Không xác định'}
                    </div>
                    
                    <div class="info-row">
                        <div class="info-label">Mã chuyến:</div>
                        <div class="info-value">#${trip.idChuyenXe}</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-label">Ngày nhận:</div>
                        <div class="info-value">${trip.ngaynhan}</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-label">Biển số:</div>
                        <div class="info-value">${trip.bienso}</div>
                    </div>
                    
                    <div class="info-row">
                        <div class="info-label">Lái xe:</div>
                        <div class="info-value">${trip.nhansu}</div>
                    </div>
                    
                    <div class="address-section">
                        <h4>Địa chỉ nhận hàng</h4>
                        <div class="address-item">${trip.diachinhan}</div>
                    </div>
                    
                    <div class="address-section">
                        <h4>Địa chỉ giao hàng</h4>
                        ${trip.diachigiao1 ? `<div class="address-item">${trip.diachigiao1}</div>` : ''}
                        ${trip.diachigiao2 ? `<div class="address-item">${trip.diachigiao2}</div>` : ''}
                        ${trip.diachigiao3 ? `<div class="address-item">${trip.diachigiao3}</div>` : ''}
                        ${trip.diachigiao4 ? `<div class="address-item">${trip.diachigiao4}</div>` : ''}
                    </div>
                    
                    ${trip.trangthai !== 5 ? renderStatusActions(trip) : ''}
                    ${trip.trangthai >= 4 ? renderPhotoUpload(trip) : ''}
                </div>
            `;
        }

        function renderStatusActions(trip) {
            const currentStatus = trip.trangthai;
            let actions = '';
            
            if (currentStatus === 0) {
                actions = `<button class="status-btn" onclick="updateTripStatus(${trip.idChuyenXe}, 1)">Nhận chuyến</button>`;
            } else if (currentStatus === 1) {
                actions = `<button class="status-btn" onclick="updateTripStatus(${trip.idChuyenXe}, 2)">Bắt đầu giao hàng</button>`;
            } else if (currentStatus === 2) {
                actions = `<button class="status-btn" onclick="updateTripStatus(${trip.idChuyenXe}, 4)">Đã giao hàng</button>`;
            } else if (currentStatus === 4) {
                actions = `<button class="status-btn" onclick="updateTripStatus(${trip.idChuyenXe}, 5)">Hoàn thành</button>`;
            }
            
            return `<div class="status-actions">${actions}</div>`;
        }

        function renderPhotoUpload(trip) {
            return `
                <div class="photo-upload">
                    <label for="photoInput-${trip.idChuyenXe}" class="upload-btn">
                        📷 Chụp ảnh / Tải ảnh
                    </label>
                    <input type="file" id="photoInput-${trip.idChuyenXe}" accept="image/*" 
                           capture="environment" style="display: none;" 
                           onchange="handlePhotoUpload(event, ${trip.idChuyenXe})">
                    <div id="photoPreview-${trip.idChuyenXe}" class="photo-preview"></div>
                </div>
            `;
        }

        async function updateTripStatus(tripId, newStatus) {
            try {
                const result = await post('UpdateStatus_TruckRoute', {
                    keyPass: KEY_PASS,
                    idChuyenXe: tripId,
                    trangthai: newStatus
                });

                if (!result.error) {
                    // Reload trip detail
                    loadTripDetail(tripId);
                    // Also reload calendar data
                    loadCalendarData();
                }
            } catch (error) {
                console.error('Error updating trip status:', error);
            }
        }

        function handlePhotoUpload(event, tripId) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById(`photoPreview-${tripId}`);
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }

        // History functions
        async function loadHistory() {
            if (!currentUser) return;
            
            const monthInput = document.getElementById('historyMonth').value;
            if (!monthInput) return;
            
            const [year, month] = monthInput.split('-');
            const firstDay = new Date(year, month - 1, 1);
            const lastDay = new Date(year, month, 0);
            
            try {
                const result = await post('GetInfor_ShipmentDriver', {
                    keyPass: KEY_PASS,
                    idLaiXe: currentUser.idLaiXe,
                    tungay: formatDate(firstDay),
                    denngay: formatDate(lastDay)
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        const trips = JSON.parse(dataItem.Data);
                        renderHistoryList(trips);
                    }
                }
            } catch (error) {
                console.error('Error loading history:', error);
            }
        }

        function renderHistoryList(trips) {
            const container = document.getElementById('historyList');
            const statusTexts = {
                0: 'Chờ xác nhận',
                1: 'Đã nhận chuyến',
                2: 'Đang giao', 
                4: 'Đã giao',
                5: 'Hoàn thành',
                9: 'Hủy'
            };

            if (trips.length === 0) {
                container.innerHTML = '<div class="loading">Không có chuyến nào trong tháng này</div>';
                return;
            }

            container.innerHTML = trips.map(trip => `
                <div class="history-item" onclick="showTripDetail(${trip.idChuyenXe})">
                    <div class="history-date">${trip.ngaynhan}</div>
                    <div class="history-route">${trip.diachinhan} → ${trip.diachigiao1}</div>
                    <div class="history-status status-${trip.trangthai}">
                        ${statusTexts[trip.trangthai] || 'Không xác định'}
                    </div>
                </div>
            `).join('');
        }

        // Create trip functions (for Điều vận)
        async function showCreateTrip() {
            document.getElementById('createTripModal').classList.add('active');
            document.getElementById('tripDate').value = formatDateForInput(new Date());
            
            // Load data for dropdowns
            await loadCustomers();
            await loadDrivers();
            await loadPayloads();
        }

        function closeCreateTrip() {
            document.getElementById('createTripModal').classList.remove('active');
        }

        async function loadCustomers() {
            try {
                const result = await post('GetInfor_Customer', {
                    keyPass: KEY_PASS
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        customers = JSON.parse(dataItem.Data);
                        const select = document.getElementById('customerSelect');
                        select.innerHTML = '<option value="">Chọn khách hàng</option>' +
                            customers.map(customer => 
                                `<option value="${customer.idKhachHang}">${customer.tenKhachHang}</option>`
                            ).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading customers:', error);
            }
        }

        async function loadDrivers() {
            try {
                const result = await post('GetInfor_Driver', {
                    keyPass: KEY_PASS
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        drivers = JSON.parse(dataItem.Data);
                        const select = document.getElementById('driverSelect');
                        select.innerHTML = '<option value="">Chọn lái xe</option>' +
                            drivers.map(driver => 
                                `<option value="${driver.idNhanSu}">${driver.tenNhanSu}</option>`
                            ).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading drivers:', error);
            }
        }

        async function loadPayloads() {
            try {
                const result = await post('GetInfor_Payload', {
                    keyPass: KEY_PASS
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        payloads = JSON.parse(dataItem.Data);
                        const select = document.getElementById('payloadSelect');
                        select.innerHTML = '<option value="">Chọn tải trọng</option>' +
                            payloads.map(payload => 
                                `<option value="${payload.idTrongTai}">${payload.trongTai}</option>`
                            ).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading payloads:', error);
            }
        }

        async function loadCustomerAddresses() {
            const customerId = document.getElementById('customerSelect').value;
            if (!customerId) return;
            
            try {
                const result = await post('GetInfor_ShippingAddress', {
                    keyPass: KEY_PASS,
                    idKhachHang: customerId
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        shippingAddresses = JSON.parse(dataItem.Data);
                        const pickupSelect = document.getElementById('pickupAddress');
                        const deliverySelect = document.getElementById('deliveryAddress');
                        
                        const options = shippingAddresses.map(addr => 
                            `<option value="${addr.idDiaChi}">${addr.diaChi}</option>`
                        ).join('');
                        
                        pickupSelect.innerHTML = '<option value="">Chọn địa chỉ nhận</option>' + options;
                        deliverySelect.innerHTML = '<option value="">Chọn địa chỉ giao</option>' + options;
                    }
                }
            } catch (error) {
                console.error('Error loading addresses:', error);
            }
        }

        async function loadTrucks() {
            const payloadId = document.getElementById('payloadSelect').value;
            if (!payloadId) return;
            
            try {
                const result = await post('GetInfor_Truck', {
                    keyPass: KEY_PASS,
                    idTrongTai: payloadId
                });

                if (!result.error && result.data) {
                    const dataItem = result.data.find(item => item.Data);
                    if (dataItem) {
                        trucks = JSON.parse(dataItem.Data);
                        const select = document.getElementById('truckSelect');
                        select.innerHTML = '<option value="">Chọn xe</option>' +
                            trucks.map(truck => 
                                `<option value="${truck.idXe}">${truck.bienso}</option>`
                            ).join('');
                    }
                }
            } catch (error) {
                console.error('Error loading trucks:', error);
            }
        }

        async function saveTrip() {
            const tripData = {
                keyPass: KEY_PASS,
                ngaynhan: document.getElementById('tripDate').value,
                idLaiXe: document.getElementById('driverSelect').value,
                idKhachHang: document.getElementById('customerSelect').value,
                idDiaChiNhan: document.getElementById('pickupAddress').value,
                idDiaChiGiao: document.getElementById('deliveryAddress').value,
                idXe: document.getElementById('truckSelect').value,
                trangthai: 0 // Chờ xác nhận
            };

            try {
                const result = await post('SAVE_TruckRoute', tripData);
                
                if (!result.error) {
                    closeCreateTrip();
                    loadCalendarData();
                    alert('Tạo chuyến thành công!');
                }
            } catch (error) {
                console.error('Error saving trip:', error);
                alert('Lỗi khi tạo chuyến!');
            }
        }

        // Utility functions
        function parseDate(dateStr) {
            const [day, month, year] = dateStr.split('-');
            return new Date(year, month - 1, day);
        }

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }

        function formatDateForInput(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Service Worker Registration for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('data:text/javascript;base64,Ly8gU2ltcGxlIHNlcnZpY2Ugd29ya2VyIGZvciBvZmZsaW5lIGZ1bmN0aW9uYWxpdHkKY29uc3QgQ0FDSEVfTkFNRSA9ICdkcml2ZXItYXBwLXYxJzsKY29uc3QgdXJsc1RvQ2FjaGUgPSBbCiAgJy8nLAogICcvaW5kZXguaHRtbCcKXTsKCnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIGV2ZW50ID0+IHsKICBldmVudC53YWl0VW50aWwoCiAgICBjYWNoZXMub3BlbihDQUNIRV9OQU1FKQogICAgICAudGhlbihjYWNoZSA9PiBjYWNoZS5hZGRBbGwodXJsc1RvQ2FjaGUpKQogICk7Cn0pOwoKc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIGV2ZW50ID0+IHsKICBldmVudC5yZXNwb25kV2l0aCgKICAgIGNhY2hlcy5tYXRjaChldmVudC5yZXF1ZXN0KQogICAgICAudGhlbihyZXNwb25zZSA9PiB7CiAgICAgICAgaWYgKHJlc3BvbnNlKSB7CiAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7CiAgICAgICAgfQogICAgICAgIHJldHVybiBmZXRjaChldmVudC5yZXF1ZXN0KTsKICAgICAgfSkKICApOwp9KTs=')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                }, function(err) {
                    console.log('ServiceWorker registration failed');
                });
            });
        }

        // Initialize app
        window.addEventListener('load', function() {
            updateCalendarHeader();
        });

        // Push notification support
        function requestNotificationPermission() {
            if ('Notification' in window && 'serviceWorker' in navigator) {
                Notification.requestPermission().then(function(permission) {
                    if (permission === 'granted') {
                        console.log('Notification permission granted');
                    }
                });
            }
        }

        function showNotification(title, body) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSI+PHBhdGggY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDEuMTEgNDBjLTIuNDggMC00LjQzIDYtMTQyOSA2Uy0uOWQxIDQ2cjNlIHMwIDYtNDY2bnR4IDkuNDUiIGZpbGw9IjE1NmE5NmMiLz48L3N2Zz4='
                });
            }
        }

        // Request notification permission on load
        requestNotificationPermission();
    </script>
</body>
</html>