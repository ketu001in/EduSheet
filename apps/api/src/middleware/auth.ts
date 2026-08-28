import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface AuthenticatedRequest extends Request {
  user?: any;
  supabase?: SupabaseClient;
  // The real public.users.role for the authenticated caller -- distinct from
  // `user`, which is the raw Supabase Auth user object and has no role info
  // at all. Populated by requireAuth; undefined until then.
  userRole?: UserRole;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token using admin client
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
    }

    req.user = user;

    // Create a user-scoped Supabase client that respects RLS
    req.supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // The Supabase Auth user has no role -- look it up from public.users so
    // requireRole (and anything else) can gate on the real role. Best-effort:
    // a lookup failure shouldn't break unrelated requests, it just leaves
    // userRole undefined, which requireRole treats as "not authorized".
    const { data: profile } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
    req.userRole = profile?.role;

    next();
  } catch (error) {
    next(error);
  }
};

// Restricts a route to specific roles. Must run AFTER requireAuth (depends
// on req.userRole). Enforced server-side -- hiding a button in the UI is
// not access control, this is what actually stops a student's account from
// calling a teacher/parent-only endpoint directly.
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ success: false, error: 'Forbidden: insufficient role' });
    }
    next();
  };
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      
      if (user) {
        req.user = user;
        req.supabase = createClient(
          process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          }
        );
      }
    }
    next();
  } catch (error) {
    next(); // Don't fail on optional auth
  }
};
