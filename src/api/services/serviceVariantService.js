import api from '../axios'

export const serviceVariantService = {
  getAll: async (params = {}) => {
    const response = await api.get('/service-variants', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/service-variants/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/service-variants', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/service-variants/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/service-variants/${id}`)
    return response.data
  },
}

