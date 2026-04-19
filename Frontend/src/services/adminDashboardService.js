import api from './api';

// Admin Dashboard Services
const adminDashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminDashboardService;
