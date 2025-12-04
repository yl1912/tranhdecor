// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bwugkspryjalzvpuqjhm.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dWdrc3ByeWphbHp2cHVxamhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NTk3NDksImV4cCI6MjA3OTEzNTc0OX0.A3LoVrAivYUQzFsKvuoKTv78iaIkV6n0AvV0Q7VL1y0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
