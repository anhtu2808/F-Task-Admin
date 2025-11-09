import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authUtils } from '../utils/auth'
import { Spin } from 'antd'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  // Check both user state and token existence
  if (!user || !authUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

