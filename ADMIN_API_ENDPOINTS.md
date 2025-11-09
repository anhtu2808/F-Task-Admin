# FTask Admin API Endpoints Documentation

Danh sách các API endpoints còn thiếu để hoàn thiện trang admin. Tất cả các endpoints này nên có prefix `/admin` và yêu cầu authentication với role ADMIN.

## Response Format

Tất cả admin API trả về format thống nhất:

```json
{
  "code": 200,
  "message": "Success",
  "result": {
    // Data hoặc pagination object
    "content": [],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

## Pagination Format

Pagination parameters:
- `page`: Số trang (bắt đầu từ 1)
- `size`: Số lượng items per page
- `sort`: Sort field và direction (ví dụ: `createdAt,desc`)

---

## 1. Dashboard & Statistics

### 1.1. Get Dashboard Statistics
**GET** `/admin/dashboard/stats`

Tổng hợp thống kê tổng quan.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "totalBookings": 1000,
    "totalRevenue": 50000000,
    "totalPartners": 150,
    "totalCustomers": 500,
    "totalServices": 25,
    "pendingBookings": 50,
    "completedBookings": 800,
    "cancelledBookings": 150
  }
}
```

### 1.2. Get Revenue Statistics
**GET** `/admin/dashboard/revenue?fromDate=2025-01-01&toDate=2025-12-31`

Thống kê revenue theo thời gian.

**Query Parameters:**
- `fromDate` (optional): Date từ (format: YYYY-MM-DD)
- `toDate` (optional): Date đến (format: YYYY-MM-DD)

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "totalRevenue": 50000000,
    "revenueByMonth": [
      {
        "month": "2025-01",
        "revenue": 5000000
      }
    ]
  }
}
```

### 1.3. Get Bookings Trend
**GET** `/admin/dashboard/bookings-trend?period=month`

Xu hướng bookings theo thời gian.

**Query Parameters:**
- `period` (optional): Period type (day, week, month) - default: month

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "trend": [
      {
        "period": "2025-01",
        "count": 100
      }
    ]
  }
}
```

---

## 2. Service Catalogs (Admin)

### 2.1. Get All Service Catalogs
**GET** `/admin/service-catalogs?page=1&size=10&sort=createdAt,desc`

List tất cả service catalogs với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `sort` (optional): Sort field and direction
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "content": [...],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

### 2.2. Get Service Catalog by ID
**GET** `/admin/service-catalogs/{id}`

Chi tiết service catalog.

### 2.3. Create Service Catalog
**POST** `/admin/service-catalogs`

Tạo service catalog mới.

**Request Body:**
```json
{
  "name": "Service Catalog Name",
  "description": "Description",
  "imageUrl": "https://example.com/image.jpg",
  "platformFeePercent": 10.0,
  "isActive": true
}
```

### 2.4. Update Service Catalog
**PUT** `/admin/service-catalogs/{id}`

Update service catalog.

### 2.5. Delete Service Catalog
**DELETE** `/admin/service-catalogs/{id}`

Xóa service catalog.

### 2.6. Get Service Catalog Variants
**GET** `/admin/service-catalogs/{id}/variants?page=1&size=10`

List variants của một service catalog.

---

## 3. Service Variants (Admin)

### 3.1. Get All Service Variants
**GET** `/admin/service-variants?page=1&size=10&serviceCatalogId=1&name=variant`

List tất cả service variants với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `serviceCatalogId` (optional): Filter by catalog ID
- `name` (optional): Filter by name
- `minPrice` (optional): Filter by min price
- `maxPrice` (optional): Filter by max price
- `isMultiPartner` (optional): Filter by multi partner
- `sort` (optional): Sort field and direction

### 3.2. Get Service Variant by ID
**GET** `/admin/service-variants/{id}`

Chi tiết service variant.

### 3.3. Create Service Variant
**POST** `/admin/service-variants`

Tạo service variant mới.

**Request Body:**
```json
{
  "name": "Variant Name",
  "description": "Description",
  "durationHours": 2,
  "pricePerVariant": 500000,
  "isMultiPartner": true,
  "numberOfPartners": 2,
  "serviceCatalogId": 1
}
```

