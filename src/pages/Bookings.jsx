import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag, InputNumber } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { adminBookingService } from '../api/services/adminBookingService'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [refundModalVisible, setRefundModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    status: undefined,
    customerId: undefined,
    partnerId: undefined,
    serviceCatalogId: undefined,
    variantId: undefined,
    customerName: undefined,
    partnerName: undefined,
    serviceName: undefined,
    startDateFrom: undefined,
    startDateTo: undefined,
    createdFrom: undefined,
    createdTo: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    district: undefined,
    isCustomerAccepted: undefined,
  })
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [form] = Form.useForm()
  const [statusForm] = Form.useForm()
  const [refundForm] = Form.useForm()

  useEffect(() => {
    loadBookings()
  }, [pagination.current, pagination.pageSize, filters, sortBy, sortDirection])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
      }
      
      // Only add sortBy and sortDirection if they have values
      if (sortBy) {
        params.sortBy = sortBy
      }
      if (sortDirection) {
        params.sortDirection = sortDirection
      }
      
      // Only add filters that have values (not undefined, null, or empty string)
      if (filters.status) {
        params.status = filters.status
      }
      if (filters.customerId) {
        params.customerId = filters.customerId
      }
      if (filters.partnerId) {
        params.partnerId = filters.partnerId
      }
      if (filters.serviceCatalogId) {
        params.serviceCatalogId = filters.serviceCatalogId
      }
      if (filters.variantId) {
        params.variantId = filters.variantId
      }
      if (filters.customerName) {
        params.customerName = filters.customerName
      }
      if (filters.partnerName) {
        params.partnerName = filters.partnerName
      }
      if (filters.serviceName) {
        params.serviceName = filters.serviceName
      }
      if (filters.startDateFrom) {
        params.startDateFrom = filters.startDateFrom.toISOString()
      }
      if (filters.startDateTo) {
        params.startDateTo = filters.startDateTo.toISOString()
      }
      if (filters.createdFrom) {
        params.createdFrom = filters.createdFrom.toISOString()
      }
      if (filters.createdTo) {
        params.createdTo = filters.createdTo.toISOString()
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params.minPrice = filters.minPrice
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params.maxPrice = filters.maxPrice
      }
      if (filters.district) {
        params.district = filters.district
      }
      if (filters.isCustomerAccepted !== undefined && filters.isCustomerAccepted !== null) {
        params.isCustomerAccepted = filters.isCustomerAccepted
      }
      
      const response = await adminBookingService.getAllBookings(params)
      if (response.code === 200 && response.result) {
        setBookings(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load bookings:', error)
      message.error('Không thể tải danh sách bookings!')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await adminBookingService.getBookingById(id)
      if (response.code === 200 && response.result) {
        setSelectedBooking(response.result)
        setModalVisible(true)
      }
    } catch (error) {
      message.error('Không thể tải thông tin booking!')
    }
  }

  const handleUpdateStatus = async (values) => {
    try {
      const response = await adminBookingService.updateBookingStatus(selectedBooking.id, values)
      if (response.code === 200) {
        message.success('Cập nhật status booking thành công!')
        setStatusModalVisible(false)
        setSelectedBooking(null)
        statusForm.resetFields()
        loadBookings()
      }
    } catch (error) {
      message.error('Cập nhật status thất bại!')
    }
  }

  const handleCancel = async (values) => {
    try {
      const response = await adminBookingService.cancelBooking(selectedBooking.id, values)
      if (response.code === 200) {
        message.success('Hủy booking thành công!')
        setModalVisible(false)
        setSelectedBooking(null)
        loadBookings()
      }
    } catch (error) {
      message.error('Hủy booking thất bại!')
    }
  }

  const handleRefund = async (values) => {
    try {
      const response = await adminBookingService.refundBooking(selectedBooking.id, values)
      if (response.code === 200) {
        message.success('Refund booking thành công!')
        setRefundModalVisible(false)
        setSelectedBooking(null)
        refundForm.resetFields()
        loadBookings()
      }
    } catch (error) {
      message.error('Refund booking thất bại!')
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setPagination({ ...pagination, current: 1 })
  }

  const handleTableChange = (pagination, tableFilters, sorter) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    })
    
    if (sorter.field && sorter.order) {
      setSortBy(sorter.field)
      setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc')
    } else {
      // Reset sorting when user clears sort
      setSortBy(null)
      setSortDirection(null)
    }
  }

  const handleOpenStatusModal = (booking) => {
    setSelectedBooking(booking)
    statusForm.setFieldsValue({ status: booking.status })
    setStatusModalVisible(true)
  }

  const handleOpenRefundModal = (booking) => {
    setSelectedBooking(booking)
    refundForm.setFieldsValue({ refundAmount: booking.totalPrice })
    setRefundModalVisible(true)
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
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            View
          </Button>
          <Button onClick={() => handleOpenStatusModal(record)}>
            Update Status
          </Button>
          {record.status !== 'CANCELLED' && (
            <Button danger onClick={() => handleCancel({ reason: 'Admin cancellation' })}>
              Cancel
            </Button>
          )}
          {record.status === 'COMPLETED' && (
            <Button type="primary" onClick={() => handleOpenRefundModal(record)}>
              Refund
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Bookings</h1>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Customer Name"
          style={{ width: 150 }}
          value={filters.customerName}
          onChange={(e) => handleFilterChange('customerName', e.target.value)}
          allowClear
        />
        <Input
          placeholder="Partner Name"
          style={{ width: 150 }}
          value={filters.partnerName}
          onChange={(e) => handleFilterChange('partnerName', e.target.value)}
          allowClear
        />
        <Input
          placeholder="Service Name"
          style={{ width: 150 }}
          value={filters.serviceName}
          onChange={(e) => handleFilterChange('serviceName', e.target.value)}
          allowClear
        />
        <Select
          placeholder="Status"
          style={{ width: 150 }}
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
        <InputNumber
          placeholder="Min Price"
          style={{ width: 120 }}
          min={0}
          value={filters.minPrice}
          onChange={(value) => handleFilterChange('minPrice', value)}
        />
        <InputNumber
          placeholder="Max Price"
          style={{ width: 120 }}
          min={0}
          value={filters.maxPrice}
          onChange={(value) => handleFilterChange('maxPrice', value)}
        />
        <RangePicker
          placeholder={['Start Date From', 'Start Date To']}
          onChange={(dates) => {
            handleFilterChange('startDateFrom', dates?.[0])
            handleFilterChange('startDateTo', dates?.[1])
          }}
        />
        <Button onClick={() => {
          setFilters({
            status: undefined,
            customerId: undefined,
            partnerId: undefined,
            serviceCatalogId: undefined,
            variantId: undefined,
            customerName: undefined,
            partnerName: undefined,
            serviceName: undefined,
            startDateFrom: undefined,
            startDateTo: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            district: undefined,
            isCustomerAccepted: undefined,
          })
          setPagination({ ...pagination, current: 1 })
        }}>
          Clear Filters
        </Button>
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
            
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button onClick={() => handleOpenStatusModal(selectedBooking)}>
                  Update Status
                </Button>
                {selectedBooking.status !== 'CANCELLED' && (
                  <Button danger onClick={() => handleCancel({ reason: 'Admin cancellation' })}>
                    Cancel Booking
                  </Button>
                )}
                {selectedBooking.status === 'COMPLETED' && (
                  <Button type="primary" onClick={() => handleOpenRefundModal(selectedBooking)}>
                    Refund
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Update Booking Status"
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false)
          setSelectedBooking(null)
          statusForm.resetFields()
        }}
        onOk={() => statusForm.submit()}
        width={500}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="WAITING_FOR_PAYMENT">Waiting for Payment</Select.Option>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="PARTIALLY_ACCEPTED">Partially Accepted</Select.Option>
              <Select.Option value="FULLY_ACCEPTED">Fully Accepted</Select.Option>
              <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
              <Select.Option value="COMPLETED">Completed</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="reason" label="Reason (optional)">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Refund Booking"
        open={refundModalVisible}
        onCancel={() => {
          setRefundModalVisible(false)
          setSelectedBooking(null)
          refundForm.resetFields()
        }}
        onOk={() => refundForm.submit()}
        width={500}
      >
        <Form form={refundForm} layout="vertical" onFinish={handleRefund}>
          <Form.Item name="refundAmount" label="Refund Amount" rules={[{ required: true, min: 0 }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              max={selectedBooking?.totalPrice}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item name="reason" label="Reason (optional)">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Bookings

