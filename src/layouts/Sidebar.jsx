import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  StarOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/service-catalogs',
      icon: <AppstoreOutlined />,
      label: 'Service Catalogs',
    },
    {
      key: '/service-variants',
      icon: <FileTextOutlined />,
      label: 'Service Variants',
    },
    {
      key: '/bookings',
      icon: <CalendarOutlined />,
      label: 'Bookings',
    },
    {
      key: '/partners',
      icon: <TeamOutlined />,
      label: 'Partners',
    },
    {
      key: '/reviews',
      icon: <StarOutlined />,
      label: 'Reviews',
    },
    {
      key: '/transactions',
      icon: <DollarOutlined />,
      label: 'Transactions',
    },
    {
      key: '/districts',
      icon: <EnvironmentOutlined />,
      label: 'Districts',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
  ]

  return (
    <Sider
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        FTask Admin
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}

export default Sidebar

