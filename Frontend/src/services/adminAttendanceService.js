import adminApi from './adminApi';

// Admin Attendance Management Services
const adminAttendanceService = {
  // Get attendance records
  getAttendance: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await adminApi.get(`/admin/attendance${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Record attendance
  recordAttendance: async (attendanceData) => {
    try {
      const response = await adminApi.post('/admin/attendance', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminAttendanceService;
