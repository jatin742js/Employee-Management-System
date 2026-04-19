import api from './api';

// Employee Leave Services
const employeeLeaveService = {
  // Get my leave requests
  getMyLeaves: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/employee/leaves${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request leave
  requestLeave: async (leaveData) => {
    try {
      const response = await api.post('/employee/leaves', leaveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel leave request
  cancelLeave: async (id) => {
    try {
      const response = await api.delete(`/employee/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employeeLeaveService;
