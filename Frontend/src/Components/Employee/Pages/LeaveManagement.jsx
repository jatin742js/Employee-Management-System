import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  Filter,
  Send,
  Briefcase,
  Heart,
  TrendingUp,
} from 'lucide-react';

const LeaveManagement = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const leaveBalance = [
    { type: 'Casual Leave', available: 8, used: 4, total: 12, color: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200', icon: '🏖️' },
    { type: 'Sick Leave', available: 10, used: 2, total: 12, color: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200', icon: '🏥' },
    { type: 'Earned Leave', available: 15, used: 5, total: 20, color: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200', icon: '🎉' },
    { type: 'Special Leave', available: 3, used: 0, total: 3, color: 'bg-purple-50', textColor: 'text-purple-700', borderColor: 'border-purple-200', icon: '⭐' },
  ];

  const leaveRequests = [
    { id: 1, type: 'Casual Leave', from: '2026-04-10', to: '2026-04-12', days: 3, status: 'approved', reason: 'Vacation', appliedOn: '2026-03-28' },
    { id: 2, type: 'Sick Leave', from: '2026-03-20', to: '2026-03-21', days: 2, status: 'approved', reason: 'Medical', appliedOn: '2026-03-18' },
    { id: 3, type: 'Casual Leave', from: '2026-04-15', to: '2026-04-17', days: 3, status: 'pending', reason: 'Personal', appliedOn: '2026-04-01' },
    { id: 4, type: 'Earned Leave', from: '2026-05-01', to: '2026-05-05', days: 5, status: 'pending', reason: 'Vacation', appliedOn: '2026-04-05' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ leaveType, startDate, endDate, reason });
    setLeaveType('');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const getStatusColor = (status) => {
    return status === 'approved' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : status === 'pending'
      ? 'bg-amber-100 text-amber-800 border-amber-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = (status) => {
    return status === 'approved' 
      ? <CheckCircle2 size={16} className="text-green-600" />
      : status === 'pending'
      ? <Clock size={16} className="text-amber-600" />
      : <AlertCircle size={16} className="text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-2">Manage your leaves, check balance, and track requests</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'request', label: 'Request Leave', icon: '📝' },
            { id: 'history', label: 'History', icon: '📋' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-all border-b-2 ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div>
            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {leaveBalance.map((leave, index) => (
                <div
                  key={index}
                  className={`${leave.color} border ${leave.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Leave Balance</p>
                      <h3 className={`text-2xl font-bold ${leave.textColor} mt-1`}>{leave.available}</h3>
                    </div>
                    <span className="text-3xl">{leave.icon}</span>
                  </div>
                  <p className={`${leave.textColor} text-sm font-semibold mb-3`}>{leave.type}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Used</span>
                      <span>{leave.used}/{leave.total}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${
                          leave.type === 'Casual Leave' ? 'from-blue-400 to-blue-600' :
                          leave.type === 'Sick Leave' ? 'from-red-400 to-red-600' :
                          leave.type === 'Earned Leave' ? 'from-green-400 to-green-600' :
                          'from-purple-400 to-purple-600'
                        }`}
                        style={{ width: `${(leave.used / leave.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Leaves Used</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">11</h3>
                    <p className="text-xs text-gray-500 mt-2">Out of 47 total leaves</p>
                  </div>
                  <TrendingUp className="text-blue-600 opacity-20" size={48} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Requests</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">2</h3>
                    <p className="text-xs text-gray-500 mt-2">Awaiting approval</p>
                  </div>
                  <Clock className="text-amber-600 opacity-20" size={48} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Approved Leaves</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">2</h3>
                    <p className="text-xs text-gray-500 mt-2">Confirmed & scheduled</p>
                  </div>
                  <CheckCircle2 className="text-green-600 opacity-20" size={48} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Leave Tab */}
        {selectedTab === 'request' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Request New Leave</h2>
                <p className="text-gray-600 text-sm mt-1">Fill in the details to apply for leave</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Leave Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  >
                    <option value="">Select leave type</option>
                    <option value="casual">Casual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="earned">Earned Leave</option>
                    <option value="special">Special Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Reason</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a reason for your leave request..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Note:</span> Your leave request will be forwarded to your manager for approval. You'll receive a notification once it's reviewed.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* History Tab */}
        {selectedTab === 'history' && (
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 bg-linear-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Leave History</h2>
                  <p className="text-gray-600 text-sm mt-1">All your leave requests and approvals</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <Download size={18} />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Leave Type</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applied On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {request.type === 'Casual Leave' ? '🏖️' :
                               request.type === 'Sick Leave' ? '🏥' :
                               request.type === 'Earned Leave' ? '🎉' : '⭐'}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{request.type}</p>
                              <p className="text-xs text-gray-500">{request.reason}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm text-gray-900">{request.from} to {request.to}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-semibold text-gray-900">{request.days} days</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm text-gray-600">{request.appliedOn}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveManagement;
