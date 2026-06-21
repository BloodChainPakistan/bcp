import { supabase } from '../../lib/supabaseClient';
import { useEntityList } from '../../lib/useEntityList';
import { PageHeader, MigrationNotice, isMissingTable } from '../../components/admin/ui';

interface Flag {
  key: string;
  label: string;
  enabled: boolean;
}

export default function AdminFeatures() {
  const { rows, error, reload, setError } = useEntityList<Flag>('feature_flags', 'key, label, enabled');

  if (isMissingTable(error)) return <MigrationNotice />;

  async function toggle(f: Flag) {
    const { error } = await supabase.from('feature_flags').update({ enabled: !f.enabled }).eq('key', f.key);
    if (error) setError(error.message);
    else reload();
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Features" subtitle="Turn public-site features on or off. Changes take effect on the visitor's next page load." />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
      <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-xl mb-4">
        Toggling a feature off hides it on the public website (e.g. the WhatsApp button, a registration form, the Blog or Gallery). Reload the public page to see the change.
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {rows.map((f) => (
          <div key={f.key} className="flex items-center justify-between px-5 py-4">
            <span className="text-bcp-dark font-medium">{f.label}</span>
            <button
              onClick={() => toggle(f)}
              role="switch"
              aria-checked={f.enabled}
              aria-label={`Toggle ${f.label}`}
              className={`relative w-12 h-7 rounded-full transition-colors ${f.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${f.enabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="px-5 py-8 text-center text-gray-400">No feature flags.</p>}
      </div>
    </div>
  );
}
