import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Leave Approved', message: 'Your leave request has been approved', time: '2 hours ago' },
    { id: 2, title: 'New Task Assigned', message: 'You are assigned to Website Redesign', time: '5 hours ago' },
    { id: 3, title: 'Payslip Ready', message: 'Your March payslip is ready', time: '1 day ago' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with important notifications</p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                <span className="text-xs text-gray-500 mt-2">{n.time}</span>
              </div>
              <button onClick={() => setNotifications(notifications.filter(x => x.id !== n.id))} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
