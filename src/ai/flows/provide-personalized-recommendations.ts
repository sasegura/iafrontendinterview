'use server';

/**
 * @fileOverview A flow for providing personalized study recommendations based on interview performance.
 *
 * - providePersonalizedRecommendations - A function that provides personalized study recommendations.
 * - ProvidePersonalizedRecommendationsInput - The input type for the providePersonalizedRecommendations function.
 * - ProvidePersonalizedRecommendationsOutput - The return type for the providePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvidePersonalizedRecommendationsInputSchema = z.object({
  intervieweeResponse: z
    .string()
    .describe('The response given by the interviewee to a specific question.'),
  feedback: z.string().describe('The AI-generated feedback on the response.'),
  topic: z.string().describe('The topic of the interview (e.g., React, JavaScript).'),
  difficultyLevel: z
    .enum(['Junior', 'Mid', 'Senior'])
    .describe('The difficulty level of the interview.'),
});
export type ProvidePersonalizedRecommendationsInput = z.infer<
  typeof ProvidePersonalizedRecommendationsInputSchema
>;

const ProvidePersonalizedRecommendationsOutputSchema = z.object({
  studyRecommendations: z
    .string()
    .describe('Personalized study recommendations based on the interview performance.'),
});
export type ProvidePersonalizedRecommendationsOutput = z.infer<
  typeof ProvidePersonalizedRecommendationsOutputSchema
>;

export async function providePersonalizedRecommendations(
  input: ProvidePersonalizedRecommendationsInput
): Promise<ProvidePersonalizedRecommendationsOutput> {
  return providePersonalizedRecommendationsFlow(input);
}

const providePersonalizedRecommendationsPrompt = ai.definePrompt({
  name: 'providePersonalizedRecommendationsPrompt',
  input: {schema: ProvidePersonalizedRecommendationsInputSchema},
  output: {schema: ProvidePersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert career coach specializing in frontend development. Based on the user's response to an interview question, the feedback they received, the topic of the interview, and the difficulty level, provide personalized study recommendations.

  Interviewee Response: {{{intervieweeResponse}}}
  Feedback: {{{feedback}}}
  Topic: {{{topic}}}
  Difficulty Level: {{{difficultyLevel}}}

  Provide specific and actionable study recommendations to improve their knowledge and skills in the areas identified as needing improvement. The recommendations should include specific topics to study, resources to consult (e.g., documentation, tutorials, articles), and exercises to practice. Focus the recommendations on the areas of improvement indicated by the AI feedback.
  `,
});

const providePersonalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'providePersonalizedRecommendationsFlow',
    inputSchema: ProvidePersonalizedRecommendationsInputSchema,
    outputSchema: ProvidePersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await providePersonalizedRecommendationsPrompt(input);
    return output!;
  }
);