### 3.4. Update Service Variant
**PUT** `/admin/service-variants/{id}`

Update service variant.

### 3.5. Delete Service Variant
**DELETE** `/admin/service-variants/{id}`

Xóa service variant.

---

## 4. Bookings (Admin)

### 4.1. Get All Bookings
**GET** `/admin/bookings?page=1&size=10&status=PENDING&fromDate=2025-01-01&toDate=2025-12-31`

List tất cả bookings với pagination và filters mạnh hơn.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `status` (optional): Filter by status
- `fromDate` (optional): Filter by from date
- `toDate` (optional): Filter by to date
- `customerId` (optional): Filter by customer ID
- `partnerId` (optional): Filter by partner ID
- `minPrice` (optional): Filter by min price
- `maxPrice` (optional): Filter by max price
- `address` (optional): Filter by address
- `sort` (optional): Sort field and direction

### 4.2. Get Booking by ID
**GET** `/admin/bookings/{id}`

Chi tiết booking.

### 4.3. Update Booking Status
**PUT** `/admin/bookings/{id}/status`

Admin có thể thay đổi status booking.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "reason": "Admin override"
}
```

### 4.4. Cancel Booking (Admin)
**PUT** `/admin/bookings/{id}/cancel`

Admin cancel booking.

**Request Body:**
```json
{
  "reason": "Admin cancellation reason"
}
```

### 4.5. Refund Booking
**POST** `/admin/bookings/{id}/refund`

Admin refund booking.

**Request Body:**
```json
{
  "amount": 500000,
  "reason": "Refund reason"
}
```

---

## 5. Partners (Admin)

### 5.1. Get All Partners
**GET** `/admin/partners?page=1&size=10&isAvailable=true&sort=createdAt,desc`

List tất cả partners với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `isAvailable` (optional): Filter by availability
- `districtId` (optional): Filter by district ID
- `minRating` (optional): Filter by min rating
- `sort` (optional): Sort field and direction

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "content": [
      {
        "id": 1,
        "user": {...},
        "averageRating": 4.5,
        "totalJobsCompleted": 100,
        "isAvailable": true,
        "districts": [...]
      }
    ],
    "totalElements": 150,
    "totalPages": 15,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

### 5.2. Get Partner by ID
**GET** `/admin/partners/{id}`

Chi tiết partner.

### 5.3. Update Partner Status
**PUT** `/admin/partners/{id}/status`

Activate/deactivate partner.

**Request Body:**
```json
{
  "isAvailable": false,
  "reason": "Reason for deactivation"
}
```

### 5.4. Update Partner Districts
**PUT** `/admin/partners/{id}/districts`

Admin quản lý districts của partner.

**Request Body:**
```json
{
  "districtIds": [1, 2, 3]
}
```

### 5.5. Get Partner Bookings
**GET** `/admin/partners/{id}/bookings?page=1&size=10`

List bookings của partner.

### 5.6. Get Partner Reviews
**GET** `/admin/partners/{id}/reviews?page=1&size=10`

List reviews của partner.

### 5.7. Get Partner Transactions
**GET** `/admin/partners/{id}/transactions?page=1&size=10`

List transactions của partner.

---

## 6. Customers (Admin)

### 6.1. Get All Customers
**GET** `/admin/customers?page=1&size=10&sort=createdAt,desc`

List tất cả customers với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `status` (optional): Filter by status
- `sort` (optional): Sort field and direction

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "content": [
      {
        "id": 1,
        "user": {...},
        "addresses": [...],
        "totalBookings": 50,
        "totalSpent": 5000000
      }
    ],
    "totalElements": 500,
    "totalPages": 50,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

### 6.2. Get Customer by ID
**GET** `/admin/customers/{id}`

Chi tiết customer.

### 6.3. Update Customer Status
**PUT** `/admin/customers/{id}/status`

Activate/deactivate customer.

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Reason for deactivation"
}
```

### 6.4. Get Customer Bookings
**GET** `/admin/customers/{id}/bookings?page=1&size=10`

List bookings của customer.

