import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { bogFallback, coreFallback, photoByName, type TeamMember } from './teamData';

interface UseTeam {
  bog: TeamMember[] | null;
  core: TeamMember[] | null;
  loading: boolean;
}

/**
 * Single source of truth for the public team sections (About page + home).
 *
 * - Reads `team_members` filtered to **current + published** rows, so a member
 *   whose tenure was ended (`is_current=false`) or who was hidden
 *   (`is_published=false`) immediately disappears from the site.
 * - Trusts the DB even when a group comes back empty — it does NOT fall back to
 *   the hardcoded list per-group (that bug made "hide everyone" revert).
 * - Falls back to the bundled roster ONLY when the DB is unreachable, so the
 *   page is never blank.
 * - Returns `null` until the first response, so callers can render a loading
 *   state instead of flashing the hardcoded list and then swapping it out.
 */
export function useTeam(): UseTeam {
  const [bog, setBog] = useState<TeamMember[] | null>(null);
  const [core, setCore] = useState<TeamMember[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('name, role, photo_url, group_name')
        .eq('is_current', true)
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (!active) return;

      if (error || !data) {
        // DB unreachable → show the bundled roster so the section isn't empty.
        setBog(bogFallback);
        setCore(coreFallback);
        return;
      }

      const pick = (group: string): TeamMember[] =>
        data
          .filter((m) => m.group_name === group)
          .map((m) => ({
            name: m.name as string,
            role: (m.role as string) ?? '',
            img: (m.photo_url as string) || photoByName[m.name as string] || '',
          }));

      setBog(pick('bog'));
      setCore(pick('core_cabinet'));
    })();
    return () => {
      active = false;
    };
  }, []);

  return { bog, core, loading: bog === null || core === null };
}
