import api from '../axios'

export const districtService = {
  getAllDistricts: async () => {
    const response = await api.get('/districts')
    return response.data
  },
}

