import { supabase } from "@/supabase";
export const getSupabase = async () => {
  let { data: footpath, error } = await supabase
    .from("location-footpath")
    .select("*");
  return footpath;
};
