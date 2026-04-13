import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function LeaveManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      type: 'Casual', 
      from: '2026-04-02', 
      to: '2026-04-03', 
      reason: 'just a casual leave',
      status: 'APPROVED'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      type: 'Sick Leave', 
      from: '2026-04-05', 
      to: '2026-04-07', 
      reason: 'Medical appointment',
      status: 'PENDING'
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      type: 'Vacation', 
      from: '2026-04-10', 
      to: '2026-04-15', 
      reason: 'Family vacation',
      status: 'APPROVED'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      type: 'Personal', 
      from: '2026-04-08', 
      to: '2026-04-08', 
      reason: 'Personal work',
      status: 'REJECTED'
    },
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'APPROVED': 'bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded',
      'PENDING': 'bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded',
      'REJECTED': 'bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded',
    };
    return styles[status] || styles['PENDING'];
  };

  const handleStatusChange = (id, newStatus) => {
    setLeaveRequests(leaveRequests.map(leave => 
      leave.id === id ? { ...leave, status: newStatus } : leave
    ));
    setSelectedStatusId(null);
  };

  const filteredRequests = leaveRequests.filter(leave => {
    const matchesSearch = leave.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || leave.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-7 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600 mt-2">Manage leave applications</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Total Leaves */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Total Leaves</p>
          <h3 className="text-3xl font-bold text-gray-900">{leaveRequests.length}</h3>
        </div>

        {/* Pending */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Pending</p>
          <h3 className="text-3xl font-bold text-gray-900">{leaveRequests.filter(l => l.status === 'PENDING').length}</h3>
        </div>

        {/* Approved */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Approved</p>
          <h3 className="text-3xl font-bold text-gray-900">{leaveRequests.filter(l => l.status === 'APPROVED').length}</h3>
        </div>

        {/* Rejected */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Rejected</p>
          <h3 className="text-3xl font-bold text-gray-900">{leaveRequests.filter(l => l.status === 'REJECTED').length}</h3>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 flex-1 h-11 hover:border-indigo-400 hover:bg-gray-50 transition">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search leaves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ml-3 outline-none w-full text-sm bg-transparent"
            />
          </div>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5 w-44 text-sm font-medium text-gray-700 bg-white hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Dates</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{leave.name}</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-700 font-semibold bg-gray-100 px-2.5 py-1.5 rounded">
                    {leave.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDate(leave.from)} - {formatDate(leave.to)}, {new Date(leave.to).getFullYear()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{leave.reason}</td>
                <td className="px-6 py-4 relative">
                  <button 
                    onClick={() => setSelectedStatusId(selectedStatusId === leave.id ? null : leave.id)}
                    className={getStatusBadge(leave.status) + ' cursor-pointer hover:opacity-80'}
                  >
                    {leave.status}
                  </button>
                  
                  {/* Status Dropdown */}
                  {selectedStatusId === leave.id && (
                    <div className="absolute top-full left-6 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          handleStatusChange(leave.id, 'PENDING');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition"
                      >
                        PENDING
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(leave.id, 'APPROVED');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-teal-700 hover:bg-teal-50 border-t border-gray-200 transition"
                      >
                        APPROVED
                      </button>
                      <button
                        onClick={() => {
                          handleStatusChange(leave.id, 'REJECTED');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 border-t border-gray-200 transition"
                      >
                        REJECTED
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No leave requests found</p>
        </div>
      )}
    </div>
  );
}
