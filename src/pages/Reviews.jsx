import { useEffect, useState } from 'react'
import { Table, Modal, Descriptions, Tag, Button, Popconfirm, message, Space, Rate } from 'antd'
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { bookingService } from '../api/services/bookingService'
import { reviewService } from '../api/services/reviewService'
import dayjs from 'dayjs'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    try {
      // Get all bookings and extract reviews
      const response = await bookingService.getBookings({ size: 1000 })
      if (response.code === 200 && response.result) {
        const bookings = response.result.content || []
        
        // For each booking, try to get partner reviews
        // Note: This is a simplified approach. In a real app, you'd have a dedicated reviews endpoint
        const allReviews = []
        
        // Since we don't have a direct "get all reviews" endpoint for admin,
        // we'll need to get reviews from partner endpoints
        // This is a limitation - we'll show a message about it
        setReviews(allReviews)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = (review) => {
    setSelectedReview(review)
    setModalVisible(true)
  }

  const handleDelete = async (reviewId) => {
    try {
      const response = await reviewService.deleteReview(reviewId)
      if (response.code === 200) {
        message.success('Xóa review thành công!')
        loadReviews()
      }
    } catch (error) {
      message.error('Xóa review thất bại!')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Partner',
      dataIndex: 'partnerName',
      key: 'partnerName',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => <Rate disabled value={rating} />,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
            View
          </Button>
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
      <div style={{ marginBottom: 16 }}>
        <h1>Reviews</h1>
        <p style={{ color: '#999' }}>
          Note: Reviews are managed through partner endpoints. To view all reviews, you may need to access individual partner review pages.
        </p>
      </div>

      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: 'No reviews found' }}
      />

      <Modal
        title="Review Details"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          setSelectedReview(null)
        }}
        footer={null}
        width={700}
      >
        {selectedReview && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{selectedReview.id}</Descriptions.Item>
            <Descriptions.Item label="Booking ID">{selectedReview.bookingId}</Descriptions.Item>
            <Descriptions.Item label="Customer">{selectedReview.customerName}</Descriptions.Item>
            <Descriptions.Item label="Partner">{selectedReview.partnerName}</Descriptions.Item>
            <Descriptions.Item label="Rating">
              <Rate disabled value={selectedReview.rating} />
            </Descriptions.Item>
            <Descriptions.Item label="Description">{selectedReview.description || '-'}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(selectedReview.createdAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default Reviews

