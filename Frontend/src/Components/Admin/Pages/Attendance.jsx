import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

// Mock admin info
const adminInfo = {
  name: 'John Doe',
  organization: 'TechCorp Inc.',
  role: 'HR Administrator',
};

// Mock attendance data
const mockAttendance = [
  {
    id: 1,
    name: 'Alice Johnson',
    department: 'Engineering',
    checkIn: '09:05 AM',
    checkOut: '06:00 PM',
    status: 'present',
    late: false,
  },
  {
    id: 2,
    name: 'Bob Smith',
    department: 'Sales',
    checkIn: '09:00 AM',
    checkOut: '05:30 PM',
    status: 'present',
    late: false,
  },
  {
    id: 3,
    name: 'Carol Davis',
    department: 'HR',
    checkIn: '09:15 AM',
    checkOut: '05:45 PM',
    status: 'present',
    late: true,
  },
  {
    id: 4,
    name: 'David Brown',
    department: 'Marketing',
    checkIn: null,
    checkOut: null,
    status: 'on-leave',
    late: false,
  },
  {
    id: 5,
    name: 'Eva Green',
    department: 'Engineering',
    checkIn: '09:30 AM',
    checkOut: null,
    status: 'present',
    late: true,
  },
  {
    id: 6,
    name: 'Frank Miller',
    department: 'Sales',
    checkIn: null,
    checkOut: null,
    status: 'on-leave',
    late: false,
  },
];

// Summary stats
const summaryStats = {
  total: 124,
  present: 98,
  late: 8,
  onLeave: 6,
};

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  // Filter employees
  const filteredEmployees = mockAttendance.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusIcon = (status, late) => {
    if (status === 'present') {
      return late ? <Clock className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'on-leave') return <Calendar className="h-4 w-4 text-blue-500" />;
    return null;
  };

  const getStatusBadge = (status, late) => {
    if (status === 'present') {
      return late
        ? <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Late</span>
        : <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Present</span>;
    }
    if (status === 'on-leave') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">On Leave</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {adminInfo.organization} · {adminInfo.role}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mark Attendance
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Employees</p>
                <p className="text-2xl font-bold">{summaryStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Present</p>
                <p className="text-2xl font-bold">{summaryStats.present}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Late</p>
                <p className="text-2xl font-bold ">{summaryStats.late}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">On Leave</p>
                <p className="text-2xl font-bold">{summaryStats.onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Date Navigation & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeDate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatDate(selectedDate)}</p>
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
              >
                Today
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredEmployees.map((emp) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{emp.checkIn || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">{emp.checkOut || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(emp.status, emp.late)}
                        {getStatusBadge(emp.status, emp.late)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-indigo-600 transition">
                        <AlertCircle className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-gray-500">No records found.</div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs">
          © 2025 Employee Management System · {adminInfo.organization}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;