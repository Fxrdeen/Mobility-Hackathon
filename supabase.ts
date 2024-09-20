import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://zzewknbjgdixejqxyhph.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXdrbmJqZ2RpeGVqcXh5aHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NTMzNTgsImV4cCI6MjA0MjQyOTM1OH0.xIkLtWdCNq7qgCusPJvJsHCDINRgZzcGjGCnwBaxcw4";
export const supabase = createClient(supabaseUrl, supabaseKey);
