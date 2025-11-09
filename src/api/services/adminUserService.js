import api from '../axios'

export const adminUserService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, null, {
      params: { isActive },
    })
    return response.data
  },

  updateUserRole: async (id, roleId) => {
    const response = await api.put(`/admin/users/${id}/role`, { roleId })
    return response.data
  },
}

