import adminApi from './adminApi';

// Admin Payroll Management Services
const adminPayrollService = {
  // Get all payroll records
  getAllPayroll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await adminApi.get(`/admin/payroll${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create payroll record
  createPayroll: async (payrollData) => {
    try {
      const response = await adminApi.post('/admin/payroll', payrollData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payroll status
  updatePayrollStatus: async (id, paymentStatus, paymentDate) => {
    try {
      const response = await adminApi.put(`/admin/payroll/${id}/status`, {
        paymentStatus,
        paymentDate,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminPayrollService;
