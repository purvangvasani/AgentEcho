'use server';

/**
 * @fileOverview A flow that summarizes LinkedIn posting performance over the past month.
 *
 * - summarizeLinkedinPerformance - A function that summarizes LinkedIn posting performance.
 * - SummarizeLinkedinPerformanceInput - The input type for the summarizeLinkedinPerformance function.
 * - SummarizeLinkedinPerformanceOutput - The return type for the summarizeLinkedinPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLinkedinPerformanceInputSchema = z.object({
  linkedinPosts: z.array(z.object({
    title: z.string().describe('The title of the LinkedIn post.'),
    content: z.string().describe('The content of the LinkedIn post.'),
    likes: z.number().describe('The number of likes the post received.'),
    comments: z.number().describe('The number of comments the post received.'),
    views: z.number().describe('The number of views the post received.'),
    date: z.string().describe('The date the post was published (ISO format).'),
  })).describe('An array of LinkedIn posts with their respective data.'),
});
export type SummarizeLinkedinPerformanceInput = z.infer<typeof SummarizeLinkedinPerformanceInputSchema>;

const SummarizeLinkedinPerformanceOutputSchema = z.object({
  summary: z.string().describe('A summary of the LinkedIn posting performance over the past month.'),
  progress: z.string().describe('progress of LinkedIn posting performance summarization.')
});
export type SummarizeLinkedinPerformanceOutput = z.infer<typeof SummarizeLinkedinPerformanceOutputSchema>;

export async function summarizeLinkedinPerformance(input: SummarizeLinkedinPerformanceInput): Promise<SummarizeLinkedinPerformanceOutput> {
  return summarizeLinkedinPerformanceFlow(input);
}

const summarizeLinkedinPerformancePrompt = ai.definePrompt({
  name: 'summarizeLinkedinPerformancePrompt',
  input: {schema: SummarizeLinkedinPerformanceInputSchema},
  output: {schema: SummarizeLinkedinPerformanceOutputSchema},
  prompt: `You are an expert in social media analytics. You will receive a list of LinkedIn posts with their data, and you will provide a summary of their performance over the past month.

Posts:
{{#each linkedinPosts}}
  - Title: {{this.title}}
    Content: {{this.content}}
    Likes: {{this.likes}}
    Comments: {{this.comments}}
    Views: {{this.views}}
    Date: {{this.date}}
{{/each}}

Summary:`,
});

const summarizeLinkedinPerformanceFlow = ai.defineFlow(
  {
    name: 'summarizeLinkedinPerformanceFlow',
    inputSchema: SummarizeLinkedinPerformanceInputSchema,
    outputSchema: SummarizeLinkedinPerformanceOutputSchema,
  },
  async input => {
    const {output} = await summarizeLinkedinPerformancePrompt(input);
    return {
      ...output!,
      progress: 'LinkedIn posting performance summarized successfully.'
    };
  }
);
