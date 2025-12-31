# Candidate Ranking Algorithm
# AI-powered evaluation and ranking of candidates

import json
from typing import List, Dict, Tuple
from enum import Enum
from datetime import datetime

class CandidateRank(Enum):
    TIER_1 = 90  # Interview immediately
    TIER_2 = 75  # Strong candidates
    TIER_3 = 60  # Consider candidates
    TIER_4 = 40  # Pool for future
    REJECT = 0   # Do not proceed

class CandidateRanking:
    def __init__(self):
        self.ranking_factors = {
            'skills_fit': 0.35,
            'experience_relevance': 0.25,
            'cultural_fit': 0.15,
            'growth_potential': 0.15,
            'location_match': 0.10
        }
        self.tier_distribution = {
            'tier_1': 0.10,  # Top 10%
            'tier_2': 0.20,  # Next 20%
            'tier_3': 0.30,  # Next 30%
            'tier_4': 0.40   # Remaining 40%
        }

    def rank_candidates(self, candidates: List[Dict], job_profile: Dict) -> List[Dict]:
        """
        Rank candidates using multi-factor analysis
        
        Args:
            candidates: List of candidate profiles with scores
            job_profile: Job requirements and preferences
            
        Returns:
            Sorted list of ranked candidates with tier assignment
        """
        ranked = []
        
        for candidate in candidates:
            # Calculate individual factor scores
            skills_score = self._evaluate_skills_fit(candidate, job_profile)
            exp_score = self._evaluate_experience_relevance(candidate, job_profile)
            culture_score = self._evaluate_cultural_alignment(candidate, job_profile)
            growth_score = self._evaluate_growth_potential(candidate)
            location_score = self._evaluate_location_match(candidate, job_profile)
            
            # Weighted score calculation
            total_score = (
                skills_score * self.ranking_factors['skills_fit'] +
                exp_score * self.ranking_factors['experience_relevance'] +
                culture_score * self.ranking_factors['cultural_fit'] +
                growth_score * self.ranking_factors['growth_potential'] +
                location_score * self.ranking_factors['location_match']
            )
            
            ranked.append({
                'candidate_id': candidate.get('id'),
                'name': candidate.get('name'),
                'total_score': round(total_score, 2),
                'factor_scores': {
                    'skills_fit': round(skills_score, 2),
                    'experience_relevance': round(exp_score, 2),
                    'cultural_fit': round(culture_score, 2),
                    'growth_potential': round(growth_score, 2),
                    'location_match': round(location_score, 2)
                },
                'strengths': self._identify_strengths(candidate),
                'gaps': self._identify_gaps(candidate, job_profile),
                'interview_questions': self._generate_interview_questions(candidate, job_profile)
            })
        
        # Sort by score descending
        ranked.sort(key=lambda x: x['total_score'], reverse=True)
        
        # Assign tiers
        return self._assign_tiers(ranked)

    def _evaluate_skills_fit(self, candidate: Dict, job_profile: Dict) -> float:
        """
        Evaluate how well candidate's skills match job requirements
        Scoring: 0-100
        """
        required_skills = set(job_profile.get('required_skills', []))
        nice_to_have = set(job_profile.get('nice_to_have_skills', []))
        candidate_skills = set(candidate.get('skills', []))
        
        if not required_skills:
            return 0
        
        # Calculate matches
        required_matches = candidate_skills & required_skills
        nice_matches = candidate_skills & nice_to_have
        
        required_score = len(required_matches) / len(required_skills) * 80
        nice_score = min(len(nice_matches) / len(nice_to_have), 1) * 20 if nice_to_have else 0
        
        return required_score + nice_score

    def _evaluate_experience_relevance(self, candidate: Dict, job_profile: Dict) -> float:
        """
        Evaluate relevance and depth of experience
        Scoring: 0-100
        """
        years_required = job_profile.get('years_experience_required', 0)
        years_candidate = candidate.get('total_years_experience', 0)
        
        # Experience score
        if years_candidate >= years_required:
            exp_score = min((years_candidate / years_required) * 100, 100)
        else:
            exp_score = (years_candidate / years_required) * 80
        
        # Industry relevance score
        relevant_experience = candidate.get('relevant_experience_years', 0)
        industry_score = (relevant_experience / years_required) * 20 if years_required > 0 else 0
        
        return min(exp_score + industry_score, 100)

    def _evaluate_cultural_alignment(self, candidate: Dict, job_profile: Dict) -> float:
        """
        Evaluate cultural fit and values alignment
        Scoring: 0-100
        """
        company_values = set(job_profile.get('company_values', []))
        candidate_values = set(candidate.get('stated_values', []))
        
        if not company_values:
            return 50  # Neutral if no values defined
        
        values_match = len(candidate_values & company_values) / len(company_values) * 60
        
        # Communication style match
        comm_style = self._match_communication_style(
            candidate.get('communication_style'),
            job_profile.get('team_communication_style')
        )
        
        return values_match + comm_style

    def _evaluate_growth_potential(self, candidate: Dict) -> float:
        """
        Evaluate candidate's potential for growth and development
        Scoring: 0-100
        """
        growth_score = 50  # Baseline
        
        # Learning mindset
        if candidate.get('continuous_learning'):
            growth_score += 15
        
        # Career progression trajectory
        if candidate.get('career_progression_rate', 0) > 0:
            growth_score += 20
        
        # Technical depth and breadth
        if len(candidate.get('skills', [])) > 8:
            growth_score += 10
        
        # Certifications and education
        if candidate.get('advanced_certifications'):
            growth_score += 5
        
        return min(growth_score, 100)

    def _evaluate_location_match(self, candidate: Dict, job_profile: Dict) -> float:
        """
        Evaluate location and work arrangement fit
        Scoring: 0-100
        """
        candidate_location = candidate.get('location')
        job_location = job_profile.get('location')
        remote_allowed = job_profile.get('remote_work_allowed', False)
        
        if candidate_location == job_location:
            return 100
        elif remote_allowed:
            return 100  # Full score if remote allowed
        else:
            return 50  # Partial score if relocation needed

    def _identify_strengths(self, candidate: Dict) -> List[str]:
        """Identify and list candidate's key strengths"""
        strengths = []
        
        if candidate.get('years_experience', 0) > 10:
            strengths.append('Deep experience')
        if len(candidate.get('technical_skills', [])) > 5:
            strengths.append('Strong technical breadth')
        if candidate.get('leadership_experience'):
            strengths.append('Leadership background')
        if candidate.get('track_record_success'):
            strengths.append('Proven track record')
            
        return strengths

    def _identify_gaps(self, candidate: Dict, job_profile: Dict) -> List[str]:
        """Identify skill and experience gaps"""
        gaps = []
        
        required_skills = set(job_profile.get('required_skills', []))
        candidate_skills = set(candidate.get('skills', []))
        missing = required_skills - candidate_skills
        
        if missing:
            gaps.append(f"Missing skills: {', '.join(missing)}")
        
        if candidate.get('years_experience', 0) < job_profile.get('years_experience_required', 0):
            gaps.append('Below required experience level')
        
        return gaps

    def _generate_interview_questions(self, candidate: Dict, job_profile: Dict) -> List[str]:
        """Generate targeted interview questions"""
        questions = []
        
        # Technical depth questions
        primary_skill = job_profile.get('primary_technical_skill')
        questions.append(f"Tell us about your experience with {primary_skill}")
        
        # Experience questions
        if candidate.get('relevant_experience_years', 0) < job_profile.get('years_experience_required', 0):
            questions.append("How would you approach learning our tech stack quickly?")
        
        # Growth questions
        questions.append("Where do you see yourself in 3-5 years?")
        
        # Culture fit questions
        questions.append("What type of team environment do you work best in?")
        
        return questions

    def _assign_tiers(self, ranked_candidates: List[Dict]) -> List[Dict]:
        """Assign ranking tiers based on score distribution"""
        total = len(ranked_candidates)
        
        tier_1_count = max(1, int(total * self.tier_distribution['tier_1']))
        tier_2_count = int(total * self.tier_distribution['tier_2'])
        tier_3_count = int(total * self.tier_distribution['tier_3'])
        
        for idx, candidate in enumerate(ranked_candidates):
            if idx < tier_1_count:
                candidate['tier'] = 'TIER_1 - Interview Immediately'
            elif idx < tier_1_count + tier_2_count:
                candidate['tier'] = 'TIER_2 - Strong Candidate'
            elif idx < tier_1_count + tier_2_count + tier_3_count:
                candidate['tier'] = 'TIER_3 - Consider for Interview'
            else:
                candidate['tier'] = 'TIER_4 - Pool for Future Roles'
        
        return ranked_candidates

    def _match_communication_style(self, candidate_style: str, team_style: str) -> float:
        """Match communication styles"""
        if not candidate_style or not team_style:
            return 25
        return 25 if candidate_style == team_style else 15

# Usage example
if __name__ == "__main__":
    ranker = CandidateRanking()
    candidates = [
        {
            'id': 'C001',
            'name': 'Alice Johnson',
            'skills': ['Python', 'AWS', 'Docker'],
            'years_experience': 5,
            'relevant_experience_years': 4,
            'total_years_experience': 6
        }
    ]
    job = {
        'required_skills': ['Python', 'AWS'],
        'years_experience_required': 3
    }
    ranked = ranker.rank_candidates(candidates, job)
    print(json.dumps(ranked, indent=2))
