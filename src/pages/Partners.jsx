import { useEffect, useState } from 'react'
import { Table, Card, Descriptions, Tag, Space, Button, Modal, message } from 'antd'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import { bookingService } from '../api/services/bookingService'

const Partners = () => {
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    setLoading(true)
    try {
      // Extract unique partners from bookings
      const response = await bookingService.getBookings({ size: 1000 })
      if (response.code === 200 && response.result) {
        const bookings = response.result.content || []
        const partnerMap = new Map()
        
        bookings.forEach(booking => {
          if (booking.partners) {
            booking.partners.forEach(partner => {
              if (!partnerMap.has(partner.partner.id)) {
                partnerMap.set(partner.partner.id, partner.partner)
              }
            })
          }
        })
        
        setPartners(Array.from(partnerMap.values()))
      }
    } catch (error) {
      console.error('Failed to load partners:', error)
    } finally {
      setLoading(false)
    }
  }


  const handleView = (partner) => {
    setSelectedPartner(partner)
    setModalVisible(true)
  }

  const handleManageDistricts = async (partner) => {
    message.warning('District management is only available for the current logged-in partner. This feature is limited by the API.')
    // Note: The API endpoint /partners/districts only works for the current partner
    // Admin cannot manage districts for other partners directly
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
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleManageDistricts(record)}
            disabled
            title="District management is only available for the current partner"
          >
            Districts
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h1 style={{ marginBottom: 16 }}>Partners</h1>

      <Table
        dataSource={partners}
        columns={columns}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Partner Details"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedPartner(null)
        }}
        footer={null}
        width={700}
      >
        {selectedPartner && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{selectedPartner.id}</Descriptions.Item>
            <Descriptions.Item label="Name">{selectedPartner.user?.fullName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedPartner.user?.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedPartner.user?.email}</Descriptions.Item>
            <Descriptions.Item label="Average Rating">{selectedPartner.averageRating?.toFixed(2) || '-'}</Descriptions.Item>
            <Descriptions.Item label="Total Jobs Completed">{selectedPartner.totalJobsCompleted}</Descriptions.Item>
            <Descriptions.Item label="Available">
              <Tag color={selectedPartner.isAvailable ? 'green' : 'red'}>
                {selectedPartner.isAvailable ? 'Yes' : 'No'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Districts">
              {selectedPartner.districts?.map(d => d.name).join(', ') || '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

    </div>
  )
}

export default Partners

