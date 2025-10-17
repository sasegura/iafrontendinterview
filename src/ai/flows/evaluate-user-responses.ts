'use server';

/**
 * @fileOverview A flow for evaluating user responses to interview questions.
 *
 * - evaluateUserResponse - A function that evaluates the user's response and provides feedback.
 * - EvaluateUserResponseInput - The input type for the evaluateUserResponse function.
 * - EvaluateUserResponseOutput - The return type for the evaluateUserResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateUserResponseInputSchema = z.object({
  topic: z.string().describe('The topic of the interview question (e.g., React, JavaScript).'),
  question: z.string().describe('The interview question asked to the user.'),
  userAnswer: z.string().describe("The user's answer to the interview question."),
  interviewPrompt: z.string().describe('The base prompt for the interview agent.'),
});
export type EvaluateUserResponseInput = z.infer<typeof EvaluateUserResponseInputSchema>;

const EvaluateUserResponseOutputSchema = z.object({
  evaluation: z.string().describe("A brief summary of the user's answer."),
  strengths: z.string().describe("The strengths of the user's answer."),
  areasForImprovement: z.string().describe('Areas where the user can improve.'),
  estimatedLevel: z.enum(['Junior', 'Mid', 'Senior']).describe('The estimated skill level of the user.'),
  nextQuestion: z.string().describe('The next question to ask the user.'),
  points: z.number().describe('The points to award to the user for the answer.'),
});
export type EvaluateUserResponseOutput = z.infer<typeof EvaluateUserResponseOutputSchema>;

export async function evaluateUserResponse(input: EvaluateUserResponseInput): Promise<EvaluateUserResponseOutput> {
  return evaluateUserResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateUserResponsePrompt',
  input: {schema: EvaluateUserResponseInputSchema},
  output: {schema: EvaluateUserResponseOutputSchema},
  prompt: `{{{interviewPrompt}}}

Topic: {{{topic}}}. Question: {{{question}}}

User's response: {{{userAnswer}}}

Provide structured feedback in the following format:
- Evaluation: brief summary (max 2 sentences)
- Strengths:
- Areas for improvement:
- Estimated Level: Junior / Mid / Senior
- nextQuestion: the next question to ask the user
- points: points to award to the user for the answer.
`,
});

const evaluateUserResponseFlow = ai.defineFlow(
  {
    name: 'evaluateUserResponseFlow',
    inputSchema: EvaluateUserResponseInputSchema,
    outputSchema: EvaluateUserResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
