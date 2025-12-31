# REST API Documentation for HR System

## Base URL
```
https://api.hr-system.internal/v1
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {jwt_token}
```

---

## Recruitment & Hiring APIs

### POST /recruitment/jobs
Create a new job posting

**Request:**
```json
{
  "title": "Senior Backend Engineer",
  "description": "Looking for experienced backend engineer...",
  "required_skills": ["Python", "AWS", "Docker"],
  "years_experience_required": 5,
  "salary_min": 120000,
  "salary_max": 160000,
  "department": "Engineering"
}
```

**Response:**
```json
{
  "job_id": "JOB-2025-001",
  "created_at": "2025-01-15T10:30:00Z",
  "status": "active"
}
```

### POST /recruitment/resumes/upload
Upload and process a resume

**Request:**
```
Content-Type: multipart/form-data
- file: [resume.pdf]
- job_id: JOB-2025-001 (optional)
```

**Response:**
```json
{
  "resume_id": "RES-2025-001",
  "candidate": {
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["Python", "JavaScript", "AWS"],
    "years_experience": 6
  },
  "processing_status": "completed"
}
```

### POST /recruitment/candidates/score
Score a candidate against job requirements

**Request:**
```json
{
  "resume_id": "RES-2025-001",
  "job_id": "JOB-2025-001"
}
```

**Response:**
```json
{
  "candidate_id": "CAN-2025-001",
  "score": 82.5,
  "breakdown": {
    "skills_match": 85,
    "experience_match": 80,
    "education_match": 75
  },
  "recommendation": "Interview Recommended"
}
```

### GET /recruitment/candidates/ranked
Get ranked list of candidates for a job

**Query Parameters:**
- `job_id`: Job posting ID
- `limit`: Number of results (default: 10)
- `tier`: Filter by tier (TIER_1, TIER_2, etc.)

**Response:**
```json
{
  "job_id": "JOB-2025-001",
  "total_candidates": 45,
  "ranked_list": [
    {
      "candidate_id": "CAN-2025-001",
      "name": "Alice Johnson",
      "score": 92,
      "tier": "TIER_1",
      "interview_scheduled": false
    }
  ]
}
```

### POST /recruitment/interviews/schedule
Schedule an interview with candidate

**Request:**
```json
{
  "candidate_id": "CAN-2025-001",
  "job_id": "JOB-2025-001",
  "interview_date": "2025-01-20T14:00:00Z",
  "interviewer_id": "EMP-1001",
  "interview_type": "technical"
}
```

**Response:**
```json
{
  "interview_id": "INT-2025-001",
  "status": "scheduled",
  "confirmation_sent": true
}
```

---

## Employee Data APIs

### POST /employees/create
Create new employee record

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@company.com",
  "phone": "+1-555-0123",
  "ssn": "123-45-6789",
  "job_title": "Senior Engineer",
  "department": "Engineering",
  "manager_id": "EMP-1001",
  "start_date": "2025-02-01",
  "salary": 150000,
  "employment_type": "Full-Time"
}
```

**Response:**
```json
{
  "employee_id": "EMP-2025-001",
  "created_at": "2025-01-15T10:30:00Z",
  "status": "onboarding_pending"
}
```

### GET /employees/{employee_id}
Retrieve employee information

**Response:**
```json
{
  "employee_id": "EMP-2025-001",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "job_title": "Senior Engineer",
  "department": "Engineering",
  "manager_id": "EMP-1001",
  "employment_status": "active",
  "hire_date": "2025-02-01"
}
```

### PUT /employees/{employee_id}
Update employee information

**Request:**
```json
{
  "job_title": "Staff Engineer",
  "salary": 165000,
  "department": "Platform Engineering"
}
```

### DELETE /employees/{employee_id}
Archive employee record (soft delete)

**Response:**
```json
{
  "employee_id": "EMP-2025-001",
  "status": "archived",
  "termination_date": "2025-12-31"
}
```

---

## Leave Management APIs

### GET /leave/balance/{employee_id}
Get employee leave balances

**Response:**
```json
{
  "employee_id": "EMP-2025-001",
  "balances": {
    "vacation": {
      "allocated": 20,
      "used": 5,
      "remaining": 15,
      "carryover": 0
    },
    "sick": {
      "allocated": 10,
      "used": 2,
      "remaining": 8,
      "carryover": 0
    },
    "personal": {
      "allocated": 3,
      "used": 0,
      "remaining": 3
    }
  }
}
```

### POST /leave/request
Submit a leave request

**Request:**
```json
{
  "employee_id": "EMP-2025-001",
  "leave_type": "vacation",
  "start_date": "2025-03-10",
  "end_date": "2025-03-14",
  "reason": "Family vacation",
  "requires_approval": true
}
```

**Response:**
```json
{
  "request_id": "LR-2025-001",
  "status": "pending_approval",
  "submitted_at": "2025-01-15T10:30:00Z"
}
```

### PUT /leave/request/{request_id}/approve
Approve a leave request

**Request:**
```json
{
  "approved_by": "EMP-1001",
  "comments": "Approved - coverage arranged"
}
```

---

## Payroll APIs

### POST /payroll/calculate
Calculate payroll for a period

**Request:**
```json
{
  "payroll_period": "2025-01",
  "employees": ["EMP-2025-001", "EMP-2025-002"],
  "include_bonus": true
}
```

**Response:**
```json
{
  "payroll_id": "PR-2025-01-001",
  "period": "2025-01",
  "total_gross": 450000,
  "total_deductions": 95000,
  "total_net": 355000,
  "pay_date": "2025-02-01",
  "processed": false
}
```

### POST /payroll/process
Process and disburse payroll

**Request:**
```json
{
  "payroll_id": "PR-2025-01-001"
}
```

**Response:**
```json
{
  "payroll_id": "PR-2025-01-001",
  "status": "processed",
  "processed_at": "2025-01-31T16:00:00Z",
  "disbursement_initiated": true
}
```

### GET /payroll/stub/{employee_id}/{period}
Get employee pay stub

**Response:**
```json
{
  "employee_id": "EMP-2025-001",
  "period": "2025-01",
  "gross_pay": 12500,
  "deductions": {
    "federal_tax": 2100,
    "social_security": 775,
    "medicare": 181,
    "health_insurance": 450
  },
  "net_pay": 8994,
  "pay_date": "2025-02-01"
}
```

---

## Compliance APIs

### POST /compliance/audit
Run compliance audit

**Request:**
```json
{
  "audit_type": "data_privacy",
  "scope": ["employee_data", "resume_data"],
  "jurisdiction": ["US", "EU"]
}
```

**Response:**
```json
{
  "audit_id": "AUD-2025-001",
  "status": "in_progress",
  "estimated_completion": "2025-01-20T17:00:00Z"
}
```

### GET /compliance/audit/{audit_id}/results
Get audit results

**Response:**
```json
{
  "audit_id": "AUD-2025-001",
  "status": "completed",
  "compliance_score": 94,
  "findings": [
    {
      "severity": "low",
      "category": "documentation",
      "description": "Missing retention policy documentation"
    }
  ],
  "recommendations": []
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_request",
  "message": "Required field 'email' is missing",
  "details": {"field": "email"}
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Employee not found",
  "resource_id": "EMP-999-001"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred",
  "request_id": "req-12345"
}
```

---

## Rate Limiting
- Standard: 1000 requests per hour
- Batch operations: 100 requests per hour
- Real-time operations: No limit

## Webhook Events
Supported webhook events:
- `employee.created`
- `employee.updated`
- `leave.approved`
- `payroll.processed`
- `compliance.warning`

Register webhooks via: `POST /webhooks/register`
