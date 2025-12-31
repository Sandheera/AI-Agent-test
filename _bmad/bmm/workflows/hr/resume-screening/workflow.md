# Resume Screening & Candidate Ranking Workflow

## Overview
Automated resume screening and candidate ranking system that uses job description matching and AI-powered evaluation to identify top candidates for open positions.

## Process Steps

### 1. Job Description Input
- Accept job title, description, required skills, experience level
- Extract key competencies and qualifications
- Set scoring criteria and weights

### 2. Resume Processing
- Parse resume documents (PDF, DOCX, TXT)
- Extract candidate information (experience, skills, education)
- Normalize data for comparison

### 3. AI-Powered Screening
- Match candidate qualifications against job requirements
- Calculate compatibility score (0-100)
- Identify skill gaps and strengths
- Detect potential red flags (employment gaps, skill mismatch)

### 4. Ranking Algorithm
- Weight scores by importance of qualifications
- Apply customizable filtering rules
- Generate ranked candidate list
- Create score distribution report

### 5. Output Generation
- Generate screening report with rankings
- Create candidate comparison matrix
- Provide recommendations for next steps
- Schedule interviews for top candidates

## API Endpoints Used
```
POST /api/resume/upload - Upload resume document
POST /api/job-description/parse - Parse job requirements
POST /api/screening/evaluate - Run AI screening
GET /api/screening/results - Retrieve screening results
POST /api/interview/schedule - Schedule interviews
```

## Data Privacy Compliance
- Encrypted storage of resume data
- GDPR-compliant data retention policies
- Secure deletion after hiring decision
- Audit logging of all access

## Knowledge Base Integration
References: `hr-logic/resume-screening.js`, `hr-logic/candidate-ranking.py`
