import api from '../axios'

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all')
    return response.data
  },

  testNotification: async () => {
    const response = await api.post('/notifications/test')
    return response.data
  },
}

