'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interview questions based on the selected tech stack and difficulty level.
 *
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the generateInterviewQuestions function.
 * - GenerateInterviewQuestionsOutput - The return type for the generateInterviewQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateInterviewQuestionsInputSchema = z.object({
  techStack: z
    .string()
    .describe('The tech stack for the interview questions (e.g., React, JavaScript).'),
  difficultyLevel: z
    .enum(['Junior', 'Mid', 'Senior'])
    .describe('The difficulty level of the interview questions.'),
  previousQuestions: z.array(z.string()).optional().describe('An array of previously asked questions to avoid repetition.'),
});
export type GenerateInterviewQuestionsInput = z.infer<
  typeof GenerateInterviewQuestionsInputSchema
>;

export const GenerateInterviewQuestionsOutputSchema = z.object({
  question: z.string().describe('The generated interview question.'),
  options: z.array(z.string()).describe('An array of 4 possible answers (3 incorrect, 1 correct).'),
  answer: z.string().describe('The correct answer from the options array.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<
  typeof GenerateInterviewQuestionsOutputSchema
>;

export async function generateInterviewQuestions(
  input: GenerateInterviewQuestionsInput
): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: {schema: GenerateInterviewQuestionsInputSchema},
  output: {schema: GenerateInterviewQuestionsOutputSchema},
  prompt: `You are an expert interviewer specializing in frontend development.

  Generate a new, unique interview question in a multiple-choice format based on the following tech stack and difficulty level. Provide 4 options, where one is the correct answer.

  **Crucially, do not repeat or ask a similar question to the ones in the list below.**
  {{#if previousQuestions}}
  Previous Questions:
  {{#each previousQuestions}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Tech Stack: {{{techStack}}}
  Difficulty Level: {{{difficultyLevel}}}
  `,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);