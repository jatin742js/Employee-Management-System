import React, { useState, useEffect } from 'react';
import {
  Bell,
  MessageSquare,
  Moon,
  Sun,
  Search,
  User,
  LogOut,
  ChevronDown,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Briefcase,
  FileText,
  Download,
  Video,
  DollarSign,
  Award,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  UserCheck,
  CalendarDays,
  Home,
  CreditCard,
  Upload,
  Shield,
  Star,
  PieChart,
  CalendarCheck,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const EmployeeDashboard = () => {
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // UI states
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount] = useState(2);

  // Attendance states
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workingHours, setWorkingHours] = useState('0h 0m');

  // Mock data
  const [tasks] = useState([
    { id: 1, name: 'Complete monthly report', priority: 'High', deadline: '2025-03-25', progress: 70, status: 'In Progress' },
    { id: 2, name: 'Update employee profiles', priority: 'Medium', deadline: '2025-03-28', progress: 40, status: 'Pending' },
    { id: 3, name: 'Review Q1 performance', priority: 'Low', deadline: '2025-03-30', progress: 10, status: 'Pending' },
  ]);

  const [projects] = useState([
    { id: 1, name: 'HRMS Upgrade', team: ['John', 'Sarah'], progress: 65, deadline: '2025-04-15' },
    { id: 2, name: 'Mobile App Launch', team: ['Mike', 'Anna'], progress: 30, deadline: '2025-05-01' },
  ]);

  const [meetings] = useState([
    { id: 1, title: 'Team Sync', time: '10:00 AM', department: 'Engineering', joinLink: '#' },
    { id: 2, title: 'Project Review', time: '2:00 PM', department: 'Product', joinLink: '#' },
  ]);

  const [notifications] = useState([
    { id: 1, title: 'HR Policy Update', message: 'New remote work policy effective April 1', time: '2h ago' },
    { id: 2, title: 'Leave Approved', message: 'Your leave request for March 20-22 has been approved', time: '5h ago' },
    { id: 3, title: 'Meeting Reminder', message: 'Performance review at 3 PM today', time: '1d ago' },
  ]);

  const leaveBalances = { casual: 12, sick: 8, earned: 4 };
  const recentLeaves = [
    { id: 1, type: 'Casual', from: '2025-03-20', to: '2025-03-22', status: 'Approved' },
    { id: 2, type: 'Sick', from: '2025-03-05', to: '2025-03-06', status: 'Approved' },
  ];

  const salarySlip = { amount: 5500, tax: 450, bonus: 300, month: 'March 2025' };

  const performance = { score: 88, attendance: 95, tasksCompleted: 85 };

  const importantDates = [
    { date: '2025-03-25', event: 'Team Meeting', type: 'meeting' },
    { date: '2025-03-30', event: 'Holiday: Holi', type: 'holiday' },
    { date: '2025-04-01', event: 'Quarterly Review', type: 'meeting' },
  ];

  const documents = [
    { name: 'Offer Letter', icon: FileText, type: 'pdf' },
    { name: 'ID Card', icon: Shield, type: 'image' },
    { name: 'Certificates', icon: Award, type: 'pdf' },
  ];

  // Helper functions
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    if (checkInTime) {
      // Mock calculation – in real app, compute from stored times
      setWorkingHours('7h 30m');
    }
    setIsCheckedIn(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // KPI cards data
  const kpiCards = [
    { label: 'Present Days', value: 18, icon: Calendar, trend: '+2', trendUp: true, unit: 'days' },
    { label: 'Absent Days', value: 2, icon: XCircle, trend: '-1', trendUp: false, unit: 'days' },
    { label: 'Leave Balance', value: 12, icon: CalendarDays, trend: '5 left', trendUp: true, unit: 'days' },
    { label: 'Pending Tasks', value: 5, icon: CheckSquare, trend: '+3', trendUp: false, unit: 'tasks' },
    { label: 'Salary Status', value: 'Paid', icon: DollarSign, trend: 'March', trendUp: true, unit: '' },
    { label: 'Active Projects', value: 3, icon: FolderKanban, trend: '+1', trendUp: true, unit: 'projects' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Briefcase className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">EmployeeHub</span>
              </div>
              {/* Search Bar - hidden on mobile */}
              <div className="hidden md:ml-6 md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                          <p className="font-medium text-gray-800 dark:text-white">{notif.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
                          <span className="text-xs text-gray-400">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Icon */}
              <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <MessageSquare className="h-5 w-5" />
                {messageCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-500 rounded-full">
                    {messageCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">Jatin Sharma</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Jatin Sharma</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Senior Software Engineer</p>
                    </div>
                    <div className="py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {getGreeting()}, Jatin!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Senior Software Engineer · Engineering Department
              </p>
            </div>
            <div className="mt-2 sm:mt-0 text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
              <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{currentTime}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {kpiCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
                  <span className={`text-sm font-medium ${card.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2 text-gray-800 dark:text-white">
                  {typeof card.value === 'number' ? card.value : card.value}
                  {card.unit && <span className="text-sm font-normal text-gray-500"> {card.unit}</span>}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Widget */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-500" /> Today's Attendance
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Check-in:</span>
                <span className="font-medium">{checkInTime || '--:--'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Check-out:</span>
                <span className="font-medium">{checkOutTime || '--:--'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Working Hours:</span>
                <span className="font-medium">{workingHours}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className={`font-medium ${isCheckedIn ? 'text-green-500' : 'text-red-500'}`}>
                  {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>
              <div className="flex space-x-2 pt-2">
                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                  >
                    Punch In
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                  >
                    Punch Out
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Leave Overview */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <CalendarDays className="h-5 w-5 mr-2 text-indigo-500" /> Leave Overview
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Casual</p>
                  <p className="text-lg font-bold">{leaveBalances.casual}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sick</p>
                  <p className="text-lg font-bold">{leaveBalances.sick}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Earned</p>
                  <p className="text-lg font-bold">{leaveBalances.earned}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Recent Requests</p>
                {recentLeaves.map(leave => (
                  <div key={leave.id} className="flex justify-between text-sm py-1">
                    <span>{leave.type} ({leave.from} - {leave.to})</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Apply Leave →
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                Apply Leave
              </button>
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                Mark Attendance
              </button>
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                View Payslip
              </button>
              <button className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 p-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                Update Profile
              </button>
            </div>
          </div>

          {/* Task Management */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <CheckSquare className="h-5 w-5 mr-2 text-indigo-500" /> Assigned Tasks
            </h2>
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{task.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                        <span className={`px-2 py-0.5 rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span>Due: {task.deadline}</span>
                        <span>{task.status}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{task.progress}%</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Overview */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <FolderKanban className="h-5 w-5 mr-2 text-indigo-500" /> Active Projects
            </h2>
            <div className="space-y-4">
              {projects.map(proj => (
                <div key={proj.id}>
                  <p className="font-medium text-gray-800 dark:text-white">{proj.name}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Team: {proj.team.join(', ')}</span>
                    <span>Deadline: {proj.deadline}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${proj.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1">{proj.progress}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payroll Quick Access */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-indigo-500" /> Payroll ({salarySlip.month})
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Gross Salary:</span>
                <span className="font-semibold">${salarySlip.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax Deduction:</span>
                <span>${salarySlip.tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bonus:</span>
                <span className="text-green-500">+${salarySlip.bonus}</span>
              </div>
              <div className="pt-2">
                <button className="w-full flex items-center justify-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition">
                  <Download className="h-4 w-4" />
                  <span>Download Salary Slip</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <Video className="h-5 w-5 mr-2 text-indigo-500" /> Upcoming Meetings
            </h2>
            <div className="space-y-3">
              {meetings.map(meeting => (
                <div key={meeting.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-gray-500">{meeting.time} · {meeting.department}</p>
                  <button className="text-xs text-indigo-600 hover:underline mt-1">Join meeting →</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-500" /> Recent Alerts
            </h2>
            <div className="space-y-3">
              {notifications.slice(0, 2).map(notif => (
                <div key={notif.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-xs text-gray-500">{notif.message}</p>
                  <span className="text-xs text-gray-400">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-indigo-500" /> Performance Summary
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Performance Score</span>
                  <span>{performance.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${performance.score}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Attendance</span>
                  <span>{performance.attendance}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${performance.attendance}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Task Completion</span>
                  <span>{performance.tasksCompleted}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${performance.tasksCompleted}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" /> Important Dates
            </h2>
            <div className="space-y-2">
              {importantDates.map((item, idx) => (
                <div key={idx} className="flex items-center text-sm">
                  <span className="w-24 text-gray-500">{item.date}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    item.type === 'holiday' ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-500" /> Documents
            </h2>
            <div className="space-y-2">
              {documents.map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs">Download</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;