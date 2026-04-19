import api from './api';

// Employee Payroll Services
const employeePayrollService = {
  // Get my payroll records
  getMyPayroll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/employee/payroll${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get payroll details by ID
  getPayrollDetails: async (id) => {
    try {
      const response = await api.get(`/employee/payroll/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default employeePayrollService;
