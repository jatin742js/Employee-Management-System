import api from './api';

// Admin Employee Management Services
const adminEmployeeService = {
  // Get all employees
  getAllEmployees: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/admin/employees${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single employee
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/admin/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/admin/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`/admin/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Deactivate employee
  deactivateEmployee: async (id) => {
    try {
      const response = await api.put(`/admin/employees/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Activate employee
  activateEmployee: async (id) => {
    try {
      const response = await api.put(`/admin/employees/${id}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/admin/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminEmployeeService;
