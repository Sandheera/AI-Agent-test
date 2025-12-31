# BMAD Fullstack HR Agent - Implementation Guide

## Quick Start

### 1. Agent Activation
The HR Agent (Alex) is now available in the BMAD system. To activate:

```bash
# Option 1: From command line
bmad agent:activate hr-agent

# Option 2: In VS Code
- Open the agent definition: /bmm/agents/hr-agent.md
- The agent will automatically load on activation
```

### 2. Agent Menu
Once activated, the HR Agent presents these options:

```
[MH] Redisplay Menu Help
[CH] Chat with the Agent about HR Systems
[RS] Resume Screening & Candidate Ranking
[OB] Employee Onboarding Workflow
[LM] Leave Management System
[CC] Compliance & Data Privacy Verification
[PY] Payroll Integration & Processing
[ED] Employee Data Management
[KB] View/Manage HR Knowledge Base
[PM] Start Party Mode
[DA] Dismiss Agent
```

### 3. Knowledge Base Access
The comprehensive knowledge base is organized as follows:

```
_bmad-output/
  ├─ fullstack-hr-agent.txt (complete documentation)
  
_bmad/bmm/data/
  ├─ hr-logic/
  │  ├─ resume-screening.js
  │  ├─ candidate-ranking.py
  │  ├─ onboarding-workflow.js
  │  ├─ access-provisioning.py
  │  ├─ leave-management.js
  │  ├─ compliance-rules.py
  │  ├─ payroll-engine.js
  │  ├─ tax-calculator.py
  │  ├─ employee-data-store.js
  │  ├─ access-control.py
  │  └─ data-privacy-engine.py
  │
  ├─ hr-api-docs/
  │  └─ api-reference.md (complete API documentation)
  │
  ├─ hr-compliance/
  │  ├─ labor-law-rules.md (federal/state/jurisdiction rules)
  │  ├─ gdpr-requirements.md (EU data protection)
  │  └─ ccpa-requirements.md (California privacy)
  │
  ├─ postman-collections/
  │  ├─ recruitment-workflow.postman_collection.json
  │  ├─ payroll-processing.postman_collection.json
  │  ├─ employee-data-mgmt.postman_collection.json
  │  ├─ leave-management.postman_collection.json
  │  └─ compliance-verification.postman_collection.json
  │
  ├─ hr-integrations/
  │  ├─ payroll-system-integration.md
  │  ├─ benefits-provider-integration.md
  │  ├─ time-tracking-integration.md
  │  ├─ learning-management-integration.md
  │  └─ slack-notifications-integration.md
  │
  └─ hr-data-models/
     ├─ employee-schema.json
     ├─ job-schema.json
     ├─ candidate-schema.json
     ├─ leave-schema.json
     └─ payroll-schema.json
```

---

## Core HR Workflows

### Workflow 1: Resume Screening & Candidate Ranking

**Purpose:** Automate resume evaluation and identify top candidates for open positions

**Key Components:**
- Resume document parsing (PDF, DOCX, TXT)
- AI-powered skill matching against job requirements
- Multi-factor candidate ranking
- Tier-based candidate classification (TIER_1 to TIER_4)
- Interview recommendation generation

**API Endpoints:**
```
POST /recruitment/jobs - Create job posting
POST /recruitment/resumes/upload - Upload candidate resume
POST /recruitment/candidates/score - Score individual candidate
GET /recruitment/candidates/ranked - Get ranked candidate list
POST /recruitment/interviews/schedule - Schedule interviews
```

**Example Usage:**
```javascript
// Using the Agent
Select: [RS] Resume Screening & Candidate Ranking
Provide: Job description and candidate resumes
Output: Ranked candidate list with scoring breakdown
```

**Knowledge Base Files:**
- `resume-screening.js` - Resume parsing and scoring logic
- `candidate-ranking.py` - Multi-factor ranking algorithm
- `recruitment-workflow.postman_collection.json` - API testing

---

### Workflow 2: Employee Onboarding

**Purpose:** Automate new hire setup from offer acceptance through 90-day integration

**Key Components:**
- Pre-arrival data collection and system setup
- First-day activities and orientation
- Phased onboarding (days 2-30)
- 30/60/90-day check-in scheduling and tracking
- Training module assignment
- System access provisioning

