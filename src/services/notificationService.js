import api from './api';

const notificationService = {
  getAll: async () => {
    const response = await api.get('/api/notifications');
    return response.data;
  },

  getUnread: async () => {
    const response = await api.get('/api/notifications/unread');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/api/notifications/unread/count');
    return response.data.count;
  },

  markAsRead: async (id) => {
    await api.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/api/notifications/read-all');
  },

  deleteNotification: async (id) => {
    await api.delete(`/api/notifications/${id}`);
  },
};

export default notificationService;