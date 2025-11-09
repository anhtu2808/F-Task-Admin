import { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Table, Spin } from 'antd'
import { DollarOutlined, CalendarOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons'
import { bookingService } from '../api/services/bookingService'
import dayjs from 'dayjs'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalPartners: 0,
    totalServices: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await bookingService.getBookings({ page: 0, size: 10 })
      if (response.code === 200 && response.result) {
        const bookings = response.result.content || []
        setRecentBookings(bookings)
        
        // Calculate stats
        const totalBookings = response.result.totalElements || 0
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
        
        setStats({
          totalBookings,
          totalRevenue,
          totalPartners: 0, // Will be calculated from partner data
          totalServices: 0, // Will be calculated from service data
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<CalendarOutlined />}
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
              title="Total Partners"
              value={stats.totalPartners}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={stats.totalServices}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

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

