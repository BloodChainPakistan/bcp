import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

/** Generic admin list loader. Returns rows, loading, error, and a reload fn. */
export function useEntityList<T>(table: string, columns: string, limit = 200) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) setError(error.message);
    setRows((data as T[]) ?? []);
    setLoading(false);
  }, [table, columns, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch on mount
    load();
  }, [load]);

  return { rows, loading, error, reload: load, setError };
}

/** Patch a row by id. Returns an error string or null. */
export async function updateRow(
  table: string,
  id: string,
  patch: Record<string, unknown>,
): Promise<string | null> {
  const { error } = await supabase.from(table).update(patch).eq('id', id);
  return error?.message ?? null;
}