### 6.5. Get Customer Transactions
**GET** `/admin/customers/{id}/transactions?page=1&size=10`

List transactions của customer.

---

## 7. Reviews (Admin)

### 7.1. Get All Reviews
**GET** `/admin/reviews?page=1&size=10&rating=5&partnerId=1&customerId=1`

List tất cả reviews với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `rating` (optional): Filter by rating (1-5)
- `partnerId` (optional): Filter by partner ID
- `customerId` (optional): Filter by customer ID
- `bookingId` (optional): Filter by booking ID
- `sort` (optional): Sort field and direction

### 7.2. Get Review by ID
**GET** `/admin/reviews/{id}`

Chi tiết review.

### 7.3. Delete Review (Admin)
**DELETE** `/admin/reviews/{id}`

Admin xóa review.

### 7.4. Update Review Status
**PUT** `/admin/reviews/{id}/status`

Hide/show review.

**Request Body:**
```json
{
  "isVisible": false,
  "reason": "Reason for hiding"
}
```

---

## 8. Transactions (Admin)

### 8.1. Get All Transactions
**GET** `/admin/transactions?page=1&size=10&type=EARNING&status=COMPLETED&fromDate=2025-01-01&toDate=2025-12-31&userId=1`

List tất cả transactions với pagination và filters mạnh.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `type` (optional): Filter by type (EARNING, WITHDRAWAL, ADJUSTMENT, REFUND, PLATFORM_FEE, TOP_UP, FINE)
- `status` (optional): Filter by status (PENDING, COMPLETED, FAILED)
- `userId` (optional): Filter by user ID
- `fromDate` (optional): Filter by from date
- `toDate` (optional): Filter by to date
- `minAmount` (optional): Filter by min amount
- `maxAmount` (optional): Filter by max amount
- `sort` (optional): Sort field and direction

### 8.2. Get Transaction by ID
**GET** `/admin/transactions/{id}`

Chi tiết transaction.

### 8.3. Create Adjustment Transaction
**POST** `/admin/transactions/adjustment`

Admin tạo adjustment transaction.

**Request Body:**
```json
{
  "userId": 1,
  "amount": 100000,
  "type": "ADJUSTMENT",
  "description": "Admin adjustment reason"
}
```

### 8.4. Get Transactions Summary
**GET** `/admin/transactions/summary?fromDate=2025-01-01&toDate=2025-12-31`

Tổng hợp transactions.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "totalEarnings": 10000000,
    "totalWithdrawals": 5000000,
    "totalPlatformFees": 1000000,
    "totalRefunds": 500000,
    "totalAdjustments": 200000,
    "byType": {
      "EARNING": 10000000,
      "WITHDRAWAL": 5000000,
      "PLATFORM_FEE": 1000000
    }
  }
}
```

---

## 9. Districts (Admin)

### 9.1. Get All Districts
**GET** `/admin/districts?page=1&size=10&city=Hanoi`

List districts (có thể thêm pagination nếu nhiều).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `city` (optional): Filter by city
- `sort` (optional): Sort field and direction

### 9.2. Get District by ID
**GET** `/admin/districts/{id}`

Chi tiết district.

### 9.3. Create District
**POST** `/admin/districts`

Tạo district mới.

**Request Body:**
```json
{
  "name": "District Name",
  "city": "City Name",
  "code": "DISTRICT_CODE"
}
```

### 9.4. Update District
**PUT** `/admin/districts/{id}`

Update district.

### 9.5. Delete District
**DELETE** `/admin/districts/{id}`

Xóa district.

---

## 10. Notifications (Admin)

### 10.1. Get All Notifications
**GET** `/admin/notifications?page=1&size=10&userId=1&type=JOB_ACCEPTED&isRead=false`

List tất cả notifications với pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `userId` (optional): Filter by user ID
- `type` (optional): Filter by type
- `isRead` (optional): Filter by read status
- `sort` (optional): Sort field and direction

### 10.2. Get Notification by ID
**GET** `/admin/notifications/{id}`

Chi tiết notification.

### 10.3. Send Notification (Admin)
**POST** `/admin/notifications`

Admin gửi notification.

**Request Body:**
```json
{
  "userId": 1,
  "type": "ADMIN_NOTIFICATION",
  "title": "Notification Title",
  "message": "Notification Message",
  "bookingId": 1
}
```

### 10.4. Delete Notification
**DELETE** `/admin/notifications/{id}`

Xóa notification.

---

## 11. Users (Admin)

### 11.1. Get All Users
**GET** `/admin/users?page=1&size=10&role=CUSTOMER&isActive=true&sort=createdAt,desc`

List tất cả users với pagination và filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `size` (optional): Page size (default: 10)
- `role` (optional): Filter by role (CUSTOMER, PARTNER, ADMIN)
- `isActive` (optional): Filter by active status
- `phone` (optional): Filter by phone
- `email` (optional): Filter by email
- `sort` (optional): Sort field and direction

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "content": [
      {
        "id": 1,
        "username": "user1",
        "phone": "0123456789",
        "email": "user@example.com",
        "fullName": "User Name",
        "role": "CUSTOMER",
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "totalElements": 1000,
    "totalPages": 100,
    "currentPage": 1,
    "pageSize": 10
  }
}
```

