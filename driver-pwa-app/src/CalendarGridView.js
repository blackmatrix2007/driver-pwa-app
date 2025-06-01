import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Truck,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import DriverScheduleCalendar from "./DriverScheduleCalendar";

const CalendarScreen = ({ userData, shipments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getShipmentsForDay = (day) => {
    if (!day) return [];

    const dateStr = `${day < 10 ? "0" + day : day}-${
      currentMonth.getMonth() + 1 < 10
        ? "0" + (currentMonth.getMonth() + 1)
        : currentMonth.getMonth() + 1
    }-${currentMonth.getFullYear()}`;

    return shipments.filter((s) => s.ngaynhan === dateStr);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-blue-500"; // Chờ xác nhận
      case 1:
        return "bg-green-500"; // Đã nhận chuyến
      case 2:
        return "bg-yellow-500"; // Đang giao
      case 4:
        return "bg-gray-500"; // Đã giao
      case 5:
        return "bg-white border-2 border-gray-300"; // Hoàn thành
      case 9:
        return "bg-red-500"; // Hủy
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã nhận chuyến";
      case 2:
        return "Đang giao";
      case 4:
        return "Đã giao";
      case 5:
        return "Hoàn thành";
      case 9:
        return "Hủy";
      default:
        return "Không xác định";
    }
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">
              Tháng {currentMonth.getMonth() + 1}/{currentMonth.getFullYear()}
            </h2>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                )
              }
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-medium py-2 text-sm">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const dayShipments = getShipmentsForDay(day);

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-2 min-h-[100px] ${
                    day ? "hover:bg-gray-50 cursor-pointer" : ""
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day && (
                    <>
                      <div className="font-medium text-sm mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayShipments.slice(0, 3).map((shipment, idx) => (
                          <div
                            key={idx}
                            className={`text-xs p-1 rounded ${getStatusColor(
                              shipment.trangthai
                            )} ${
                              shipment.trangthai === 5
                                ? "text-gray-700"
                                : "text-white"
                            }`}
                          >
                            <div className="font-medium">
                              {shipment.gioLayHang}
                            </div>
                            <div className="truncate">
                              {shipment.diachinhan}
                            </div>
                          </div>
                        ))}
                        {dayShipments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayShipments.length - 3} chuyến khác
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* {userData.type === 2 && (
          <button className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
            <Plus className="w-6 h-6" />
          </button>
        )} */}
      </div>
    </div>
  );
};

