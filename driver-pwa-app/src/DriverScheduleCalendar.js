import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Menu, Truck, Clock, MapPin, AlertCircle } from 'lucide-react';

// Driver Schedule Calendar Component
const DriverScheduleCalendar = ({ userData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef(null);

  // Mock data for drivers and their schedules
  const drivers = [
    { id: 1, name: 'Lầu Văn Quyền', vehicle: '99H 03552' },
    { id: 2, name: 'Vũ Văn Hậu', vehicle: '14C-16073' },
    { id: 3, name: 'Thang Nguyên Đoàn', vehicle: '99H-03577' },
    { id: 4, name: 'Nguyễn Văn An', vehicle: '29C-23451' },
    { id: 5, name: 'Chử Quang Hảo', vehicle: '99C-12345' },
    { id: 6, name: 'Phạm Ngọc Văn Nam', vehicle: '14C-25789' }
  ];

  // Generate dates for the week
  const generateWeekDates = (startDate) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = generateWeekDates(currentDate);

  // Mock schedule data
  const schedules = {
    1: { // Lầu Văn Quyền
      '2025-06-02': [
        { time: '08:00', task: 'Health check @Hong Ngoc', type: 'appointment' },
        { time: '13:00 - 14:00', task: 'Reeracoen / Ms. Senoo', type: 'meeting' }
      ],
      '2025-06-03': [
        { time: '', task: 'sign document - payment by bank', type: 'admin' }
      ],
      '2025-06-04': [
        { time: '', task: 'Business trip to Nha Trang', type: 'trip' },
        { time: '13:30', task: 'Warehouse @Dien Phu IZ', type: 'delivery' }
      ],
      '2025-06-05': [
        { time: '', task: 'Business trip to HCM', type: 'trip' },
        { time: '13:00 - 16:00', task: 'TMV Mr. Ugi AD @SPD', type: 'meeting' }
      ]
    },
    2: { // Vũ Văn Hậu
      '2025-06-01': [
        { time: '', task: 'sign document', type: 'admin' }
      ],
      '2025-06-03': [
        { time: '', task: 'sign document - payment by bank', type: 'admin' }
      ],
      '2025-06-06': [
        { time: '08:00 - 17:00', task: 'Holiday', type: 'holiday' }
      ]
    },
    3: { // Thang Nguyên Đoàn
      '2025-06-02': [
        { time: '', task: 'sign document', type: 'admin' },
        { time: '15:30 - 16:30', task: 'Delivery tape to Sumiriko', type: 'delivery' }
      ]
    },
    4: { // Nguyễn Văn An
      '2025-06-02': [
        { time: '15:00', task: 'IT/ Việt Hà company', type: 'meeting' }
      ],
      '2025-06-05': [
        { time: '', task: 'BD / SPD', type: 'meeting' }
      ],
      '2025-06-06': [
        { time: '10:30 - 11:30', task: 'TMV Mr. Ugi AD @SPD', type: 'meeting' }
      ]
    },
    5: { // Chử Quang Hảo
      '2025-06-04': [
        { time: '09:00 - 12:00', task: 'Delivery to LINGYI', type: 'delivery' }
      ],
      '2025-06-05': [
        { time: '14:00 - 16:00', task: 'Pickup from Kuehne + Nagel', type: 'pickup' }
      ]
    },
    6: { // Phạm Ngọc Văn Nam
      '2025-06-03': [
        { time: '08:00 - 10:00', task: 'Meeting with HLV', type: 'meeting' }
      ],
      '2025-06-06': [
        { time: '13:00 - 15:00', task: 'Delivery to DONGWON', type: 'delivery' }
      ]
    }
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getDayName = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'delivery': return 'text-blue-600';
      case 'pickup': return 'text-green-600';
      case 'meeting': return 'text-purple-600';
      case 'admin': return 'text-gray-600';
      case 'trip': return 'text-orange-600';
      case 'appointment': return 'text-red-600';
      case 'holiday': return 'text-pink-600';
      default: return 'text-gray-800';
    }
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  // Handle horizontal scroll
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="flex items-center justify-between p-4">
          <Menu className="w-6 h-6" />
          <h1 className="text-xl font-medium">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h1>
          <div className="w-6 h-6" /> {/* Spacer */}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
        <button onClick={handlePrevWeek} className="p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={handleCurrentWeek} className="px-4 py-1 text-sm font-medium">
          Hiện tại
        </button>
        <button onClick={handleNextWeek} className="p-2">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Driver/Vehicle Column */}
        <div className="w-24 bg-white border-r flex-shrink-0">
          <div className="h-16 border-b flex items-center justify-center">
            <span className="text-sm font-medium">Name</span>
          </div>
          {drivers.map((driver) => (
            <div key={driver.id} className="h-32 border-b p-2 flex flex-col justify-center">
              <div className="text-xs font-medium truncate">{driver.name}</div>
              <div className="text-xs text-gray-500 mt-1">{driver.vehicle}</div>
            </div>
          ))}
        </div>

        {/* Scrollable Days Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-hidden"
        >
          <div className="flex" style={{ minWidth: '600px' }}>
            {weekDates.map((date, index) => (
              <div key={index} className="flex-1 min-w-[200px] bg-white border-r">
                {/* Day Header */}
                <div className="h-16 border-b flex flex-col items-center justify-center">
                  <span className="text-sm">{getDayName(date)}, {date.getDate().toString().padStart(2, '0')}</span>
                </div>
                
                {/* Driver Tasks */}
                {drivers.map((driver) => {
                  const dateStr = formatDate(date);
                  const tasks = schedules[driver.id]?.[dateStr] || [];
                  
                  return (
                    <div key={driver.id} className="h-32 border-b p-2 overflow-y-auto">
                      {tasks.length > 0 ? (
                        <div className="space-y-1">
                          {tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="text-xs">
                              {task.time && (
                                <div className="font-medium">{task.time}</div>
                              )}
                              <div className={`${getTaskColor(task.type)} break-words`}>
                                {task.task}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 text-center mt-4">-</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t flex justify-around py-2">
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
        </button>
        <button className="p-2">
          <div className="w-6 h-6 bg-gray-400 rounded"></div>
        </button>
      </div>
    </div>
  );
};

export default DriverScheduleCalendar;