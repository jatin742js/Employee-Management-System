import adminApi from './adminApi';

// Admin Authentication Services
const adminAuthService = {
  // Register admin
  registerAdmin: async (adminData) => {
    try {
      const response = await adminApi.post('/admin/auth/register', {
        name: adminData.fullName,
        email: adminData.email,
        password: adminData.password,
        organization: adminData.fullName, // Use fullName as organization too
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login admin
  loginAdmin: async (email, password) => {
    try {
      const response = await adminApi.post('/admin/auth/login', {
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

  // Get admin profile
  getAdminProfile: async () => {
    try {
      const response = await adminApi.get('/admin/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update admin profile
  updateAdminProfile: async (profileData) => {
    try {
      const response = await adminApi.put('/admin/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change admin password
  changeAdminPassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await adminApi.put('/admin/auth/change-password', {
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
