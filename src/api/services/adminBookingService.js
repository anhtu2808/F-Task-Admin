import api from '../axios'

export const adminBookingService = {
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params })
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`)
    return response.data
  },

  updateBookingStatus: async (id, data) => {
    const response = await api.put(`/admin/bookings/${id}/status`, data)
    return response.data
  },

  cancelBooking: async (id, data) => {
    const response = await api.put(`/admin/bookings/${id}/cancel`, data)
    return response.data
  },

  refundBooking: async (id, data) => {
    const response = await api.post(`/admin/bookings/${id}/refund`, data)
    return response.data
  },
}

