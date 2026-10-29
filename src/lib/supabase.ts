import { createClient } from '@supabase/supabase-js';

// Projet unique la-villa-loyers (D1 — fusion 18/02/2026)
// Toutes les données : loyers, blog, knowledge_base, prospects
export const SUPABASE_URL = 'https://tefpynkdxxfiefpkgitz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnB5bmtkeHhmaWVmcGtnaXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTg5NDksImV4cCI6MjA4NjQ3NDk0OX0.X_Z85w6L4i1IkVevMK73hpFRClCpgh0Gh0WMY9pdDtw';

// Dev seulement (import.meta.env.DEV est faux dans le bundle de production : branche morte) : les Edge Functions
// n'autorisent en CORS que le domaine de production ; en local, on les appelle via le proxy Vite (vite.config.ts).
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;
const devFetch: typeof fetch | undefined = import.meta.env.DEV && typeof window !== 'undefined'
  ? (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      if (url.startsWith(FUNCTIONS_BASE)) return fetch(`${window.location.origin}/functions/v1${url.slice(FUNCTIONS_BASE.length)}`, init);
      return fetch(input, init);
    }
  : undefined;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, devFetch ? { global: { fetch: devFetch } } : undefined);
