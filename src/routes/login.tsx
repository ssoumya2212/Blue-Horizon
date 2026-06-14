import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getSession, homeFor, type Role } from "@/lib/auth";
import { signIn as supabaseSignIn } from "@/services/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email and Password Required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Email and Password Required")
    .min(6, "Password must contain at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Blue Horizon" },
      { name: "description", content: "Sign in as Parent, Driver or Admin." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [role, setRole] = useState<Role>("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onEmailSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Clear any stuck sessions before attempting a new login
      await supabase.auth.signOut();
      
      const res = await supabaseSignIn(data.email, data.password);
      if (res && res.error) {
        if (res.error.toLowerCase().includes("invalid login credentials")) {
          setError("password", {
            type: "manual",
            message: "Incorrect password",
          });
          toast.error(
            "Incorrect password or email. Does not match the database.",
            { className: "text-destructive border-destructive" },
          );
        } else {
          toast.error(res.error, {
            className: "text-destructive border-destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      const sess = await getSession();
      if (sess && sess.role) {
        if (sess.role !== role) {
          toast.success(
            `Logged in successfully! Redirecting to ${sess.role} dashboard...`,
          );
          navigate({ to: homeFor(sess.role) });
          return;
        }
        toast.success("Login Successful");
        navigate({ to: homeFor(sess.role) });
      } else {
        toast.error("User profile not found in database.", {
          className: "text-destructive border-destructive",
        });
        await supabase.auth.signOut();
      }
    } catch (err) {
      toast.error("Server Error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ background: "var(--gradient-hero)" }}
    >
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/">
          <Logo variant="light" />
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="glass-card w-full max-w-md overflow-hidden p-0 border-0 rounded-2xl">
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)}>
            <TabsList className="grid h-14 w-full grid-cols-3 rounded-none bg-black/10 backdrop-blur-md p-1 gap-1">
              {(["parent", "driver", "admin"] as Role[]).map((r) => (
                <TabsTrigger
                  key={r}
                  value={r}
                  disabled={isLoading}
                  className="h-full rounded-xl capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                >
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-8 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
                <p className="mt-2 text-sm text-muted-foreground capitalize">
                  Welcome back, {role}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onEmailSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.email ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
                    >
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <Input
                        {...register("email")}
                        placeholder="Email address"
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <span className="text-xs text-destructive mt-1 ml-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <div
                      className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.password ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
                    >
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Password"
                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-xs text-destructive mt-1 ml-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </form>
            </div>
          </Tabs>
        </Card>
      </div>

      <p className="pb-6 text-center text-xs text-white/70">
        © 2025 Blue Horizon Public School – All Rights Reserved
      </p>
    </div>
  );
}
