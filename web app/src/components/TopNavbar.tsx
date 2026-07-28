import { Bell, Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Session } from "@/lib/auth";
import { setSearchQuery, useSearchQuery } from "@/lib/search";

// Maps a typed query to the most relevant screen.
const ROUTE_KEYWORDS: { match: RegExp; to: string }[] = [
  { match: /\b(student|kid|child|grade|attendance)/i, to: "/app/students" },
  { match: /\b(bus|fleet|vehicle|plate)/i, to: "/app/buses" },
  { match: /\b(driver|license|licence)/i, to: "/app/drivers" },
  { match: /\b(route|stop|trip)/i, to: "/app/routes" },
  { match: /\b(track|gps|live|map|location)/i, to: "/app/tracking" },
  { match: /\b(notif|alert|message)/i, to: "/app/notifications" },
  { match: /\b(report|incident|issue)/i, to: "/app/reports" },
  { match: /\b(emergency|sos|contact)/i, to: "/app/emergency" },
  { match: /\b(setting|profile|preference)/i, to: "/app/settings" },
];

function resolveRoute(q: string): string {
  for (const r of ROUTE_KEYWORDS) if (r.match.test(q)) return r.to;
  // Fallback: send any free-text search to Students (the broadest list view).
  return "/app/students";
}

export function TopNavbar({ session }: { session: NonNullable<Session> }) {
  const initials = session.username.slice(0, 2).toUpperCase();
  const q = useSearchQuery();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate({ to: resolveRoute(q) });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <form
        onSubmit={submit}
        className="relative hidden flex-1 max-w-md md:block"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students, buses, routes… (press Enter)"
          className="pl-9"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <NotificationsDropdown role={session.role} />
        <div className="flex items-center gap-2 rounded-full bg-muted/50 py-1 pl-1 pr-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-medium leading-tight">
              {session.username}
            </p>
            <p className="text-[10px] capitalize text-muted-foreground leading-tight">
              {session.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
