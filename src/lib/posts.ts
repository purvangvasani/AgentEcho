// This file contains server actions to interact with your Python API for post management.
// You can replace the mock logic with `fetch` calls to your actual Python API endpoints.
'use server';

import { Post, PostStatus } from './types';
import { revalidatePath } from 'next/cache';

// This is a mock database. In a real application, you would fetch this from your Python API.
let MOCK_POSTS: Post[] = [
    {
    id: '1',
    topic: 'AI in Software Development',
    content: 'The rise of AI is transforming software development, from automated code generation to intelligent testing. Teams that embrace these tools will innovate faster and deliver higher-quality products. #AI #SoftwareDevelopment #FutureOfTech',
    status: 'pending',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    topic: 'The Future of Remote Work',
    content: 'Remote work is here to stay. Companies are adopting hybrid models, focusing on flexibility and results. The key to success lies in strong communication and a trust-based culture. #RemoteWork #FutureOfWork #CompanyCulture',
    status: 'approved',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    topic: 'Cybersecurity Trends in 2024',
    content: 'With increasing digital threats, robust cybersecurity is non-negotiable. Key trends for 2024 include AI-powered threat detection, zero-trust architecture, and a focus on employee training. #Cybersecurity #DataPrivacy #InfoSec',
    status: 'posted',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Fetches all posts.
 * Replace this with a call to your Python API:
 * const response = await fetch(`${process.env.PYTHON_API_URL}/posts`);
 * const posts = await response.json();
 * return posts;
 */
export async function getPosts(): Promise<Post[]> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return a deep copy to prevent mutation of the mock data
  return JSON.parse(JSON.stringify(MOCK_POSTS)).map((p: Post) => ({...p, createdAt: new Date(p.createdAt), postedAt: p.postedAt ? new Date(p.postedAt) : undefined}));
}

/**
 * Creates a new post.
 * Replace this with a call to your Python API:
 * await fetch(`${process.env.PYTHON_API_URL}/posts`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(postData),
 * });
 */
export async function createPost(postData: { topic: string, content: string, status: PostStatus }) {
  const newPost: Post = {
    id: crypto.randomUUID(),
    ...postData,
    createdAt: new Date(),
  };
  MOCK_POSTS.unshift(newPost);
  revalidatePath('/');
  return newPost;
}

/**
 * Updates the status of a post.
 * Replace this with a call to your Python API:
 * await fetch(`${process.env.PYTHON_API_URL}/posts/${id}`, {
 *   method: 'PATCH',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ status }),
 * });
 */
export async function updatePostStatus(id: string, status: PostStatus) {
  const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
  if (postIndex !== -1) {
    MOCK_POSTS[postIndex].status = status;
    if (status === 'posted') {
      MOCK_POSTS[postIndex].postedAt = new Date();
    }
  }
  revalidatePath('/');
}

/**
 * Deletes a post.
 * Replace this with a call to your Python API:
 * await fetch(`${process.env.PYTHON_API_URL}/posts/${id}`, {
 *   method: 'DELETE',
 * });
 */
export async function deletePost(id: string) {
  MOCK_POSTS = MOCK_POSTS.filter(p => p.id !== id);
  revalidatePath('/');
}
