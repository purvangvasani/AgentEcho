'use server';

import { generateLinkedInPost } from '@/ai/flows/generate-linkedin-post';

export async function createPostFromTopic(topic: string) {
  if (!topic || topic.trim().length < 3) {
    return { success: false, error: 'Topic must be at least 3 characters long.' };
  }
  
  try {
    const { postContent } = await generateLinkedInPost({ trendingTopic: topic });
    return { success: true, post: { topic, content: postContent } };
  } catch (error) {
    console.error('Error generating post:', error);
    return { success: false, error: 'Failed to generate post using AI. Please try again.' };
  }
}
