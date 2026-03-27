import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, MapPin } from 'lucide-react';

export default function EmployeeAttendance() {
  const [currentMonth, setCurrentMonth] = useState('March 2025');

  const attendanceCalendar = [
    { date: '1', status: 'present', day: 'Mon' },
    { date: '2', status: 'present', day: 'Tue' },
    { date: '3', status: 'present', day: 'Wed' },
    { date: '4', status: 'late', day: 'Thu' },
    { date: '5', status: 'absent', day: 'Fri' },
    { date: '6', status: 'present', day: 'Sat' },
    { date: '7', status: 'present', day: 'Sun' },
    { date: '8', status: 'present', day: 'Mon' },
    { date: '9', status: 'present', day: 'Tue' },
    { date: '10', status: 'present', day: 'Wed' },
    { date: '11', status: 'present', day: 'Thu' },
    { date: '12', status: 'present', day: 'Fri' },
    { date: '13', status: 'present', day: 'Sat' },
    { date: '14', status: 'present', day: 'Sun' },
    { date: '15', status: 'holiday', day: 'Mon' },
    { date: '16', status: 'present', day: 'Tue' },
    { date: '17', status: 'present', day: 'Wed' },
    { date: '18', status: 'present', day: 'Thu' },
    { date: '19', status: 'late', day: 'Fri' },
    { date: '20', status: 'present', day: 'Sat' },
    { date: '21', status: 'present', day: 'Sun' },
    { date: '22', status: 'present', day: 'Mon' },
    { date: '23', status: 'present', day: 'Tue' },
    { date: '24', status: 'present', day: 'Wed' },
    { date: '25', status: 'present', day: 'Thu' },
    { date: '26', status: 'present', day: 'Fri' },
    { date: '27', status: 'present', day: 'Sat' },
    { date: '28', status: 'present', day: 'Sun' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'present': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      'late': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      'absent': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      'holiday': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    };
    return colors[status] || '';
  };

  const stats = [
    { label: 'Present', value: '19', icon: CheckCircle, color: 'green' },
    { label: 'Late', value: '2', icon: Clock, color: 'yellow' },
    { label: 'Absent', value: '1', icon: AlertCircle, color: 'red' },
    { label: 'Holidays', value: '1', icon: Calendar, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Attendance</h1>
          <p className="text-gray-600 dark:text-gray-400">{currentMonth}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Today's Check-in */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Check In</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">09:00 AM</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-gray-600 dark:text-gray-400">On Site</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Check Out</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">--:--</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Pending</p>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Attendance Calendar</h2>
          <div className="grid grid-cols-7 gap-2">
            {attendanceCalendar.map((day, idx) => (
              <div key={idx} className={`p-3 rounded-lg text-center cursor-pointer transition ${getStatusColor(day.status)}`}>
                <p className="text-xs font-semibold">{day.day}</p>
                <p className="text-lg font-bold">{day.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
