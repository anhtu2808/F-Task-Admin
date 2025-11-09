import api from '../axios'

export const transactionService = {
  getTransactions: async (params = {}) => {
    const response = await api.get('/users/transactions', { params })
    return response.data
  },

  getWallet: async () => {
    const response = await api.get('/users/wallet')
    return response.data
  },
}

