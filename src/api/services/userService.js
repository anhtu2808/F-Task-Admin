import api from '../axios'

export const userService = {
  getCurrentUserInfo: async () => {
    const response = await api.get('/users/me')
    return response.data
  },

  updateUserInfo: async (data) => {
    const response = await api.put('/users/update-info', data)
    return response.data
  },
}

