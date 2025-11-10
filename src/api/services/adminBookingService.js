import api from '../axios'

export const adminBookingService = {
  getAllBookings: async (params = {}) => {
    // 👇 Gán mặc định nếu chưa có orderBy/sortDirection
    const defaultParams = {
      sortBy: params.sortBy || 'startAt',
      sortDirection: params.sortDirection || 'desc',
      ...params,
    }

    const response = await api.get('/admin/bookings', { params: defaultParams })
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

