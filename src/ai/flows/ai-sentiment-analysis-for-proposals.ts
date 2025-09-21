'use server';
/**
 * @fileOverview An AI assistant that analyzes sentiment trends on social media related to active proposals.
 *
 * - analyzeSentiment - A function that handles the sentiment analysis process for proposals.
 * - AnalyzeSentimentInput - The input type for the analyzeSentiment function.
 * - AnalyzeSentimentOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSentimentInputSchema = z.object({proposalDescription: z.string().describe('The description of the proposal to analyze sentiment for.')});
export type AnalyzeSentimentInput = z.infer<typeof AnalyzeSentimentInputSchema>;

const AnalyzeSentimentOutputSchema = z.object({
sentiment: z.string().describe('The overall sentiment towards the proposal (e.g., positive, negative, neutral).'),
likelihood: z.string().describe('An informed opinion on whether the proposal is likely to pass or fail based on sentiment analysis.')
});
export type AnalyzeSentimentOutput = z.infer<typeof AnalyzeSentimentOutputSchema>;

export async function analyzeSentiment(input: AnalyzeSentimentInput): Promise<AnalyzeSentimentOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentPrompt',
  input: {schema: AnalyzeSentimentInputSchema},
  output: {schema: AnalyzeSentimentOutputSchema},
  prompt: `You are an AI assistant specializing in sentiment analysis of social media trends related to blockchain proposals.

  Analyze the following proposal description and provide an overall sentiment and an informed opinion on whether the proposal is likely to pass or fail.

  Proposal Description: {{{proposalDescription}}}

  Consider the following:
  - Overall sentiment towards the proposal (positive, negative, neutral).
  - Key positive and negative arguments.
  - Potential concerns or objections.
  - Likelihood of the proposal passing or failing based on the analyzed sentiment.
  `,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: AnalyzeSentimentInputSchema,
    outputSchema: AnalyzeSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
