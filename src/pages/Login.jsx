import { useState } from 'react'
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import { authService } from '../api/services/authService'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const Login = () => {
  const [step, setStep] = useState(1) // 1: send OTP, 2: verify OTP
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async (values) => {
    setLoading(true)
    try {
      const response = await authService.sendOtp(values.phone)
      if (response.code === 200) {
        setPhone(values.phone)
        setStep(2)
        message.success('OTP đã được gửi. Vui lòng kiểm tra điện thoại. (OTP mặc định: 123456)')
      }
    } catch (error) {
      message.error('Gửi OTP thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (values) => {
    setLoading(true)
    try {
      const response = await authService.verifyOtp(phone, values.otp, 'CUSTOMER')
      if (response.code === 200 && response.result) {
        const { accessToken, userId } = response.result
        await login(accessToken, { id: userId })
        message.success('Đăng nhập thành công!')
        navigate('/dashboard')
      }
    } catch (error) {
      message.error('OTP không đúng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            FTask Admin
          </Title>
          
          {step === 1 ? (
            <Form onFinish={handleSendOtp} layout="vertical">
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} size="large">
                  Gửi OTP
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form onFinish={handleVerifyOtp} layout="vertical">
              <Form.Item
                name="otp"
                label="Mã OTP"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã OTP' },
                  { pattern: /^[0-9]{6}$/, message: 'OTP phải có 6 chữ số' },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder="Nhập mã OTP (123456)"
                  size="large"
                  maxLength={6}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} size="large">
                  Xác thực OTP
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="link" block onClick={() => setStep(1)}>
                  Quay lại
                </Button>
              </Form.Item>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  )
}

export default Login

