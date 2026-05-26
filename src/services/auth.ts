import { supabase } from "@/lib/supabase";

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
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error.message);
  }
};

// CURRENT USER
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();

  return data.user;
};

// SEND OTP
export const sendOtp = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};

// VERIFY OTP (PHONE)
export const verifyOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
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
