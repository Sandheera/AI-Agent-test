// Resume Screening Logic
// Handles resume parsing, skill extraction, and candidate evaluation

class ResumeScreening {
  constructor() {
    this.skillsDatabase = this.initializeSkillsDatabase();
    this.experienceWeights = {
      entry: 0.3,
      mid: 0.6,
      senior: 0.9,
      lead: 1.0
    };
  }

  /**
   * Parse resume document and extract candidate information
   * @param {Buffer} resumeBuffer - Resume file content
   * @param {string} format - File format (pdf, docx, txt)
   * @returns {Object} Parsed resume data
   */
  parseResume(resumeBuffer, format) {
    const parser = this.selectParser(format);
    const rawText = parser.extractText(resumeBuffer);
    
    return {
      name: this.extractName(rawText),
      email: this.extractEmail(rawText),
      phone: this.extractPhone(rawText),
      experience: this.parseExperience(rawText),
      skills: this.extractSkills(rawText),
      education: this.parseEducation(rawText),
      certifications: this.extractCertifications(rawText)
    };
  }

  /**
   * Extract technical and soft skills from resume
   * @param {string} resumeText - Resume content
   * @returns {Array} Identified skills with proficiency
   */
  extractSkills(resumeText) {
    const skills = [];
    const skillPatterns = this.skillsDatabase.patterns;
    
    for (const [skill, patterns] of Object.entries(skillPatterns)) {
      patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(resumeText)) {
          skills.push({
            name: skill,
            category: this.skillsDatabase.categories[skill],
            confidence: this.calculateConfidence(resumeText, skill)
          });
        }
      });
    }
    
    return skills;
  }

  /**
   * Parse work experience from resume
   * @param {string} resumeText - Resume content
   * @returns {Array} Experience entries with duration and title
   */
  parseExperience(resumeText) {
    const experiences = [];
    const experienceRegex = /(\w+[\s\w]+(?:Engineer|Manager|Developer|Designer|Analyst|Architect))[\s\S]*?(?:\d{4}-\d{4}|\d{1,2}\/\d{1,2}\/\d{4})/g;
    
    const matches = resumeText.matchAll(experienceRegex);
    for (const match of matches) {
      experiences.push({
        title: match[1],
        duration: this.extractDuration(match[0]),
        description: match[0]
      });
    }
    
    return experiences;
  }

  /**
   * Score candidate based on job requirements
   * @param {Object} candidate - Parsed candidate data
   * @param {Object} jobRequirements - Job description requirements
   * @returns {Object} Scoring breakdown and total score
   */
  scoreCandidate(candidate, jobRequirements) {
    const scores = {
      skillsMatch: this.scoreSkillsMatch(candidate.skills, jobRequirements.requiredSkills),
      experienceMatch: this.scoreExperienceMatch(candidate.experience, jobRequirements.yearsRequired),
      educationMatch: this.scoreEducationMatch(candidate.education, jobRequirements.educationLevel),
      certificationMatch: this.scoreCertifications(candidate.certifications, jobRequirements.requiredCerts)
    };

    const weights = jobRequirements.weights || {
      skills: 0.5,
      experience: 0.25,
      education: 0.15,
      certifications: 0.1
    };

    const totalScore = 
      (scores.skillsMatch * weights.skills) +
      (scores.experienceMatch * weights.experience) +
      (scores.educationMatch * weights.education) +
      (scores.certificationMatch * weights.certifications);

    return {
      totalScore: Math.round(totalScore * 100) / 100,
      breakdown: scores,
      weights: weights,
      recommendation: this.generateRecommendation(totalScore)
    };
  }

  /**
   * Score skills match against job requirements
   * @param {Array} candidateSkills - Candidate's skills
   * @param {Array} requiredSkills - Job required skills
   * @returns {number} Skills match score 0-100
   */
  scoreSkillsMatch(candidateSkills, requiredSkills) {
    if (!requiredSkills || requiredSkills.length === 0) return 100;

    const candidateSkillNames = candidateSkills.map(s => s.name.toLowerCase());
    const matchedSkills = requiredSkills.filter(req => 
      candidateSkillNames.some(candidate => 
        this.skillsSimilar(candidate, req.toLowerCase())
      )
    );

    return (matchedSkills.length / requiredSkills.length) * 100;
  }

  /**
   * Score experience match
   * @param {Array} experience - Candidate's experience
   * @param {number} yearsRequired - Required years
   * @returns {number} Experience match score 0-100
   */
  scoreExperienceMatch(experience, yearsRequired) {
    const totalYears = experience.reduce((sum, exp) => sum + (exp.duration || 0), 0);
    
    if (totalYears >= yearsRequired) {
      return 100;
    } else {
      return (totalYears / yearsRequired) * 100;
    }
  }

  /**
   * Generate hiring recommendation
   * @param {number} score - Total candidate score
   * @returns {string} Recommendation (Strong, Medium, Weak, Reject)
   */
  generateRecommendation(score) {
    if (score >= 85) return 'Strong Candidate - Interview Recommended';
    if (score >= 70) return 'Medium Candidate - Consider Interview';
    if (score >= 50) return 'Weak Candidate - Pool for Future Roles';
    return 'Below Threshold - Do Not Proceed';
  }

  // Helper methods
  initializeSkillsDatabase() {
    return {
      patterns: {
        'JavaScript': ['javascript', 'js', 'node.js'],
        'Python': ['python'],
        'Java': ['java'],
        'React': ['react', 'reactjs'],
        'AWS': ['aws', 'amazon web services'],
        'Docker': ['docker'],
        'Kubernetes': ['kubernetes', 'k8s'],
        'SQL': ['sql', 'mysql', 'postgresql'],
        'MongoDB': ['mongodb'],
        'Leadership': ['team lead', 'manager', 'director'],
        'Communication': ['communication', 'presentation'],
        'ProjectManagement': ['project management', 'agile', 'scrum']
      },
      categories: {
        'JavaScript': 'technical',
        'Python': 'technical',
        'React': 'technical',
        'AWS': 'technical',
        'Leadership': 'soft',
        'Communication': 'soft'
      }
    };
  }

  selectParser(format) {
    // Implementation would return appropriate parser for format
    return { extractText: (buffer) => buffer.toString() };
  }

  extractName(text) {
    // Implementation for name extraction
    return '';
  }

  extractEmail(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : null;
  }

  extractPhone(text) {
    const phoneRegex = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/;
    const match = text.match(phoneRegex);
    return match ? match[1] : null;
  }

  parseEducation(text) {
    return [];
  }

  extractCertifications(text) {
    return [];
  }

  calculateConfidence(text, skill) {
    return 0.8;
  }

  extractDuration(text) {
    return 3;
  }

  scoreEducationMatch(education, required) {
    return 80;
  }

  scoreCertifications(certs, required) {
    return 70;
  }

  skillsSimilar(skill1, skill2) {
    return skill1.includes(skill2) || skill2.includes(skill1);
  }
}

module.exports = ResumeScreening;
