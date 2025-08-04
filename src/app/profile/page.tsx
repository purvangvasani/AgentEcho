
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, updateUser, connectLinkedIn } from '@/lib/auth';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Linkedin, Loader2, LogOut } from 'lucide-react';
import { logout } from '@/lib/auth';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, startSavingTransition] = useTransition();
  const [isConnecting, startConnectingTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.name);
        setEmail(currentUser.email);
      } else {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || isSaving) return;

    startSavingTransition(async () => {
      const result = await updateUser({ ...user, name, email });
      if (result.success && result.user) {
        setUser(result.user);
        setName(result.user.name);
        setEmail(result.user.email);
        toast({ title: 'Profile updated successfully!' });
      } else {
        toast({
          title: 'Update Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };
  
  const handleConnectLinkedIn = () => {
    if (!user || isConnecting) return;
    
    startConnectingTransition(async () => {
      const result = await connectLinkedIn();
       if (result.success && result.user) {
        setUser(result.user);
        toast({ title: `LinkedIn ${result.user.linkedinAccessToken ? 'connected' : 'disconnected'} successfully!` });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.error,
          variant: 'destructive',
        });
      }
    })
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl">
         <Button variant="link" onClick={() => router.push('/')} className="mb-4 px-0">
          &larr; Back to Dashboard
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Profile</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveChanges} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6 flex-col items-start gap-4">
             <div className="space-y-2">
                <h3 className="font-semibold">Connected Accounts</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your LinkedIn account to allow automatic posting.
                </p>
              </div>
            {user.linkedinAccessToken ? (
              <div className="flex items-center gap-2 p-3 rounded-md bg-secondary text-secondary-foreground w-full">
                <Linkedin className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Connected to LinkedIn</span>
                 <Button variant="destructive" size="sm" className="ml-auto" onClick={handleConnectLinkedIn} disabled={isConnecting}>
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={handleConnectLinkedIn} disabled={isConnecting}>
                <Linkedin className="mr-2 h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect to LinkedIn'}
                 {isConnecting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            )}
             <div className="mt-6 w-full border-t pt-6">
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                </Button>
             </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
