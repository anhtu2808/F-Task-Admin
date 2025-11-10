import api from '../axios'

export const serviceVariantService = {
  getAll: async (params = {}) => {
    const response = await api.get('/service-variants', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/service-variants/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/service-variants', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/service-variants/${id}`, data, {
      validateStatus: () => true, // chấp nhận mọi mã trạng thái
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/service-variants/${id}`, {
      validateStatus: () => true,
    });

    // Nếu backend trả 204 (No Content), không có response body
    if (response.status === 204) {
      return { code: 204, message: 'Deleted successfully' };
    }

    // Còn nếu có body (ví dụ code, message, result) thì trả về như bình thường
    return response.data;
  },
}

