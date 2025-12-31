# 🏗️ HR Management System - Architecture & Workflow Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  • Swagger UI (/api-docs)        → Interactive Testing     │
│  • Postman Collection             → API Testing             │
│  • Frontend React (Optional)       → Web Application         │
│  • Mobile Apps (Optional)          → Native Apps            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/REST Requests
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                              │
├─────────────────────────────────────────────────────────────┤
│  Express.js Server (server.js)                              │
│  • Swagger/OpenAPI Documentation Generator                  │
│  • CORS Middleware                                          │
│  • Request Logging (Morgan)                                 │
│  • Security Headers (Helmet)                                │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Route Handling
                 ↓
┌──────────────────────────────────────────────────────────────┐
│                   ROUTING LAYER (4 modules)                  │
├──────────────────────────────────────────────────────────────┤
│  /api/v1/auth         /api/v1/employees                     │
│  • register           • get all (paginated)                  │
│  • login              • get one                              │
│  • get me             • search                               │
│  • logout             • create (HR/Admin)                    │
│                       • update (HR/Admin)                    │
│  /api/v1/leave        • delete (Admin)                      │
│  • get all            /api/v1/jobs                          │
│  • get one            • get all (paginated)                  │
│  • get balance        • get one                              │
│  • request            • create (HR/Admin)                    │
│  • approve            • update (HR/Admin)                    │
│  • cancel             • delete (Admin)                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Route Processing
                 ↓
┌──────────────────────────────────────────────────────────────┐
│                  MIDDLEWARE LAYER                            │
├──────────────────────────────────────────────────────────────┤
│  auth.js:                                                     │
│  • verifyToken() → JWT validation from Authorization header  │
│  • authorize() → Role-based access control middleware        │
│                   (Admin, Manager, HR, Employee)            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Permission Verified
                 ↓
┌──────────────────────────────────────────────────────────────┐
│               CONTROLLER LAYER (4 modules)                   │
├──────────────────────────────────────────────────────────────┤
│  authController.js        employeeController.js             │
│  • register()             • getAllEmployees()               │
│  • login()                • getEmployee()                    │
│  • getCurrentUser()       • createEmployee()                │
│  • logout()               • updateEmployee()                │
│                           • deleteEmployee()                │
│  jobController.js         • searchEmployees()               │
│  • getAllJobs()                                              │
│  • getJob()               leaveController.js                │
│  • createJob()            • getAllLeaves()                  │
│  • updateJob()            • getLeave()                      │
│  • deleteJob()            • requestLeave()                  │
│                           • approveLeave()                  │
│                           • getLeaveBalance()               │
│                           • cancelLeave()                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Business Logic Processing
                 ↓
┌──────────────────────────────────────────────────────────────┐
│                    MODEL LAYER (4 models)                    │
├──────────────────────────────────────────────────────────────┤
│  User.js                  Employee.js                        │
│  • name                   • firstName, lastName              │
│  • email (unique)         • email (unique)                   │
│  • password (hashed)      • phone, jobTitle                  │
│  • role                   • department, salary               │
│  • employeeId (ref)       • hireDate, managerId (ref)       │
│  • Methods:               • address, emergencyContact       │
│    - comparePassword()    • skills, certifications          │
│    - pre-save hash()      • status, timestamps              │
│                                                              │
│  Job.js                   Leave.js                          │
│  • title, description     • employeeId (ref)                │
│  • department, location   • leaveType                       │
│  • requiredSkills         • startDate, endDate              │
│  • experienceRequired     • duration (auto-calc)            │
│  • salaryMin/Max          • reason, status                  │
│  • employmentType         • approvedBy, approvalDate        │
│  • status                 • comments, timestamps            │
│  • postedBy (ref)                                            │
│  • candidates (array)     Methods:                          │
│  • postDate, closingDate  • pre-save auto-calc duration     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Mongoose Validation & Operations
                 ↓
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
├──────────────────────────────────────────────────────────────┤
│  MongoDB Atlas Cloud Database                                │
│  Collections:                                                │
│  • users (Authentication & Roles)                            │
│  • employees (Employee Records)                              │
│  • jobs (Job Postings)                                       │
│  • leaves (Leave Requests)                                   │
│                                                              │
│  Features:                                                   │
│  • Indexes on frequently queried fields                      │
│  • Relationships via ObjectId references                     │
│  • Schema validation at model level                          │
│  • Auto-timestamps (createdAt, updatedAt)                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Request-Response Flow

### Example: Employee Create Request with Authentication

