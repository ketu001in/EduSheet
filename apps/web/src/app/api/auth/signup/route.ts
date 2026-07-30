import { NextResponse } from 'next/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabaseAdmin = createServiceClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, board, grade } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // 1. Admin create user (service role, no session involved).
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: role || 'student',
        board: board || 'CBSE',
        grade: grade || '1',
      },
    });

    if (adminError) {
      console.error('Supabase admin createUser error:', adminError);
      return NextResponse.json({ error: adminError.message || 'Failed to create user account.' }, { status: 400 });
    }

    const newUserId = adminData.user.id;

    // 2. Direct sync into public.users and public.user_profiles.
    try {
      await supabaseAdmin.from('users').upsert({
        id: newUserId,
        email,
        full_name: name,
        role: role || 'student',
      });

      await supabaseAdmin.from('user_profiles').upsert({
        user_id: newUserId,
      });
    } catch (dbErr) {
      console.warn('Direct user record sync warning:', dbErr);
    }

    // 3. Sign in via the SSR-aware client so the session cookie is actually set on the response.
    const supabase = await createServerSupabaseClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json({
        success: true,
        user: adminData.user,
        message: 'Account created! Please sign in.',
      });
    }

    return NextResponse.json({
      success: true,
      user: signInData.user,
      session: signInData.session,
      message: 'Registration successful!',
    });
  } catch (err: any) {
    console.error('Server signup error:', err);
    return NextResponse.json({ error: err?.message || 'Server error during registration.' }, { status: 500 });
  }
}
