import { supabase } from "@/lib/supabase";
import { sendTwilioOtp, verifyTwilioOtp } from "@/server-functions/auth";

// SIGN UP
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data };
};

// LOGIN
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data };
};

// LOGOUT
export const signOut = async () => {
  const { error } = await supabase.auth.signOut({ scope: "global" });

  if (error) {
    console.log(error.message);
  }
};

// CURRENT USER
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();

  return data.user;
};

// SEND OTP (Using Twilio)
export const sendOtp = async (phone: string) => {
  const res = await sendTwilioOtp({ data: { phone } });

  if (!res.success) {
    return { error: res.error || "Failed to send OTP", data: null };
  }
  return { error: null, data: res };
};

// VERIFY OTP (Using Twilio)
export const verifyOtp = async (phone: string, token: string) => {
  const res = await verifyTwilioOtp({ data: { phone, code: token } });

  if (!res.success || !res.tempPassword) {
    return { error: res.error || "Invalid OTP code", data: null };
  }

  // Actually sign in the user on the client using the generated password
  const { data, error } = await supabase.auth.signInWithPassword({
    phone: res.phone,
    password: res.tempPassword,
  });

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};

// SEND EMAIL OTP
export const sendEmailOtp = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};

// VERIFY EMAIL OTP
export const verifyEmailOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};

// UPDATE PASSWORD
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return { error: error.message, data: null };
  }

  return { error: null, data };
};
