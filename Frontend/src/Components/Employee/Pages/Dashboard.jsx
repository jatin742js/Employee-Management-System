import React, { useState } from 'react';
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

const Dashboard = () => {
  const employeeData = {
    name: 'Olivia Chen',
    role: 'Senior Product Designer',
    department: 'Product Design',
    company: 'TechCorp Inc.',
    joinDate: 'Jan 15, 2023',
  };

  const statsData = [
    {
      title: 'Total Hours',
      value: '160',
      unit: 'hrs/month',
      icon: Clock,
      color: 'teal',
      trend: '+2.5% from last month',
    },
    {
      title: 'Current Salary',
      value: '₹50,000',
      unit: 'per month',
      icon: DollarSign,
      color: 'cyan',
      trend: 'On schedule',
    },
    {
      title: 'Leaves Remaining',
      value: '8',
      unit: 'days left',
      icon: Calendar,
      color: 'emerald',
      trend: '25 used this year',
    },
    {
      title: 'Attendance',
      value: '98%',
      unit: 'attendance rate',
      icon: UserCheck,
      color: 'blue',
      trend: 'Excellent performance',
    },
  ];

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

  const colorMap = {
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: 'bg-teal-100' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100' },
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-5xl ml-8 mr-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {employeeData.name} 👋</h1>
          <p className="text-gray-600 text-sm mt-2">
            {employeeData.company} · {employeeData.department}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Events - Wider */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">📅 Upcoming Events</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{event.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </div>
                    <div className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded text-xs font-medium border border-teal-200">
                      {event.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities - Sidebar */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">✓ Recent Activity</h2>
            </div>
            <div className="p-4">
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

        {/* Quick Stats Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Links */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">⚡ Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-all text-sm font-medium text-gray-900">
                  Request Leave
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-all text-sm font-medium text-gray-900">
                  View Pay Slip
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-all text-sm font-medium text-gray-900">
                  Update Profile
                </button>
                <button className="p-3 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-all text-sm font-medium text-gray-900">
                  Download Forms
                </button>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">📈 Performance Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Productivity</span>
                    <span className="text-sm font-semibold text-teal-700">92%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-teal-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Attendance</span>
                    <span className="text-sm font-semibold text-teal-700">98%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-teal-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Projects Completed</span>
                    <span className="text-sm font-semibold text-teal-700">87%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">Great job! Keep up the excellent work.</p>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Bell size={20} className="text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Company Announcement</p>
              <p className="text-sm text-blue-800 mt-1">
                New office hours starting April 15. Remote work allowed on Wednesdays and Fridays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
