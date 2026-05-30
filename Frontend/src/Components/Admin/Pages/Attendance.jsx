import React, { useState, useEffect } from 'react';
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
  Zap,
} from 'lucide-react';
import adminAttendanceService from '../../../services/adminAttendanceService';
import { useSocket } from '../../../context/SocketContext';

const AttendancePage = () => {
  const { socket } = useSocket();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attendance, setAttendance] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminInfo, setAdminInfo] = useState({
    organization: 'Organization',
    role: 'Administrator',
  });
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    onLeave: 0,
  });
  const [recentUpdate, setRecentUpdate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for real-time total time calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load admin info from localStorage
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
    if (adminUser.department || adminUser.name) {
      setAdminInfo({
        organization: adminUser.department || 'Organization',
        role: adminUser.role || 'Administrator',
      });
    }
    loadAttendanceData();

    // Socket.io listeners for real-time updates
    if (socket) {
      // Listen for attendance marked events (check-in)
      socket.on('attendance:marked', (data) => {
        const today = new Date().toISOString().split('T')[0];
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        
        // Only update if the event is for today's date and matches selected date
        if (data.date === today || data.date === selectedDateStr) {
          setAttendance(prev => {
            const updated = prev.map(emp => {
              if (emp.id === data.employeeId || emp.id === data.empId) {
                return {
                  ...emp,
                  checkIn: data.checkInTime || emp.checkIn,
                  status: data.isLate ? 'late' : 'present',
                  late: data.isLate || false,
                };
              }
              return emp;
            });
            return updated;
          });
          
          // Show visual indicator
          setRecentUpdate(data.employeeId || data.empId);
          setTimeout(() => setRecentUpdate(null), 3000);
        }
      });

      // Listen for leave updates
      socket.on('leave:updated', (data) => {
        const today = new Date().toISOString().split('T')[0];
        const selectedDateStr = selectedDate.toISOString().split('T')[0];
        
        if (data.date === today || data.date === selectedDateStr) {
          setAttendance(prev => {
            const updated = prev.map(emp => {
              if (emp.id === data.employeeId) {
                return {
                  ...emp,
                  status: 'leave',
                  checkIn: null,
                  checkOut: null,
                };
              }
              return emp;
            });
            return updated;
          });

          setRecentUpdate(data.employeeId);
          setTimeout(() => setRecentUpdate(null), 3000);
        }
      });

      // Listen for attendance status changes
      socket.on('attendance:statusChanged', (data) => {
        setAttendance(prev => {
          const updated = prev.map(emp => {
            if (emp.id === data.employeeId) {
              return {
                ...emp,
                status: data.newStatus,
              };
            }
            return emp;
          });
          return updated;
        });

        setRecentUpdate(data.employeeId);
        setTimeout(() => setRecentUpdate(null), 3000);
      });

      return () => {
        socket.off('attendance:marked');
        socket.off('leave:updated');
        socket.off('attendance:statusChanged');
      };
    }
  }, [selectedDate, socket]);

  const loadAttendanceData = async () => {
    try {
      setIsLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const response = await adminAttendanceService.getAttendance({
        fromDate: dateString,
        toDate: dateString,
      });

      const attendanceData =
        response?.data?.attendance ||
        response?.attendance ||
        (Array.isArray(response?.data) ? response.data : null) ||
        (Array.isArray(response) ? response : []);

      const normalizedAttendance = Array.isArray(attendanceData)
        ? attendanceData.map((record) => ({
            id: record._id,
            name: record.employee?.name || 'Unknown',
            department: record.employee?.department || 'N/A',
            checkIn: record.checkInTime || null,
            checkOut: record.checkOutTime || null,
            status: (record.status || 'absent').toLowerCase(),
            late: record.isLate || false, // Add late flag from backend
            lateBy: record.lateBy || 0, // Minutes late
          }))
        : [];

      setAttendance(normalizedAttendance);

      // Calculate stats
      const total = normalizedAttendance.length;
      const present = normalizedAttendance.filter((a) => a.status === 'present' && !a.late).length;
      const late = normalizedAttendance.filter((a) => a.status === 'present' && a.late || a.status === 'late').length;
      const onLeave = normalizedAttendance.filter((a) => a.status === 'leave').length;
      setStats({ total, present, late, onLeave });

      setError('');
    } catch (err) {
      const errorMsg = err.message || 'Failed to load attendance data';
      setError(errorMsg);
      console.error('Error loading attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate stats whenever attendance data changes (real-time updates)
  useEffect(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present' && !a.late).length;
    const late = attendance.filter((a) => (a.status === 'present' && a.late) || a.status === 'late').length;
    const onLeave = attendance.filter((a) => a.status === 'leave').length;
    setStats({ total, present, late, onLeave });
  }, [attendance]);

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
  const filteredEmployees = attendance.filter(emp => {
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.department || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setAttendance(attendance.map(emp => 
      emp.id === id ? { ...emp, status: newStatus, late: newStatus === 'present' && emp.late } : emp
    ));
    setSelectedStatusId(null);
  };

  const getStatusIcon = (status, late) => {
    if (status === 'present') {
      return late ? <Clock className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (status === 'late') return <Clock className="h-4 w-4 text-orange-500" />;
    if (status === 'absent') return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (status === 'leave') return <Calendar className="h-4 w-4 text-blue-500" />;
    if (status === 'half-day') return <Clock className="h-4 w-4 text-orange-500" />;
    return null;
  };

  const getStatusBadge = (status, late) => {
    if (status === 'present') {
      return late
        ? <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 flex items-center gap-1"><Clock size={12} /> Late</span>
        : <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Present</span>;
    }
    if (status === 'late') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 flex items-center gap-1"><Clock size={12} /> Late</span>;
    if (status === 'absent') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Absent</span>;
    if (status === 'leave') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">On Leave</span>;
    if (status === 'half-day') return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Half Day</span>;
    return null;
  };

  // Unified time parsing function - handles both 12-hour and 24-hour formats
  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    
    try {
      // Handle format like "09:05 AM" or "9:05 AM" or "09:05" (24-hour)
      const parts = timeStr.trim().split(' ');
      const timePart = parts[0];
      const period = parts[1]?.toUpperCase(); // AM/PM
      
      const [hoursStr, minutesStr] = timePart.split(':');
      let hours = parseInt(hoursStr);
      const minutes = parseInt(minutesStr) || 0;
      
      // Handle 12-hour format (with AM/PM)
      if (period) {
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
      }
      // If no AM/PM, assume it's 24-hour format
      
      return hours * 60 + minutes;
    } catch (e) {
      console.error('Time parsing error for:', timeStr, e);
      return null;
    }
  };

  const calculateTotalTime = (checkIn, checkOut) => {
    if (!checkIn) return '—';
    
    try {
      const checkInMinutes = parseTimeToMinutes(checkIn);
      if (checkInMinutes === null) return '—';
      
      // If checkOut exists, use it; otherwise use current time for real-time elapsed
      let checkOutMinutes;
      if (checkOut) {
        checkOutMinutes = parseTimeToMinutes(checkOut);
        if (checkOutMinutes === null) return '—';
      } else {
        // Use current time for real-time elapsed calculation
        const now = currentTime;
        const currentHours = now.getHours();
        const currentMins = now.getMinutes();
        checkOutMinutes = currentHours * 60 + currentMins;
      }
      
      let diffMinutes = checkOutMinutes - checkInMinutes;
      
      // Handle day boundary (if checkout is next day)
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }
      
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      
      return `${hours}h ${mins}m`;
    } catch (e) {
      return '—';
    }
  };

  const formatLateTime = (minutes) => {
    if (!minutes || minutes <= 0) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m late`;
    } else if (hours > 0) {
      return `${hours}h late`;
    } else {
      return `${mins}m late`;
    }
  };

  // Format time string to consistent format (e.g., "09:05:30 AM")
  const formatTimeString = (timeStr) => {
    if (!timeStr) return '—';
    
    try {
      const parts = timeStr.trim().split(' ');
      const timePart = parts[0];
      const period = parts[1]?.toUpperCase();
      
      // Parse time parts
      const timeParts = timePart.split(':');
      let hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]) || 0;
      const seconds = parseInt(timeParts[2]) || 0;
      
      // Determine AM/PM from 24-hour format
      let timePeriod = period;
      
      // If no period provided, determine from hours
      if (!timePeriod || (timePeriod !== 'AM' && timePeriod !== 'PM')) {
        timePeriod = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
      }
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${timePeriod}`;
    } catch (e) {
      return timeStr || '—';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">{adminInfo.organization} · {adminInfo.role}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
            <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
          {/* <div className="flex gap-3">
            <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Mark Attendance
            </button>
          </div> */}
        </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading attendance data...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <button 
            onClick={loadAttendanceData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only Show When Loaded */}
      {!isLoading && (
      <>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Present</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.present}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Late</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.late}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">On Leave</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.onLeave}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Date Navigation & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div className="text-center min-w-max">
              <p className="text-base sm:text-lg font-semibold text-gray-900 wrap-break-word">{formatDate(selectedDate)}</p>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-indigo-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="leave">On Leave</option>
              <option value="half-day">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Total Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr 
                  key={emp.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    recentUpdate === emp.id ? 'bg-blue-50 animate-pulse' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {recentUpdate === emp.id && (
                        <Zap className="h-4 w-4 text-blue-500 mr-2 animate-bounce" />
                      )}
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <span className="ml-3 font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{emp.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatTimeString(emp.checkIn)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatTimeString(emp.checkOut)}</td>
                  <td className="px-6 py-4 whitespace-nowrap relative">
                    <button 
                      onClick={() => setSelectedStatusId(selectedStatusId === emp.id ? null : emp.id)}
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      {getStatusIcon(emp.status, emp.late)}
                      {getStatusBadge(emp.status, emp.late)}
                    </button>

                    {/* Show late time in hours:minutes format */}
                    {emp.late && emp.lateBy > 0 && (
                      <span className="ml-2 text-xs text-orange-600 font-medium">
                        ({formatLateTime(emp.lateBy)})
                      </span>
                    )}

                    {/* Status Dropdown */}
                    {selectedStatusId === emp.id && (
                      <div className="absolute top-full left-6 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleStatusChange(emp.id, 'present')}
                          className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(emp.id, 'late')}
                          className="block w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 border-t border-gray-200 transition"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(emp.id, 'absent')}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 border-t border-gray-200 transition"
                        >
                          Absent
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {calculateTotalTime(emp.checkIn, emp.checkOut)}
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

      
    </>
    )}
    </div>
  );
};

export default AttendancePage;