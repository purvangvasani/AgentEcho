export type PostStatus = 'pending' | 'approved' | 'posted';

export type Post = {
  id: string;
  topic: string;
  content: string;
  status: PostStatus;
  createdAt: Date;
  postedAt?: Date;
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  linkedinAccessToken?: string;
}
