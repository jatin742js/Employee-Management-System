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

// Mock data
const adminInfo = {
  name: 'John Doe',
  organization: 'TechCorp Inc.',
  role: 'HR Administrator',
};

const stats = {
  totalEmployees: 124,
  presentToday: 98,
  onLeave: 12,
  pendingRequests: 5,
};

const recentLeaveRequests = [
  { id: 1, employee: 'Emily Chen', type: 'Sick Leave', days: 2, status: 'pending', date: '2025-03-28' },
  { id: 2, employee: 'Michael Brown', type: 'Casual Leave', days: 1, status: 'pending', date: '2025-03-28' },
  { id: 3, employee: 'Sarah Wilson', type: 'Annual Leave', days: 5, status: 'approved', date: '2025-03-27' },
  { id: 4, employee: 'David Lee', type: 'Sick Leave', days: 1, status: 'rejected', date: '2025-03-26' },
];

const recentEmployees = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', position: 'Frontend Dev', joinDate: '2025-03-01' },
  { id: 2, name: 'Bob Smith', department: 'Sales', position: 'Account Executive', joinDate: '2025-03-05' },
  { id: 3, name: 'Carol Davis', department: 'HR', position: 'HR Generalist', joinDate: '2025-03-10' },
  { id: 4, name: 'David Brown', department: 'Marketing', position: 'Marketing Specialist', joinDate: '2025-03-15' },
];

const attendanceData = [
  { day: 'Mon', present: 85, total: 124 },
  { day: 'Tue', present: 92, total: 124 },
  { day: 'Wed', present: 88, total: 124 },
  { day: 'Thu', present: 95, total: 124 },
  { day: 'Fri', present: 90, total: 124 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState(recentLeaveRequests);
  const [employees, setEmployees] = useState(recentEmployees);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleApproveLeave = (id) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'approved' } : req
      )
    );
    // API call would go here
  };

  const handleRejectLeave = (id) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
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

  const handleViewAllEmployees = () => {
    navigate('/admin/employees');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-teal-600 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with admin info */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Welcome back, {adminInfo.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {adminInfo.organization} · {adminInfo.role}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
              + Add Employee
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Employees</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalEmployees}</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Present Today</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.presentToday}</p>
                <p className="text-xs text-green-600 mt-1">+5 from yesterday</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">On Leave</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.onLeave}</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                <UserX className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stats.pendingRequests}</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attendance Overview</h2>
              <select className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="space-y-4">
              {attendanceData.map((day) => (
                <div key={day.day}>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>{day.day}</span>
                    <span>{day.present} / {day.total} present</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: `${(day.present / day.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Leave Requests</h2>
            <div className="space-y-4">
              {leaveRequests.map((req) => (
                <div key={req.id} className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{req.employee}</p>
                    <p className="text-sm text-gray-500">{req.type} · {req.days} day(s)</p>
                    <p className="text-xs text-gray-400 mt-1">{req.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(req.status)}
                    {req.status === 'pending' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleViewAllRequests} className="mt-4 text-indigo-600 text-sm font-medium hover:underline w-full text-center">
              View all requests →
            </button>
          </div>
        </div>

        {/* Recent Employees Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recently Added Employees</h2>
            <button onClick={handleViewAllEmployees} className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="ml-3 font-medium text-gray-800 dark:text-white">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{emp.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{emp.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{emp.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-indigo-600 transition">
                        <Eye className="h-5 w-5" />
                      </button>
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
};

export default AdminDashboard;