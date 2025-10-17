'use server';

import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsInput,
} from '@/ai/flows/generate-interview-questions';
import {
  evaluateUserResponse,
  type EvaluateUserResponseInput,
} from '@/ai/flows/evaluate-user-responses';
import {
  providePersonalizedRecommendations,
  type ProvidePersonalizedRecommendationsInput,
} from '@/ai/flows/provide-personalized-recommendations';
import { interviewPrompt } from './prompts';

export async function getInitialQuestion(
  input: GenerateInterviewQuestionsInput
) {
  try {
    const question = await generateInterviewQuestions(input);
    return { success: true, data: question };
  } catch (error) {
    console.error('Error generating initial question:', error);
    return { success: false, error: 'Failed to generate initial question.' };
  }
}

export async function evaluateAnswer(
  input: Omit<EvaluateUserResponseInput, 'interviewPrompt'>
) {
  try {
    const evaluation = await evaluateUserResponse({
      ...input,
      interviewPrompt,
    });
    return { success: true, data: evaluation };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return { success: false, error: 'Failed to evaluate your answer.' };
  }
}

export async function getRecommendations(
  input: ProvidePersonalizedRecommendationsInput
) {
  try {
    const recommendations = await providePersonalizedRecommendations(input);
    return { success: true, data: recommendations };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      success: false,
      error: 'Failed to generate study recommendations.',
    };
  }
}
