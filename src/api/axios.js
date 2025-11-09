import axios from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ftask.anhtudev.works',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        // Unauthorized - Clear token
        // The ProtectedRoute will handle redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userInfo')
        // Only show error message if not already on login page
        if (!window.location.pathname.includes('/login')) {
          message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        }
      } else if (status >= 500) {
        message.error('Lỗi server. Vui lòng thử lại sau.')
      } else if (data?.message) {
        message.error(data.message)
      } else {
        message.error('Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } else if (error.request) {
      message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
    } else {
      message.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    }
    
    return Promise.reject(error)
  }
)

export default api

