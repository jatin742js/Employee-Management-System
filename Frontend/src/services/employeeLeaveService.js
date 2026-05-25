import employeeApi from './employeeApi';

// Employee Leave Services
const employeeLeaveService = {
  // Get my leave requests
  getMyLeaves: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await employeeApi.get(`/employee/leaves${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request leave
  requestLeave: async (leaveData) => {
    try {
      const response = await employeeApi.post('/employee/leaves', leaveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel leave request
  cancelLeave: async (id) => {
    try {
      const response = await employeeApi.delete(`/employee/leaves/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employeeLeaveService;
