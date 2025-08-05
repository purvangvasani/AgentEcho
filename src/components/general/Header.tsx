"use client"
import { Bot, LogOut, UserIcon } from "lucide-react";
import { ManualPostDialog } from "../app/ManualPostDialog";
import { GeneratePostDialog } from "../app/GeneratePostDialog";
import { CronSettingsDialog } from "../app/CronSettingsDialog";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAppContext } from "@/lib/AppContext";
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

export default function Header() {
    const router = useRouter();
    const { user } = useAppContext();
    const handleLogout = async () => {
        await logout();
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="flex-shrink-0 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
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
                            <Avatar>
                                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Cron Settings</span>
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
    )
}