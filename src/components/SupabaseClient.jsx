import { createClient } from "@supabase/supabase-js";

// Replace these with your own Supabase URL and public anon key
const supabaseUrl = "https://mkayyxgettwszclpvwim.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYXl5eGdldHR3c3pjbHB2d2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njg0MzQsImV4cCI6MjA1ODE0NDQzNH0.at-WK-WYZXG_bWaRL4BjNd3DAouIRCyb7ufV-XPBq60";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