```
1. CLIENT REQUEST
   POST /api/v1/employees
   Header: Authorization: Bearer eyJhbGci...
   Body: {firstName: "John", lastName: "Doe", ...}
         │
         ↓
2. SERVER RECEIVES REQUEST
   → Express parses JSON body
   → Extracts token from Authorization header
         │
         ↓
3. ROUTING (employeeRoutes.js)
   → Router matches POST /api/v1/employees
   → Invokes: verifyToken middleware
         │
         ↓
4. MIDDLEWARE - VERIFY TOKEN (auth.js)
   verifyToken():
   → Extract: "Bearer eyJhbGci..."
   → Verify: jwt.verify(token, JWT_SECRET)
   → Set: req.user = {id: "...", role: "HR"}
   → Call: next()
         │
         ↓
5. MIDDLEWARE - AUTHORIZATION (auth.js)
   authorize(['Admin', 'HR']):
   → Check: req.user.role in ['Admin', 'HR']
   → Result: ✓ Role is 'HR' → Allowed
   → Call: next()
         │
         ↓
6. CONTROLLER (employeeController.js)
   createEmployee():
   → Validate request data
   → Check email not duplicate
   → Create new Employee document
         │
         ↓
7. MODEL (Employee.js)
   Employee.create():
   → Run Mongoose validation
   → Check required fields
   → Save to database
         │
         ↓
8. DATABASE (MongoDB)
   → Insert new document
   → Generate _id
   → Return saved document
         │
         ↓
9. CONTROLLER RESPONSE
   createEmployee():
   → res.status(201).json({
       status: 'success',
       data: {employee}
     })
         │
         ↓
10. SERVER RESPONSE
    HTTP 201 Created
    Body: {status: 'success', data: {...}}
         │
         ↓
11. CLIENT RECEIVES
    • Status: 201
    • Body: Employee data with _id
    • Display success message
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────┐
│              AUTHENTICATION FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. REGISTER                                            │
│     POST /api/v1/auth/register                          │
│     ├─ Body: {name, email, password, role}             │
│     ├─ Validate email not duplicate                    │
│     ├─ Hash password: bcryptjs (10 rounds)             │
│     └─ Create User doc → Return user + token           │
│                                                         │
│  2. LOGIN                                               │
│     POST /api/v1/auth/login                             │
│     ├─ Find user by email                              │
│     ├─ Compare password: user.comparePassword()        │
│     ├─ Generate JWT token: {id, role, exp: 7d}        │
│     └─ Return user + token                             │
│                                                         │
│  3. REQUEST WITH TOKEN                                  │
│     GET /api/v1/auth/me                                 │
│     ├─ Header: Authorization: Bearer {token}           │
│     ├─ verifyToken middleware:                         │
│     │  ├─ Extract token                                │
│     │  ├─ Verify signature                             │
│     │  ├─ Check expiry                                 │
│     │  ├─ Set req.user                                 │
│     │  └─ Call next()                                  │
│     └─ Return current user                             │
│                                                         │
│  4. LOGOUT                                              │
│     POST /api/v1/auth/logout                            │
│     └─ Clear token on client (client-side)             │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            AUTHORIZATION FLOW (Role-Based)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Role Hierarchy:                                        │
│  ADMIN > HR/MANAGER > EMPLOYEE                          │
│                                                         │
│  Example: POST /api/v1/employees (Create)              │
│  Route: router.post('/',                               │
│           verifyToken,                 ← Check token    │
│           authorize(['Admin', 'HR']),  ← Check role     │
│           employeeController.create)                    │
│                                                         │
│  authorize(['Admin', 'HR']) middleware:                 │
│  ├─ req.user = {id: "...", role: "HR"}                │
│  ├─ Check: "HR" in ['Admin', 'HR']                    │
│  ├─ Result: ✓ ALLOWED                                  │
│  ├─ Call: next() → Go to controller                    │
│                                                         │
│  If role is 'Employee':                                │
│  ├─ Check: "Employee" in ['Admin', 'HR']              │
│  ├─ Result: ✗ DENIED                                   │
│  └─ Return: 403 Forbidden → Access Denied              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Leave Management Workflow

```
┌────────────────────────────────────────────────────┐
│         LEAVE REQUEST LIFECYCLE                    │
├────────────────────────────────────────────────────┤
│                                                    │
│  1. EMPLOYEE REQUESTS LEAVE                       │
│     POST /api/v1/leave                             │
│     Body: {                                        │
│       employeeId: "507f...",                      │
│       leaveType: "Vacation",                       │
│       startDate: "2024-06-01",                    │
│       endDate: "2024-06-07",                      │
│       reason: "Summer vacation"                   │
│     }                                              │
│     ├─ Validate dates                             │
│     ├─ Auto-calculate duration: 6 days            │
│     ├─ Set status: "Pending"                      │
│     └─ Save to database                           │
│                                                    │
│  2. MANAGER VIEWS PENDING REQUESTS                │
│     GET /api/v1/leave?status=Pending              │
│     └─ Returns paginated list of pending leaves   │
│                                                    │
│  3. MANAGER APPROVES/REJECTS                      │
│     PUT /api/v1/leave/{id}/approve                │
│     Body: {                                        │
│       status: "Approved",  (or "Rejected")        │
│       approvedBy: "507f...",                      │
│       comments: "Approved"                        │
│     }                                              │
│     ├─ Update status                              │
│     ├─ Record approver                            │
│     ├─ Set approvalDate                           │
│     └─ Save comments                              │
│                                                    │
│  4. EMPLOYEE CHECKS BALANCE                       │
│     GET /api/v1/leave/balance/{employeeId}       │
│     Returns: {                                     │
│       totalAllowance: 20,  (annual)                │
│       used: 6,             (this request)          │
│       remaining: 14        (balance)               │
│     }                                              │
│                                                    │
│  5. EMPLOYEE CAN CANCEL                           │
│     DELETE /api/v1/leave/{id}                     │
│     ├─ Only if status is Pending                  │
│     ├─ Update status: "Cancelled"                 │
│     └─ Return confirmation                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌─────────────────┐         ┌──────────────────┐
│    User         │         │    Employee      │
├─────────────────┤         ├──────────────────┤
│ _id             │◄────┐   │ _id              │
│ name            │     │   │ firstName        │
│ email (unique)  │     │   │ lastName         │
│ password (hash) │     │   │ email (unique)   │
│ role            │     └───┤ employeeId (ref) │
│ employeeId (ref)├────────►│ managerId (ref)  │
│ isActive        │         │ jobTitle         │
│ createdAt       │         │ department       │
│ lastLogin       │         │ salary           │
└─────────────────┘         │ hireDate         │
         △                  │ status           │
         │                  │ address          │
         │                  │ skills []        │
         │                  │ createdAt        │
         │                  │ updatedAt        │
         │                  └──────────────────┘
         │                          △
         │                          │
         │                          │
      ┌──┴──────────────────────────┤
      │                             │
