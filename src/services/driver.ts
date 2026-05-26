import { supabase } from "../lib/supabase";

export const getDrivers = async () => {
  const { data, error } = await supabase.from("drivers").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};
