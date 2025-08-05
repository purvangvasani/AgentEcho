
import AgentEchoDashboard from "@/components/app/AgentEchoDashboard";
import { getCurrentUser } from "@/lib/auth";
import { getPosts } from "@/lib/posts";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

const DashboardPage = async () => {
    // update to use appContext later
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    const posts = await getPosts();

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <AgentEchoDashboard user={user} posts={posts} />
        </Suspense>
    )
}

export default DashboardPage;

// import { getPosts } from "@/lib/posts";
// import DashboardClient from "./DashboardClient";

// export default async function DashboardPage() {
//   const posts = await getPosts();
//   return <DashboardClient posts={posts} />;
// }