import { createClient } from '@supabase/supabase-js';

// Projet lavilla-coliving (public-facing: blog, chatbot, prospects)
const SUPABASE_URL = 'https://basgneefkqzuzhzgnvsb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhc2duZWVma3F6dXpoemdudnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzIxNzUsImV4cCI6MjA4NjQwODE3NX0.08era6Mpa7GOWt0CwellvYiWOrxxi-Q-9y_RZHYesmM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
