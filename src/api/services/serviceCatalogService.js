import api from '../axios'

export const serviceCatalogService = {
  getAll: async () => {
    const response = await api.get('/service-catalogs')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/service-catalogs/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/service-catalogs', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/service-catalogs/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/service-catalogs/${id}`)
    return response.data
  },
}

