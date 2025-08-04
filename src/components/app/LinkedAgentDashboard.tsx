"use client";

import { useState, useCallback, useMemo } from 'react';
import type { Post, PostStatus, User } from '@/lib/types';
import { Linkedin, Hourglass, CheckCircle, Send, PlusCircle, User as UserIcon, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PostCard } from '@/components/app/PostCard';
import { GeneratePostDialog } from '@/components/app/GeneratePostDialog';
import { ManualPostDialog } from '@/components/app/ManualPostDialog';
import { CronSettingsDialog } from '@/components/app/CronSettingsDialog';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';


const initialPosts: Post[] = [
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

const columnConfig: Record<PostStatus, { title: string; icon: React.ElementType }> = {
  pending: { title: 'Pending Approval', icon: Hourglass },
  approved: { title: 'Approved', icon: CheckCircle },
  posted: { title: 'Posted', icon: Send },
};

interface LinkedAgentDashboardProps {
  user: User;
}

export default function LinkedAgentDashboard({ user }: LinkedAgentDashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const router = useRouter();

  const handleCreatePost = useCallback((newPostData: { topic: string; content: string }) => {
    const newPost: Post = {
      id: crypto.randomUUID(),
      ...newPostData,
      status: 'pending',
      createdAt: new Date(),
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  const updatePostStatus = useCallback((postId: string, status: PostStatus) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? { ...p, status, postedAt: status === 'posted' ? new Date() : p.postedAt }
          : p
      )
    );
  }, []);

  const handleDeletePost = useCallback((postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const columns = useMemo(() => Object.keys(columnConfig) as PostStatus[], []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="flex-shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Linkedin className="w-8 h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">LinkedAgent</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <ManualPostDialog onPostCreated={handleCreatePost} />
          <GeneratePostDialog onPostCreated={handleCreatePost} />
          <CronSettingsDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((status) => {
            const filteredPosts = posts.filter((p) => p.status === status);
            const { title, icon: Icon } = columnConfig[status];
            return (
              <Card key={status} className="flex flex-col h-full overflow-hidden border-0 shadow-lg bg-card/80">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    {title}
                  </CardTitle>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">{filteredPosts.length}</Badge>
                </CardHeader>
                <CardContent className="flex-1 p-4 pt-0 overflow-y-auto">
                  {filteredPosts.length > 0 ? (
                    <div className="space-y-4">
                      {filteredPosts.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onStatusChange={updatePostStatus}
                          onDelete={handleDeletePost}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                      <PlusCircle className="w-10 h-10 mb-2" />
                      <p>No posts in this category.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
