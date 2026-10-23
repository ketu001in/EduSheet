import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase pauses free-tier projects after ~7 days without database
// activity, and a paused project makes every logged-in page hang until
// Vercel returns a 504. Vercel Cron (see vercel.json) hits this route once
// a day; the query below is a real round-trip to Postgres, which is what
// counts as activity. RLS may return zero rows for the anon key -- that's
// fine, the query still reaches the database.
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const started = Date.now();
  const { error } = await supabase.from('users').select('id', { head: true, count: 'exact' }).limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 503 });
  }
  return NextResponse.json({ ok: true, ms: Date.now() - started });
}
