import { supabase } from "../lib/supabase";

export const getTracking = async () => {
  const { data, error } = await supabase.from("tracking").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};
