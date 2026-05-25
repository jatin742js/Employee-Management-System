import employeeApi from './employeeApi';

// Employee Attendance Services
const employeeAttendanceService = {
  // Get my attendance records
  getMyAttendance: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await employeeApi.get(`/employee/attendance${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check in
  checkIn: async () => {
    try {
      const response = await employeeApi.post('/employee/attendance/check-in');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check out
  checkOut: async () => {
    try {
      const response = await employeeApi.post('/employee/attendance/check-out');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employeeAttendanceService;
