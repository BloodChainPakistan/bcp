import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PageHeader } from '../../components/admin/ui';

interface Settings {
  min_age: number;
  max_age: number;
  cooldown_days: number;
  max_active_requests: number;
  max_requests_per_month: number;
  min_weight_kg: number;
  match_compatible: boolean;
}

const NUM_FIELDS: { key: keyof Settings; label: string }[] = [
  { key: 'min_age', label: 'Minimum age' },
  { key: 'max_age', label: 'Maximum age' },
  { key: 'cooldown_days', label: 'Donation cooldown (days)' },
  { key: 'max_active_requests', label: 'Max active requests / person' },
  { key: 'max_requests_per_month', label: 'Max requests / month' },
  { key: 'min_weight_kg', label: 'Minimum weight (kg)' },
];

export default function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from('eligibility_settings').select('*').eq('id', 1).single();
      if (!active) return;
      if (error) setError(error.message);
      else setS(data as Settings);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    setSaving(true);
    setMsg(null);
    setError(null);
    const { error } = await supabase.from('eligibility_settings').update(s).eq('id', 1);
    setSaving(false);
    if (error) setError(error.message);
    else setMsg('Settings saved.');
  }

  if (!s) return <div className="p-8 text-gray-400">{error ?? 'Loading…'}</div>;

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Eligibility Settings" subtitle="Rules applied when matching donors." />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
      {msg && <div className="p-3 bg-green-50 text-green-700 rounded-xl mb-4">{msg}</div>}
      <form onSubmit={save} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NUM_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
              <input
                type="number"
                value={s[f.key] as number}
                onChange={(e) => setS({ ...s, [f.key]: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none"
              />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={s.match_compatible}
            onChange={(e) => setS({ ...s, match_compatible: e.target.checked })}
            className="w-5 h-5 rounded text-bcp-red focus:ring-bcp-red"
          />
          <span className="text-sm text-gray-700">Match compatible blood groups (not just exact group)</span>
        </label>
        <button
          type="submit"
          disabled={saving}
          className={`${saving ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-bold py-3 px-8 rounded-xl transition-colors`}
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
