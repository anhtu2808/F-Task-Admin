import { useEffect, useState } from 'react'
import { Table, Card, Spin } from 'antd'
import { districtService } from '../api/services/districtService'

const Districts = () => {
  const [districts, setDistricts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDistricts()
  }, [])

  const loadDistricts = async () => {
    setLoading(true)
    try {
      const response = await districtService.getAllDistricts()
      if (response.code === 200 && response.result) {
        setDistricts(response.result)
      }
    } catch (error) {
      console.error('Failed to load districts:', error)
    } finally {
      setLoading(false)
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
      title: 'City',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Districts</h1>

      <Card>
        <Table
          dataSource={districts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </div>
  )
}

export default Districts

