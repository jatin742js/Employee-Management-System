import api from './api';

// Employee Authentication Services
const employeeAuthService = {
  // Get employee profile
  getEmployeeProfile: async () => {
    try {
      const response = await api.get('/employee/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update employee profile
  updateEmployeeProfile: async (profileData) => {
    try {
      const response = await api.put('/employee/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changeEmployeePassword: async (passwords) => {
    try {
      const response = await api.put('/employee/auth/change-password', passwords);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login employee
  loginEmployee: async (email, password) => {
    try {
      const response = await api.post('/employee/auth/login', {
        email,
        password,
      });
      
      // Store token and user data
      if (response.data.data.token) {
        localStorage.setItem('employeeToken', response.data.data.token);
        localStorage.setItem('employeeUser', JSON.stringify(response.data.data.employee));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register employee
  registerEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employee/auth/register', employeeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout employee
  logoutEmployee: () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeUser');
  },
};

export default employeeAuthService;
