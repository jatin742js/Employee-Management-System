import React, { useState, useEffect } from "react";

// --- Helper Functions ---
const getGreeting = (hour) => {
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Mock data for employee profile
const employeeData = {
  name: "Olivia Chen",
  id: "E-10245",
  department: "Product Design",
  photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
};

// Mock data for leave balances
const leaveBalances = {
  sickLeave: 12,
  casualLeave: 8,
  annualLeave: 14,
};

// Mock data for pay statements
const latestPayStatement = {
  month: "March 2025",
  netPay: 4250.0,
  pdfUrl: "#",
};

// Mock data for schedule & events
const todaysSchedule = [
  { title: "Morning Shift", time: "9:00 AM - 5:00 PM", type: "shift" },
  { title: "Design Review", time: "11:00 AM - 12:00 PM", type: "meeting" },
  { title: "1:1 with Manager", time: "2:00 PM - 2:30 PM", type: "meeting" },
];

const upcomingEvents = [
  { title: "All-Hands Meeting", date: "Tomorrow, 10:00 AM" },
  { title: "Company Holiday", date: "Good Friday, Apr 18" },
  { title: "Product Launch", date: "Apr 22, 3:00 PM" },
];

const weeklyShifts = [
  { day: "Mon", hours: "9:00 - 17:00" },
  { day: "Tue", hours: "9:00 - 17:00" },
  { day: "Wed", hours: "9:00 - 17:00" },
  { day: "Thu", hours: "9:00 - 17:00" },
  { day: "Fri", hours: "9:00 - 17:00" },
];

// --- Main Dashboard Component ---
const ESSDashboard = () => {
  // State for real-time clock & greeting
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // State for Attendance (Punch In/Out)
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentDateTime.getHours();
  const greeting = getGreeting(currentHour);
  const formattedDate = formatDate(currentDateTime);
  const formattedTime = formatTime(currentDateTime);

  // Handle Punch In/Out
  const handlePunch = () => {
    if (!isClockedIn) {
      // Punch In
      setIsClockedIn(true);
      setClockInTime(new Date());
    } else {
      // Punch Out
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  // Helper for alert actions (demo)
  const handleRequestTimeOff = () => {
    alert("Opening request time off form...");
  };

  const handleDownloadPayStub = () => {
    alert("Downloading pay stub (PDF) ...");
  };

  const handleQuickLink = (link) => {
    alert(`Redirecting to: ${link}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Main container with bento grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Responsive grid: 3 columns on large, 1 on small */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Header + Announcement */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
                    {greeting}, {employeeData.name}! 👋
                  </h1>
                  <p className="text-gray-500 mt-1">
                    {formattedDate} · {formattedTime}
                  </p>
                </div>
                <div className="bg-teal-50 border-l-4 border-teal-500 px-4 py-2 rounded-lg">
                  <p className="text-sm text-teal-700 font-medium">
                    📢 New benefits enrollment period ends April 30!
                  </p>
                </div>
              </div>
            </div>

            {/* Two-column sub-grid: Attendance + Leave Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance / Time Tracking Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-teal-600">⏱️</span> Time Tracking
                </h2>
                <div className="flex flex-col items-center text-center space-y-5">
                  {/* Large status button */}
                  <button
                    onClick={handlePunch}
                    className={`w-full py-4 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-md ${
                      isClockedIn
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-teal-600 hover:bg-teal-700"
                    }`}
                  >
                    {isClockedIn ? "🔴 Clock Out" : "🟢 Punch In / Start Shift"}
                  </button>

                  {/* Current Status & Total Hours */}
                  <div className="w-full bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Current Status:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isClockedIn
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isClockedIn ? "On Shift ✅" : "Off Duty ⏸️"}
                      </span>
                    </div>
                    {isClockedIn && clockInTime && (
                      <div className="text-sm text-gray-500">
                        Clocked in since: {formatTime(clockInTime)}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">
                        Total Hours This Week:
                      </span>
                      <span className="font-bold text-gray-800 text-lg">
                        38.5 hrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Management Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">🌿</span> Leave Balances
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Sick Leave</span>
                    <span className="font-medium text-gray-800">
                      {leaveBalances.sickLeave} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-600">Casual Leave</span>
                    <span className="font-medium text-gray-800">
                      {leaveBalances.casualLeave} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600">Annual Leave</span>
                    <span className="font-medium text-gray-800">
                      {leaveBalances.annualLeave} days
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRequestTimeOff}
                  className="w-full py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200"
                >
                  📅 Request Time Off
                </button>
              </div>
            </div>

            {/* My Calendar & Upcoming Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-indigo-500">📅</span> My Calendar & Upcoming
              </h2>
              {/* Today's schedule highlight */}
              <div className="mb-6 bg-indigo-50 rounded-xl p-4">
                <h3 className="font-medium text-indigo-800 mb-2">
                  Today's Schedule
                </h3>
                <div className="space-y-2">
                  {todaysSchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 flex items-center gap-2">
                        {item.type === "shift" ? "🕒" : "👥"} {item.title}
                      </span>
                      <span className="text-gray-500 font-mono">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly shifts summary */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">
                  This Week's Shifts
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {weeklyShifts.map((shift) => (
                    <div
                      key={shift.day}
                      className="text-center bg-gray-50 rounded-lg p-2"
                    >
                      <div className="font-semibold text-gray-800">
                        {shift.day}
                      </div>
                      <div className="text-xs text-gray-500">
                        {shift.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming meetings & events */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">
                  Upcoming Events
                </h3>
                <div className="space-y-2">
                  {upcomingEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-gray-100 pb-2"
                    >
                      <span className="text-gray-800">{event.title}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {event.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Pay Statements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-blue-500">💰</span> Recent Pay Statements
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800">
                    {latestPayStatement.month}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${latestPayStatement.netPay.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleDownloadPayStub}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  📄 Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Snippet + Quick Links */}
          <div className="space-y-6">
            {/* Personal Profile Snippet */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md text-center">
              <div className="flex flex-col items-center">
                <img
                  src={employeeData.photoUrl}
                  alt={employeeData.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 shadow-sm"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {employeeData.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {employeeData.id} · {employeeData.department}
                </p>
                <div className="mt-4 w-full pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Employee Since</span>
                    <span className="font-medium text-gray-700">2022</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Work Location</span>
                    <span className="font-medium text-gray-700">Remote / HQ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links & Resources */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-purple-500">🔗</span> Quick Links
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickLink("Company Handbook")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-3 text-gray-700 font-medium"
                >
                  📘 Company Handbook
                </button>
                <button
                  onClick={() => handleQuickLink("Benefits Portal")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-3 text-gray-700 font-medium"
                >
                  🎯 Benefits Portal
                </button>
                <button
                  onClick={() => handleQuickLink("IT Support")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-3 text-gray-700 font-medium"
                >
                  🖥️ IT Support
                </button>
                <button
                  onClick={() => handleQuickLink("Learning Hub")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition flex items-center gap-3 text-gray-700 font-medium"
                >
                  📚 Learning & Development
                </button>
              </div>
            </div>

            {/* Additional tiny widget: wellness tip (optional for extra polish) */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧘</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Wellness Tip</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Take a 5-min stretch break — your focus will thank you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESSDashboard;