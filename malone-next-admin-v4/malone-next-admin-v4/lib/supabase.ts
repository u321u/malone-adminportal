import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabase = Boolean(url && anon);

export function getBrowserSupabase() {
  if (!url || !anon) return null;
  return createClient(url, anon);
}

export function getServerSupabase() {
  if (!url || !service) return null;
  return createClient(url, service, { auth: { persistSession: false } });
}
