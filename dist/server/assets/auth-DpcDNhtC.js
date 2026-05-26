import { e as supabase } from "./router-CEqblTjI.js";
const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
const sendOtp = async (phone) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
const verifyOtp = async (phone, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms"
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
const sendEmailOtp = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
const verifyEmailOtp = async (email, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email"
  });
  if (error) {
    return { error: error.message, data: null };
  }
  return { error: null, data };
};
export {
  sendOtp as a,
  signIn as b,
  signUp as c,
  verifyOtp as d,
  sendEmailOtp as s,
  verifyEmailOtp as v
};
