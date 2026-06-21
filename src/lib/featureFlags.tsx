import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabaseClient';

type Flags = Record<string, boolean>;
const FeatureContext = createContext<Flags>({});

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Flags>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('feature_flags').select('key, enabled');
      if (!active || !data) return;
      setFlags(Object.fromEntries(data.map((f: { key: string; enabled: boolean }) => [f.key, f.enabled])));
    })();
    return () => {
      active = false;
    };
  }, []);

  return <FeatureContext.Provider value={flags}>{children}</FeatureContext.Provider>;
}

/**
 * Returns whether a feature is enabled. Fail-open: unknown keys (table missing,
 * not loaded yet) default to TRUE so the site never breaks on a flag lookup.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFeature(key: string): boolean {
  const flags = useContext(FeatureContext);
  return flags[key] ?? true;
}
