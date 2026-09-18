import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

import path from 'path';
// Only meaningful for local dev (see app.ts's identical guard for why
// __dirname needs the typeof check -- this file is bundled as ESM for
// Vercel, where __dirname doesn't exist and env vars come from the
// platform instead).
if (typeof __dirname !== 'undefined') {
  dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
