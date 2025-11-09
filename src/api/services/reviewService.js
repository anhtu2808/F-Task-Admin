import api from '../axios'

export const reviewService = {
  createReview: async (data) => {
    const response = await api.post('/reviews', data)
    return response.data
  },

  updateReview: async (reviewId, data) => {
    const response = await api.put(`/reviews/${reviewId}`, data)
    return response.data
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data
  },
}

