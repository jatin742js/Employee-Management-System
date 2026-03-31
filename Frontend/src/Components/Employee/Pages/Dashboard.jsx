import React, { useState, useEffect } from "react";

// Mock employee data
const employee = {
  name: "Olivia Chen",
  id: "E-10245",
  department: "Product Design",
  organization: "TechCorp Inc.",
  photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
};

// Mock leave balances
const leaveBalances = {
  sickLeave: 12,
  casualLeave: 8,
  annualLeave: 14,
};

// Mock pay statement
const latestPayStatement = {
  month: "March 2025",
  netPay: 4250.0,
  pdfUrl: "#",
};

// Mock schedule
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

// Helper functions
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

export default function EmployeeDashboard() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(currentDateTime.getHours());
  const formattedDate = formatDate(currentDateTime);
  const formattedTime = formatTime(currentDateTime);

  const handlePunch = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date());
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  const handleRequestTimeOff = () => alert("Opening request time off form...");
  const handleDownloadPayStub = () => alert("Downloading pay stub (PDF)...");
  const handleQuickLink = (link) => alert(`Redirecting to: ${link}`);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Responsive bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome header with organization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800 dark:text-white tracking-tight">
                    {greeting}, {employee.name}! 👋
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {employee.organization} · {employee.department}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {formattedDate} · {formattedTime}
                  </p>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/30 border-l-4 border-teal-500 px-4 py-2 rounded-lg">
                  <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">
                    📢 New benefits enrollment period ends April 30!
                  </p>
                </div>
              </div>
            </div>

            {/* Two‑column sub‑grid: Attendance + Leave Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance / Time Tracking Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-teal-600">⏱️</span> Time Tracking
                </h2>
                <div className="flex flex-col items-center text-center space-y-5">
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
                  <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        Current Status:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isClockedIn
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {isClockedIn ? "On Shift ✅" : "Off Duty ⏸️"}
                      </span>
                    </div>
                    {isClockedIn && clockInTime && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Clocked in since: {formatTime(clockInTime)}
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        Total Hours This Week:
                      </span>
                      <span className="font-bold text-gray-800 dark:text-white text-lg">
                        38.5 hrs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Management Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-emerald-500">🌿</span> Leave Balances
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Sick Leave</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {leaveBalances.sickLeave} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-300">Casual Leave</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {leaveBalances.casualLeave} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 dark:text-gray-300">Annual Leave</span>
                    <span className="font-medium text-gray-800 dark:text-white">
                      {leaveBalances.annualLeave} days
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRequestTimeOff}
                  className="w-full py-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  📅 Request Time Off
                </button>
              </div>
            </div>

            {/* My Calendar & Upcoming Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-indigo-500">📅</span> My Calendar & Upcoming
              </h2>
              {/* Today's schedule */}
              <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">
                  Today's Schedule
                </h3>
                <div className="space-y-2">
                  {todaysSchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        {item.type === "shift" ? "🕒" : "👥"} {item.title}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 font-mono">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly shifts summary */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  This Week's Shifts
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {weeklyShifts.map((shift) => (
                    <div
                      key={shift.day}
                      className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
                    >
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {shift.day}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {shift.hours}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming events */}
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Upcoming Events
                </h3>
                <div className="space-y-2">
                  {upcomingEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2"
                    >
                      <span className="text-gray-800 dark:text-gray-200">{event.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {event.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Pay Statements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-blue-500">💰</span> Recent Pay Statements
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {latestPayStatement.month}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
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

          {/* Right column: Profile Snippet + Quick Links */}
          <div className="space-y-6">
            {/* Personal Profile Snippet */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md text-center">
              <div className="flex flex-col items-center">
                <img
                  src={employee.photoUrl}
                  alt={employee.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-teal-100 dark:border-teal-900 shadow-sm"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                  {employee.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {employee.id} · {employee.department}
                </p>
                <div className="mt-4 w-full pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Organization</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{employee.organization}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Employee Since</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">2022</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500 dark:text-gray-400">Work Location</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Remote / HQ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links & Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-purple-500">🔗</span> Quick Links
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickLink("Company Handbook")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-3 text-gray-700 dark:text-gray-200 font-medium"
                >
                  📘 Company Handbook
                </button>
                <button
                  onClick={() => handleQuickLink("Benefits Portal")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-3 text-gray-700 dark:text-gray-200 font-medium"
                >
                  🎯 Benefits Portal
                </button>
                <button
                  onClick={() => handleQuickLink("IT Support")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-3 text-gray-700 dark:text-gray-200 font-medium"
                >
                  🖥️ IT Support
                </button>
                <button
                  onClick={() => handleQuickLink("Learning Hub")}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center gap-3 text-gray-700 dark:text-gray-200 font-medium"
                >
                  📚 Learning & Development
                </button>
              </div>
            </div>

            {/* Wellness tip */}
            <div className="bg-linear-to-r from-teal-50 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-2xl p-5 border border-teal-100 dark:border-teal-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧘</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Wellness Tip</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Take a 5-min stretch break — your focus will thank you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
          © 2025 Employee Management System · {employee.organization}
        </div> */}
      </div>
    </div>
  );
}