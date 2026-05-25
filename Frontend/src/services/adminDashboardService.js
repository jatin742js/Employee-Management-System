import adminApi from './adminApi';

// Admin Dashboard Services
const adminDashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await adminApi.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminDashboardService;
