import api from '../axios'

export const adminPartnerService = {
  getAllPartners: async (params = {}) => {
    const response = await api.get('/admin/partners', { params })
    return response.data
  },

  getPartnerById: async (id) => {
    const response = await api.get(`/admin/partners/${id}`)
    return response.data
  },

  updatePartnerStatus: async (id, data) => {
    const response = await api.put(`/admin/partners/${id}/status`, data)
    return response.data
  },

  updatePartnerDistricts: async (id, districtIds) => {
    const response = await api.put(`/admin/partners/${id}/districts`, { districtIds })
    return response.data
  },

  getPartnerBookings: async (id, params = {}) => {
    // Note: swagger shows default page=0, but we'll send page from 1 and let backend handle it
    const response = await api.get(`/admin/partners/${id}/bookings`, { params })
    return response.data
  },
}

