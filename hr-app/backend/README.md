# HR Management System - Backend API

A complete, production-ready HR Management System built with Node.js, Express, MongoDB, and Swagger/OpenAPI documentation.

## 🚀 Features

### Core HR Functionalities
- **Employee Management**: Create, read, update, delete employee records with full details
- **Job Postings**: Manage job openings, track candidates, and handle recruitment
- **Leave Management**: Request, approve, and track employee leave with automatic balance calculations
- **User Authentication**: JWT-based authentication with role-based access control
- **Role-Based Authorization**: Admin, Manager, HR, and Employee roles with different permissions

### Technical Features
- **MongoDB**: NoSQL database with Mongoose ODM for data modeling
- **Express.js**: Fast, minimal web framework for building REST APIs
- **Swagger/OpenAPI**: Comprehensive API documentation with interactive UI
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcrypt hashing with salt rounds
- **Request Logging**: Morgan middleware for HTTP request logging
- **Security**: Helmet for HTTP headers security, CORS for cross-origin requests
- **Testing**: Jest and Supertest for comprehensive API testing

## 📋 Project Structure

```
backend/
├── server.js                 # Express app setup and configuration
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
├── models/
│   ├── Employee.js          # Employee schema and validation
│   ├── Job.js               # Job posting schema
│   ├── Leave.js             # Leave request schema
│   └── User.js              # User authentication schema
├── controllers/
│   ├── employeeController.js # Employee CRUD operations
│   ├── jobController.js      # Job management logic
│   ├── leaveController.js    # Leave request handling
│   └── authController.js     # Authentication logic
├── routes/
│   ├── employeeRoutes.js    # Employee endpoints with Swagger docs
│   ├── jobRoutes.js         # Job endpoints with Swagger docs
│   ├── leaveRoutes.js       # Leave endpoints with Swagger docs
│   └── authRoutes.js        # Auth endpoints with Swagger docs
├── middleware/
│   └── auth.js              # JWT verification and authorization
└── tests/
    ├── auth.test.js         # Authentication tests
    ├── employee.test.js     # Employee API tests
    └── leave.test.js        # Leave management tests
```

## 🔧 Installation

### Prerequisites
- Node.js 14+ 
- MongoDB Atlas or local MongoDB instance
- npm or yarn

### Setup Steps

1. **Clone or navigate to project directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=hr_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development
```

5. **Start the server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Interactive Swagger UI
Once server is running, visit: **http://localhost:5000/api-docs**

You can test all endpoints directly from the Swagger UI by:
1. Clicking "Authorize" button
2. Entering your JWT token from login
3. Trying out any endpoint

### API Endpoints Overview

#### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | - |
| POST | `/login` | Login user | - |
| GET | `/me` | Get current user | ✅ |
| POST | `/logout` | Logout | ✅ |

#### Employees (`/api/v1/employees`)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get all employees | - | - |
| GET | `/:id` | Get single employee | - | - |
| GET | `/search/:query` | Search employees | - | - |
| POST | `/` | Create employee | ✅ | Admin, HR |
| PUT | `/:id` | Update employee | ✅ | Admin, HR |
| DELETE | `/:id` | Delete employee | ✅ | Admin |

#### Jobs (`/api/v1/jobs`)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get all jobs | - | - |
| GET | `/:id` | Get single job | - | - |
| POST | `/` | Create job | ✅ | Admin, HR |
| PUT | `/:id` | Update job | ✅ | Admin, HR |
| DELETE | `/:id` | Delete job | ✅ | Admin |

#### Leave (`/api/v1/leave`)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get all leaves | - | - |
| GET | `/:id` | Get single leave | - | - |
| GET | `/balance/:employeeId` | Get leave balance | - | - |
| POST | `/` | Request leave | ✅ | All |
| PUT | `/:id/approve` | Approve/reject leave | ✅ | Admin, HR, Manager |
| DELETE | `/:id` | Cancel leave | ✅ | All |

## 🔐 Authentication

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "Employee"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Employee"
    }
  }
}
```

### Using the Token
Include token in all protected endpoints:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
npm test -- auth.test.js
npm test -- employee.test.js
npm test -- leave.test.js
```

### Run with Coverage
```bash
npm test -- --coverage
```

Test files cover:
- ✅ Happy path scenarios
- ✅ Error handling
- ✅ Authorization checks
- ✅ Data validation
- ✅ Pagination and filtering

## 📊 Database Models

### Employee Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  jobTitle: String,
  department: String,
  salary: Number,
  hireDate: Date,
  managerId: ObjectId (self-reference),
  status: String (Active/Inactive),
  address: Object,
  emergencyContact: Object,
  skills: [String],
  certifications: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Admin/Manager/HR/Employee),
  employeeId: ObjectId (reference to Employee),
  isActive: Boolean,
  createdAt: Date
}
```

