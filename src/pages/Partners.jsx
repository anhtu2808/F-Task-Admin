import { useEffect, useState } from 'react'
import { Table, Descriptions, Tag, Space, Button, Modal, Form, Select, Input, DatePicker, message, Drawer, Tabs } from 'antd'
import { EyeOutlined, EditOutlined, CalendarOutlined } from '@ant-design/icons'
import { adminPartnerService } from '../api/services/adminPartnerService'
import { adminBookingService } from '../api/services/adminBookingService'
import { districtService } from '../api/services/districtService'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const Partners = () => {
  const [partners, setPartners] = useState([])
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [partnerBookings, setPartnerBookings] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    partnerName: undefined,
    phone: undefined,
    email: undefined,
    isAvailable: undefined,
    isActive: undefined,
    district: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  })
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [statusForm] = Form.useForm()
  const [districtsForm] = Form.useForm()


  useEffect(() => {
    loadDistricts()
    loadPartners()
  }, [pagination.current, pagination.pageSize, filters, sortBy, sortDirection])

  const loadDistricts = async () => {
    try {
      const response = await districtService.getAllDistricts()
      if (response.code === 200 && response.result) {
        setDistricts(response.result)
      }
    } catch (error) {
      console.error('Failed to load districts:', error)
    }
  }

  const loadPartners = async () => {
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
      if (filters.partnerName) {
        params.partnerName = filters.partnerName
      }
      if (filters.phone) {
        params.phone = filters.phone
      }
      if (filters.email) {
        params.email = filters.email
      }
      if (filters.isAvailable !== undefined && filters.isAvailable !== null) {
        params.isAvailable = filters.isAvailable
      }
      if (filters.isActive !== undefined && filters.isActive !== null) {
        params.isActive = filters.isActive
      }
      if (filters.district) {
        params.district = filters.district
      }
      if (filters.createdFrom) {
        params.createdFrom = filters.createdFrom.toISOString()
      }
      if (filters.createdTo) {
        params.createdTo = filters.createdTo.toISOString()
      }
      
      const response = await adminPartnerService.getAllPartners(params)
      if (response.code === 200 && response.result) {
        setPartners(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load partners:', error)
      message.error('Không thể tải danh sách partners!')
    } finally {
      setLoading(false)
    }
  }

  const loadPartnerDetails = async (id) => {
    try {
      const response = await adminPartnerService.getPartnerById(id)
      if (response.code === 200 && response.result) {
        setSelectedPartner(response.result)
        return response.result
      }
    } catch (error) {
      console.error('Failed to load partner details:', error)
      message.error('Không thể tải thông tin partner!')
    }
  }

  const loadPartnerBookings = async (id) => {
    try {
      const response = await adminPartnerService.getPartnerBookings(id, { page: 1, size: 10 })
      if (response.code === 200 && response.result) {
        setPartnerBookings(response.result.content || [])
      }
    } catch (error) {
      console.error('Failed to load partner bookings:', error)
    }
  }

  const handleView = async (partner) => {
    const partnerDetails = await loadPartnerDetails(partner.id)
    if (partnerDetails) {
      setDrawerVisible(true)
      loadPartnerBookings(partner.id)
    }
  }

  const handleUpdateStatus = async (values) => {
    try {
      const response = await adminPartnerService.updatePartnerStatus(selectedPartner.id, values)
      if (response.code === 200) {
        message.success('Cập nhật partner status thành công!')
        loadPartners()
        if (drawerVisible) {
          await loadPartnerDetails(selectedPartner.id)
        }
      }
    } catch (error) {
      message.error('Cập nhật partner status thất bại!')
    }
  }

  const handleUpdateDistricts = async (values) => {
    try {
      const response = await adminPartnerService.updatePartnerDistricts(selectedPartner.id, values.districtIds)
      if (response.code === 200) {
        message.success('Cập nhật districts thành công!')
        await loadPartnerDetails(selectedPartner.id)
      }
    } catch (error) {
      message.error('Cập nhật districts thất bại!')
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: ['user', 'fullName'],
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: ['user', 'phone'],
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Average Rating',
      dataIndex: 'averageRating',
      key: 'averageRating',
      render: (rating) => rating ? rating.toFixed(2) : '-',
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobsCompleted',
      key: 'totalJobsCompleted',
    },
    {
      title: 'Available',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (available) => <Tag color={available ? 'green' : 'red'}>{available ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ]

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

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Partners</h1>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Partner Name"
          style={{ width: 150 }}
          value={filters.partnerName}
          onChange={(e) => handleFilterChange('partnerName', e.target.value)}
          allowClear
        />
        <Input
          placeholder="Phone"
          style={{ width: 150 }}
          value={filters.phone}
          onChange={(e) => handleFilterChange('phone', e.target.value)}
          allowClear
        />
        <Input
          placeholder="Email"
          style={{ width: 150 }}
          value={filters.email}
          onChange={(e) => handleFilterChange('email', e.target.value)}
          allowClear
        />
        <Select
          placeholder="Available"
          style={{ width: 120 }}
          allowClear
          value={filters.isAvailable}
          onChange={(value) => handleFilterChange('isAvailable', value)}
        >
          <Select.Option value={true}>Available</Select.Option>
          <Select.Option value={false}>Unavailable</Select.Option>
        </Select>
        <Select
          placeholder="Active"
          style={{ width: 120 }}
          allowClear
          value={filters.isActive}
          onChange={(value) => handleFilterChange('isActive', value)}
        >
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
        <Input
          placeholder="District"
          style={{ width: 150 }}
          value={filters.district}
          onChange={(e) => handleFilterChange('district', e.target.value)}
          allowClear
        />
        <RangePicker
          onChange={(dates) => {
            handleFilterChange('createdFrom', dates?.[0])
            handleFilterChange('createdTo', dates?.[1])
          }}
        />
        <Button onClick={() => {
          setFilters({
            partnerName: undefined,
            phone: undefined,
            email: undefined,
            isAvailable: undefined,
            isActive: undefined,
            district: undefined,
            createdFrom: undefined,
            createdTo: undefined,
          })
          setPagination({ ...pagination, current: 1 })
        }}>
          Clear Filters
        </Button>
      </div>

      <Table
        dataSource={partners}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Drawer
        title={`Partner: ${selectedPartner?.user?.fullName || ''}`}
        placement="right"
        size="large"
        onClose={() => {
          setDrawerVisible(false)
          setSelectedPartner(null)
          setPartnerBookings([])
          statusForm.resetFields()
          districtsForm.resetFields()
        }}
        open={drawerVisible}
        width={900}
      >
        {selectedPartner && (
          <Tabs
            items={[
              {
                key: 'details',
                label: 'Details',
                children: (
                  <div>
                    <Descriptions column={1} bordered style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="ID">{selectedPartner.id}</Descriptions.Item>
                      <Descriptions.Item label="Name">{selectedPartner.user?.fullName}</Descriptions.Item>
                      <Descriptions.Item label="Phone">{selectedPartner.user?.phone}</Descriptions.Item>
                      <Descriptions.Item label="Email">{selectedPartner.user?.email}</Descriptions.Item>
                      <Descriptions.Item label="Average Rating">
                        {selectedPartner.averageRating ? selectedPartner.averageRating.toFixed(2) : '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Jobs Completed">
                        {selectedPartner.totalJobsCompleted}
                      </Descriptions.Item>
                      <Descriptions.Item label="Available">
                        <Tag color={selectedPartner.isAvailable ? 'green' : 'red'}>
                          {selectedPartner.isAvailable ? 'Yes' : 'No'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Districts">
                        {selectedPartner.districts?.map(d => d.name).join(', ') || '-'}
                      </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: 24 }}>
                      <h3>Update Status</h3>
                      <Form
                        form={statusForm}
                        layout="vertical"
                        onFinish={handleUpdateStatus}
                        initialValues={{ isAvailable: selectedPartner.isAvailable }}
                        key={`status-${selectedPartner.id}`}
                      >
                        <Form.Item name="isAvailable" label="Available" rules={[{ required: true }]}>
                          <Select>
                            <Select.Option value={true}>Available</Select.Option>
                            <Select.Option value={false}>Unavailable</Select.Option>
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Update Status
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <h3>Manage Districts</h3>
                      <Form
                        form={districtsForm}
                        layout="vertical"
                        onFinish={handleUpdateDistricts}
                        initialValues={{ districtIds: selectedPartner.districts?.map(d => d.id) || [] }}
                        key={`districts-${selectedPartner.id}`}
                      >
                        <Form.Item
                          name="districtIds"
                          label="Districts"
                          rules={[{ required: true, message: 'Please select at least one district' }]}
                        >
                          <Select mode="multiple" placeholder="Select districts">
                            {districts.map(district => (
                              <Select.Option key={district.id} value={district.id}>
                                {district.name} - {district.city}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Update Districts
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                ),
              },
              {
                key: 'bookings',
                label: 'Bookings',
                children: (
                  <Table
                    dataSource={partnerBookings}
                    columns={bookingColumns}
                    rowKey="id"
                    pagination={false}
                  />
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </div>
  )
}

export default Partners

