import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Descriptions, Drawer } from 'antd'
import { EyeOutlined, EditOutlined, UserOutlined } from '@ant-design/icons'
import { adminUserService } from '../api/services/adminUserService'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    fullName: undefined,
    phone: undefined,
    email: undefined,
    username: undefined,
    isActive: undefined,
    gender: undefined,
    roleName: undefined,
    createdFrom: undefined,
    createdTo: undefined,
  })
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState(null)
  const [form] = Form.useForm()
  const [statusForm] = Form.useForm()
  const [roleForm] = Form.useForm()

  useEffect(() => {
    loadUsers()
  }, [pagination.current, pagination.pageSize, filters, sortBy, sortDirection])

  const loadUsers = async () => {
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
      if (filters.fullName) {
        params.fullName = filters.fullName
      }
      if (filters.phone) {
        params.phone = filters.phone
      }
      if (filters.email) {
        params.email = filters.email
      }
      if (filters.username) {
        params.username = filters.username
      }
      if (filters.isActive !== undefined && filters.isActive !== null) {
        params.isActive = filters.isActive
      }
      if (filters.gender) {
        params.gender = filters.gender
      }
      if (filters.roleName) {
        params.roleName = filters.roleName
      }
      if (filters.createdFrom) {
        params.createdFrom = filters.createdFrom.toISOString()
      }
      if (filters.createdTo) {
        params.createdTo = filters.createdTo.toISOString()
      }
      
      const response = await adminUserService.getAllUsers(params)
      if (response.code === 200 && response.result) {
        setUsers(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load users:', error)
      message.error('Không thể tải danh sách users!')
    } finally {
      setLoading(false)
    }
  }

  const loadUserDetails = async (id) => {
    try {
      const response = await adminUserService.getUserById(id)
      if (response.code === 200 && response.result) {
        setSelectedUser(response.result)
        return response.result
      }
    } catch (error) {
      console.error('Failed to load user details:', error)
      message.error('Không thể tải thông tin user!')
    }
  }

  const handleView = async (user) => {
    const userDetails = await loadUserDetails(user.id)
    if (userDetails) {
      setDrawerVisible(true)
    }
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
    })
    setModalVisible(true)
  }

  const handleUpdateUser = async (values) => {
    try {
      const response = await adminUserService.updateUser(selectedUser.id, values)
      if (response.code === 200) {
        message.success('Cập nhật user thành công!')
        setModalVisible(false)
        setSelectedUser(null)
        form.resetFields()
        loadUsers()
        if (drawerVisible) {
          await loadUserDetails(selectedUser.id)
        }
      }
    } catch (error) {
      message.error('Cập nhật user thất bại!')
    }
  }

  const handleUpdateStatus = async (values) => {
    try {
      const response = await adminUserService.updateUserStatus(selectedUser.id, values.isActive)
      if (response.code === 200) {
        message.success('Cập nhật user status thành công!')
        setStatusModalVisible(false)
        setSelectedUser(null)
        statusForm.resetFields()
        loadUsers()
        if (drawerVisible) {
          await loadUserDetails(selectedUser.id)
        }
      }
    } catch (error) {
      message.error('Cập nhật user status thất bại!')
    }
  }

  const handleUpdateRole = async (values) => {
    try {
      const response = await adminUserService.updateUserRole(selectedUser.id, values.roleId)
      if (response.code === 200) {
        message.success('Cập nhật user role thành công!')
        setRoleModalVisible(false)
        setSelectedUser(null)
        roleForm.resetFields()
        loadUsers()
        if (drawerVisible) {
          await loadUserDetails(selectedUser.id)
        }
      }
    } catch (error) {
      message.error('Cập nhật user role thất bại!')
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

  const handleOpenStatusModal = (user) => {
    setSelectedUser(user)
    statusForm.setFieldsValue({ isActive: user.isActive !== undefined ? user.isActive : true })
    setStatusModalVisible(true)
  }

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user)
    // Note: roleId might need to be extracted from user.role
    roleForm.setFieldsValue({ roleId: user.roleId || 1 })
    setRoleModalVisible(true)
  }

  const getGenderTag = (gender) => {
    const genderColors = {
      MALE: 'blue',
      FEMALE: 'pink',
      UNKNOWN: 'default',
    }
    return <Tag color={genderColors[gender]}>{gender}</Tag>
  }

  const getRoleTag = (role) => {
    const roleColors = {
      ADMIN: 'red',
      CUSTOMER: 'blue',
      PARTNER: 'green',
    }
    return <Tag color={roleColors[role]}>{role}</Tag>
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: getGenderTag,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: getRoleTag,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Yes' : 'No'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button onClick={() => handleOpenStatusModal(record)}>
            Status
          </Button>
          <Button onClick={() => handleOpenRoleModal(record)}>
            Role
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Users</h1>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Full Name"
          style={{ width: 150 }}
          value={filters.fullName}
          onChange={(e) => handleFilterChange('fullName', e.target.value)}
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
        <Input
          placeholder="Username"
          style={{ width: 150 }}
          value={filters.username}
          onChange={(e) => handleFilterChange('username', e.target.value)}
          allowClear
        />
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
        <Select
          placeholder="Gender"
          style={{ width: 120 }}
          allowClear
          value={filters.gender}
          onChange={(value) => handleFilterChange('gender', value)}
        >
          <Select.Option value="MALE">Male</Select.Option>
          <Select.Option value="FEMALE">Female</Select.Option>
          <Select.Option value="UNKNOWN">Unknown</Select.Option>
        </Select>
        <Input
          placeholder="Role Name"
          style={{ width: 120 }}
          value={filters.roleName}
          onChange={(e) => handleFilterChange('roleName', e.target.value)}
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
            fullName: undefined,
            phone: undefined,
            email: undefined,
            username: undefined,
            isActive: undefined,
            gender: undefined,
            roleName: undefined,
            createdFrom: undefined,
            createdTo: undefined,
          })
          setPagination({ ...pagination, current: 1 })
        }}>
          Clear Filters
        </Button>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title="Edit User"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedUser(null)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
          <Form.Item name="fullName" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select>
              <Select.Option value="MALE">Male</Select.Option>
              <Select.Option value="FEMALE">Female</Select.Option>
              <Select.Option value="UNKNOWN">Unknown</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update User Status"
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false)
          setSelectedUser(null)
          statusForm.resetFields()
        }}
        onOk={() => statusForm.submit()}
        width={400}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item name="isActive" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update User Role"
        open={roleModalVisible}
        onCancel={() => {
          setRoleModalVisible(false)
          setSelectedUser(null)
          roleForm.resetFields()
        }}
        onOk={() => roleForm.submit()}
        width={400}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleUpdateRole}>
          <Form.Item name="roleId" label="Role ID" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} min={1} />
          </Form.Item>
          <p style={{ color: '#999', fontSize: '12px' }}>
            Note: Role ID mapping - 1: CUSTOMER, 2: PARTNER, 3: ADMIN (check with backend)
          </p>
        </Form>
      </Modal>

      <Drawer
        title={`User: ${selectedUser?.fullName || selectedUser?.username || ''}`}
        placement="right"
        size="large"
        onClose={() => {
          setDrawerVisible(false)
          setSelectedUser(null)
        }}
        open={drawerVisible}
        width={700}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{selectedUser.id}</Descriptions.Item>
            <Descriptions.Item label="Username">{selectedUser.username}</Descriptions.Item>
            <Descriptions.Item label="Full Name">{selectedUser.fullName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedUser.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Gender">{getGenderTag(selectedUser.gender)}</Descriptions.Item>
            <Descriptions.Item label="Role">{getRoleTag(selectedUser.role)}</Descriptions.Item>
            <Descriptions.Item label="Active">
              <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                {selectedUser.isActive ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ID Card">{selectedUser.idCard || '-'}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  )
}

export default Users