### 11.2. Get User by ID
**GET** `/admin/users/{id}`

Chi tiết user.

### 11.3. Update User
**PUT** `/admin/users/{id}`

Update user info.

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "gender": "MALE"
}
```

### 11.4. Update User Status
**PUT** `/admin/users/{id}/status`

Activate/deactivate user.

**Request Body:**
```json
{
  "isActive": false,
  "reason": "Reason for deactivation"
}
```

### 11.5. Update User Role
**PUT** `/admin/users/{id}/role`

Thay đổi role user.

**Request Body:**
```json
{
  "role": "ADMIN",
  "reason": "Reason for role change"
}
```

---

## 12. System Settings (Admin)

### 12.1. Get System Settings
**GET** `/admin/settings`

Lấy system settings.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "result": {
    "platformFeePercent": 10.0,
    "minWithdrawalAmount": 100000,
    "maxWithdrawalAmount": 10000000,
    "bookingCancelPenaltyPercent": 30,
    "bookingCancelPenaltyHours": 4,
    "insufficientPartnersWarningHours": 6
  }
}
```

### 12.2. Update System Settings
**PUT** `/admin/settings`

Update system settings.

**Request Body:**
```json
{
  "platformFeePercent": 10.0,
  "minWithdrawalAmount": 100000,
  "maxWithdrawalAmount": 10000000,
  "bookingCancelPenaltyPercent": 30,
  "bookingCancelPenaltyHours": 4,
  "insufficientPartnersWarningHours": 6
}
```

### 12.3. Get Platform Fee Settings
**GET** `/admin/settings/platform-fee`

Lấy platform fee settings.

### 12.4. Update Platform Fee
**PUT** `/admin/settings/platform-fee`

Update platform fee.

**Request Body:**
```json
{
  "platformFeePercent": 10.0,
  "effectiveDate": "2025-01-01"
}
```

---

## Authentication & Authorization

Tất cả các admin API endpoints yêu cầu:
1. **Authentication**: JWT token trong header `Authorization: Bearer {token}`
2. **Authorization**: User phải có role `ADMIN`

**Error Response (401 Unauthorized):**
```json
{
  "code": 401,
  "message": "Unauthorized",
  "result": null
}
```

**Error Response (403 Forbidden):**
```json
{
  "code": 403,
  "message": "Forbidden - Admin access required",
  "result": null
}
```

---

## Error Handling

Tất cả APIs trả về error format:

```json
{
  "code": 400,
  "message": "Error message",
  "result": null
}
```

**Common Error Codes:**
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Notes

1. Tất cả các admin APIs sử dụng pagination bắt đầu từ **page = 1** (không phải 0)
2. Date format: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) hoặc YYYY-MM-DD
3. Tất cả các endpoints cần có proper validation
4. Cần có rate limiting để tránh abuse
5. Cần có audit log cho các admin actions
6. Các sensitive operations (delete, status change, role change) cần có confirmation mechanism

