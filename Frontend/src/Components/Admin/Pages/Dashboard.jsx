import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  UserCheck,
  Calendar,
  DollarSign,
  RefreshCw,
  Briefcase,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  Target,
  PieChart,
  Download,
  MoreVertical,
  Eye,
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setTimeout(() => {
      setData(getDashboardData());
      setLoading(false);
    }, 800);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getDashboardData = () => ({
    kpis: [
      {
        id: 1,
        title: 'Total Employees',
        value: '1,245',
        change: 12.5,
        icon: Users,
        color: 'blue',
        metric: '+89 this month',
      },
      {
        id: 2,
        title: 'Present Today',
        value: '1,089',
        change: 4.3,
        icon: UserCheck,
        color: 'green',
        metric: '87.5% attendance',
      },
      {
        id: 3,
        title: 'On Leave',
        value: '98',
        change: -2.1,
        icon: Calendar,
        color: 'orange',
        metric: '7.9% of workforce',
      },
      {
        id: 4,
        title: 'Absent',
        value: '58',
        change: -5.4,
        icon: AlertCircle,
        color: 'red',
        metric: '4.7% of workforce',
      },
    ],
    attendance: {
      thisWeek: [
        { day: 'Monday', present: 1089, absent: 98, leave: 58 },
        { day: 'Tuesday', present: 1095, absent: 92, leave: 58 },
        { day: 'Wednesday', present: 1102, absent: 85, leave: 58 },
        { day: 'Thursday', present: 1089, absent: 98, leave: 58 },
        { day: 'Friday', present: 1055, absent: 128, leave: 62 },
      ],
      avgAttendance: 87.2,
    },
    payroll: {
      upcoming: '$4,280,000',
      processed: '$3,850,000',
      pending: '$430,000',
      employees: 945,
      pending_approvals: 12,
    },
    departments: [
      { name: 'Engineering', employees: 285, avg_salary: '$85,000', status: 'Balanced' },
      { name: 'Sales', employees: 156, avg_salary: '$72,000', status: 'Growing' },
      { name: 'Marketing', employees: 98, avg_salary: '$68,000', status: 'Stable' },
      { name: 'HR', employees: 42, avg_salary: '$65,000', status: 'Stable' },
      { name: 'Operations', employees: 324, avg_salary: '$58,000', status: 'Balanced' },
    ],
    recentActivities: [
      { id: 1, type: 'hire', message: 'New employee Sarah Johnson hired in Engineering', time: '2 hours ago', icon: Plus },
      { id: 2, type: 'leave', message: 'Leave request approved for John Doe (5 days)', time: '4 hours ago', icon: Calendar },
      { id: 3, type: 'payroll', message: 'Payroll for March processed successfully', time: '1 day ago', icon: DollarSign },
      { id: 4, type: 'performance', message: 'Q1 performance reviews completed', time: '2 days ago', icon: Target },
      { id: 5, type: 'system', message: 'System maintenance scheduled for May 15th', time: '3 days ago', icon: Clock },
    ],
    leaveRequests: {
      pending: 23,
      approved: 45,
      rejected: 3,
      upcoming: [
        { employee: 'Alice Smith', days: 5, status: 'Pending', date: 'May 20-24' },
        { employee: 'Bob Wilson', days: 3, status: 'Approved', date: 'May 15-17' },
        { employee: 'Carol Davis', days: 7, status: 'Pending', date: 'May 25-June 2' },
      ],
    },
    topPerformers: [
      { name: 'Emma Watson', role: 'Senior Engineer', score: 98, department: 'Engineering' },
      { name: 'Michael Brown', role: 'Sales Manager', score: 96, department: 'Sales' },
      { name: 'Lisa Anderson', role: 'Marketing Lead', score: 94, department: 'Marketing' },
    ],
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 animate-pulse mb-4">
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-300 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const colorMap = {
    blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800',
    orange: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800',
    red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800',
  };

  const getActivityColor = (type) => {
    const colors = {
      hire: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      leave: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      payroll: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      performance: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      system: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    };
    return colors[type] || colors.system;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, Admin • Real-time analytics and management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ${
                refreshing ? 'animate-spin' : ''
              }`}
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition">
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {data.kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className={`bg-gradient-to-br ${colorMap[kpi.color]} border rounded-xl p-6 hover:shadow-lg transition`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{kpi.title}</h3>
                <div className={`p-2 rounded-lg bg-${kpi.color}-100 dark:bg-${kpi.color}-900/30`}>
                  <Icon size={20} className={`text-${kpi.color}-600 dark:text-${kpi.color}-400`} />
                </div>
              </div>
              <div className="mb-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{kpi.metric}</p>
              </div>
              <div className="flex items-center gap-1">
                {kpi.change > 0 ? (
                  <>
                    <ArrowUpRight size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">+{kpi.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={16} className="text-red-600" />
                    <span className="text-sm font-semibold text-red-600">{kpi.change}%</span>
                  </>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Weekly Attendance Overview
            </h2>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg: {data.attendance.avgAttendance}%</span>
          </div>
          <div className="space-y-4">
            {data.attendance.thisWeek.map((day, idx) => {
              const total = day.present + day.absent + day.leave;
              const presentPct = (day.present / total) * 100;
              const absentPct = (day.absent / total) * 100;
              const leavePct = (day.leave / total) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day.day}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{day.present}/{total}</span>
                  </div>
                  <div className="flex h-3 gap-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: `${presentPct}%` }} />
                    <div className="bg-red-500" style={{ width: `${absentPct}%` }} />
                    <div className="bg-yellow-500" style={{ width: `${leavePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">On Leave</span>
            </div>
          </div>
        </div>

        {/* Payroll Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <DollarSign size={20} className="text-green-600" />
            Payroll Summary
          </h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Upcoming Payroll</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.payroll.upcoming}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">Processed</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.payroll.processed}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{data.payroll.pending}</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Processed / Pending Approvals</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{data.payroll.employees} / {data.payroll.pending_approvals}</p>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
              View Payroll Details
            </button>
          </div>
        </div>
      </div>

      {/* Leave Requests & Departments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Leave Requests */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-orange-600" />
            Leave Requests
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.leaveRequests.pending}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.leaveRequests.approved}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.leaveRequests.rejected}</p>
            </div>
          </div>
          <div className="space-y-3">
            {data.leaveRequests.upcoming.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{req.employee}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{req.date} • {req.days} days</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  req.status === 'Pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Departments Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Briefcase size={20} className="text-purple-600" />
            Departments Overview
          </h2>
          <div className="space-y-3">
            {data.departments.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{dept.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{dept.employees} employees • {dept.avg_salary}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  dept.status === 'Balanced' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  dept.status === 'Growing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {dept.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Clock size={20} className="text-blue-600" />
            Recent Activities
          </h2>
          <div className="space-y-3">
            {data.recentActivities.map((activity) => {
              const ActivityIcon = activity.icon;
              return (
                <div key={activity.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <ActivityIcon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium">
            View All Activities
          </button>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
            <Target size={20} className="text-purple-600" />
            Top Performers
          </h2>
          <div className="space-y-4">
            {data.topPerformers.map((performer, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{performer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{performer.role}</p>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{performer.score}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${performer.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{performer.department}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition font-medium">
            View Performance Details
          </button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Add Employee', icon: Plus },
            { label: 'Process Payroll', icon: DollarSign },
            { label: 'Manage Leave', icon: Calendar },
            { label: 'View Reports', icon: BarChart3 },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition font-semibold text-blue-700 dark:text-blue-400 text-sm"
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