**API Endpoints:**
```
POST /employees/create - Create employee record
POST /onboarding/setup - Start onboarding workflow
POST /access/provision - Provision system access
POST /benefits/enroll - Enroll in benefits
POST /training/assign - Assign training modules
POST /checkin/schedule - Schedule check-in meetings
```

**Example Usage:**
```javascript
// Using the Agent
Select: [OB] Employee Onboarding Workflow
Provide: New hire information and job details
Output: Automated onboarding timeline and checklist
```

**Knowledge Base Files:**
- `onboarding-workflow.js` - Onboarding orchestration
- `access-provisioning.py` - System access setup logic

---

### Workflow 3: Leave Management

**Purpose:** Manage employee leave requests, approvals, and balance tracking

**Key Components:**
- Annual leave allocation and accrual calculation
- Leave balance tracking
- Request submission and approval workflow
- Conflict detection and backup coverage verification
- Carryover policy enforcement
- Payroll integration

**API Endpoints:**
```
GET /leave/balance/{employee_id} - Get leave balances
POST /leave/request - Submit leave request
PUT /leave/request/{request_id}/approve - Approve/reject request
GET /leave/calendar - Get leave calendar view
PUT /leave/request/{request_id}/withdraw - Withdraw request
```

**Example Usage:**
```javascript
// Using the Agent
Select: [LM] Leave Management System
Provide: Employee ID and leave request details
Output: Request status, balance update, notifications
```

**Knowledge Base Files:**
- `leave-management.js` - Leave logic and validation
- `leave-management.postman_collection.json` - API testing
- `labor-law-rules.md` - Jurisdiction-specific entitlements

---

### Workflow 4: Payroll Processing

**Purpose:** Calculate and process accurate, compliant employee compensation

**Key Components:**
- Gross pay calculation
- Leave and absence deductions
- Tax calculation (federal, state, local, FICA)
- Benefit deductions
- Net pay computation
- Direct deposit processing
- Pay stub generation
- Year-end tax forms (W-2, 1099)

**API Endpoints:**
```
POST /payroll/calculate - Calculate payroll period
POST /payroll/process - Process and disburse
GET /payroll/stub/{employee_id}/{period} - Get pay stub
GET /payroll/report - Generate payroll report
POST /payroll/archive - Archive payroll records
```

**Example Usage:**
```javascript
// Using the Agent
Select: [PY] Payroll Integration & Processing
Provide: Payroll period and employee list
Output: Calculated payroll, approval workflow, disbursement confirmation
```

**Knowledge Base Files:**
- `payroll-engine.js` - Payroll calculation logic
- `tax-calculator.py` - Tax withholding calculations
- `payroll-processing.postman_collection.json` - API testing
- `labor-law-rules.md` - Tax and wage requirements

---

### Workflow 5: Compliance Verification

**Purpose:** Ensure HR systems and processes comply with labor laws and data privacy regulations

**Key Components:**
- Data storage and encryption verification
- Labor law compliance checks
- GDPR/CCPA compliance assessment
- Audit logging verification
- Risk identification and scoring
- Remediation tracking

**API Endpoints:**
```
POST /compliance/audit - Start compliance audit
GET /compliance/audit/{audit_id}/results - Get audit results
POST /compliance/remediate - Apply remediation
GET /compliance/report - Generate compliance report
```

**Example Usage:**
```javascript
// Using the Agent
Select: [CC] Compliance & Data Privacy Verification
Provide: Compliance scope and jurisdiction
Output: Compliance audit report with findings and recommendations
```

**Knowledge Base Files:**
- `labor-law-rules.md` - Federal and state requirements
- `gdpr-requirements.md` - EU data protection regulations
- `ccpa-requirements.md` - California privacy law
- `data-privacy-engine.py` - Compliance checking logic

---

### Workflow 6: Employee Data Management

**Purpose:** Centralized management of employee records with strict access controls

**Key Components:**
- Employee master data storage
- Personal information management
- Document management
- Role-based access control
- Employment status tracking
- Historical data archiving

**API Endpoints:**
```
POST /employees/create - Create employee record
GET /employees/{employee_id} - Retrieve employee data
PUT /employees/{employee_id} - Update employee record
DELETE /employees/{employee_id} - Archive employee record
GET /employees/search - Search employees
POST /employees/bulk-import - Bulk import employees
```

