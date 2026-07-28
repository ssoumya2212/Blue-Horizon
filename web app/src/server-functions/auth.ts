import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import twilio from "twilio";

// Ensure environment variables are loaded (Vite/TanStack Start context)
// @ts-ignore
const twilioSid = import.meta.env.TWILIO_ACCOUNT_SID || (typeof process !== "undefined" ? process.env.TWILIO_ACCOUNT_SID : undefined);
// @ts-ignore
const twilioToken = import.meta.env.TWILIO_AUTH_TOKEN || (typeof process !== "undefined" ? process.env.TWILIO_AUTH_TOKEN : undefined);
// @ts-ignore
const verifySid = import.meta.env.TWILIO_VERIFY_SERVICE_SID || (typeof process !== "undefined" ? process.env.TWILIO_VERIFY_SERVICE_SID : undefined);

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : "") || "";
// @ts-ignore
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || (typeof process !== "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : "") || "";

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

const otpRateLimits = new Map<string, { count: number; lastSent: number }>();

function checkRateLimit(phone: string) {
  const now = Date.now();
  const limit = otpRateLimits.get(phone);
  if (limit) {
    if (now - limit.lastSent < 60000) {
      throw new Error("Please wait 60 seconds before requesting another OTP.");
    }
    if (limit.count >= 5 && now - limit.lastSent < 3600000) {
      throw new Error("Too many OTP requests. Please try again later.");
    }
    
    if (now - limit.lastSent > 3600000) {
      limit.count = 0;
    }
    
    limit.count += 1;
    limit.lastSent = now;
  } else {
    otpRateLimits.set(phone, { count: 1, lastSent: now });
  }
}

export const sendTwilioOtp = createServerFn({ method: "POST" })
  .inputValidator(z.object({ phone: z.string() }))
  .handler(async ({ data: { phone } }) => {
    try {
      checkRateLimit(phone);
      
      const client = getTwilioClient();
      if (!verifySid)
        throw new Error("Twilio Verify Service SID not configured.");

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
  .inputValidator(z.object({ phone: z.string(), code: z.string() }))
  .handler(async ({ data: { phone, code } }) => {
    try {
      const client = getTwilioClient();
      if (!verifySid)
        throw new Error("Twilio Verify Service SID not configured.");

      const verificationCheck = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: phone, code });

      if (verificationCheck.status === "approved") {
        const supabase = getSupabaseAdmin();

        const { data: users, error: userError } =
          await supabase.auth.admin.listUsers();
        if (userError) throw userError;

        let user = users.users.find((u) => u.phone === phone.replace("+", ""));

        if (!user) {
          const { data: newUser, error: createError } =
            await supabase.auth.admin.createUser({
              phone: phone,
              phone_confirm: true,
            });
          if (createError) throw createError;
          user = newUser.user;
        }

        // Note: Returning temporary passwords plaintext is an insecure workaround
        // used because standard custom auth hooks aren't implemented.
        const tempPassword =
          Math.random().toString(36).slice(-10) +
          Math.random().toString(36).slice(-10);

        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          {
            password: tempPassword,
            phone_confirm: true,
          },
        );

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
