'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a full set of interview questions.
 *
 * - generateFullInterview - A function that generates 10 unique interview questions.
 * - GenerateFullInterviewInput - The input type for the generateFullInterview function.
 * - GenerateFullInterviewOutput - The return type for the generateFullInterview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  generateInterviewQuestions,
} from './generate-interview-questions';

import type { GenerateInterviewQuestionsOutput } from './generate-interview-questions';

const INTERVIEW_LENGTH = 10;

const GenerateFullInterviewInputSchema = z.object({
  techStack: z
    .string()
    .describe('The tech stack for the interview questions (e.g., React, JavaScript).'),
  difficultyLevel: z
    .enum(['Junior', 'Mid', 'Senior'])
    .describe('The difficulty level of the interview questions.'),
});

const GenerateFullInterviewOutputSchema = z.object({
  questions: z
    .array(z.object({
      question: z.string().describe('The generated interview question.'),
      options: z.array(z.string()).describe('An array of 4 possible answers (3 incorrect, 1 correct).'),
      answer: z.string().describe('The correct answer from the options array.'),
    }))
    .describe('An array of 10 generated interview questions.'),
});

export type GenerateFullInterviewInput = z.infer<
  typeof GenerateFullInterviewInputSchema
>;
export type GenerateFullInterviewOutput = z.infer<
  typeof GenerateFullInterviewOutputSchema
>;

export async function generateFullInterview(
  input: GenerateFullInterviewInput
): Promise<GenerateFullInterviewOutput> {
  return generateFullInterviewFlow(input);
}

const generateFullInterviewFlow = ai.defineFlow(
  {
    name: 'generateFullInterviewFlow',
    inputSchema: GenerateFullInterviewInputSchema,
    outputSchema: GenerateFullInterviewOutputSchema,
  },
  async (input) => {
    const questions: GenerateInterviewQuestionsOutput[] = [];
    const previousQuestions: string[] = [];

    for (let i = 0; i < INTERVIEW_LENGTH; i++) {
      const question = await generateInterviewQuestions({
        ...input,
        previousQuestions,
      });
      questions.push(question);
      previousQuestions.push(question.question);
    }

    return { questions };
  }
);