**Example Usage:**
```javascript
// Using the Agent
Select: [ED] Employee Data Management
Provide: Operation type and employee details
Output: Record created/updated, confirmation of action
```

**Knowledge Base Files:**
- `employee-data-store.js` - Employee record management
- `access-control.py` - Permission and visibility controls
- `data-privacy-engine.py` - PII protection

---

## Testing with Postman

The Postman collections provide complete API testing for all HR workflows:

### 1. Recruitment Workflow
```
File: recruitment-workflow.postman_collection.json
Tests:
  - Create job postings
  - Upload and parse resumes
  - Score and rank candidates
  - Schedule interviews
  - Record interview feedback
```

### 2. Payroll Processing
```
File: payroll-processing.postman_collection.json
Tests:
  - Calculate payroll
  - Validate calculations
  - Process disbursement
  - Generate pay stubs
  - Create tax forms
```

### 3. Employee Data Management
```
File: employee-data-mgmt.postman_collection.json
Tests:
  - Create employee records
  - Update employee information
  - Search and filter
  - Bulk operations
  - Archive records
```

### 4. Leave Management
```
File: leave-management.postman_collection.json
Tests:
  - Check balances
  - Submit requests
  - Approve/reject
  - View calendar
  - Modify policies
```

### 5. Compliance Verification
```
File: compliance-verification.postman_collection.json
Tests:
  - Run compliance audits
  - View audit results
  - Track remediation
  - Generate reports
```

### Running Postman Collections:
```bash
# Import collection in Postman
File → Import → Select .postman_collection.json

# Or use Newman (CLI)
newman run recruitment-workflow.postman_collection.json \
  --environment postman_environment.json

# With authentication
newman run recruitment-workflow.postman_collection.json \
  --environment postman_environment.json \
  --variable jwt_token=$JWT_TOKEN
```

---

## Configuration & Customization

### Custom Labor Laws by Jurisdiction

The `labor-law-rules.md` file includes templates for adding jurisdiction-specific rules:

```python
# Adding custom jurisdiction
JURISDICTION_RULES = {
    'us_california': {
        'minimum_wage': 16.50,
        'vacation_days': 20,
        'sick_days': 5,
        'double_time_threshold': 12,  # hours/day
        'meal_break_required': True
    }
}
```

### Custom Compliance Rules

Extend the compliance engine with organization-specific rules:

```python
# In data-privacy-engine.py
CUSTOM_POLICIES = {
    'data_retention_periods': {
        'employee_records': 7,
        'recruitment': 1,
        'payroll': 7,
        'training': 3
    }
}
```

### API Customization

All API endpoints can be extended or customized:

```javascript
// Extend resume screening
class CustomResumeScreening extends ResumeScreening {
    scoreCandidate(candidate, jobReq) {
        const baseScore = super.scoreCandidate(candidate, jobReq);
        // Apply custom logic
        return customizedScore;
    }
}
```

---

## Integration Guide

### Connecting to External Systems

#### Payroll System Integration
```javascript
// In payroll-engine.js
const payrollProvider = new PayrollProviderAPI({
    endpoint: process.env.PAYROLL_API_URL,
    apiKey: process.env.PAYROLL_API_KEY
});

// Export payroll data
await payrollProvider.sendPayroll(payrollData);
```

#### Benefits System Integration
```python
# In onboarding-workflow.js equivalent
benefits_api = BenefitsProviderAPI(
    endpoint=os.getenv('BENEFITS_API_URL'),
    token=os.getenv('BENEFITS_API_TOKEN')
)
benefits_api.enroll_employee(employee_data)
```

#### Time Tracking Integration
```javascript
// Sync timekeeping data
const timeTrackingAPI = new TimeTrackingProvider();
const timecards = await timeTrackingAPI.getTimecards(payrollPeriod);
```

---

## Compliance Checklists

### GDPR Compliance Checklist
- [ ] Data Processing Agreement (DPA) with all vendors
- [ ] Data Protection Impact Assessment (DPIA) completed
- [ ] Privacy notices updated and provided to employees
- [ ] Data subject rights processes implemented
- [ ] Breach notification procedures documented
- [ ] Data retention schedules enforced
- [ ] Encryption implemented for data at rest and in transit
- [ ] Access controls and audit logging in place
- [ ] Employee consent documentation for specific processing
- [ ] International transfer mechanisms established (if applicable)

