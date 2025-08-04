"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualPostDialogProps {
  onPostCreated: (post: { topic: string; content: string }) => void;
}

export function ManualPostDialog({ onPostCreated }: ManualPostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (topic.trim().length < 3 || content.trim().length < 3) {
      toast({
        title: 'Error',
        description: 'Topic and content must be at least 3 characters long.',
        variant: 'destructive',
      });
      return;
    }

    onPostCreated({ topic, content });
    toast({
      title: 'Post Created!',
      description: 'The new post has been added to the pending approval column.',
    });
    setIsOpen(false);
    setTopic('');
    setContent('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PenSquare className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Write New Post</span>
          <span className="md:hidden">Write</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write New Post</DialogTitle>
          <DialogDescription>
            Manually craft your LinkedIn post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="topic" className="sm:text-right">
                Topic
              </Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The future of AI"
                className="col-span-1 sm:col-span-3"
                required
                minLength={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label htmlFor="content" className="sm:text-right pt-2">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                className="col-span-1 sm:col-span-3"
                required
                minLength={3}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            <Button type="submit">
              Create Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
