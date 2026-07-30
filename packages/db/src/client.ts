import { createBrowserClient as createBrowser } from '@supabase/ssr';
import { createServerClient as createServer, type CookieOptions } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Add actual Database types when generated
export type Database = any;

export const createBrowserClient = (supabaseUrl: string, supabaseAnonKey: string) => {
  return createBrowser<Database>(supabaseUrl, supabaseAnonKey);
};

export const createServerClient = (
  supabaseUrl: string, 
  supabaseAnonKey: string,
  cookieStore: {
    get(name: string): { name: string; value: string } | undefined;
    set(name: string, value: string, options: CookieOptions): void;
    remove(name: string, options: CookieOptions): void;
  }
) => {
  return createServer<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.remove(name, options);
        } catch (error) {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

export const createAdminClient = (supabaseUrl: string, supabaseServiceRoleKey: string) => {
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
