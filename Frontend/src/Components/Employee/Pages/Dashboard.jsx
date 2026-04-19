import React, { useState, useEffect } from 'react';
import {
  Clock,
  DollarSign,
  Calendar,
  UserCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Bell,
  Download,
} from 'lucide-react';
import employeeDashboardService from '../../../services/employeeDashboardService';
import employeeAuthService from '../../../services/employeeAuthService';

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    department: 'Loading...',
    company: 'TechCorp Inc.',
    joinDate: 'Loading...',
  });

  const [statsData, setStatsData] = useState([
    {
      title: 'Total Hours',
      value: '-',
      unit: 'hrs/month',
      icon: Clock,
      color: 'teal',
      trend: 'Loading...',
    },
    {
      title: 'Total Leaves',
      value: '-',
      unit: 'days available',
      icon: Calendar,
      color: 'cyan',
      trend: 'Loading...',
    },
    {
      title: 'Attendance',
      value: '-',
      unit: 'attendance rate',
      icon: UserCheck,
      color: 'emerald',
      trend: 'Loading...',
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const upcomingEvents = [
    { id: 1, title: 'Monthly Performance Review', date: 'April 15, 2026', type: 'review', icon: '📊' },
    { id: 2, title: 'Team Meeting', date: 'April 10, 2026', type: 'meeting', icon: '👥' },
    { id: 3, title: 'Project Deadline', date: 'April 12, 2026', type: 'deadline', icon: '🎯' },
    { id: 4, title: 'Vacation Approved', date: 'April 20-27, 2026', type: 'leave', icon: '🏖️' },
  ];

  const recentActivities = [
    { id: 1, action: 'Attendance marked', time: 'Today at 9:30 AM', status: 'success' },
    { id: 2, action: 'Salary processed', time: '2 days ago', status: 'success' },
    { id: 3, action: 'Leave request submitted', time: '3 days ago', status: 'success' },
    { id: 4, action: 'Document updated', time: '1 week ago', status: 'neutral' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile data
      const profileResponse = await employeeAuthService.getEmployeeProfile();
      const profileData = profileResponse.data || profileResponse;
      
      if (profileData) {
        setEmployeeData({
          name: profileData.name || 'Employee',
          role: profileData.position || 'Employee',
          department: profileData.department || 'General',
          company: 'TechCorp Inc.',
          joinDate: profileData.joinDate || 'N/A',
        });
      }

      // Load dashboard stats
      const statsResponse = await employeeDashboardService.getDashboardStats();
      const stats = statsResponse.data || statsResponse;

      if (stats) {
        const updatedStats = [
          {
            ...statsData[0],
            value: stats.totalHours || '160',
            trend: stats.hoursTrend || '+2.5% from last month',
          },
          {
            ...statsData[1],
            value: stats.totalLeaves || '12',
            trend: stats.leavesTrend || '5 used this year',
          },
          {
            ...statsData[2],
            value: stats.attendanceRate || '98%',
            trend: stats.attendanceTrend || 'Excellent performance',
          },
        ];
        setStatsData(updatedStats);
      }

      setError('');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMsg = err.message || 'Failed to load dashboard data';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const colorMap = {
    teal: { bg: 'bg-white', border: 'border-teal-200', text: 'text-teal-700', icon: 'bg-teal-100' },
    cyan: { bg: 'bg-white', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100' },
    emerald: { bg: 'bg-white', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100' },
    blue: { bg: 'bg-white', border: 'border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100' },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {employeeData.name} </h1>
          <p className="text-gray-600 text-sm mt-2">
            {employeeData.company} · {employeeData.department}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const colors = colorMap[stat.color];
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-lg p-4 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`${colors.icon} p-2 rounded-lg`}>
                    <Icon size={18} className={colors.text} />
                  </div>
                </div>
                <p className={`${colors.text} text-xs font-semibold uppercase tracking-wide mb-1`}>
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-xs">{stat.unit}</p>
                <p className="text-gray-500 text-xs mt-2">{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Upcoming Events - Wider */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">🔔 Notifications</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-start justify-between cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      event.type === 'review' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'meeting' ? 'bg-teal-100 text-teal-700' :
                      event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {event.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities - Sidebar */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">✓ Recent Activity</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="pb-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {activity.status === 'success' ? (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        {/* <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Bell size={20} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-teal-900">Company Announcement</p>
              <p className="text-sm text-teal-800 mt-1">
                New office hours starting April 15. Remote work allowed on Wednesdays and Fridays.
              </p>
            </div>
          </div>
        </div> */}
      </div>
      )}
    </div>
  );
};

export default Dashboard;