### Leave Model
```javascript
{
  employeeId: ObjectId (reference to Employee),
  leaveType: String (Vacation/Sick/Personal/Maternity/Paternity/Unpaid),
  startDate: Date,
  endDate: Date,
  duration: Number (auto-calculated in days),
  reason: String,
  status: String (Pending/Approved/Rejected/Cancelled),
  approvedBy: ObjectId (reference to User),
  approvalDate: Date,
  comments: String,
  createdAt: Date
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  department: String,
  location: String,
  requiredSkills: [String],
  experienceRequired: Number,
  salaryMin: Number,
  salaryMax: Number,
  employmentType: String,
  status: String (Open/Closed/Filled/On Hold),
  postedBy: ObjectId (reference to Employee),
  candidates: [ObjectId],
  postDate: Date,
  closingDate: Date,
  createdAt: Date
}
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Role-Based Access Control**: Granular permission management
- **CORS Protection**: Cross-origin request validation
- **Helmet Security**: HTTP header security
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Secure error messages without exposing internals

## 🚨 Error Handling

Standard error response format:
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "data": null
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

## 📦 Dependencies

**Core**
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `dotenv`: Environment variables

**Middleware & Security**
- `cors`: Cross-origin requests
- `helmet`: HTTP security headers
- `morgan`: Request logging
- `express-async-errors`: Async error handling

**API Documentation**
- `swagger-ui-express`: Swagger UI
- `swagger-jsdoc`: JSDoc to Swagger converter

**Testing**
- `jest`: Testing framework
- `supertest`: HTTP assertion library

**Development**
- `nodemon`: Auto-reload on changes

## 📝 Example Requests

### Create Employee
```bash
curl -X POST http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "phone": "1234567890",
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "salary": 75000,
    "hireDate": "2023-01-15"
  }'
```

### Request Leave
```bash
curl -X POST http://localhost:5000/api/v1/leave \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "507f1f77bcf86cd799439011",
    "leaveType": "Vacation",
    "startDate": "2024-06-01",
    "endDate": "2024-06-07",
    "reason": "Summer vacation"
  }'
```

### Get Leave Balance
```bash
curl -X GET "http://localhost:5000/api/v1/leave/balance/507f1f77bcf86cd799439011"
```

## 🔄 Workflow Examples

### Complete Recruitment Flow
1. Create job posting (`POST /api/v1/jobs`)
2. View all open jobs (`GET /api/v1/jobs`)
3. Review job details (`GET /api/v1/jobs/:id`)
4. Create employee after hiring (`POST /api/v1/employees`)
5. Update job status to "Filled" (`PUT /api/v1/jobs/:id`)

### Complete Leave Management Flow
1. Employee requests leave (`POST /api/v1/leave`)
2. Manager views pending leaves (`GET /api/v1/leave?status=Pending`)
3. Manager approves/rejects (`PUT /api/v1/leave/:id/approve`)
4. Employee checks leave balance (`GET /api/v1/leave/balance/:employeeId`)
5. Employee can cancel leave if needed (`DELETE /api/v1/leave/:id`)

## 🌐 CORS Configuration

Currently allows all origins. For production, configure:
```javascript
cors({
  origin: 'https://yourdomain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

## 📈 Performance Tips

1. Use pagination for large datasets: `?page=1&limit=20`
2. Filter data on backend, not frontend
3. Index frequently searched fields in MongoDB
4. Use projection to return only needed fields
5. Implement caching for read-heavy operations

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify MONGODB_URI in .env
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### JWT Token Errors
- Token may be expired (7 days default)
- Check JWT_SECRET matches in .env
- Token format: `Bearer YOUR_TOKEN`

### CORS Errors
- Check if frontend origin is whitelisted
- Verify Content-Type headers
- Test with Postman first

## 📞 Support

For issues or questions:
1. Check API documentation at `/api-docs`
2. Review test files for usage examples
3. Check error messages in server logs
4. Verify environment variables are set correctly

## 📄 License

This project is part of the BMAD Framework HR Management System.

---

**Happy coding! 🚀**
