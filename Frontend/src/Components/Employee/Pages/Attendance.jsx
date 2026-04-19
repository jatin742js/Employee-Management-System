import { useState, useEffect } from "react";
import {
  Clock3,
  LogIn,
  LogOut,
  CheckCircle2,
  Zap,
  TrendingUp,
} from "lucide-react";
import employeeAttendanceService from "../../../services/employeeAttendanceService";

export default function AttendanceDashboard() {
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Get current month and year
  const currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear().toString();
  const todayDateString = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await employeeAttendanceService.getMyAttendance();
      const data = response.data || response.attendance || response;
      
      if (Array.isArray(data)) {
        const formattedData = data.map((record) => ({
          date: new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          month: new Date(record.date).toLocaleDateString('en-US', { month: 'long' }),
          year: new Date(record.date).getFullYear().toString(),
          checkIn: record.checkInTime || '-',
          checkOut: record.checkOutTime || '-',
          hours: record.totalHours || 'Ongoing',
          dayType: record.type || 'Regular',
          status: record.status || 'Present',
          progress: record.progress || 0,
        }));
        setAttendanceHistory(formattedData);
      }
      setError('');
    } catch (err) {
      console.error('Error loading attendance:', err);
      setError(err.message || 'Failed to load attendance');
      setAttendanceHistory([
        {
          date: "Mar 31, 2026",
          month: "March",
          year: "2026",
          checkIn: "01:30 PM",
          checkOut: "-",
          hours: "5h 27m (ongoing)",
          dayType: "In Progress",
          status: "Present",
          progress: 65,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleCheckIn = async () => {
    // Check if already checked in today
    if (lastCheckInDate === todayDateString) {
      alert("You have already checked in today. You can check in again tomorrow.");
      return;
    }
    
    try {
      setIsCheckingIn(true);
      const response = await employeeAttendanceService.checkIn();
      const data = response.data || response;
      
      if (data) {
        const time = getCurrentTime();
        setCheckInTime(time);
        setLastCheckInDate(todayDateString);
        
        // Add entry to table immediately
        const today = new Date();
        const todayDate = `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
        const todayMonth = months[today.getMonth()];
        const todayYear = today.getFullYear().toString();
        
        const todayEntry = {
          date: todayDate,
          month: todayMonth,
          year: todayYear,
          checkIn: time,
          checkOut: "-",
          hours: "calculating...",
          dayType: "In Progress",
          status: "Present",
          progress: 0
        };
        
        setAttendanceHistory([todayEntry, ...attendanceHistory]);
        alert("Check-in successful!");
      }
    } catch (err) {
      console.error('Error checking in:', err);
      alert(err.message || 'Failed to check in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (checkInTime && !checkOutTime) {
      try {
        setIsCheckingOut(true);
        const response = await employeeAttendanceService.checkOut();
        const data = response.data || response;
        
        if (data) {
          const time = getCurrentTime();
          setCheckOutTime(time);
          
          // Update the first entry (today's entry) with checkout time
          const { hours, progress } = calculateHours(checkInTime, time);
          
          const updatedHistory = [...attendanceHistory];
          updatedHistory[0] = {
            ...updatedHistory[0],
            checkOut: time,
            hours: hours,
            dayType: "Regular",
            progress: progress
          };
          
          setAttendanceHistory(updatedHistory);
          alert("Check-out successful!");
          
          // Auto reset after 2 seconds for next day
          setTimeout(() => {
            setCheckInTime(null);
            setCheckOutTime(null);
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking out:', err);
        alert(err.message || 'Failed to check out');
      } finally {
        setIsCheckingOut(false);
      }
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

  const presentCount = filteredAttendance.filter(item => item.status === "Present").length;
  const totalDays = filteredAttendance.length;

  const isMarkedPresent = checkInTime !== null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Good afternoon, Sourav!
          </h1>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* Today Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900 text-base">Today</h2>
              <span className={`text-white text-xs px-2.5 py-1 rounded-full font-medium ${
                checkOutTime ? "bg-teal-500" : checkInTime ? "bg-teal-500" : "bg-gray-500"
              }`}>
                {checkOutTime ? "Present" : checkInTime ? "Present" : "Not Marked"}
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
                    stroke={checkOutTime ? "#14b8a6" : checkInTime ? "#14b8a6" : "#f59e0b"}
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
                  ? "bg-teal-600 hover:bg-teal-700" 
                  : !checkOutTime
                  ? "bg-teal-600 hover:bg-teal-700"
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
              <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-teal-200 bg-teal-50 mb-3">
                <Clock3 className="text-teal-600 w-5 h-5" />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average hours</p>
              <h2 className="text-xl font-bold text-gray-900">7h 17mins</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-orange-200 bg-orange-50 mb-3">
                <LogIn className="text-orange-500 w-5 h-5" />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average check-in</p>
              <h2 className="text-xl font-bold text-gray-900">10:33 AM</h2>
            </div>
          </div>

          {/* Stats - Column 2 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-teal-200 bg-teal-50 mb-3">
                <LogOut className="text-teal-600 w-5 h-5" />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Average check-out</p>
              <h2 className="text-xl font-bold text-gray-900">19:12 PM</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded border border-teal-200 bg-teal-50 mb-3">
                <CheckCircle2 className="text-teal-600 w-5 h-5" />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">On-time arrival</p>
              <h2 className="text-xl font-bold text-black">98.56%</h2>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-gray-900 text-base">My Attendance</h2>
              <button className="text-blue-600 text-xs hover:text-blue-700 font-medium">View Stats</button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-600 font-semibold">● {presentCount}</span>
                <span className="text-gray-600 text-xs">Present</span>
              </div>
            </div>

            <div className="flex justify-center py-4 border-t border-gray-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{presentCount}</h3>
                <p className="text-xs text-gray-500">/{totalDays} days</p>
              </div>
            </div>

            {/* <p className="text-emerald-600 text-xs text-center font-medium">
              ✓ Better than 96% employees!
            </p> */}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">

          {/* Working History */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            
            {/* Card Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">📋 Working History</h2>
              <p className="text-gray-600 text-xs mt-1">
                {attendanceHistory.filter(item =>
                  item.month === selectedMonth &&
                  item.year === selectedYear
                ).length} record(s) found
              </p>
            </div>

            {/* Filters Section */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                Filter Options
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
            <div className="p-4 sm:p-6 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Date</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Check In</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Check Out</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Working Hours</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Day Type</th>
                      <th className="text-left px-6 py-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Status</th>
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
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900">{item.date}</td>
                      <td className="px-6 py-4 text-gray-900">{item.checkIn}</td>
                      <td className="px-6 py-4 text-gray-600">{item.checkOut}</td>
                      <td className="px-6 py-4 text-gray-900">{item.hours}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.dayType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium border border-teal-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 px-4 text-center">
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