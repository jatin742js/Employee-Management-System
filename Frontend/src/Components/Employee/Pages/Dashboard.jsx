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
      title: 'Total Leaves',
      value: '12',
      unit: 'days available',
      icon: Calendar,
      color: 'cyan',
      trend: '5 used this year',
    },
    {
      title: 'Attendance',
      value: '98%',
      unit: 'attendance rate',
      icon: UserCheck,
      color: 'emerald',
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
    teal: { bg: 'bg-white', border: 'border-teal-200', text: 'text-teal-700', icon: 'bg-teal-100' },
    cyan: { bg: 'bg-white', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100' },
    emerald: { bg: 'bg-white', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100' },
    blue: { bg: 'bg-white', border: 'border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100' },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100  py-8 px-4">
      <div className="w-full px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {employeeData.name} </h1>
          <p className="text-gray-600 text-sm mt-2">
            {employeeData.company} · {employeeData.department}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
              <h2 className="text-lg font-semibold text-gray-900">� Notifications</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-start justify-between cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      event.type === 'review' ? 'bg-purple-100 text-purple-700' :
                      event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
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

        {/* Announcements */}
        {/* <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Bell size={20} className="text-blue-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Company Announcement</p>
              <p className="text-sm text-blue-800 mt-1">
                New office hours starting April 15. Remote work allowed on Wednesdays and Fridays.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
