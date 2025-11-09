import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { bookingService } from '../api/services/bookingService'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
  })
  const [form] = Form.useForm()

  useEffect(() => {
    loadBookings()
  }, [pagination.current, pagination.pageSize, filters])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        ...filters,
      }
      if (filters.fromDate) {
        params.fromDate = filters.fromDate.toISOString()
      }
      if (filters.toDate) {
        params.toDate = filters.toDate.toISOString()
      }
      
      const response = await bookingService.getBookings(params)
      if (response.code === 200 && response.result) {
        setBookings(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await bookingService.getBooking(id)
      if (response.code === 200 && response.result) {
        setSelectedBooking(response.result)
        setModalVisible(true)
      }
    } catch (error) {
      message.error('Không thể tải thông tin booking!')
    }
  }

  const handleCancel = async (values) => {
    try {
      const response = await bookingService.cancelBooking(selectedBooking.id, values.reason)
      if (response.code === 200) {
        message.success('Hủy booking thành công!')
        setModalVisible(false)
        loadBookings()
      }
    } catch (error) {
      message.error('Hủy booking thất bại!')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setPagination({ ...pagination, current: 1 })
  }

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    })
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

  const columns = [
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
          View
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Bookings</h1>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        >
          <Select.Option value="WAITING_FOR_PAYMENT">Waiting for Payment</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="PARTIALLY_ACCEPTED">Partially Accepted</Select.Option>
          <Select.Option value="FULLY_ACCEPTED">Fully Accepted</Select.Option>
          <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
          <Select.Option value="COMPLETED">Completed</Select.Option>
          <Select.Option value="CANCELLED">Cancelled</Select.Option>
        </Select>
        <RangePicker
          onChange={(dates) => {
            handleFilterChange('fromDate', dates?.[0])
            handleFilterChange('toDate', dates?.[1])
          }}
        />
      </div>

      <Table
        dataSource={bookings}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title="Booking Details"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedBooking(null)
          form.resetFields()
        }}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <div>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>Customer:</strong> {selectedBooking.customer?.user?.fullName}</p>
            <p><strong>Service:</strong> {selectedBooking.variant?.name}</p>
            <p><strong>Status:</strong> {getStatusTag(selectedBooking.status)}</p>
            <p><strong>Total Price:</strong> {selectedBooking.totalPrice?.toLocaleString('vi-VN')} VNĐ</p>
            <p><strong>Start At:</strong> {dayjs(selectedBooking.startAt).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Required Partners:</strong> {selectedBooking.requiredPartners}</p>
            <p><strong>Joined Partners:</strong> {selectedBooking.numberOfJoinedPartner}</p>
            <p><strong>Method:</strong> {selectedBooking.method}</p>
            <p><strong>Customer Note:</strong> {selectedBooking.customerNote || '-'}</p>
            
            {selectedBooking.status === 'PENDING' && (
              <Form form={form} onFinish={handleCancel} style={{ marginTop: 16 }}>
                <Form.Item name="reason" label="Cancel Reason" rules={[{ required: true }]}>
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" danger htmlType="submit">
                    Cancel Booking
                  </Button>
                </Form.Item>
              </Form>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Bookings

