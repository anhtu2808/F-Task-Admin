import { createContext, useContext, useState, useEffect } from 'react'
import { authUtils } from '../utils/auth'
import { userService } from '../api/services/userService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      if (authUtils.isAuthenticated()) {
        try {
          const response = await userService.getCurrentUserInfo()
          if (response.code === 200 && response.result) {
            setUser(response.result)
            authUtils.setUserInfo(response.result)
          }
        } catch (error) {
          console.error('Failed to load user info:', error)
          authUtils.removeToken()
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const login = async (token, userInfo) => {
    authUtils.setToken(token)
    // Load full user info after login
    try {
      const response = await userService.getCurrentUserInfo()
      if (response.code === 200 && response.result) {
        setUser(response.result)
        authUtils.setUserInfo(response.result)
      } else {
        // Fallback to provided userInfo if API call fails
        setUser(userInfo)
        authUtils.setUserInfo(userInfo)
      }
    } catch (error) {
      // Fallback to provided userInfo if API call fails
      setUser(userInfo)
      authUtils.setUserInfo(userInfo)
    }
  }

  const logout = () => {
    authUtils.removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

