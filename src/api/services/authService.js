import api from '../axios'

export const authService = {
  sendOtp: async (phone) => {
    const response = await api.post('/auth/send-otp', { phone })
    return response.data
  },

  verifyOtp: async (phone, otp, role = 'CUSTOMER') => {
    const response = await api.post('/auth/verify-otp', { phone, otp, role })
    return response.data
  },
}

