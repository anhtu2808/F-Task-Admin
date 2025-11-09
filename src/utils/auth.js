export const authUtils = {
  getToken: () => {
    return localStorage.getItem('accessToken')
  },

  setToken: (token) => {
    localStorage.setItem('accessToken', token)
  },

  removeToken: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo')
    return userInfo ? JSON.parse(userInfo) : null
  },

  setUserInfo: (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken')
  },
}

