// Implemented the Genkit flow to generate a LinkedIn post from a trending topic.
'use server';
/**
 * @fileOverview A LinkedIn post generator AI agent that uses trending topics to create engaging content.
 *
 * - generateLinkedInPost - A function that handles the generation of LinkedIn posts from trending topics.
 * - GenerateLinkedInPostInput - The input type for the generateLinkedInPost function.
 * - GenerateLinkedInPostOutput - The return type for the generateLinkedInPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLinkedInPostInputSchema = z.object({
  trendingTopic: z
    .string()
    .describe('The trending topic to generate a LinkedIn post about.'),
});
export type GenerateLinkedInPostInput = z.infer<typeof GenerateLinkedInPostInputSchema>;

const GenerateLinkedInPostOutputSchema = z.object({
  postContent: z.string().describe('The generated content for the LinkedIn post.'),
});
export type GenerateLinkedInPostOutput = z.infer<typeof GenerateLinkedInPostOutputSchema>;

export async function generateLinkedInPost(input: GenerateLinkedInPostInput): Promise<GenerateLinkedInPostOutput> {
  return generateLinkedInPostFlow(input);
}

const generateLinkedInPostPrompt = ai.definePrompt({
  name: 'generateLinkedInPostPrompt',
  input: {schema: GenerateLinkedInPostInputSchema},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are a social media expert specializing in creating engaging LinkedIn posts.

  Generate a LinkedIn post about the following trending topic:
  Trending Topic: {{{trendingTopic}}}
  `,
});

const generateLinkedInPostFlow = ai.defineFlow(
  {
    name: 'generateLinkedInPostFlow',
    inputSchema: GenerateLinkedInPostInputSchema,
    outputSchema: GenerateLinkedInPostOutputSchema,
  },
  async input => {
    const {output} = await generateLinkedInPostPrompt(input);
    return output!;
  }
);
