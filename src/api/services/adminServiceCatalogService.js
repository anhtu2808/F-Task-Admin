import api from '../axios'

export const adminServiceCatalogService = {
  getAllServiceCatalogs: async (params = {}) => {
    const response = await api.get('/admin/service-catalogs', { params })
    return response.data
  },

  getServiceCatalogById: async (id) => {
    const response = await api.get(`/admin/service-catalogs/${id}`)
    return response.data
  },

  createServiceCatalog: async (data) => {
    const response = await api.post('/admin/service-catalogs', data)
    return response.data
  },

  updateServiceCatalog: async (id, data) => {
    const response = await api.put(`/admin/service-catalogs/${id}`, data)
    return response.data
  },

  deleteServiceCatalog: async (id) => {
    const response = await api.delete(`/admin/service-catalogs/${id}`)
    return response.data
  },
}

