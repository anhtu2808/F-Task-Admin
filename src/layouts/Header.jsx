import { Layout, Dropdown, Avatar, Button } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const { Header: AntHeader } = Layout

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
        FTask Admin Panel
      </div>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar icon={<UserOutlined />} />
          <span>{user?.fullName || user?.username || 'Admin'}</span>
        </div>
      </Dropdown>
    </AntHeader>
  )
}

export default Header

