

"use client";

import { useCallback } from 'react';
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


const columnConfig: Record<PostStatus, { title: string; icon: React.ElementType }> = {
  pending: { title: 'Pending Approval', icon: Hourglass },
  approved: { title: 'Approved', icon: CheckCircle },
  posted: { title: 'Posted', icon: Send },
};

interface AgentEchoDashboardProps {
  user: User;
  posts: Post[];
}

export default function AgentEchoDashboard({ user, posts }: AgentEchoDashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    router.refresh();
  };
  
  const columns = Object.keys(columnConfig) as PostStatus[];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="flex-shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Linkedin className="w-8 h-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">AgentEcho</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="hidden sm:flex items-center gap-2">
            <ManualPostDialog />
            <GeneratePostDialog />
            <CronSettingsDialog />
          </div>
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
       <div className="sm:hidden p-4 border-b">
          <div className="grid grid-cols-2 gap-2">
            <ManualPostDialog />
            <GeneratePostDialog />
            <CronSettingsDialog />
          </div>
        </div>

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
