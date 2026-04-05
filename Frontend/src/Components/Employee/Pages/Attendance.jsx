import { useState } from "react";
import {
  Clock3,
  LogIn,
  LogOut,
  CheckCircle2,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function AttendanceDashboard() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  
  // Get current month and year
  const currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear().toString();
  const todayDateString = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      date: "5/4/26",
      month: "April",
      year: "2026",
      arrival: "11:56 AM",
      departure: "6:01 PM",
      hours: "6:05 hours",
      progress: 75,
      status: "Late",
    },
    {
      date: "4/4/26",
      month: "April",
      year: "2026",
      arrival: "10:11 AM",
      departure: "8:53 PM",
      hours: "10:42 hours",
      progress: 100,
      status: "On Time",
    },
    {
      date: "3/4/26",
      month: "April",
      year: "2026",
      arrival: "9:45 AM",
      departure: "4:03 PM",
      hours: "5:18 hours",
      progress: 60,
      status: "Late",
    },
  ]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateHours = (checkIn, checkOut) => {
    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    
    const checkInMinutes = parseTime(checkIn);
    const checkOutMinutes = parseTime(checkOut);
    const diffMinutes = checkOutMinutes - checkInMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    const progress = Math.min(100, Math.round((diffMinutes / (8 * 60)) * 100));
    
    return {
      hours: `${hours}h ${mins}m`,
      progress
    };
  };

  const handleCheckIn = () => {
    // Check if already checked in today
    if (lastCheckInDate === todayDateString) {
      alert("You have already checked in today. You can check in again tomorrow.");
      return;
    }
    if (!checkInTime) {
      setCheckInTime(getCurrentTime());
      setLastCheckInDate(todayDateString);
    }
  };

  const handleCheckOut = () => {
    if (checkInTime && !checkOutTime) {
      const time = getCurrentTime();
      setCheckOutTime(time);
      
      // Add to history
      const { hours, progress } = calculateHours(checkInTime, time);
      const today = new Date();
      const todayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear().toString().slice(-2)}`;
      const todayMonth = months[today.getMonth()];
      const todayYear = today.getFullYear().toString();
      
      // Determine status
      let status = "On Time";
      if (progress < 80) status = "Late";
      if (progress === 0) status = "Absent";
      
      const todayEntry = {
        date: "Today",
        month: todayMonth,
        year: todayYear,
        arrival: checkInTime,
        departure: time,
        hours: hours,
        progress: progress,
        status: status
      };
      
      setAttendanceHistory([todayEntry, ...attendanceHistory]);
      
      // Auto reset after 2 seconds for next day
      setTimeout(() => {
        setCheckInTime(null);
        setCheckOutTime(null);
      }, 2000);
    }
  };

  const handleReset = () => {
    setCheckInTime(null);
    setCheckOutTime(null);
  };

  // Calculate statistics based on filtered data
  const filteredAttendance = attendanceHistory.filter(item =>
    item.month === selectedMonth &&
    item.year === selectedYear
  );

  const onTimeCount = filteredAttendance.filter(item => item.status === "On Time").length;
  const lateCount = filteredAttendance.filter(item => item.status === "Late").length;
  const absentCount = filteredAttendance.filter(item => item.status === "Absent").length;
  const totalDays = filteredAttendance.length;

  const isMarkedPresent = checkInTime !== null;

  return (
    <div className="min-h-screen  bg-linear-to-br from-gray-50 to-gray-100  py-8 px-4">
      <div className="max-w-6xl ml-8 mr-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good afternoon, Sourav!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You have 2 leave request pending.
          </p>
        </div>

        {/* Top Section */}
        <div className="grid lg:grid-cols-4 gap-5">

          {/* Today Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900 text-base">Today</h2>
              <span className={`text-white text-xs px-2.5 py-1 rounded-full font-medium ${
                checkOutTime ? "bg-emerald-500" : checkInTime ? "bg-blue-500" : "bg-red-500"
              }`}>
                {checkOutTime ? "Completed" : checkInTime ? "In Progress" : "Absent"}
              </span>
            </div>

            <div className="flex justify-center mb-6">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={checkOutTime ? "#10b981" : checkInTime ? "#3b82f6" : "#f59e0b"}
                    strokeWidth="12"
                    strokeDasharray={`${(checkOutTime ? 100 : checkInTime ? 50 : 67) / 100 * 339.3} 339.3`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{checkOutTime ? "100" : checkInTime ? "50" : "67"}%</span>
                  <span className="text-xs text-gray-500">{checkOutTime ? "completed" : checkInTime ? "in progress" : "in office"}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center mb-4">
              {checkInTime && !checkOutTime 
                ? "You have checked in. Now check out when leaving." 
                : checkInTime && checkOutTime
                ? "You have completed your work day!"
                : "Click to check in your attendance."}
            </p>

            {checkInTime && (
              <div className="mb-4 space-y-2">
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium">Check In</p>
                  <p className="text-base font-bold text-gray-900">{checkInTime}</p>
                </div>
                {checkOutTime && (
                  <div className="p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Check Out</p>
                    <p className="text-base font-bold text-gray-900">{checkOutTime}</p>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => {
                if (!checkInTime) {
                  handleCheckIn();
                } else if (!checkOutTime) {
                  handleCheckOut();
                } else {
                  handleReset();
                }
              }}
              disabled={lastCheckInDate === todayDateString && !checkInTime && !checkOutTime}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition text-white ${
                lastCheckInDate === todayDateString && !checkInTime && !checkOutTime
                  ? "bg-gray-400 cursor-not-allowed"
                  : !checkInTime
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : !checkOutTime
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {lastCheckInDate === todayDateString && !checkInTime && !checkOutTime
                ? "Already checked out today"
                : !checkInTime
                ? "Check In"
                : !checkOutTime
                ? "Check Out"
                : "Reset"}
            </button>
          </div>

          {/* Stats - Column 1 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <Clock3 className="text-teal-600 mb-3 w-5 h-5" />
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average hours</p>
              <h2 className="text-xl font-bold text-gray-900">7h 17mins</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <LogIn className="text-orange-500 mb-3 w-5 h-5" />
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average check-in</p>
              <h2 className="text-xl font-bold text-gray-900">10:33 AM</h2>
            </div>
          </div>

          {/* Stats - Column 2 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <LogOut className="text-teal-600 mb-3 w-5 h-5" />
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average check-out</p>
              <h2 className="text-xl font-bold text-gray-900">19:12 PM</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <CheckCircle2 className="text-emerald-600 mb-3 w-5 h-5" />
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">On-time arrival</p>
              <h2 className="text-xl font-bold text-emerald-600">98.56%</h2>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900 text-base">My Attendance</h2>
              <button className="text-blue-600 text-xs hover:text-blue-700 font-medium">View Stats</button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-600 font-semibold">● {onTimeCount}</span>
                <span className="text-gray-600 text-xs">on time</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-500 font-semibold">● {absentCount}</span>
                <span className="text-gray-600 text-xs">Work from home</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-500 font-semibold">● {lateCount}</span>
                <span className="text-gray-600 text-xs">late attendance</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-semibold">● {absentCount}</span>
                <span className="text-gray-600 text-xs">absent</span>
              </div>
            </div>

            <div className="flex justify-center py-4 border-t border-gray-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{onTimeCount + lateCount}</h3>
                <p className="text-xs text-gray-500">/{totalDays} days</p>
              </div>
            </div>

            {/* <p className="text-emerald-600 text-xs text-center font-medium">
              ✓ Better than 96% employees!
            </p> */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-1 gap-5">

          {/* Working History */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">📋 Working History</h2>
              <p className="text-gray-600 text-xs mt-1">
                {attendanceHistory.filter(item =>
                  item.month === selectedMonth &&
                  item.year === selectedYear
                ).length} record(s) found
              </p>
            </div>

            {/* Filters Section */}
            <div className="px-6 py-5 border-b border-gray-200 bg-white">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                Filter Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Month Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Month
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>October</option>
                    <option>November</option>
                    <option>December</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Year
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-gray-900"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    placeholder="Enter year (e.g., 2023)"
                  />
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 font-semibold text-gray-700 text-xs">Date</th>
                      <th className="text-left pb-3 font-semibold text-gray-700 text-xs">Arrival</th>
                      <th className="text-left pb-3 font-semibold text-gray-700 text-xs">Departure</th>
                      <th className="text-left pb-3 font-semibold text-gray-700 text-xs">Effective time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory
                      .filter(item =>
                        item.month === selectedMonth &&
                        item.year === selectedYear
                      )
                      .length > 0 ? (
                        attendanceHistory
                          .filter(item =>
                            item.month === selectedMonth &&
                            item.year === selectedYear
                          )
                          .map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-gray-900">{item.date}</td>
                      <td className="py-3 text-gray-900">{item.arrival}</td>
                      <td className="py-3 text-gray-600">{item.departure}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.progress >= 80
                                    ? "bg-emerald-600"
                                    : item.progress >= 50
                                    ? "bg-amber-500"
                                    : "bg-orange-500"
                                }`}
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 whitespace-nowrap">{item.hours}</span>
                        </div>
                      </td>
                    </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-8 px-4 text-center">
                            <p className="text-gray-600 text-sm">No attendance records found for the selected filters</p>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}