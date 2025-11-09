import { useEffect, useState } from 'react'
import { Table, Button, Tag, Badge, message, Space } from 'antd'
import { CheckOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { notificationService } from '../api/services/notificationService'
import dayjs from 'dayjs'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const response = await notificationService.getNotifications()
      if (response.code === 200 && response.result) {
        setNotifications(response.result)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      if (response.code === 200 && response.result !== undefined) {
        setUnreadCount(response.result)
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId)
      if (response.code === 200) {
        message.success('Đã đánh dấu đã đọc!')
        loadNotifications()
        loadUnreadCount()
      }
    } catch (error) {
      message.error('Đánh dấu đã đọc thất bại!')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead()
      if (response.code === 200) {
        message.success('Đã đánh dấu tất cả đã đọc!')
        loadNotifications()
        loadUnreadCount()
      }
    } catch (error) {
      message.error('Đánh dấu tất cả đã đọc thất bại!')
    }
  }

  const getTypeTag = (type) => {
    const typeColors = {
      JOB_ACCEPTED: 'green',
      JOB_STARTED: 'blue',
      JOB_COMPLETED: 'cyan',
      NEW_JOB_AVAILABLE: 'orange',
      PAYMENT_SUCCESS: 'green',
      PAYMENT_FAILED: 'red',
      PAYMENT_CREATED: 'blue',
      PARTNER_CANCELLED_CLAIM: 'orange',
      EARNING_RECEIVED: 'green',
      REVIEW_RECEIVED: 'purple',
      BOOKING_CREATED: 'blue',
      INSUFFICIENT_PARTNERS_WARNING: 'orange',
    }
    return <Tag color={typeColors[type]}>{type}</Tag>
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: getTypeTag,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (id) => id || '-',
    },
    {
      title: 'Read',
      dataIndex: 'isRead',
      key: 'isRead',
      render: (isRead) => (
        <Badge status={isRead ? 'default' : 'processing'} text={isRead ? 'Read' : 'Unread'} />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.isRead && (
            <Button
              icon={<CheckOutlined />}
              size="small"
              onClick={() => handleMarkAsRead(record.id)}
            >
              Mark Read
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1>Notifications</h1>
          <Badge count={unreadCount} showZero>
            <span style={{ marginLeft: 8 }}>Unread: {unreadCount}</span>
          </Badge>
        </div>
        {unreadCount > 0 && (
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <Table
        dataSource={notifications}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  )
}

export default Notifications

