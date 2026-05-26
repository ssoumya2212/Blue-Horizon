import { supabase } from "../lib/supabase";

export const getAttendance = async () => {
  const { data, error } = await supabase.from("attendance").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};
