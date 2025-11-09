import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Spin, Tag } from 'antd'
import { DollarOutlined, CalendarOutlined, TeamOutlined, AppstoreOutlined, UserOutlined, StarOutlined } from '@ant-design/icons'
import { adminDashboardService } from '../api/services/adminDashboardService'
import { adminBookingService } from '../api/services/adminBookingService'
import dayjs from 'dayjs'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalPartners: 0,
    totalBookings: 0,
    totalCompletedBookings: 0,
    totalCancelledBookings: 0,
    totalPendingBookings: 0,
    totalServiceCatalogs: 0,
    totalServiceVariants: 0,
    totalReviews: 0,
    totalRevenue: 0,
    totalPlatformFee: 0,
    averageRating: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load dashboard stats
      const statsResponse = await adminDashboardService.getOverallStats()
      if (statsResponse.code === 200 && statsResponse.result) {
        setStats(statsResponse.result)
      }

      // Load recent bookings
      const bookingsResponse = await adminBookingService.getAllBookings({ 
        page: 1, 
        size: 10, 
        sortBy: 'createdAt', 
        sortDirection: 'desc' 
      })
      if (bookingsResponse.code === 200 && bookingsResponse.result) {
        setRecentBookings(bookingsResponse.result.content || [])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status) => {
    const statusColors = {
      WAITING_FOR_PAYMENT: 'orange',
      PENDING: 'blue',
      PARTIALLY_ACCEPTED: 'cyan',
      FULLY_ACCEPTED: 'green',
      IN_PROGRESS: 'purple',
      COMPLETED: 'success',
      CANCELLED: 'error',
    }
    return <Tag color={statusColors[status]}>{status}</Tag>
  }

  const bookingColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: ['customer', 'user', 'fullName'],
      key: 'customer',
    },
    {
      title: 'Service',
      dataIndex: ['variant', 'name'],
      key: 'service',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Start At',
      dataIndex: 'startAt',
      key: 'startAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Partners"
              value={stats.totalPartners}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Bookings"
              value={stats.totalCompletedBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={stats.totalPendingBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cancelled Bookings"
              value={stats.totalCancelledBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Service Catalogs"
              value={stats.totalServiceCatalogs}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Service Variants"
              value={stats.totalServiceVariants}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={stats.totalReviews}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              formatter={(value) => value.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Platform Fee"
              value={stats.totalPlatformFee}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              formatter={(value) => value.toLocaleString('vi-VN')}
            />
          </Card>
        </Col>
      </Row>

      {stats.averageRating > 0 && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Average Rating"
                value={stats.averageRating}
                prefix={<StarOutlined />}
                precision={2}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card title="Recent Bookings">
        <Table
          dataSource={recentBookings}
          columns={bookingColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
}

export default Dashboard

