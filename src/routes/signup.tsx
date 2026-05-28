import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, Lock, Mail, Phone, Hash, Loader2, ArrowLeft, Bus as BusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { signIn as setLocalSession, homeFor, type Role } from "@/lib/auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    studentRollNo: z.string().min(1, "Student Roll Number is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    studentName: z.string().optional(),
    busId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Create Account — Blue Horizon" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [role, setRole] = useState<Role>("parent");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSignupSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      // 1. Trigger Supabase native signup
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            student_roll_no: data.studentRollNo,
            phone: data.phone,
            role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success("Account created! Please check your email for the OTP.");
      
      // If auto-confirmed (depending on Supabase settings), we still show OTP screen 
      // to fulfill the UI requirement for the user flow.
      setStep("otp");
    } catch (err) {
      toast.error("Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpToken.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = getValues();
      
      // Verify OTP with Supabase
      const { data: verifyData, error } = await supabase.auth.verifyOtp({
        email: data.email,
        token: otpToken,
        type: "signup",
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      // Ensure profile exists or is updated in public.profiles table
      if (verifyData.user) {
        const profileData = {
          id: verifyData.user.id,
          full_name: data.fullName,
          student_name: data.studentName || null,
          student_roll_no: data.studentRollNo,
          email: data.email,
          phone: data.phone,
          role: role,
          bus_id: data.busId || null,
        };

        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(profileData);

        if (profileError) {
          console.error("Profile save error:", profileError);
          // Non-blocking error, user is authenticated
        }
      }

      toast.success("Verification successful!");
      setLocalSession(data.email, role);
      navigate({ to: homeFor(role) });
    } catch (err) {
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: "var(--gradient-hero)" }}>
      <header className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/">
          <Logo variant="light" />
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="glass-card w-full max-w-xl overflow-hidden p-0 border-0 rounded-2xl shadow-[var(--shadow-elegant)]">
          <Tabs value={role} onValueChange={(v) => setRole(v as Role)}>
            <TabsList className="grid h-14 w-full grid-cols-3 rounded-none bg-black/10 backdrop-blur-md p-1 gap-1">
              {(["parent", "driver", "admin"] as Role[]).map((r) => (
                <TabsTrigger
                  key={r}
                  value={r}
                  disabled={isLoading || step === "otp"}
                  className="h-full rounded-xl capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-300"
                >
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-8 space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                <p className="mt-2 text-sm text-muted-foreground capitalize">
                  {step === "form" ? `Register as a ${role}` : "Verify your email"}
                </p>
              </div>

              {step === "form" ? (
                <form onSubmit={handleSubmit(onSignupSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.fullName ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <User className="h-5 w-5 text-muted-foreground" />
                        <Input {...register("fullName")} placeholder="Full Name" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.fullName && <span className="text-xs text-destructive mt-1 ml-1">{errors.fullName.message}</span>}
                    </div>

                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.studentRollNo ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <Hash className="h-5 w-5 text-muted-foreground" />
                        <Input {...register("studentRollNo")} placeholder="Student Roll No." className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.studentRollNo && <span className="text-xs text-destructive mt-1 ml-1">{errors.studentRollNo.message}</span>}
                    </div>

                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.email ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <Input {...register("email")} placeholder="Email Address" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.email && <span className="text-xs text-destructive mt-1 ml-1">{errors.email.message}</span>}
                    </div>

                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.phone ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <Input {...register("phone")} placeholder="Phone Number" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.phone && <span className="text-xs text-destructive mt-1 ml-1">{errors.phone.message}</span>}
                    </div>

                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.password ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <Input type="password" {...register("password")} placeholder="Password" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.password && <span className="text-xs text-destructive mt-1 ml-1">{errors.password.message}</span>}
                    </div>

                    <div>
                      <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 ${errors.confirmPassword ? "border-destructive focus-within:ring-destructive" : "focus-within:border-primary focus-within:ring-primary"}`}>
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <Input type="password" {...register("confirmPassword")} placeholder="Confirm Password" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                      </div>
                      {errors.confirmPassword && <span className="text-xs text-destructive mt-1 ml-1">{errors.confirmPassword.message}</span>}
                    </div>

                    {role === "parent" && (
                      <div className="sm:col-span-2">
                        <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 focus-within:border-primary focus-within:ring-primary`}>
                          <User className="h-5 w-5 text-muted-foreground" />
                          <Input {...register("studentName")} placeholder="Student Name (Optional)" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                        </div>
                      </div>
                    )}
                    
                    {role === "driver" && (
                      <div className="sm:col-span-2">
                        <div className={`flex items-center gap-3 rounded-xl border bg-background/50 px-3 shadow-sm transition-colors focus-within:ring-1 focus-within:border-primary focus-within:ring-primary`}>
                          <BusIcon className="h-5 w-5 text-muted-foreground" />
                          <Input {...register("busId")} placeholder="Assigned Bus ID (Optional)" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" disabled={isLoading} />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" className="h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mt-4" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "CREATE ACCOUNT"}
                  </Button>

                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                      Sign In
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={onVerifyOtp} className="space-y-6 flex flex-col items-center">
                  <p className="text-sm text-muted-foreground text-center">
                    Enter the 6-digit verification code sent to <br />
                    <span className="font-medium text-foreground">{getValues("email")}</span>
                  </p>
                  
                  <InputOTP maxLength={6} value={otpToken} onChange={setOtpToken} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  
                  <div className="w-full space-y-3 mt-4">
                    <Button type="submit" className="h-12 w-full text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all" disabled={isLoading || otpToken.length !== 6}>
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "VERIFY & LOGIN"}
                    </Button>
                    
                    <Button type="button" variant="ghost" size="sm" onClick={() => setStep("form")} disabled={isLoading} className="text-muted-foreground mx-auto block">
                      <ArrowLeft className="mr-2 h-4 w-4 inline" /> Back to details
                    </Button>
                  </div>
                </form>
              )}
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
