
import Header from "@/components/general/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider>
        {/* <AppSidebar /> */}
        <SidebarInset>
          <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            <Header />
            <div className="overflow-y-auto bg-muted h-full">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}