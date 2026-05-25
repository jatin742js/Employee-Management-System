import employeeApi from './employeeApi';

// Employee Dashboard Services
const employeeDashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await employeeApi.get('/employee/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get employee notifications
  getMyNotifications: async (params = {}) => {
    try {
      const response = await employeeApi.get('/employee/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employeeDashboardService;
