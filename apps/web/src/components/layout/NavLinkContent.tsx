'use client';
import { useLinkStatus } from 'next/link';
import { Loader2, LucideIcon } from 'lucide-react';

// Must render as a child of next/link's <Link> -- useLinkStatus only works
// there. Shows a spinner in place of the icon while the route transition is
// pending, so a click gives instant visible feedback even if the target
// page takes a moment to compile/fetch (very noticeable in dev mode).
export function NavLinkContent({ icon: Icon, label, isActive, iconClassName }: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  iconClassName?: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      {pending
        ? <Loader2 className={`w-5 h-5 animate-spin shrink-0 ${iconClassName ?? (isActive ? 'text-white' : 'text-slate-400')}`} />
        : <Icon className={`w-5 h-5 shrink-0 ${iconClassName ?? (isActive ? 'text-white' : 'text-slate-400')}`} />}
      {label}
    </>
  );
}
