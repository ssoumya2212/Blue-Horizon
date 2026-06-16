import { GraduationCap } from "lucide-react";

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const text = variant === "light" ? "text-white" : "text-primary";
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow shadow-md">
        <GraduationCap className="h-5 w-5 text-white" />
      </div>
      <span className={`text-lg font-bold tracking-tight ${text}`}>
        BLUE HORIZON
      </span>
    </div>
  );
}
