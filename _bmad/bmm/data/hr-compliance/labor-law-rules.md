# Labor Law Compliance Rules
# Jurisdiction-specific regulations and requirements

## United States

### Federal Labor Standards (FLSA - Fair Labor Standards Act)

#### Minimum Wage
```
federal_minimum_wage: $7.25/hour
effective_date: 2009-07-24
notes: States and localities may set higher minimum wages
```

#### Overtime Requirements
```
overtime_threshold: 40 hours/week
overtime_multiplier: 1.5x (time and a half)
exempt_categories:
  - Executive/Administrative
  - Professional (licensed, learned)
  - Computer professional
  - Outside sales
```

#### Child Labor Restrictions
```
minimum_age: 14 years
restricted_occupations:
  - Mining
  - Manufacturing
  - Hazardous operations
maximum_hours_minors_14_15:
  - during_school: 3 hours/day, 18 hours/week
  - outside_school: 8 hours/day, 40 hours/week
  - night_hours: 7:00 PM - 7:00 AM
```

### Leave Requirements

#### Paid Time Off (Varies by State)
```
california:
  vacation_minimum: 40 hours/year
  sick_leave_minimum: 40 hours/year
  accrual_method: At least 1 hour per 30 hours worked
  carryover: Must allow carry-over of at least 5 days

new_york:
  sick_leave_minimum: 5 days/year
  accrual: At least 1 hour per 30 hours worked

massachusetts:
  earned_time_minimum: 1 hour per 30 hours worked
```

#### Family and Medical Leave Act (FMLA)
```
eligibility:
  - Employers: 50+ employees within 75 miles
  - Service: Minimum 12 months employment
  - Hours: Minimum 1,250 hours worked in 12 months

entitlements:
  - Duration: 12 weeks/12 months
  - Job Protection: Position or equivalent
  - Benefits: Health insurance continues
  - Pay: Unpaid (unless using accrued leave)

qualifying_events:
  - Child birth or adoption
  - Care for spouse/child/parent with serious health condition
  - Employee's own serious health condition
  - Military service (spouse/child/parent)
```

#### Americans with Disabilities Act (ADA)
```
requirements:
  - Reasonable accommodations for qualified individuals
  - Leave for disability-related treatments
  - Protected from discrimination

compliance:
  - Document accommodation requests
  - Maintain confidentiality of medical information
  - Interactive process for determining accommodations
```

---

## European Union (GDPR Compliance)

### Data Protection Requirements

#### Employee Data Rights
```
right_to_access: Employees can request copy of personal data
right_to_rectification: Correct inaccurate data
right_to_erasure: "Right to be forgotten" (with exceptions)
right_to_data_portability: Export in machine-readable format
right_to_restrict_processing: Limit use of data
right_to_object: Opt-out from processing
rights_related_to_automated_decisions: Human review of automated decisions
```

#### Lawful Basis for Processing
```
consent: Explicit, informed, freely given
contract: Necessary for employment contract
legal_obligation: Required by law
vital_interests: Protection of life
public_task: Performance of official duty
legitimate_interests: HR operations (must be balanced against rights)
```

#### Data Retention
```
recruitment_data: 6 months after hiring decision
employment_records: Duration of employment + 3-5 years
payroll_records: 7 years (tax purposes)
training_records: Duration of employment + 2 years
performance_reviews: Duration of employment + 3 years
health_and_safety: Duration of employment + 10 years
harassment_complaints: Duration of employment + 6 years
```

#### Data Protection Officer Requirements
```
required_when:
  - Large scale systematic monitoring
  - Large scale processing of special categories
  - Public authorities (most cases)

responsibilities:
  - Monitor GDPR compliance
  - Cooperate with supervisory authorities
  - Act as point of contact
  - Conduct Data Protection Impact Assessments
```

### Data Breach Notification
```
notification_timeline: 72 hours to supervisory authority
affected_parties: Notify if high risk to individuals
documentation: Maintain breach register
penalties: Up to €20 million or 4% of global turnover
```

