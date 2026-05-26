import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { getSession, type Session } from "@/lib/auth";
import { getPassengers } from "@/services/passengers";
export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const [session, setSession] = useState<Session>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    console.log("TEST WORKING");

    const fetchData = async () => {
      const data = await getPassengers();
      console.log("SUPABASE DATA:", data);
    };

    fetchData();

    setSession(getSession());
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="min-h-screen bg-background" />;
  if (!session) return <Navigate to="/login" />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar role={session.role} />
        <SidebarInset className="flex flex-1 flex-col">
          <TopNavbar session={session} />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