// Calendar Grid Component
const CalendarGridView = ({ userData, onSelectShipment }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [shipments, setShipments] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const horizontalScrollRef = useRef(null);
  const timeScrollRef = useRef(null);

  // Generate week days
  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Generate time slots
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour}:00`);
  }

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Mock shipments data
  useEffect(() => {
    const mockShipments = [
      {
        id: 1,
        date: new Date(2025, 5, 2),
        time: "08:00",
        duration: 2,
        customer: "FUJITA / Mr Kawagishi GD",
        pickup: "Kuehne + Nagel",
        delivery: "LINGYI",
        status: 0,
        driver: "Lầu Văn Quyền",
      },
      {
        id: 2,
        date: new Date(2025, 5, 3),
        time: "09:00",
        duration: 3,
        customer: "HLV",
        pickup: "TC Group / WMS",
        delivery: "DONGWON",
        status: 1,
        driver: "Vũ Văn Hậu",
      },
      {
        id: 3,
        date: new Date(2025, 5, 4),
        time: "13:00",
        duration: 2,
        customer: "TD System",
        pickup: "Kuehne + Nagel",
        delivery: "SENA TECH",
        status: 2,
        driver: "Lầu Văn Quyền",
      },
      {
        id: 4,
        date: new Date(2025, 5, 5),
        time: "10:00",
        duration: 4,
        customer: "CE",
        pickup: "HLV",
        delivery: "Kuehne + Nagel",
        status: 4,
        driver: "Thang Nguyên Đoàn",
      },
    ];
    setShipments(mockShipments);
  }, [currentWeek]);

  // Get shipments for a specific day and time
  const getShipmentForSlot = (day, timeSlot) => {
    const [hour] = timeSlot.split(":").map(Number);

    return shipments.find((shipment) => {
      const shipmentDate = new Date(shipment.date);
      const [shipmentHour] = shipment.time.split(":").map(Number);

      return (
        shipmentDate.toDateString() === day.toDateString() &&
        shipmentHour <= hour &&
        hour < shipmentHour + shipment.duration
      );
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-blue-500 text-white"; // Chờ xác nhận
      case 1:
        return "bg-green-500 text-white"; // Đã nhận chuyến
      case 2:
        return "bg-yellow-500 text-white"; // Đang giao
      case 4:
        return "bg-gray-500 text-white"; // Đã giao
      case 5:
        return "bg-white border-2 border-gray-300 text-gray-700"; // Hoàn thành
      default:
        return "bg-gray-400 text-white";
    }
  };

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    if (timeScrollRef.current) {
      timeScrollRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleTimeScroll = (e) => {
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              setCurrentWeek(
                new Date(currentWeek.setDate(currentWeek.getDate() - 7))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">
            Tuần {Math.ceil((currentWeek.getDate() - 1) / 7)} - Tháng{" "}
            {currentWeek.getMonth() + 1}/{currentWeek.getFullYear()}
          </h2>
          <button
            onClick={() =>
              setCurrentWeek(
                new Date(currentWeek.setDate(currentWeek.getDate() + 7))
              )
            }
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Time column */}
        <div className="w-20 bg-white border-r">
          <div className="h-12 border-b"></div>
          <div
            ref={timeScrollRef}
            onScroll={handleTimeScroll}
            className="overflow-y-auto"
            style={{ height: "calc(100% - 48px)" }}
          >
            {timeSlots.map((time, idx) => (
              <div
                key={idx}
                className="h-20 border-b flex items-center justify-center text-sm text-gray-600"
              >
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Days grid */}
        <div className="flex-1 flex flex-col">
          {/* Day headers */}
          <div className="flex bg-white border-b h-12">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex-1 text-center border-r p-2">
                <div className="text-xs text-gray-600">{dayNames[idx]}</div>
                <div className="font-medium">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Scrollable content */}
          <div
            ref={horizontalScrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-auto"
          >
            <div
              className="flex"
              style={{ minHeight: `${timeSlots.length * 80}px` }}
            >
              {weekDays.map((day, dayIdx) => (
                <div key={dayIdx} className="flex-1 border-r">
                  {timeSlots.map((time, timeIdx) => {
                    const shipment = getShipmentForSlot(day, time);
                    const isFirstSlot =
                      shipment &&
                      timeSlots[timeIdx - 1] &&
                      !getShipmentForSlot(day, timeSlots[timeIdx - 1]);

                    return (
                      <div key={timeIdx} className="h-20 border-b relative">
                        {shipment && isFirstSlot && (
                          <div
                            className={`absolute inset-x-1 p-2 rounded cursor-pointer hover:shadow-lg transition-shadow ${getStatusColor(
                              shipment.status
                            )}`}
                            style={{
                              height: `${shipment.duration * 80 - 8}px`,
                              zIndex: 10,
                            }}
                            onClick={() => onSelectShipment(shipment)}
                          >
                            <div className="text-xs font-medium truncate">
                              {shipment.time} - {shipment.customer}
                            </div>
                            <div className="text-xs mt-1 truncate opacity-90">
                              {shipment.pickup} → {shipment.delivery}
                            </div>
                            <div className="text-xs mt-1 truncate opacity-80">
                              <Truck className="w-3 h-3 inline mr-1" />
                              {shipment.driver}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add button for dispatcher */}
      {/* {userData.type === 2 && (
        <button className="fixed bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
          <Plus className="w-6 h-6" />
        </button>
      )} */}
    </div>
  );
};

// Main Calendar Selection Screen
const CalendarHomeScreen = ({ userData, onViewChange, onSelectShipment }) => {
  const [selectedView, setSelectedView] = useState(null);

  const handleViewSelect = (view) => {
    setSelectedView(view);
    if (onViewChange) {
      onViewChange(view);
    }
  };

  if (selectedView === "grid") {
    // return (
    //   <CalendarGridView
    //     userData={userData}
    //     onSelectShipment={onSelectShipment}
    //   />
    // );
    return null;
  }

  if (selectedView === "monthly") {
    //return <CalendarScreen userData={userData} shipments={[]} />;
    return null;
  }

    if (selectedView === "custom") {
        return <DriverScheduleCalendar userData={userData} />;
    }


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          Chọn chế độ xem lịch
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
            <button
            onClick={() => handleViewSelect("custom")}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {/* <CalendarScreen className="w-16 h-16 text-blue-500" userData={userData} shipments={[]} /> */}
                {/* <Calendar className="w-16 h-16 text-blue-500" /> */}
              </div>
              <h2 className="text-xl font-bold">Xem lịch</h2>
              <p className="text-gray-600 mt-2 text-center">
                Hiển thị tổng quan các chuyến xe trong tháng
              </p>
            </div>
          </button>
          {/* Monthly View Option */}
          <button
            onClick={() => handleViewSelect("monthly")}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {/* <CalendarScreen className="w-16 h-16 text-blue-500" userData={userData} shipments={[]} /> */}
                {/* <Calendar className="w-16 h-16 text-blue-500" /> */}
              </div>
              <h2 className="text-xl font-bold">Xem theo tháng</h2>
              <p className="text-gray-600 mt-2 text-center">
                Hiển thị tổng quan các chuyến xe trong tháng
              </p>
            </div>
          </button>

          {/* Weekly/Grid View Option */}
          <button
            onClick={() => handleViewSelect("grid")}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 bg-green-600 rounded-sm"
                    ></div>
                  ))}
                </div>
              </div>
              <h2 className="text-xl font-bold">Xem theo tuần</h2>
              <p className="text-gray-600 mt-2 text-center">
                Hiển thị chi tiết theo giờ trong tuần
              </p>
            </div>

          </button>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-medium mb-4">Chú thích trạng thái</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm">Chờ xác nhận</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm">Đã nhận chuyến</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
              <span className="text-sm">Đang giao</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
              <span className="text-sm">Đã giao</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
              <span className="text-sm">Hoàn thành</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Hủy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHomeScreen;
