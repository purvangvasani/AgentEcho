"use client";
import { useAppContext } from "@/lib/AppContext";
import AgentEchoDashboard from "@/components/app/AgentEchoDashboard";
import { redirect } from "next/navigation";
import { Post } from "@/lib/types";

export default function DashboardClient({ posts }: { posts: Post[] }) {
    const { user } = useAppContext();
    console.log("user", user);
    if (!user) {
        redirect("/login");
    }
    return <AgentEchoDashboard user={user} posts={posts} />;
}