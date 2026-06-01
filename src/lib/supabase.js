import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gdthbnguukmppdcschbm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdGhibmd1dWttcHBkY3NjaGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTg2NjUsImV4cCI6MjA5NTgzNDY2NX0.hbJ8taIU8f55XkgW4mrf-0g6fCKvz6kSFm063BKpEH8"
);