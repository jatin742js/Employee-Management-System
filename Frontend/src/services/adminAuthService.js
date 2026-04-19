import api from './api';

// Admin Authentication Services
const adminAuthService = {
  // Register admin
  registerAdmin: async (adminData) => {
    try {
      const response = await api.post('/admin/auth/register', {
        name: adminData.fullName,
        email: adminData.email,
        password: adminData.password,
        phone: adminData.phone,
        department: adminData.position || 'Administration',
        organization: adminData.organization,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login admin
  loginAdmin: async (email, password) => {
    try {
      const response = await api.post('/admin/auth/login', {
        email,
        password,
      });
      
      // Store token and user data
      if (response.data.data.token) {
        localStorage.setItem('adminToken', response.data.data.token);
        // Store only the admin object, not the entire data
        localStorage.setItem('adminUser', JSON.stringify(response.data.data.admin));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Forgot password
  forgotPassword: async (email, organization, newPassword) => {
    try {
      const response = await api.post('/admin/auth/forgot-password', {
        email,
        organization,
        newPassword,
        confirmPassword: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get admin profile
  getAdminProfile: async () => {
    try {
      const response = await api.get('/admin/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update admin profile
  updateAdminProfile: async (profileData) => {
    try {
      const response = await api.put('/admin/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change admin password
  changeAdminPassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.put('/admin/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout admin
  logoutAdmin: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('rememberAdminEmail');
  },
};

export default adminAuthService;
