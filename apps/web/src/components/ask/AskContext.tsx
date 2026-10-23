'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';

// Lets any page tell "Ask AI" what the user is looking at in more detail
// than its visible text conveys -- e.g. the Anatomy Explorer reports which
// model, view, and part are selected. Pages that don't call usePageAskDetails
// still get answered from their help-registry entry plus visible text.
interface AskContextValue {
  details: string | null;
  setDetails: (owner: symbol, details: string | null) => void;
}

const AskContext = createContext<AskContextValue | null>(null);

export function AskContextProvider({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<{ owner: symbol; details: string } | null>(null);
  const setDetails = useCallback((owner: symbol, details: string | null) => {
    setEntry((cur) => {
      if (details) return cur?.owner === owner && cur.details === details ? cur : { owner, details };
      // Only clear if the caller is still the one that set it -- avoids a
      // page that is unmounting wiping details the next page just set.
      return cur?.owner === owner ? null : cur;
    });
  }, []);
  const value = useMemo(() => ({ details: entry?.details ?? null, setDetails }), [entry, setDetails]);
  return <AskContext.Provider value={value}>{children}</AskContext.Provider>;
}

export function useAskDetails(): string | null {
  return useContext(AskContext)?.details ?? null;
}

export function usePageAskDetails(details: string | null) {
  const ctx = useContext(AskContext);
  const owner = useRef(Symbol('ask-details')).current;
  const setDetails = ctx?.setDetails;
  useEffect(() => {
    setDetails?.(owner, details);
  }, [details, owner, setDetails]);
  useEffect(() => () => setDetails?.(owner, null), [owner, setDetails]);
}
