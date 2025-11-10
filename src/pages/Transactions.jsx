import { useEffect, useState } from 'react'
import { Table, Tag, Select, Card, Statistic } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { transactionService } from '../api/services/transactionService'
import dayjs from 'dayjs'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [filters, setFilters] = useState({
    type: undefined,
    status: undefined,
  })
  const [totalFee, setTotalFee] = useState(null)
  useEffect(() => {
    loadTotalFee()
    loadTransactions()
  }, [pagination.current, pagination.pageSize, filters])

  const loadTotalFee = async () => {
    try {
      const response = await transactionService.getTotalFee()
      if (response.code === 200 && response.result !== undefined) {
        setTotalFee(response.result)
      }
    } catch (error) {
      console.error('Failed to load total fee:', error)
    }
  }

  const loadWallet = async () => {
    try {
      const response = await transactionService.getWallet()
      if (response.code === 200 && response.result) {
        setWallet(response.result)
      }
    } catch (error) {
      console.error('Failed to load wallet:', error)
    }
  }

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.current,
        size: pagination.pageSize,
        ...filters,
      }

      const response = await transactionService.getTransactions(params)
      if (response.code === 200 && response.result) {
        setTransactions(response.result.content || [])
        setPagination({
          ...pagination,
          total: response.result.totalElements || 0,
        })
      }
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
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

  const getTypeTag = (type) => {
    const typeColors = {
      EARNING: 'green',
      WITHDRAWAL: 'orange',
      ADJUSTMENT: 'blue',
      REFUND: 'cyan',
      PLATFORM_FEE: 'purple',
      TOP_UP: 'geekblue',
      FINE: 'red',
    }
    return <Tag color={typeColors[type]}>{type}</Tag>
  }

  const getStatusTag = (status) => {
    const statusColors = {
      PENDING: 'orange',
      COMPLETED: 'green',
      FAILED: 'red',
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
      title: 'User',
      dataIndex: ['user', 'fullName'],
      key: 'user',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: getTypeTag,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${amount?.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Balance Before',
      dataIndex: 'balanceBefore',
      key: 'balanceBefore',
      render: (balance) => balance ? `${balance.toLocaleString('vi-VN')} VNĐ` : '-',
    },
    {
      title: 'Balance After',
      dataIndex: 'balanceAfter',
      key: 'balanceAfter',
      render: (balance) => balance ? `${balance.toLocaleString('vi-VN')} VNĐ` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Transactions</h1>

      {totalFee !== null && (
        <Card style={{ marginBottom: 24 }}>
          <Statistic
            title="Total Platform Fee"
            value={totalFee}
            prefix={<DollarOutlined />}
            suffix="VNĐ"
            formatter={(value) => value.toLocaleString('vi-VN')}
          />
        </Card>
      )}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Select
          placeholder="Filter by Type"
          style={{ width: 200 }}
          allowClear
          value={filters.type}
          onChange={(value) => handleFilterChange('type', value)}
        >
          <Select.Option value="EARNING">Earning</Select.Option>
          <Select.Option value="WITHDRAWAL">Withdrawal</Select.Option>
          <Select.Option value="ADJUSTMENT">Adjustment</Select.Option>
          <Select.Option value="REFUND">Refund</Select.Option>
          <Select.Option value="PLATFORM_FEE">Platform Fee</Select.Option>
          <Select.Option value="TOP_UP">Top Up</Select.Option>
          <Select.Option value="FINE">Fine</Select.Option>
        </Select>
        <Select
          placeholder="Filter by Status"
          style={{ width: 200 }}
          allowClear
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="COMPLETED">Completed</Select.Option>
          <Select.Option value="FAILED">Failed</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={transactions}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default Transactions

