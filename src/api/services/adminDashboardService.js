import api from '../axios'

export const adminDashboardService = {
  getOverallStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  getRevenueStats: async (fromDate, toDate) => {
    const response = await api.get('/admin/dashboard/revenue', {
      params: { fromDate, toDate },
    })
    return response.data
  },

  getBookingsTrend: async (fromDate, toDate, period = 'DAILY') => {
    const response = await api.get('/admin/dashboard/bookings-trend', {
      params: { fromDate, toDate, period },
    })
    return response.data
  },
}

