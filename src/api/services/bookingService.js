import api from '../axios'

export const bookingService = {
  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params })
    return response.data
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  createBooking: async (data) => {
    const response = await api.post('/bookings', data)
    return response.data
  },

  cancelBooking: async (id, reason) => {
    const response = await api.put(`/bookings/${id}`, { reason })
    return response.data
  },

  generateQRCode: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}/qr-code`)
    return response.data
  },

  handleInsufficientPartnersResponse: async (id, cancel) => {
    const response = await api.post(`/bookings/${id}/insufficient-partners-response`, { cancel })
    return response.data
  },
}

