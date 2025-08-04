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
  input: {schema: z.object({
    trendingTopic: z.string(),
    sentiment: z.string(),
  })},
  output: {schema: GenerateLinkedInPostOutputSchema},
  prompt: `You are a social media expert specializing in creating engaging LinkedIn posts.

  Generate a LinkedIn post about the following trending topic.
  The sentiment around this topic is currently "{{sentiment}}", so tailor the post's tone accordingly.

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
    // 1. Call your Python API here
    let sentiment = 'neutral';
    try {
      // IMPORTANT: Replace this with your actual Python API endpoint.
      const response = await fetch('https://your-python-api.com/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if your API requires them e.g.,
          // 'Authorization': `Bearer ${process.env.PYTHON_API_KEY}`
        },
        body: JSON.stringify({ topic: input.trendingTopic }),
      });

      if (response.ok) {
        const data = await response.json();
        sentiment = data.sentiment; // Assuming your API returns { "sentiment": "positive" }
      }
    } catch (error) {
      console.error("Could not connect to Python API. Using default sentiment.", error);
      // Handle connection errors if necessary
    }
    
    // 2. Use the result from the API in the prompt
    const {output} = await generateLinkedInPostPrompt({
      trendingTopic: input.trendingTopic,
      sentiment: sentiment,
    });
    
    return output!;
  }
);
