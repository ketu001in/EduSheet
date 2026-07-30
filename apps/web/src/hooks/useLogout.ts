'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorksheetStore } from '@/store/useWorksheetStore';

export function useLogout() {
  const router = useRouter();
  const clearUser = useAuthStore((s) => s.clearUser);
  const resetSession = useWorksheetStore((s) => s.resetSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
    clearUser();
    resetSession();
    router.push('/login');
    router.refresh();
  };

  return { logout, isLoggingOut };
}
