import React, { useState } from 'react';
import { Calendar, Clock, FileText, Plus, Filter } from 'lucide-react';

export default function LeaveManagementEmployee() {
  const [showForm, setShowForm] = useState(false);

  const leaveBalance = [
    { type: 'Sick Leave', total: 10, used: 2, balance: 8, color: 'red' },
    { type: 'Vacation', total: 15, used: 3, balance: 12, color: 'blue' },
    { type: 'Casual Leave', total: 8, used: 2, balance: 6, color: 'green' },
    { type: 'Maternity Leave', total: 60, used: 0, balance: 60, color: 'purple' },
  ];

  const leaveHistory = [
    { id: 1, type: 'Sick Leave', from: '2025-03-10', to: '2025-03-10', days: 1, status: 'Approved' },
    { id: 2, type: 'Vacation', from: '2025-02-15', to: '2025-02-17', days: 3, status: 'Approved' },
    { id: 3, type: 'Casual Leave', from: '2025-01-20', to: '2025-01-20', days: 1, status: 'Approved' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leave Management</h1>
            <p className="text-gray-600 dark:text-gray-400">View your leave balance and history</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="h-4 w-4" />
            Apply Leave
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leave Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaveBalance.map((leave, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{leave.type}</h3>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(leave.used / leave.total) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Used: {leave.used}/{leave.total}</span>
                    <span>Available: {leave.balance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Leave History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">From Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">To Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Days</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaveHistory.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{leave.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{leave.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{leave.to}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{leave.days}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
