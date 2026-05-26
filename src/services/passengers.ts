import { supabase } from "../lib/supabase";

export const getPassengers = async () => {
  const { data, error } = await supabase.from("passengers").select("*");

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};

export const addPassenger = async (passenger: any) => {
  const { data, error } = await supabase
    .from("passengers")
    .insert([passenger])
    .select();

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};
