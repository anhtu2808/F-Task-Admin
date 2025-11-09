import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Space, Drawer, Descriptions, Select, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { adminServiceCatalogService } from '../api/services/adminServiceCatalogService'
import ServiceCatalogVariants from '../components/ServiceCatalogVariants'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const ServiceCatalogs = () => {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [editingCatalog, setEditingCatalog] = useState(null)
  const [selectedCatalog, setSelectedCatalog] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    name: undefined,
    isActive: undefined,
    minPlatformFeePercent: undefined,
    maxPlatformFeePercent: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  })
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadCatalogs()
  }, [pagination.current, pagination.pageSize, filters, sortBy, sortDirection])

  const loadCatalogs = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current - 1, // Convert from 1-based (frontend) to 0-based (backend)
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
      if (filters.name) {
        params.name = filters.name
      }
      if (filters.isActive !== undefined && filters.isActive !== null) {
        params.isActive = filters.isActive
      }
      if (filters.minPlatformFeePercent !== undefined && filters.minPlatformFeePercent !== null) {
        params.minPlatformFeePercent = filters.minPlatformFeePercent
      }
      if (filters.maxPlatformFeePercent !== undefined && filters.maxPlatformFeePercent !== null) {
        params.maxPlatformFeePercent = filters.maxPlatformFeePercent
      }
      if (filters.createdFrom) {
        params.createdFrom = filters.createdFrom.toISOString()
      }
      if (filters.createdTo) {
        params.createdTo = filters.createdTo.toISOString()
      }

      const response = await adminServiceCatalogService.getAllServiceCatalogs(params)
      if (response.code === 200 && response.result) {
        setCatalogs(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load catalogs:', error)
      message.error('Không thể tải danh sách service catalogs!')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCatalog(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (catalog) => {
    setEditingCatalog(catalog)
    form.setFieldsValue(catalog)
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await adminServiceCatalogService.deleteServiceCatalog(id)
      if (response.code === 200) {
        message.success('Xóa service catalog thành công!')
        loadCatalogs()
      }
    } catch (error) {
      message.error('Xóa service catalog thất bại!')
    }
  }

  const handleViewDetails = async (catalog) => {
    try {
      const response = await adminServiceCatalogService.getServiceCatalogById(catalog.id)
      if (response.code === 200 && response.result) {
        setSelectedCatalog(response.result)
        setDrawerVisible(true)
      }
    } catch (error) {
      message.error('Không thể tải thông tin catalog!')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingCatalog) {
        const response = await adminServiceCatalogService.updateServiceCatalog(editingCatalog.id, values)
        if (response.code === 200) {
          message.success('Cập nhật service catalog thành công!')
          setModalVisible(false)
          loadCatalogs()
        }
      } else {
        const response = await adminServiceCatalogService.createServiceCatalog(values)
        if (response.code === 200 || response.code === 201) {
          message.success('Tạo service catalog thành công!')
          setModalVisible(false)
          loadCatalogs()
        }
      }
    } catch (error) {
      message.error(editingCatalog ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!')
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
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image URL',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url) => url ? <a href={url} target="_blank" rel="noopener noreferrer">View</a> : '-',
    },
    {
      title: 'Platform Fee %',
      dataIndex: 'platformFeePercent',
      key: 'platformFeePercent',
      render: (fee) => `${fee}%`,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => active ? 'Yes' : 'No',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Details
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Service Catalogs</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Catalog
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by name"
          style={{ width: 200 }}
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by Active"
          style={{ width: 150 }}
          allowClear
          value={filters.isActive}
          onChange={(value) => handleFilterChange('isActive', value)}
        >
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
        <InputNumber
          placeholder="Min Platform Fee %"
          style={{ width: 150 }}
          min={0}
          max={100}
          value={filters.minPlatformFeePercent}
          onChange={(value) => handleFilterChange('minPlatformFeePercent', value)}
        />
        <InputNumber
          placeholder="Max Platform Fee %"
          style={{ width: 150 }}
          min={0}
          max={100}
          value={filters.maxPlatformFeePercent}
          onChange={(value) => handleFilterChange('maxPlatformFeePercent', value)}
        />
        <RangePicker
          onChange={(dates) => {
            handleFilterChange('createdFrom', dates?.[0])
            handleFilterChange('createdTo', dates?.[1])
          }}
        />
        <Button onClick={() => {
          setFilters({
            name: undefined,
            isActive: undefined,
            minPlatformFeePercent: undefined,
            maxPlatformFeePercent: undefined,
            createdFrom: undefined,
            createdTo: undefined,
          })
          setPagination({ ...pagination, current: 1 })
        }}>
          Clear Filters
        </Button>
      </div>

      <Table
        dataSource={catalogs}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingCatalog ? 'Edit Service Catalog' : 'Create Service Catalog'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item name="platformFeePercent" label="Platform Fee Percent" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`Service Catalog: ${selectedCatalog?.name || ''}`}
        placement="right"
        size="large"
        onClose={() => {
          setDrawerVisible(false)
          setSelectedCatalog(null)
        }}
        open={drawerVisible}
        width={1200}
      >
        {selectedCatalog && (
          <div>
            <Descriptions title="Catalog Information" bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="ID">{selectedCatalog.id}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedCatalog.name}</Descriptions.Item>
              <Descriptions.Item label="Description">{selectedCatalog.description || '-'}</Descriptions.Item>
              <Descriptions.Item label="Image URL">
                {selectedCatalog.imageUrl ? (
                  <a href={selectedCatalog.imageUrl} target="_blank" rel="noopener noreferrer">
                    {selectedCatalog.imageUrl}
                  </a>
                ) : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Platform Fee Percent">{selectedCatalog.platformFeePercent}%</Descriptions.Item>
              <Descriptions.Item label="Active">{selectedCatalog.isActive ? 'Yes' : 'No'}</Descriptions.Item>
            </Descriptions>

            <ServiceCatalogVariants
              catalogId={selectedCatalog.id}
              catalogName={selectedCatalog.name}
              onClose={() => setDrawerVisible(false)}
            />
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default ServiceCatalogs

