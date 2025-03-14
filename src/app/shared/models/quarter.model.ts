export interface Quarter {
  id?: string;
  name?: string;
  description?: string;
  releaseDate?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  samples?: Sample[];
  questions?: Question[];
}

export interface Sample {
  id?: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  attributes?: {
    type?: string;
    age?: number;
    region?: string;
    flavor?: string;
    strength?: number;
    finish?: string;
  };
}

export interface Question {
  id?: string;
  text?: string;
  type?: 'multiple-choice' | 'slider' | 'text';
  options?: QuestionOption[];
  correctAnswer?: string | number | string[];
  points?: number;
  hint?: string;
  sample?: string; // References Sample ID
  attribute?: string; // Which attribute this question is about
}

export interface QuestionOption {
  id?: string;
  text?: string;
  value?: string | number;
  isCorrect?: boolean;
}

export interface UserAnswer {
  questionId?: string;
  answer?: string | number | string[];
  isCorrect?: boolean;
  pointsEarned?: number;
  timestamp?: string;
}

export interface QuarterResult {
  userId?: string;
  quarterId?: string;
  totalScore?: number;
  maxScore?: number;
  completedAt?: string;
  answers?: UserAnswer[];
  sampleRatings?: {
    [sampleId: string]: number;
  };
  favoriteId?: string;
  leastFavoriteId?: string;
  userNotes?: string;
  shared?: boolean;
}

export const validateQuarter = (quarter: Quarter): string[] => {
  const errors: string[] = [];
  
  if (!quarter.name) errors.push('Quarter name is required');
  if (!quarter.releaseDate) errors.push('Release date is required');
  
  return errors;
};

export const validateSample = (sample: Sample): string[] => {
  const errors: string[] = [];
  
  if (!sample.name) errors.push('Sample name is required');
  if (sample.order === undefined || sample.order < 0) {
    errors.push('Valid sample order is required');
  }
  
  return errors;
};

export const validateQuestion = (question: Question): string[] => {
  const errors: string[] = [];
  
  if (!question.text) errors.push('Question text is required');
  if (!question.type) errors.push('Question type is required');
  if (!question.sample) errors.push('Question must be associated with a sample');
  
  if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
    errors.push('Multiple choice questions require at least 2 options');
  }
  
  return errors;
};
