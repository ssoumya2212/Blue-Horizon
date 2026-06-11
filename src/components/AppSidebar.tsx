import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Bus,
  MapPin,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Route as RouteIcon,
  Phone,
  FileText,
  Activity,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { signOut, type Role } from "@/lib/auth";

const NAV: Record<
  Role,
  { label: string; items: { title: string; url: string; icon: any }[] }[]
> = {
  admin: [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/app/admin", icon: LayoutDashboard },
        { title: "Live Tracking", url: "/app/tracking", icon: MapPin },
        { title: "AI Analytics", url: "/app/analytics", icon: Activity },
      ],
    },
    {
      label: "Manage",
      items: [
        { title: "Buses", url: "/app/buses", icon: Bus },
        { title: "Drivers", url: "/app/drivers", icon: Users },
        { title: "Students", url: "/app/students", icon: Users },
        { title: "Routes", url: "/app/routes", icon: RouteIcon },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Notifications", url: "/app/notifications", icon: Bell },
        { title: "Reports", url: "/app/reports", icon: FileText },
        { title: "Settings", url: "/app/settings", icon: Settings },
      ],
    },
  ],
  parent: [
    {
      label: "My Child",
      items: [
        { title: "Live Tracking", url: "/app/parent", icon: MapPin },
        { title: "Notifications", url: "/app/notifications", icon: Bell },
        { title: "Emergency", url: "/app/emergency", icon: Phone },
        { title: "Report Issue", url: "/app/reports", icon: FileText },
        { title: "Settings", url: "/app/settings", icon: Settings },
      ],
    },
  ],
  driver: [
    {
      label: "Today",
      items: [
        { title: "Attendance", url: "/app/driver", icon: ClipboardList },
        { title: "Stops & Route", url: "/app/routes", icon: RouteIcon },
        { title: "Notifications", url: "/app/notifications", icon: Bell },
        { title: "Report", url: "/app/reports", icon: FileText },
        { title: "Settings", url: "/app/settings", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar({ role }: { role: Role }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const groups = NAV[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Logo variant="light" />
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
