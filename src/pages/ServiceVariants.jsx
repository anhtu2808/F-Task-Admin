import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Space, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { serviceVariantService } from '../api/services/serviceVariantService'
import { serviceCatalogService } from '../api/services/serviceCatalogService'

const ServiceVariants = () => {
  const [variants, setVariants] = useState([])
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingVariant, setEditingVariant] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [form] = Form.useForm()

  useEffect(() => {
    loadCatalogs()
    loadVariants()
  }, [])

  const loadCatalogs = async () => {
    try {
      const response = await serviceCatalogService.getAll()
      if (response.code === 200 && response.result) {
        setCatalogs(response.result)
      }
    } catch (error) {
      console.error('Failed to load catalogs:', error)
    }
  }

  const loadVariants = async (page = 1, pageSize = 10) => {
    setLoading(true)
    try {
      const response = await serviceVariantService.getAll({
        page: page - 1,
        size: pageSize,
      })
      if (response.code === 200 && response.result) {
        setVariants(response.result.content || [])
        setPagination({
          current: page,
          pageSize,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load variants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingVariant(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (variant) => {
    setEditingVariant(variant)
    form.setFieldsValue({
      ...variant,
      serviceCatalogId: variant.serviceCatalog?.id,
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      const response = await serviceVariantService.delete(id)
      if (response.code === 200 || response.code === 204) {
        message.success('Xóa service variant thành công!')
        loadVariants(pagination.current, pagination.pageSize)
      }
    } catch (error) {
      message.error('Xóa service variant thất bại!')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingVariant) {
        const response = await serviceVariantService.update(editingVariant.id, values)
        if (response.code === 200 || response.code === 302) {
          message.success('Cập nhật service variant thành công!')
          setModalVisible(false)
          loadVariants(pagination.current, pagination.pageSize)
        }
      } else {
        const response = await serviceVariantService.create(values)
        if (response.code === 201 || response.code === 200) {
          message.success('Tạo service variant thành công!')
          setModalVisible(false)
          loadVariants(pagination.current, pagination.pageSize)
        }
      }
    } catch (error) {
      message.error(editingVariant ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!')
    }
  }

  const handleTableChange = (pagination) => {
    loadVariants(pagination.current, pagination.pageSize)
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
      title: 'Duration (hours)',
      dataIndex: 'durationHours',
      key: 'durationHours',
    },
    {
      title: 'Price',
      dataIndex: 'pricePerVariant',
      key: 'pricePerVariant',
      render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Multi Partner',
      dataIndex: 'isMultiPartner',
      key: 'isMultiPartner',
      render: (multi) => multi ? 'Yes' : 'No',
    },
    {
      title: 'Number of Partners',
      dataIndex: 'numberOfPartners',
      key: 'numberOfPartners',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
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
        <h1>Service Variants</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Variant
        </Button>
      </div>

      <Table
        dataSource={variants}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingVariant ? 'Edit Service Variant' : 'Create Service Variant'}
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
          <Form.Item name="serviceCatalogId" label="Service Catalog" rules={[{ required: true }]}>
            <Select>
              {catalogs.map((catalog) => (
                <Select.Option key={catalog.id} value={catalog.id}>
                  {catalog.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="durationHours" label="Duration (hours)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="pricePerVariant" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="isMultiPartner" label="Multi Partner" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="numberOfPartners" label="Number of Partners" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ServiceVariants