┌─────────────┐              ┌──────────────┐
│   Job       │              │   Leave      │
├─────────────┤              ├──────────────┤
│ _id         │              │ _id          │
│ title       │              │ employeeId ──┼──→ Employee
│ description │              │ leaveType    │
│ department  │              │ startDate    │
│ location    │              │ endDate      │
│ requirements│              │ duration     │
│ salaryMin   │              │ reason       │
│ salaryMax   │              │ status       │
│ postedBy ───┼──→ Employee  │ approvedBy ──┼──→ User
│ candidates[]│              │ approvalDate │
│ status      │              │ comments     │
│ postDate    │              │ createdAt    │
│ closingDate │              │ updatedAt    │
└─────────────┘              └──────────────┘
```

---

## API Response Pattern

All endpoints follow this consistent response format:

### Success Response (2xx)
```json
{
  "status": "success",
  "data": {
    "employee": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "jobTitle": "Developer",
      ...
    }
  }
}
```

### Error Response (4xx, 5xx)
```json
{
  "status": "error",
  "message": "Descriptive error message",
  "data": null
}
```

### List Response (Paginated)
```json
{
  "status": "success",
  "data": [
    {employee1},
    {employee2},
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

---

## Security Layers

```
┌─────────────────────────────────────────────────┐
│           SECURITY IMPLEMENTATION                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: HTTP Security (Helmet)               │
│  ├─ X-Frame-Options: DENY                      │
│  ├─ X-Content-Type-Options: nosniff            │
│  ├─ Strict-Transport-Security                  │
│  └─ Content-Security-Policy                    │
│                                                 │
│  Layer 2: CORS Protection                      │
│  ├─ Origin validation                          │
│  ├─ Methods restriction                        │
│  ├─ Headers validation                         │
│  └─ Credentials support                        │
│                                                 │
│  Layer 3: Authentication (JWT)                 │
│  ├─ Token in Authorization header              │
│  ├─ Token signature verification               │
│  ├─ Token expiry check (7 days)               │
│  └─ User identification from token             │
│                                                 │
│  Layer 4: Authorization (Role-Based)           │
│  ├─ Role extraction from JWT                   │
│  ├─ Permission verification                    │
│  ├─ Granular endpoint access control           │
│  └─ 403 Forbidden on unauthorized access       │
│                                                 │
│  Layer 5: Password Security                    │
│  ├─ bcryptjs hashing (10 rounds)              │
│  ├─ Never store plain text                     │
│  ├─ Secure comparison function                 │
│  └─ Never return password in responses         │
│                                                 │
│  Layer 6: Input Validation                     │
│  ├─ Mongoose schema validation                 │
│  ├─ Email format validation                    │
│  ├─ Required field checking                    │
│  ├─ Type checking                              │
│  └─ Email uniqueness constraint                │
│                                                 │
│  Layer 7: Request Logging (Morgan)             │
│  ├─ All requests logged                        │
│  ├─ Response status tracked                    │
│  ├─ Response time monitored                    │
│  └─ Audit trail created                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Testing Coverage

```
┌────────────────────────────────────────────┐
│        TEST CASES BY MODULE                │
├────────────────────────────────────────────┤
│                                            │
│  auth.test.js (8 tests)                   │
│  ├─ Register user                         │
│  ├─ Prevent duplicate emails              │
│  ├─ Validate required fields              │
│  ├─ Login with correct password           │
│  ├─ Reject wrong password                 │
│  ├─ Get current user                      │
│  ├─ Reject without token                  │
│  └─ Reject invalid token                  │
│                                            │
│  employee.test.js (11 tests)              │
│  ├─ Get all employees                     │
│  ├─ Pagination support                    │
│  ├─ Department filtering                  │
│  ├─ Get single employee                   │
│  ├─ Return 404 for not found              │
│  ├─ Search employees                      │
│  ├─ Create employee (with auth)           │
│  ├─ Deny without token                    │
│  ├─ Deny for non-HR roles                 │
│  ├─ Update employee                       │
│  ├─ Delete with admin role                │
│  └─ Deny delete for non-admin             │
│                                            │
│  leave.test.js (10 tests)                 │
│  ├─ Get all leave requests                │
│  ├─ Filter by status                      │
│  ├─ Get single leave                      │
│  ├─ Request leave                         │
│  ├─ Get leave balance                     │
│  ├─ Approve leave                         │
│  ├─ Reject leave                          │
│  ├─ Deny approval without permission      │
│  ├─ Cancel leave request                  │
│  └─ Auto-calculate duration               │
│                                            │
│  TOTAL: 29 Test Cases                     │
│  Coverage: All endpoints + error cases    │
│                                            │
└────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│     PRODUCTION DEPLOYMENT ARCHITECTURE        │
├──────────────────────────────────────────────┤
│                                              │
│  CLIENT TIER                                │
│  ┌─────────────────────────────────────┐   │
│  │ • Swagger UI (Documentation)        │   │
│  │ • React Frontend (Optional)         │   │
│  │ • Mobile Apps (Optional)            │   │
│  │ • Third-party Services              │   │
│  └─────────────────────────────────────┘   │
│            ↓                                 │
│  API TIER                                  │
│  ┌─────────────────────────────────────┐   │
│  │ Node.js/Express (Load Balanced)    │   │
│  │ • Security Middleware               │   │
│  │ • Rate Limiting                     │   │
│  │ • CORS & Helmet                     │   │
│  │ • Request Logging                   │   │
│  └─────────────────────────────────────┘   │
│            ↓                                 │
│  DATA TIER                                  │
│  ┌─────────────────────────────────────┐   │
│  │ MongoDB Atlas Cloud                │   │
│  │ • Automatic Backups                │   │
│  │ • Connection Pooling               │   │
│  │ • 99.95% SLA                       │   │
│  │ • Encryption at Rest               │   │
│  └─────────────────────────────────────┘   │
│                                              │
│  MONITORING & LOGGING                       │
│  ┌─────────────────────────────────────┐   │
│  │ • Application Logs                  │   │
│  │ • Health Checks                     │   │
│  │ • Performance Metrics               │   │
│  │ • Error Tracking                    │   │
│  └─────────────────────────────────────┘   │
│                                              │
└──────────────────────────────────────────────┘
```

---

## File Dependencies

```
server.js
├── Imports: routes (auth, employee, job, leave)
├── Imports: middleware (CORS, Helmet, Morgan)
├── Imports: Swagger (ui-express, jsdoc)
├── Imports: mongoose
└── Mounts: All route modules
     │
     ├─→ authRoutes.js
     │    └─→ authController.js
     │         └─→ User model
     │
     ├─→ employeeRoutes.js
     │    ├─→ auth middleware
     │    └─→ employeeController.js
     │         └─→ Employee model
     │
     ├─→ jobRoutes.js
     │    ├─→ auth middleware
     │    └─→ jobController.js
     │         ├─→ Job model
     │         └─→ Employee model (for postedBy)
     │
     └─→ leaveRoutes.js
          ├─→ auth middleware
          └─→ leaveController.js
               ├─→ Leave model
               └─→ Employee model

auth.js middleware
├─→ verifyToken() - JWT validation
└─→ authorize() - Role-based access
```

---

This comprehensive architecture documentation helps you understand how all components work together in the HR Management System. 🚀

