import api from '../axios'

export const partnerService = {
  getPartnerReviews: async (partnerId) => {
    const response = await api.get(`/partners/${partnerId}/reviews`)
    return response.data
  },

  getMyReviews: async () => {
    const response = await api.get('/partners/my-reviews')
    return response.data
  },

  getRegisteredDistricts: async () => {
    const response = await api.get('/partners/districts')
    return response.data
  },

  registerDistricts: async (districtIds) => {
    const response = await api.put('/partners/districts', { districtIds })
    return response.data
  },

  claimBooking: async (bookingId) => {
    const response = await api.post(`/partners/bookings/${bookingId}/claim`)
    return response.data
  },

  startBooking: async (bookingId) => {
    const response = await api.post(`/partners/bookings/${bookingId}/start`)
    return response.data
  },

  completeBooking: async (bookingId) => {
    const response = await api.post(`/partners/bookings/${bookingId}/complete`)
    return response.data
  },

  cancelBookingClaim: async (bookingId) => {
    const response = await api.post(`/partners/bookings/${bookingId}/cancel`)
    return response.data
  },

  startBookingByQR: async (qrToken) => {
    const response = await api.post('/partners/bookings/start-by-qr', { qrToken })
    return response.data
  },
}

