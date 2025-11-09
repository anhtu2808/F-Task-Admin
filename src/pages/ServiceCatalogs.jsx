import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { serviceCatalogService } from '../api/services/serviceCatalogService'

const ServiceCatalogs = () => {
  const [catalogs, setCatalogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCatalog, setEditingCatalog] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadCatalogs()
  }, [])

  const loadCatalogs = async () => {
    setLoading(true)
    try {
      const response = await serviceCatalogService.getAll()
      if (response.code === 200 && response.result) {
        setCatalogs(response.result)
      }
    } catch (error) {
      console.error('Failed to load catalogs:', error)
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
      const response = await serviceCatalogService.delete(id)
      if (response.code === 200) {
        message.success('Xóa service catalog thành công!')
        loadCatalogs()
      }
    } catch (error) {
      message.error('Xóa service catalog thất bại!')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingCatalog) {
        const response = await serviceCatalogService.update(editingCatalog.id, values)
        if (response.code === 200) {
          message.success('Cập nhật service catalog thành công!')
          setModalVisible(false)
          loadCatalogs()
        }
      } else {
        const response = await serviceCatalogService.create(values)
        if (response.code === 200) {
          message.success('Tạo service catalog thành công!')
          setModalVisible(false)
          loadCatalogs()
        }
      }
    } catch (error) {
      message.error(editingCatalog ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!')
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

      <Table
        dataSource={catalogs}
        columns={columns}
        rowKey="id"
        loading={loading}
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
    </div>
  )
}

export default ServiceCatalogs

