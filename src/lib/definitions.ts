import type { EvaluateUserResponseOutput } from '@/ai/flows/evaluate-user-responses';
import type { GenerateInterviewQuestionsOutput } from '@/ai/flows/generate-interview-questions';
import type { ProvidePersonalizedRecommendationsOutput } from '@/ai/flows/provide-personalized-recommendations';

export type Difficulty = 'Junior' | 'Mid' | 'Senior';
export type Topic = 'React' | 'JavaScript' | 'HTML/CSS' | 'Testing' | 'Random';

// Re-exporting AI types for easier access in the app
export type Evaluation = EvaluateUserResponseOutput;
export type InitialQuestion = GenerateInterviewQuestionsOutput;
export type Recommendations = ProvidePersonalizedRecommendationsOutput;

export interface InterviewHistoryItem {
  question: string;
  answer: string;
  feedback: Evaluation;
  options?: string[];
  correctAnswer?: string;
}
