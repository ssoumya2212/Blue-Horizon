import { supabase } from "../lib/supabase";

export const getBuses = async () => {
  const { data, error } = await supabase.from("buses").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const addBus = async (bus: any) => {
  const { data, error } = await supabase.from("buses").insert([bus]);

  if (error) console.log(error);

  return data;
};
