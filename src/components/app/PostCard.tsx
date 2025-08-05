"use client";

import type { Post, PostStatus } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, Send, ThumbsDown, Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { updatePostStatus, deletePost } from '@/lib/posts';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: PostStatus) => {
    startTransition(async () => {
      await updatePostStatus(post.id, status);
      router.refresh();
    });
  };
  
  const handleDelete = () => {
    startTransition(async () => {
      await deletePost(post.id);
      router.refresh();
    });
  };

  return (
    <Card className="bg-background/60 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-base font-semibold leading-snug">{post.topic}</CardTitle>
        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          {post.status === 'posted' && post.postedAt && (
            <span>
              {' '}&bull; Posted {formatDistanceToNow(post.postedAt, { addSuffix: true })}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'justify' }}>{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {post.status === 'pending' && (
          <Button onClick={() => handleStatusChange('approved')} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
        )}
        {post.status === 'approved' && (
          <>
            <Button onClick={() => handleStatusChange('posted')} size="sm" disabled={isPending}>
              <Send className="w-4 h-4 mr-2" />
              Post Now
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8" disabled={isPending}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {post.status === 'approved' && (
               <DropdownMenuItem onClick={() => handleStatusChange('pending')} disabled={isPending}>
                <ThumbsDown className="w-4 h-4 mr-2" />
                Disapprove
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isPending}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
