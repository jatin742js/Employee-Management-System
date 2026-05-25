import adminApi from './adminApi';

const adminNotificationService = {
  // Get all notifications
  getAllNotifications: async (params = {}) => {
    try {
      const response = await adminApi.get('/admin/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await adminApi.get('/admin/notifications/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread notifications only
  getUnreadNotifications: async () => {
    try {
      const response = await adminApi.get('/admin/notifications', { params: { unreadOnly: true } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    try {
      const response = await adminApi.put(`/admin/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await adminApi.put('/admin/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await adminApi.delete(`/admin/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send notification to employee
  sendNotification: async (payload) => {
    try {
      const response = await adminApi.post('/admin/notifications/send', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default adminNotificationService;
