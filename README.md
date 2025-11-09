# FTask Admin Panel

Admin panel for managing FTask platform - a home service booking platform similar to BeTaskee.

## Features

- **Dashboard**: Overview statistics and recent bookings
- **Service Catalogs**: Manage service catalogs (CRUD operations)
- **Service Variants**: Manage service variants with pagination and filters
- **Bookings**: View and manage bookings with status filters
- **Partners**: View partners and manage their districts
- **Reviews**: View and manage reviews
- **Transactions**: View transaction history and wallet information
- **Districts**: View all available districts
- **Notifications**: Manage notifications

## Tech Stack

- React 18
- Vite
- Ant Design (antd)
- Axios
- React Router DOM
- Day.js

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=https://ftask.anhtudev.works
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Authentication

The admin panel uses OTP-based authentication:
1. Enter phone number to receive OTP
2. Verify OTP (default OTP: 123456 for testing)
3. Access token is stored in localStorage

## API Configuration

The API base URL is configured in `.env` file. The default is:
- Production: `https://ftask.anhtudev.works`
- Local: `http://localhost:8080`

## Project Structure

```
src/
  ├── api/           # API services and axios configuration
  ├── components/    # Reusable components
  ├── contexts/      # React contexts (AuthContext)
  ├── layouts/       # Layout components (Sidebar, Header, MainLayout)
  ├── pages/         # Page components
  ├── utils/         # Utility functions
  ├── App.jsx        # Main app component with routing
  └── main.jsx       # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes

- All API calls are authenticated using JWT tokens
- Tokens are automatically added to request headers via axios interceptors
- 401 errors automatically clear tokens and redirect to login page
- Error messages are displayed using Ant Design's message component
- District management for partners is limited (API only supports current partner's districts)
- Partners are extracted from booking data (no dedicated partners list endpoint)
- Reviews management may require accessing individual partner review endpoints

