export enum CourseFormat {
  ONLINE_SELF_PACED = 'Online (Self-Paced)',
  ONLINE_LIVE = 'Online (Live Class)',
  IN_PERSON = 'In-Person',
  HYBRID = 'Hybrid',
  TUTORING = 'Private Tutoring'
}

export enum CourseCategory {
  OVERALL = 'Best Overall',
  MATH = 'Best for Math',
  VERBAL = 'Best for Verbal'
}

export interface Testimonial {
  studentName: string;
  text: string;
  scoreImprovement: number;
  acceptedCollege: string;
  rating: number;
}

export interface AcceptanceStats {
  description: string;
  topColleges: string[];
  averageAcceptanceRate: string;
}

export interface Course {
  id: string;
  name: string;
  provider: string;
  price: number;
  priceDisplay: string; // e.g. "$200" or "$100/hr"
  format: CourseFormat;
  durationWeeks: number;
  scoreGuarantee: string;
  acceptanceImpact: string; // Description of why this helps admission
  pros: string[];
  cons: string[];
  averageScoreIncrease: number; // Estimated points
  primaryCategory: CourseCategory;
  testimonials: Testimonial[];
  acceptanceStats: AcceptanceStats;
}

export interface SearchCriteria {
  budgetMax: number;
  preferredFormat: CourseFormat | 'ANY';
  targetScoreIncrease: number;
  category: CourseCategory;
}