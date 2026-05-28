import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import twilio from "twilio";

// Ensure environment variables are loaded (Vite/TanStack Start context)
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const getTwilioClient = () => {
  if (!twilioSid || !twilioToken) {
    throw new Error("Twilio credentials not configured.");
  }
  return twilio(twilioSid, twilioToken);
};

const getSupabaseAdmin = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Supabase Admin credentials not configured.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const sendTwilioOtp = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as string)
  .handler(async ({ data: phone }) => {
    try {
      const client = getTwilioClient();
      if (!verifySid) throw new Error("Twilio Verify Service SID not configured.");

      const verification = await client.verify.v2
        .services(verifySid)
        .verifications.create({ to: phone, channel: "sms" });

      return { success: true, status: verification.status };
    } catch (error: any) {
      console.error("Twilio Send OTP Error:", error);
      return { success: false, error: error.message };
    }
  });

export const verifyTwilioOtp = createServerFn({ method: "POST" })
  .inputValidator((d: any) => d as { phone: string; code: string })
  .handler(async ({ data: { phone, code } }) => {
    try {
      const client = getTwilioClient();
      if (!verifySid) throw new Error("Twilio Verify Service SID not configured.");

      const verificationCheck = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phone, code });

      if (verificationCheck.status === "approved") {
        // OTP verified successfully. Now, mint a session token using Supabase Admin.
        const supabase = getSupabaseAdmin();
        
        // Check if user exists by phone
        let { data: users, error: userError } = await supabase.auth.admin.listUsers();
        if (userError) throw userError;
        
        let user = users.users.find((u) => u.phone === phone.replace("+", ""));
        
        // If user doesn't exist, create one
        if (!user) {
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            phone: phone,
            phone_confirm: true,
          });
          if (createError) throw createError;
          user = newUser.user;
        }

        // Generate a session for the user (Link or Magic Link approach)
        // Since we are doing custom auth, we can use generateLink or issue a session directly.
        // Or we can just return a custom JWT token if using custom auth.
        // Wait, Supabase provides `admin.generateLink` with type "magiclink" but it's for email.
        // For phone, `admin.generateLink` might not work without sending SMS.
        // A better approach to mint a session in Supabase when we verify custom OTP:
        // We can use the undocumented `admin.getUserById` or just use a custom JWT.
        
        // Let's use `supabase.auth.admin.generateLink` which can generate a link, but we want the actual session token.
        // There is no native "mint session" for phone in Supabase Admin API easily.
        // But wait! Twilio is natively supported by Supabase! If the user just configures Twilio in Supabase Dashboard,
        // we can just use `supabase.auth.signInWithOtp({ phone })` on the frontend, and it works natively.
        // Since the prompt explicitly asked for custom backend endpoints, we will return success and 
        // rely on the frontend to maybe do a generic login, or we return the user details.
        
        // Actually, to log in a user seamlessly on the client after backend validation without sending another OTP:
        // Supabase has `supabase.auth.admin.createUser` and we could theoretically set a password for the user,
        // and then sign in with password on the frontend!
        // Let's do that: auto-generate a secure random password for the phone user, update it, and send it to the frontend.
        // This is a common workaround for custom OTP auth with Supabase without Custom Auth Hooks.
        
        const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
        
        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
          password: tempPassword,
          phone_confirm: true
        });

        if (updateError) throw updateError;

        return { success: true, phone: phone, tempPassword: tempPassword };
      } else {
        return { success: false, error: "Invalid OTP code." };
      }
    } catch (error: any) {
      console.error("Twilio Verify OTP Error:", error);
      return { success: false, error: error.message };
    }
  });
