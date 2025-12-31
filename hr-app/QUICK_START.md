# 🚀 HR Management System - Quick Start Guide

Get the HR Management API running in 5 minutes!

## 📋 Prerequisites

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Git** (optional)

## ⚡ Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Create `.env` file in `backend` directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=hr_management
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRY=7d
PORT=5000
NODE_ENV=development
```

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected
Server running on port 5000
```

### Step 4: Access the API Documentation
Open your browser and go to:
```
http://localhost:5000/api-docs
```

## 🧪 Test the API (via Swagger UI)

### 1. Register a User
1. Click **Authorize** button (top right of Swagger UI)
2. Click **POST /api/v1/auth/register**
3. Click **Try it out**
4. Enter:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Employee"
}
```
5. Click **Execute**

### 2. Login
1. Click **POST /api/v1/auth/login**
2. Click **Try it out**
3. Enter:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
4. Click **Execute**
5. Copy the `token` from the response

### 3. Authorize Swagger UI
1. Click **Authorize** button
2. Paste token: `Bearer YOUR_TOKEN_HERE`
3. Click **Authorize**
4. Click **Close**

Now all protected endpoints will work!

### 4. Create an Employee
1. Click **POST /api/v1/employees**
2. Click **Try it out**
3. Enter:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "1234567890",
  "jobTitle": "Developer",
  "department": "Engineering",
  "salary": 75000,
  "hireDate": "2023-01-15"
}
```
4. Click **Execute**

### 5. Request Leave
1. Copy the employee ID from previous response
2. Click **POST /api/v1/leave**
3. Click **Try it out**
4. Enter:
```json
{
  "employeeId": "PASTE_EMPLOYEE_ID_HERE",
  "leaveType": "Vacation",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "reason": "Summer vacation"
}
```
5. Click **Execute**

## 📱 Test with Postman (Alternative)

### Import Collection
1. Open Postman
2. Click **Import**
3. Select `HR_Management_API.postman_collection.json`
4. Set variables in collection:
   - `base_url`: `http://localhost:5000`
   - `token`: (copy from login response)
   - `employee_id`: (copy from employee creation)

### Run Requests
1. Go to **Authentication → Login**
2. Copy token and paste in collection variables
3. Try any endpoint!

## 🧪 Run Tests

```bash
# All tests
npm test

# Specific test file
npm test auth.test.js

# With coverage
npm test -- --coverage
```

## 📊 Available Endpoints

### Authentication
```
POST   /api/v1/auth/register       - Register new user
POST   /api/v1/auth/login          - Login user
GET    /api/v1/auth/me             - Get current user (requires token)
POST   /api/v1/auth/logout         - Logout (requires token)
```

### Employees
```
GET    /api/v1/employees           - Get all employees
GET    /api/v1/employees/:id       - Get single employee
GET    /api/v1/employees/search/:query - Search employees
POST   /api/v1/employees           - Create employee (Admin/HR only)
PUT    /api/v1/employees/:id       - Update employee (Admin/HR only)
DELETE /api/v1/employees/:id       - Delete employee (Admin only)
```

### Leave
```
GET    /api/v1/leave               - Get all leave requests
GET    /api/v1/leave/:id           - Get single leave request
GET    /api/v1/leave/balance/:employeeId - Get leave balance
POST   /api/v1/leave               - Request leave
PUT    /api/v1/leave/:id/approve   - Approve/reject leave (Manager/HR/Admin)
DELETE /api/v1/leave/:id           - Cancel leave
```

### Jobs
```
GET    /api/v1/jobs                - Get all jobs
GET    /api/v1/jobs/:id            - Get single job
POST   /api/v1/jobs                - Create job (Admin/HR only)
PUT    /api/v1/jobs/:id            - Update job (Admin/HR only)
DELETE /api/v1/jobs/:id            - Delete job (Admin only)
```

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all endpoints |
| **HR** | Create/update/delete employees and jobs |
| **Manager** | Approve/reject leave requests |
| **Employee** | View own data, request leave |

## 💡 Common Issues

### ❌ MongoDB Connection Failed
```
Check if MONGODB_URI is correct in .env
Visit MongoDB Atlas and verify connection string
```

### ❌ 401 Unauthorized
```
Token may be expired or missing
Re-login to get a new token
Include "Bearer " before token in Authorization header
```

### ❌ 403 Forbidden
```
Your role doesn't have permission for this action
Use Admin or HR account for create/update/delete
```

## 📞 Useful Links

- **Swagger Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/v1/health
- **Root Endpoint**: http://localhost:5000/

## 🎯 Next Steps

1. ✅ API is running locally
2. ✅ Tested with Swagger UI
3. **Next**: Build frontend React app (optional)
4. **Next**: Deploy to cloud (Heroku, AWS, etc.)

## 📚 Full Documentation

For complete documentation, visit [README.md](./README.md)

---

**Enjoy! 🎉**
