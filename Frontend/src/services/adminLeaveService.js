import api from './api';

// Admin Leave Management Services
const adminLeaveService = {
  // Get all leave requests
  getAllLeaves: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/leaves${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve leave request
  approveLeave: async (id) => {
    try {
      const response = await api.put(`/admin/leaves/${id}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject leave request
  rejectLeave: async (id, rejectionReason) => {
    try {
      const response = await api.put(`/admin/leaves/${id}/reject`, {
        rejectionReason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminLeaveService;
