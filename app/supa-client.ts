import { createClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

const clientUrl = process.env.SUPABASE_URL!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

const client = createClient<Database>(clientUrl, anonKey);

export default client;
