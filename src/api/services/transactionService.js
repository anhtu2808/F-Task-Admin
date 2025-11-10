import api from '../axios'

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/admin/transactions', { params }) // ✅ sửa đường dẫn
    return response.data
  },

  getTotalFee: async () => { // 👈 thêm hàm mới
    const response = await api.get('/admin/transactions/total-fee')
    return response.data
  },
}

