import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Download,
  Eye,
} from 'lucide-react';
import adminDashboardService from '../../../services/adminDashboardService';
import adminLeaveService from '../../../services/adminLeaveService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin',
    organization: 'Loading...',
    role: 'Administrator',
  });
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingRequests: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get admin info from localStorage
      const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
      if (adminUser.name) {
        setAdminInfo({
          name: adminUser.name || 'Admin',
          organization: adminUser.organization || 'Organization',
          role: adminUser.role || 'Administrator',
        });
      }

      // Fetch dashboard stats
      const statsResponse = await adminDashboardService.getDashboardStats();
      if (statsResponse.data) {
        setStats({
          totalEmployees: statsResponse.data.totalEmployees || 0,
          presentToday: statsResponse.data.presentToday || 0,
          onLeave: statsResponse.data.onLeave || 0,
          pendingRequests: statsResponse.data.pendingLeaves || 0,
        });
      }

      // Fetch leave requests with pending status
      const leavesResponse = await adminLeaveService.getAllLeaves({ status: 'pending' });
      if (leavesResponse.data && leavesResponse.data.leaves) {
        setLeaveRequests(leavesResponse.data.leaves.slice(0, 4));
      }
    } catch (err) {
      const errorMsg = err.message || err.data?.message || 'Failed to load dashboard data';
      setError(errorMsg);
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLeave = async (id) => {
    try {
      await adminLeaveService.approveLeave(id);
      // Update local state
      setLeaveRequests(prev =>
        prev.map(req =>
          req._id === id || req.id === id ? { ...req, status: 'approved' } : req
        )
      );
    } catch (err) {
      console.error('Error approving leave:', err);
      alert('Failed to approve leave');
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await adminLeaveService.rejectLeave(id, 'Rejected by admin');
      // Update local state
      setLeaveRequests(prev =>
        prev.map(req =>
          req._id === id || req.id === id ? { ...req, status: 'rejected' } : req
        )
      );
    } catch (err) {
      console.error('Error rejecting leave:', err);
      alert('Failed to reject leave');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Rejected</span>;
      default:
        return null;
    }
  };

  const handleViewAllRequests = () => {
    navigate('/admin/leave-management');
  };

  const getNotificationIcon = (type) => {
    const iconConfig = {
      approval: { color: 'text-green-600 dark:text-green-400', label: 'Approval' },
      salary: { color: 'text-blue-600 dark:text-blue-400', label: 'Salary' },
      review: { color: 'text-purple-600 dark:text-purple-400', label: 'Review' },
      meeting: { color: 'text-orange-600 dark:text-orange-400', label: 'Meeting' },
      document: { color: 'text-red-600 dark:text-red-400', label: 'Document' },
    };
    const config = iconConfig[type] || iconConfig.approval;
    return config;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with admin info */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {adminInfo.name}
            </h1>
            <p className="text-gray-600 mt-2">
              {adminInfo.organization} · {adminInfo.role}
            </p>
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
              + Add Employee
            </button>
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">10</p>
              </div>
              <div className="text-indigo-500">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Attendance</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.presentToday}</p>
              </div>
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Leaves</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingRequests}</p>
              </div>
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Recent Leave Requests */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Leave Requests</h2>
              <button onClick={handleViewAllRequests} className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-200">
              {leaveRequests.length > 0 ? (
                leaveRequests.map((req) => (
                  <div key={req.id} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{req.employee}</p>
                        <p className="text-sm text-gray-600 mt-1">{req.type}</p>
                        <p className="text-xs text-gray-600 mt-1">{req.days} day(s) • {req.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(req.status)}
                        {req.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApproveLeave(req.id)}
                              className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition"
                              title="Approve"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRejectLeave(req.id)}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                              title="Reject"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-medium">No recent leave requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Sent Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Sent Notifications</h2>
             
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.length > 0 ? (
                notifications.map((notif) => {
                  const iconConfig = getNotificationIcon(notif.type);
                  return (
                    <div key={notif.id} className="px-6 py-4 hover:bg-gray-50 transition border-b border-gray-200 last:border-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{notif.employee}</p>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-600 mt-2">{notif.time}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium text-gray-700 bg-gray-100 whitespace-nowrap flex-shrink-0 ${iconConfig.color}`}>
                          {iconConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-medium">No sent notifications</p>
                </div>
              )}
            </div>
            {/* <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full text-indigo-600 text-sm font-medium hover:underline">
                View all notifications →
              </button>
            </div> */}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AdminDashboard;