### Labor Law Compliance Checklist
- [ ] Minimum wage and overtime rules verified
- [ ] Leave entitlements calculated correctly
- [ ] FMLA compliance documentation
- [ ] ADA accommodations documented
- [ ] Child labor restrictions enforced (if applicable)
- [ ] Wage statements provided to employees
- [ ] Tax withholding calculated accurately
- [ ] Required posters displayed
- [ ] Harassment prevention training completed
- [ ] Records retained per jurisdiction requirements

### Payroll Compliance Checklist
- [ ] Federal income tax withholding accurate
- [ ] FICA calculations correct (SS + Medicare)
- [ ] State income tax withholding (if applicable)
- [ ] Local income tax withholding (if applicable)
- [ ] Garnishment deductions applied correctly
- [ ] W-2 forms generated and filed timely
- [ ] 1099 forms generated for contractors
- [ ] Year-end reconciliation (941-X) completed
- [ ] Direct deposit information verified
- [ ] Pay stubs provided to employees

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Resume Parsing Fails
**Problem:** Resume upload returns parsing error
**Solution:**
1. Verify file format (PDF, DOCX, or TXT)
2. Check file size (< 10MB recommended)
3. Ensure resume text is selectable (not scanned image)
4. Review resume content for unusual formatting

#### Tax Calculation Errors
**Problem:** Tax withholding amounts incorrect
**Solution:**
1. Verify Form W-4 data in employee record
2. Check current tax year rates (updated annually)
3. Validate employee status (exempt vs non-exempt)
4. Review state tax rules for jurisdiction
5. Check for wage base limits (SS, Medicare)

#### Compliance Audit Failures
**Problem:** Compliance audit reports non-compliance
**Solution:**
1. Review specific findings in audit report
2. Identify affected processes and records
3. Implement recommended remediation steps
4. Document corrective actions with dates
5. Schedule re-audit to verify fixes

#### API Authentication Failures
**Problem:** JWT token validation errors
**Solution:**
1. Verify token is not expired
2. Check authorization header format: `Bearer {token}`
3. Validate token signature with secret key
4. Ensure token includes required claims
5. Check token permissions for endpoint

#### Data Access Permission Errors
**Problem:** Users cannot access specific data
**Solution:**
1. Verify user role permissions in system
2. Check department-based visibility rules
3. Review field-level access controls
4. Audit recent permission changes
5. Update permissions if needed

---

## Support Resources

### Documentation Files
- **Complete System Guide:** `_bmad-output/fullstack-hr-agent.txt`
- **API Reference:** `_bmad/bmm/data/hr-api-docs/api-reference.md`
- **Labor Laws:** `_bmad/bmm/data/hr-compliance/labor-law-rules.md`
- **GDPR Guide:** `_bmad/bmm/data/hr-compliance/gdpr-requirements.md`

### Code Examples
- **JavaScript Implementation:** `/hr-logic/*.js`
- **Python Implementation:** `/hr-logic/*.py`
- **API Testing:** `/postman-collections/*.json`

### Support Contacts
- HR Systems Team: hr-systems@company.com
- Compliance Questions: compliance@company.com
- Data Privacy Issues: privacy@company.com
- Technical Support: support@company.com

---

## Next Steps

1. **Activate the Agent:** Access the HR Agent from the BMAD interface
2. **Review Workflows:** Study the specific workflows you'll be using
3. **Test with Postman:** Import and run the relevant collections
4. **Customize Configuration:** Update labor laws and policies for your jurisdiction
5. **Integrate Systems:** Connect external payroll, benefits, and time-tracking systems
6. **Train Users:** Ensure HR team understands workflows and processes
7. **Monitor Compliance:** Regular audits and reviews

---

## Version Information
- **Agent Version:** 1.0.0
- **Framework:** BMAD (Behavior-Driven Agent Design)
- **Last Updated:** January 2025
- **Status:** Production Ready

---

**Welcome to the BMAD Fullstack HR Agent!** Your comprehensive HR automation solution is ready to streamline recruitment, onboarding, leave management, payroll, and ensure compliance across all HR processes.
