import LinkedAgentDashboard from "@/components/app/LinkedAgentDashboard";
import { redirect } from 'next/navigation';
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return <LinkedAgentDashboard user={user} />;
}
