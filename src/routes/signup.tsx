import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signIn as setLocalSession, homeFor, type Role } from "@/lib/auth";
import { signUp as supabaseSignUp } from "@/services/auth";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Blue Horizon" },
      { name: "description", content: "Create a Blue Horizon account." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const [role, setRole] = useState<Role>("parent");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const res = await supabaseSignUp(data.email, data.password);

      if (res && res.error) {
        let msg = "Server Error. Please try again.";
        const err = res.error.toLowerCase();
        if (
          err.includes("already registered") ||
          err.includes("already exists")
        ) {
          msg = "User already exists. Please log in.";
        } else if (err.includes("network") || err.includes("fetch")) {
          msg = "Server Error. Please try again.";
        } else {
          msg = res.error;
        }
        toast.error(msg, { className: "text-destructive border-destructive" });
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!", {
        className: "text-success border-success",
      });
      setLocalSession(data.name, role);
      navigate({ to: homeFor(role) });
    } catch (err) {
      toast.error("Server Error. Please try again.", {
        className: "text-destructive border-destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: "var(--gradient-hero)" }}
    >
      <header className="container mx-auto flex items-center justify-between px-4 py-4 relative z-10">
        <Link to="/">
          <Logo variant="light" />
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8 relative z-10">
        <Card className="glass-card w-full max-w-md p-8 shadow-[var(--shadow-elegant)] border-0 rounded-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Create account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Blue Horizon
            </p>
          </div>

          <Tabs
            value={role}
            onValueChange={(v) => setRole(v as Role)}
            className="mt-8"
          >
            <TabsList className="grid h-14 w-full grid-cols-3 rounded-xl bg-black/10 backdrop-blur-md p-1 gap-1">
              {(["parent", "driver", "admin"] as Role[]).map((r) => (
                <TabsTrigger
                  key={r}
                  value={r}
                  disabled={isLoading}
                  className="capitalize h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                >
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.name ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("name")}
                  placeholder="Full name"
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-destructive mt-1 ml-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.email ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
              >
                <Mail className="h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("email")}
                  placeholder="Email address"
                  type="email"
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
                className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.phone ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
              >
                <Phone className="h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("phone")}
                  placeholder="Phone number (optional)"
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <span className="text-xs text-destructive mt-1 ml-1">
                  {errors.phone.message}
                </span>
              )}
            </div>

            <div>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.password ? "border-destructive focus-within:border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}
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

            <Button
              type="submit"
              className="h-12 w-full mt-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
