export type PostStatus = 'pending' | 'approved' | 'posted';

export type Post = {
  id: string;
  topic: string;
  content: string;
  status: PostStatus;
  createdAt: Date;
  postedAt?: Date;
};
