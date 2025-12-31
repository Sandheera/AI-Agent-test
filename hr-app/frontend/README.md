# HR Management Frontend

React-based frontend for the HR Management System

## Features

- 🔐 User Authentication (Login/Register)
- 📊 Dashboard with role-based access
- 👥 Employee Management (CRUD)
- 💼 Job Postings Management
- 📅 Leave Request & Approval Workflow
- 👤 User Profile Management
- 📱 Responsive Bootstrap UI

## Technology Stack

- React 18.2.0
- React Router v6
- Axios for API calls
- Bootstrap 5 with React Bootstrap
- React Toastify for notifications
- React Icons

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm build
```

## Environment Setup

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## Project Structure

```
src/
├── pages/          # Page components (Login, Dashboard, etc)
├── components/     # Reusable components (Navigation, Footer)
├── services/       # API service layer
└── App.js         # Main App component
```

## Pages

- **Login** - User authentication
- **Register** - New user registration
- **Dashboard** - Home page with quick access
- **Employees** - Employee CRUD operations
- **Jobs** - Job posting management
- **Leave** - Leave request and approval workflow
- **Profile** - User profile information

## API Integration

All API calls go through `services/apiService.js` which uses `services/api.js` for axios configuration.

### Services Available

- `authService` - Login, Register, Logout
- `employeeService` - Employee CRUD
- `jobService` - Job management
- `leaveService` - Leave requests

## Role-Based Features

- **Admin**: Full access to all features
- **HR**: Employee and Job management
- **Manager**: Employee and Leave approval
- **Employee**: Leave requests and profile

## Running the Frontend

```bash
npm start
```

Frontend will run on `http://localhost:3000` by default.

## Backend Integration

Make sure the backend server is running on `http://localhost:5000`

See [backend/README.md](../backend/README.md) for backend setup.