---

## Payroll Compliance

### Tax Withholding

#### Federal Income Tax
```
calculation_method: Based on Form W-4 (2020+ version)
withholding_adjustments:
  - Dependents
  - Multiple jobs
  - Dual income
  - Itemized deductions

current_year_provisions: Updated annually per IRS tables
```

#### Social Security (FICA)
```
employee_rate: 6.2% (2025)
employer_rate: 6.2% (2025)
wage_base_limit: $168,600 (2025)
self_employed: 12.4% (both portions)
```

#### Medicare
```
employee_rate: 1.45%
employer_rate: 1.45%
additional_medicare_tax: 0.9% on wages over threshold
threshold:
  - Single: $200,000
  - Married filing jointly: $250,000
  - Married filing separately: $125,000
```

#### State Income Tax
```
varies_by_state: True
some_states_no_income_tax:
  - Alaska
  - Florida
  - Nevada
  - South Dakota
  - Tennessee
  - Texas
  - Washington
  - Wyoming

reciprocal_agreements: Check state-to-state agreements
```

### Deductions Compliance

#### Pre-Tax Deductions (Reduce Taxable Income)
```
health_insurance_premiums: Section 125 cafeteria plans
health_savings_account: HSA contributions
dependent_care_fsa: Dependent Care FSA
commuter_benefits: Transit and parking
retirement_contributions: 401(k), 403(b), SEP-IRA
```

#### Post-Tax Deductions
```
roth_401k_contributions: Post-tax
health_insurance_supplemental: Post-tax
union_dues: Post-tax (varies)
charitable_contributions: Post-tax
```

#### Mandatory Deductions
```
federal_income_tax: Calculate and withhold
state_income_tax: If applicable
local_income_tax: If applicable
social_security: 6.2% employee
medicare: 1.45% employee
court_ordered_garnishments: Support/restitution
```

### Year-End Requirements

#### W-2 Preparation
```
due_date: January 31, 2025 (for 2024 wages)
distribution:
  - Copy B, C, 2: Employee
  - Copy D: Employer tax return
  - Copy 1: State tax authority
  - Copy S: Employer filing

contents:
  - Gross wages
  - Federal income tax withheld
  - Social Security wages and tax
  - Medicare wages and tax
  - State income tax withheld
  - Other information (401k, HSA, etc.)

verification: Reconcile with 941-X quarterly filings
```

#### 1099 Reporting (Independent Contractors)
```
threshold: $600 or more in payments
due_date: January 31, 2025 (for 2024 payments)
forms: 1099-NEC, 1099-MISC

requirements:
  - Collect W-9 from contractor
  - Report all payments
  - Issue copies to contractor and IRS
  - Maintain records for 3 years
```

---

## Penalties and Enforcement

### Common Violations and Penalties
```
wage_violation: $10,000 - $50,000 per violation
misclassification: Back wages + penalties
unpaid_overtime: 100% of unpaid wages
family_leave_violation: Up to $300/day
discrimination: Unlimited (actual damages)
data_privacy_breach: €20 million or 4% revenue
```

### Audit Triggers
```
red_flags:
  - Large number of overtime hours
  - Frequent classification changes
  - No timekeeping system
  - Inconsistent pay practices
  - Multiple wage complaints
  - Wage/hour violations in industry
```

---

## Compliance Checklist

- [ ] Verify employee classification (exempt vs non-exempt)
- [ ] Implement timekeeping system
- [ ] Calculate and withhold taxes correctly
- [ ] Provide required wage statements
- [ ] Maintain payroll records (3-7 years)
- [ ] Post required labor law posters
- [ ] Provide FMLA notices
- [ ] Document accommodations
- [ ] Conduct harassment prevention training
- [ ] Maintain data privacy safeguards
- [ ] Report to IRS and state authorities timely
- [ ] Maintain anti-discrimination policies
- [ ] Document performance reviews
- [ ] Archive leave and time-off records
