import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import adminLeaveService from '../../../services/adminLeaveService';

export default function LeaveManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadLeaveRequests();
  }, []);

  const formatLeaveType = (leaveType) => {
    const type = (leaveType || '').toLowerCase();
    const typeMap = {
      sick: 'SICK',
      casual: 'CASUAL',
      earned: 'ANNUAL',
      maternity: 'MATERNITY',
      paternity: 'PATERNITY',
      unpaid: 'UNPAID',
    };

    return typeMap[type] || (leaveType || 'N/A').toUpperCase();
  };

  const loadLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await adminLeaveService.getAllLeaves();

      const leavesData =
        response?.data?.leaves ||
        response?.leaves ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);

      const normalizedLeaves = Array.isArray(leavesData)
        ? leavesData.map((leave) => ({
            ...leave,
            employeeName: leave.employeeName || leave.employee?.name || leave.employee?.email || 'Unknown',
            leaveType: formatLeaveType(leave.leaveType),
            status: (leave.status || 'PENDING').toUpperCase(),
          }))
        : [];

      setLeaveRequests(normalizedLeaves);

      // Calculate stats on normalized data
      const total = normalizedLeaves.length;
      const pending = normalizedLeaves.filter((l) => l.status === 'PENDING').length;
      const approved = normalizedLeaves.filter((l) => l.status === 'APPROVED').length;
      const rejected = normalizedLeaves.filter((l) => l.status === 'REJECTED').length;
      setStats({ total, pending, approved, rejected });

      setError('');
    } catch (err) {
      const errorMsg = err.message || 'Failed to load leave requests';
      setError(errorMsg);
      console.error('Error loading leaves:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminLeaveService.approveLeave(id);
      alert('Leave approved successfully!');
      await loadLeaveRequests();
    } catch (err) {
      alert('Failed to approve leave: ' + err.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await adminLeaveService.rejectLeave(id, reason);
      alert('Leave rejected successfully!');
      await loadLeaveRequests();
    } catch (err) {
      alert('Failed to reject leave: ' + err.message);
    }
  };

  const filteredRequests = leaveRequests.filter(leave => {
    const matchesSearch = leave.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'ALL' || leave.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '—';
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading leave requests...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadLeaveRequests}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only Show When Loaded */}
      {!isLoading && (
      <>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage leave applications</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Total Leaves */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Total Leaves</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
        </div>

        {/* Pending */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Pending</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.pending}</h3>
        </div>

        {/* Approved */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Approved</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.approved}</h3>
        </div>

        {/* Rejected */}
        <div className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow p-6">
          <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Rejected</p>
          <h3 className="text-3xl font-bold text-gray-900">{stats.rejected}</h3>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 flex-1 h-11 hover:border-indigo-400 hover:bg-gray-50 transition min-w-0">
            <Search size={18} className="text-gray-400 shrink-0" />
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
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition min-w-max"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Dates</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{leave.employeeName}</td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-700 font-semibold bg-gray-100 px-2.5 py-1.5 rounded">
                    {leave.leaveType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {formatDate(leave.startDate)} - {formatDate(leave.endDate)}{leave.endDate ? `, ${new Date(leave.endDate).getFullYear()}` : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{leave.reason}</td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(leave.status)}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {/* Action Buttons */}
                  {leave.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(leave._id)}
                        className="px-3 py-1.5 text-sm text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(leave._id)}
                        className="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {leave.status !== 'PENDING' && (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>        </div>      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="bg-white  shadow-sm border border-gray-200 text-center py-12">
          <p className="text-gray-500 font-medium">No leave requests found</p>
        </div>
      )}
      </>
      )}
    </div>
  );
}
