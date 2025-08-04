import LinkedAgentDashboard from "@/components/app/LinkedAgentDashboard";
import { redirect } from 'next/navigation';
import { getCurrentUser } from "@/lib/auth";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

async function Dashboard() {
  const user = await getCurrentUser();
  // if (!user) {
  //   redirect('/login');
  // }
  return <LinkedAgentDashboard user={user} />;
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <Dashboard />
    </Suspense>
  );
}
