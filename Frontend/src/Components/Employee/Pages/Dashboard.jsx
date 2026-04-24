import React, { useState, useEffect } from 'react';
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
import employeeDashboardService from '../../../services/employeeDashboardService';
import employeeAuthService from '../../../services/employeeAuthService';
import employeeAttendanceService from '../../../services/employeeAttendanceService';
import employeePayrollService from '../../../services/employeePayrollService';
import employeeLeaveService from '../../../services/employeeLeaveService';
import { useSocket } from '../../../context/SocketContext';

const Dashboard = () => {
  const [employeeData, setEmployeeData] = useState({
    name: 'Loading...',
    role: 'Loading...',
    department: 'Loading...',
    company: 'TechCorp Inc.',
    joinDate: 'Loading...',
  });

  const [statsData, setStatsData] = useState([
    {
      title: 'Total Hours',
      value: '-',
      unit: 'hrs/month',
      icon: Clock,
      color: 'teal',
      trend: 'Loading...',
    },
    {
      title: 'Total Leaves',
      value: '-',
      unit: 'days available',
      icon: Calendar,
      color: 'cyan',
      trend: 'Loading...',
    },
    {
      title: 'Attendance',
      value: '-',
      unit: 'attendance rate',
      icon: UserCheck,
      color: 'emerald',
      trend: 'Loading...',
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [payrollNotifications, setPayrollNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const { socket } = useSocket();

  const formatLeaveTypeLabel = (leaveType) => {
    const type = (leaveType || '').toLowerCase();
    if (type === 'earned') return 'Annual Leave';
    if (!type) return 'Leave';
    return `${type.charAt(0).toUpperCase()}${type.slice(1)} Leave`;
  };

  const formatPayrollNotification = (payroll) => {
    if (!payroll) return null;

    const amount = payroll.netSalary ?? payroll.baseSalary ?? 0;
    const monthLabel = payroll.month
      ? new Date(`${payroll.month}-01`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : 'Current Month';

    return {
      id: payroll._id || payroll.payrollId || `${Date.now()}-${Math.random()}`,
      title: payroll.message || `Payslip available for ${monthLabel}`,
      date: payroll.createdAt
        ? new Date(payroll.createdAt).toLocaleDateString('en-IN')
        : new Date().toLocaleDateString('en-IN'),
      type: (payroll.paymentStatus || 'processed').toLowerCase(),
      amount,
    };
  };

  useEffect(() => {
    const loadAll = async () => {
      await loadDashboardData();
      await loadPayrollNotifications();
      await loadRecentActivities();
    };
    loadAll();
  }, []);

  // Listen to real-time socket events for payroll notifications
  useEffect(() => {
    if (!socket) return;

    const refreshDashboardCards = () => {
      loadDashboardData();
      loadRecentActivities();
    };

    socket.on('payroll:notified', (data) => {
      console.log('Payroll notification received:', data);
      const notification = formatPayrollNotification(data);
      if (notification) {
        setPayrollNotifications((prev) => [notification, ...prev].slice(0, 10));
      }
      refreshDashboardCards();
    });

    socket.on('payroll:updated', (data) => {
      console.log('Payroll updated notification received:', data);
      const notification = formatPayrollNotification(data);
      if (notification) {
        setPayrollNotifications((prev) => [notification, ...prev].slice(0, 10));
      }
      refreshDashboardCards();
    });

    socket.on('payroll:statusUpdated', (data) => {
      console.log('Payroll status updated notification received:', data);
      const notification = formatPayrollNotification(data);
      if (notification) {
        setPayrollNotifications((prev) => [notification, ...prev].slice(0, 10));
      }
      refreshDashboardCards();
    });

    socket.on('attendance:marked', (data) => {
      console.log('Attendance event received:', data);
      refreshDashboardCards();
    });

    socket.on('leave:approved', (data) => {
      console.log('Leave approved event received:', data);
      refreshDashboardCards();
    });

    socket.on('leave:rejected', (data) => {
      console.log('Leave rejected event received:', data);
      refreshDashboardCards();
    });

    socket.on('leave:statusUpdated', (data) => {
      console.log('Leave status updated event received:', data);
      refreshDashboardCards();
    });

    return () => {
      socket.off('payroll:notified');
      socket.off('payroll:updated');
      socket.off('payroll:statusUpdated');
      socket.off('attendance:marked');
      socket.off('leave:approved');
      socket.off('leave:rejected');
      socket.off('leave:statusUpdated');
    };
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load profile data
      const profileResponse = await employeeAuthService.getEmployeeProfile();
      const profileData = profileResponse.data || profileResponse;
      
      if (profileData) {
        setEmployeeData({
          name: profileData.name || 'Employee',
          role: profileData.position || 'Employee',
          department: profileData.department || 'General',
          company: 'TechCorp Inc.',
          joinDate: profileData.joinDate || 'N/A',
        });
      }

      // Load dashboard stats
      const [statsResponse, attendanceResponse] = await Promise.all([
        employeeDashboardService.getDashboardStats(),
        employeeAttendanceService.getMyAttendance(),
      ]);

      const stats = statsResponse.data || statsResponse;
      const attendanceRecords =
        attendanceResponse?.data?.attendance ||
        attendanceResponse?.attendance ||
        (Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : null) ||
        (Array.isArray(attendanceResponse) ? attendanceResponse : []);

      if (stats) {
        const pendingLeaves = Number(stats.pendingLeaves || 0);
        const approvedLeaves = Number(stats.approvedLeaves || 0);
        const totalLeaves = pendingLeaves + approvedLeaves;

        const now = new Date();
        const monthAttendance = Array.isArray(attendanceRecords)
          ? attendanceRecords.filter((record) => {
              const date = new Date(record.date);
              return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
              );
            })
          : [];

        const totalHours = monthAttendance.reduce(
          (sum, record) => sum + Number(record.workingHours || 0),
          0
        );

        const attendedDays = monthAttendance.filter((record) =>
          ['present', 'half-day'].includes((record.status || '').toLowerCase())
        ).length;

        const attendanceRate = monthAttendance.length
          ? `${Math.round((attendedDays / monthAttendance.length) * 100)}%`
          : '0%';

        const todayStatus = stats.todayAttendance?.status
          ? stats.todayAttendance.status.charAt(0).toUpperCase() + stats.todayAttendance.status.slice(1)
          : 'Not Marked';

        const updatedStats = [
          {
            title: 'Total Hours',
            value: totalHours.toFixed(1),
            unit: 'hrs/month',
            icon: Clock,
            color: 'teal',
            trend: `${monthAttendance.length} attendance record(s) this month`,
          },
          {
            title: 'Total Leaves',
            value: String(totalLeaves),
            unit: 'requests',
            icon: Calendar,
            color: 'cyan',
            trend: `Pending: ${pendingLeaves} | Approved: ${approvedLeaves}`,
          },
          {
            title: 'Attendance',
            value: attendanceRate,
            unit: 'attendance rate',
            icon: UserCheck,
            color: 'emerald',
            trend: `Today: ${todayStatus}`,
          },
        ];
        setStatsData(updatedStats);
      }

      setError('');
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      const errorMsg = err.message || 'Failed to load dashboard data';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Load payroll notifications from latest payroll records
  const loadPayrollNotifications = async () => {
    try {
      const response = await employeePayrollService.getMyPayroll();
      const payrollList =
        response?.data?.payroll ||
        response?.payroll ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);

      const notifications = Array.isArray(payrollList)
        ? payrollList
            .map((payroll) => formatPayrollNotification(payroll))
            .filter(Boolean)
            .slice(0, 6)
        : [];

      setPayrollNotifications(notifications);
    } catch (err) {
      console.error('Error loading payroll notifications:', err);
      setPayrollNotifications([]);
    }
  };

  // Load recent activities
  const loadRecentActivities = async () => {
    try {
      const activities = [];
      
      // Get recent attendance
      try {
        const attendanceResponse = await employeeAttendanceService.getMyAttendance();
        const attendance = Array.isArray(attendanceResponse.data) ? attendanceResponse.data : attendanceResponse.data?.attendance || [];
        if (attendance.length > 0) {
          const latest = attendance[0];
          const date = new Date(latest.date);
          activities.push({
            id: 1,
            action: 'Attendance marked',
            time: `${date.toLocaleDateString('en-IN')} at ${latest.checkInTime || 'N/A'}`,
            status: 'success',
          });
        }
      } catch (e) {
        console.error('Error loading attendance:', e);
      }

      // Get recent leaves
      try {
        const leavesResponse = await employeeLeaveService.getMyLeaves();
        const leaves = Array.isArray(leavesResponse.data) ? leavesResponse.data : leavesResponse.data?.leaves || [];
        if (leaves.length > 0) {
          const latest = leaves[0];
          activities.push({
            id: 2,
            action: `Leave request - ${formatLeaveTypeLabel(latest.leaveType)}`,
            time: new Date(latest.createdAt).toLocaleDateString('en-IN'),
            status: latest.status === 'approved' ? 'success' : 'neutral',
          });
        }
      } catch (e) {
        console.error('Error loading leaves:', e);
      }

      setRecentActivities(activities.slice(0, 4));
    } catch (err) {
      console.error('Error loading activities:', err);
      setRecentActivities([]);
    }
  };

  const colorMap = {
    teal: { bg: 'bg-white', border: 'border-teal-200', text: 'text-teal-700', icon: 'bg-teal-100' },
    cyan: { bg: 'bg-white', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'bg-cyan-100' },
    emerald: { bg: 'bg-white', border: 'border-emerald-200', text: 'text-emerald-700', icon: 'bg-emerald-100' },
    blue: { bg: 'bg-white', border: 'border-blue-200', text: 'text-blue-700', icon: 'bg-blue-100' },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome, {employeeData.name} </h1>
          <p className="text-gray-600 text-sm mt-2">
            {employeeData.company} · {employeeData.department}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Upcoming Events - Wider */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">🔔 Notifications</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {payrollNotifications.length > 0 ? (
                  payrollNotifications.map((event) => (
                    <div
                    key={event.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-start justify-between cursor-pointer"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                    <div className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      event.type === 'pending' ? 'bg-amber-100 text-amber-700' :
                      event.type === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      ₹{Number(event.amount || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))
                ) : (
                  <div className="text-sm text-gray-500">No payroll notifications yet</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities - Sidebar */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">✓ Recent Activity</h2>
            </div>
            <div className="p-4 sm:p-6">
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
        {/* <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Bell size={20} className="text-teal-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-teal-900">Company Announcement</p>
              <p className="text-sm text-teal-800 mt-1">
                New office hours starting April 15. Remote work allowed on Wednesdays and Fridays.
              </p>
            </div>
          </div>
        </div> */}
      </div>
      )}
    </div>
  );
};

export default Dashboard;
