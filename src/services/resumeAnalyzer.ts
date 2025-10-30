import { AnalysisData } from '../lib/supabase';

const CRITICAL_SECTIONS = ['contact', 'experience', 'education', 'skills'];

const COMMON_ATS_KEYWORDS = [
  'experience', 'skills', 'education', 'certification', 'achievement',
  'management', 'leadership', 'project', 'development', 'analysis',
  'communication', 'team', 'results', 'performance', 'strategy'
];

const SECTION_PATTERNS = {
  contact: /\b(email|phone|linkedin|address|github)\b/i,
  experience: /\b(experience|employment|work history|professional background)\b/i,
  education: /\b(education|degree|university|college|bachelor|master|phd)\b/i,
  skills: /\b(skills|technical skills|competencies|expertise|proficiencies)\b/i,
};

export function analyzeResume(content: string): AnalysisData {
  const sections = detectSections(content);
  const missingElements = findMissingElements(sections);
  const formattingIssues = detectFormattingIssues(content);
  const keywords = analyzeKeywords(content);

  const formattingScore = calculateFormattingScore(formattingIssues, content);
  const contentScore = calculateContentScore(sections, missingElements);
  const keywordScore = calculateKeywordScore(keywords);
  const overallScore = Math.round((formattingScore + contentScore + keywordScore) / 3);

  const recommendations = generateRecommendations(
    sections,
    missingElements,
    formattingIssues,
    keywords
  );

  return {
    sections,
    missingElements,
    formattingIssues,
    keywords,
    recommendations,
    scores: {
      formatting: formattingScore,
      content: contentScore,
      keywords: keywordScore,
      overall: overallScore,
    },
  };
}

function detectSections(content: string): AnalysisData['sections'] {
  return {
    contact: SECTION_PATTERNS.contact.test(content),
    experience: SECTION_PATTERNS.experience.test(content),
    education: SECTION_PATTERNS.education.test(content),
    skills: SECTION_PATTERNS.skills.test(content),
  };
}

function findMissingElements(sections: AnalysisData['sections']): string[] {
  const missing: string[] = [];

  if (!sections.contact) missing.push('Contact information section');
  if (!sections.experience) missing.push('Work experience section');
  if (!sections.education) missing.push('Education section');
  if (!sections.skills) missing.push('Skills section');

  return missing;
}

function detectFormattingIssues(content: string): string[] {
  const issues: string[] = [];

  if (content.length < 200) {
    issues.push('Resume appears too short (less than 200 characters)');
  }

  if (content.length > 10000) {
    issues.push('Resume is too long - consider condensing to 1-2 pages');
  }

  const specialChars = /[^\w\s@.\-,():;'"\/\n]/g;
  const specialCharCount = (content.match(specialChars) || []).length;
  if (specialCharCount > 50) {
    issues.push('Contains unusual special characters that may confuse ATS');
  }

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(content);
  if (!hasEmail) {
    issues.push('No email address detected');
  }

  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(content);
  if (!hasPhone) {
    issues.push('No phone number detected');
  }

  const bulletPoints = (content.match(/[•●◦▪▫]/g) || []).length;
  if (bulletPoints === 0 && content.length > 500) {
    issues.push('Consider using bullet points for better readability');
  }

  return issues;
}

function analyzeKeywords(content: string): { found: string[]; missing: string[] } {
  const lowerContent = content.toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];

  COMMON_ATS_KEYWORDS.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  return { found, missing };
}

function calculateFormattingScore(issues: string[], content: string): number {
  let score = 100;

  score -= issues.length * 10;

  if (content.length < 200) score -= 20;
  if (content.length > 10000) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function calculateContentScore(
  sections: AnalysisData['sections'],
  missingElements: string[]
): number {
  let score = 100;

  score -= missingElements.length * 20;

  const sectionCount = Object.values(sections).filter(Boolean).length;
  if (sectionCount < 3) score -= 15;

  return Math.max(0, Math.min(100, score));
}

function calculateKeywordScore(keywords: { found: string[]; missing: string[] }): number {
  const totalKeywords = COMMON_ATS_KEYWORDS.length;
  const foundPercentage = (keywords.found.length / totalKeywords) * 100;

  return Math.round(foundPercentage);
}

function generateRecommendations(
  sections: AnalysisData['sections'],
  missingElements: string[],
  formattingIssues: string[],
  keywords: { found: string[]; missing: string[] }
): string[] {
  const recommendations: string[] = [];

  if (missingElements.length > 0) {
    recommendations.push(`Add missing sections: ${missingElements.join(', ')}`);
  }

  if (!sections.contact) {
    recommendations.push('Include clear contact information at the top (name, email, phone, LinkedIn)');
  }

  if (formattingIssues.length > 2) {
    recommendations.push('Address formatting issues to improve ATS readability');
  }

  if (keywords.found.length < 5) {
    recommendations.push('Include more relevant industry keywords and action verbs');
  }

  if (keywords.found.length >= 5 && keywords.found.length < 10) {
    recommendations.push('Consider adding more specific technical skills and accomplishments');
  }

  recommendations.push('Use standard section headings like "Work Experience", "Education", "Skills"');
  recommendations.push('Quantify achievements with metrics and numbers where possible');
  recommendations.push('Avoid headers, footers, tables, and complex formatting');
  recommendations.push('Save as .docx or .pdf format for best ATS compatibility');

  return recommendations;
}
