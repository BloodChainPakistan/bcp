import { Fragment, useMemo, useState } from 'react';
import { MessageCircle, Check, X, PhoneCall } from 'lucide-react';
import { useEntityList, updateRow } from '../../lib/useEntityList';
import { PageHeader } from '../../components/admin/ui';
import { useAuth } from '../../lib/auth';

interface Row {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  city: string;
  engagement_stage: string;
  assigned_to: string | null;
  contacted_at: string | null;
  contacted_by: string | null;
  is_trained: boolean;
  guidance_done: boolean;
  followup_notes: string | null;
  last_followup_at: string | null;
  created_at: string;
}

const COLUMNS =
  'id, full_name, phone, whatsapp, city, engagement_stage, assigned_to, contacted_at, contacted_by, is_trained, guidance_done, followup_notes, last_followup_at, created_at';

/** Onboarding funnel — kept separate from the verify/active `status`. */
const STAGES = [
  { key: 'new', label: 'New', cls: 'bg-red-100 text-red-700', help: 'Needs first contact' },
  { key: 'contacted', label: 'Contacted', cls: 'bg-amber-100 text-amber-700', help: 'Reached out' },
  { key: 'trained', label: 'Trained', cls: 'bg-blue-100 text-blue-700', help: 'Completed training' },
  { key: 'active', label: 'Active', cls: 'bg-green-100 text-green-700', help: 'Onboarded & active' },
  { key: 'dropped', label: 'Dropped', cls: 'bg-gray-100 text-gray-500', help: 'Not continuing' },
] as const;
const stageMeta = (k: string) => STAGES.find((s) => s.key === k) ?? STAGES[0];

function waLink(phone?: string | null): string {
  let d = (phone || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '92' + d.slice(1);
  return d ? `https://wa.me/${d}` : '#';
}
const fmtDate = (s: string | null) => (s ? new Date(s).toLocaleDateString() : '—');

const inputCls = 'w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-bcp-red/30 focus:border-bcp-red';

export default function AdminVolunteers() {
  const { session } = useAuth();
  const actor = session?.user?.email ?? 'admin';
  const { rows, loading, error, reload, setError } = useEntityList<Row>('volunteers', COLUMNS);

  const [q, setQ] = useState('');
  const [stage, setStage] = useState('');
  const [trained, setTrained] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.engagement_stage] = (c[r.engagement_stage] ?? 0) + 1;
    return c;
  }, [rows]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (stage && r.engagement_stage !== stage) return false;
        if (trained === 'yes' && !r.is_trained) return false;
        if (trained === 'no' && r.is_trained) return false;
        if (q) {
          const hay = `${r.full_name} ${r.city} ${r.assigned_to ?? ''} ${r.phone}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [rows, stage, trained, q],
  );

  async function save(id: string, patch: Record<string, unknown>) {
    const e = await updateRow('volunteers', id, { ...patch, last_followup_at: new Date().toISOString() });
    if (e) setError(e);
    else {
      setExpandedId(null);
      reload();
    }
  }

  async function markContacted(r: Row) {
    await save(r.id, {
      engagement_stage: r.engagement_stage === 'new' ? 'contacted' : r.engagement_stage,
      contacted_at: r.contacted_at ?? new Date().toISOString(),
      contacted_by: r.contacted_by ?? actor,
    });
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Volunteer Management"
        subtitle={loading ? 'Loading…' : `${rows.length} volunteer(s) · track follow-up so no one is missed`}
      />

      {/* ── Funnel: counts per stage (click to filter) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {STAGES.map((s) => {
          const active = stage === s.key;
          return (
            <button
              key={s.key}
              onClick={() => setStage(active ? '' : s.key)}
              className={`text-left rounded-2xl border p-4 transition-colors ${
                active ? 'border-bcp-red ring-2 ring-bcp-red/20' : 'border-gray-100 hover:border-gray-200'
              } ${s.key === 'new' && (counts.new ?? 0) > 0 ? 'bg-red-50' : 'bg-white'}`}
            >
              <div className="text-2xl font-bold text-bcp-dark">{counts[s.key] ?? 0}</div>
              <div className="text-sm font-medium text-bcp-dark">{s.label}</div>
              <div className="text-xs text-gray-400">{s.help}</div>
            </button>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, coordinator…" className="px-4 py-2 rounded-xl border border-gray-200 min-w-[220px]" />
        <select value={stage} onChange={(e) => setStage(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select value={trained} onChange={(e) => setTrained(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">Trained: any</option>
          <option value="yes">Trained</option>
          <option value="no">Not trained</option>
        </select>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Stage</th>
              <th className="text-left px-4 py-3">Trained</th>
              <th className="text-left px-4 py-3">Guidance</th>
              <th className="text-left px-4 py-3">Assigned</th>
              <th className="text-left px-4 py-3">Last follow-up</th>
              <th className="text-right px-4 py-3">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => {
              const sm = stageMeta(r.engagement_stage);
              const open = expandedId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-bcp-dark">{r.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={waLink(r.whatsapp || r.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" /> {r.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.city}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sm.cls}`}>{sm.label.toUpperCase()}</span></td>
                    <td className="px-4 py-3">{r.is_trained ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                    <td className="px-4 py-3">{r.guidance_done ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-gray-300" />}</td>
                    <td className="px-4 py-3 text-gray-600">{r.assigned_to || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(r.last_followup_at)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap space-x-3">
                      {r.engagement_stage === 'new' && (
                        <button onClick={() => markContacted(r)} className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline">
                          <PhoneCall className="w-3.5 h-3.5" /> Contacted
                        </button>
                      )}
                      <button onClick={() => setExpandedId(open ? null : r.id)} className="text-xs font-semibold text-bcp-red hover:underline">
                        {open ? 'Close' : 'Manage'}
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr>
                      <td colSpan={9} className="px-4 py-4 bg-gray-50">
                        <ManagePanel row={r} onSave={(patch) => save(r.id, patch)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No volunteers match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Inline editor for one volunteer's follow-up state. */
function ManagePanel({ row, onSave }: { row: Row; onSave: (patch: Record<string, unknown>) => void }) {
  const [stage, setStage] = useState(row.engagement_stage);
  const [assigned, setAssigned] = useState(row.assigned_to ?? '');
  const [isTrained, setIsTrained] = useState(row.is_trained);
  const [guidance, setGuidance] = useState(row.guidance_done);
  const [notes, setNotes] = useState(row.followup_notes ?? '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Stage</label>
        <select value={stage} onChange={(e) => setStage(e.target.value)} className={`${inputCls} bg-white`}>
          {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Assigned coordinator</label>
        <input value={assigned} onChange={(e) => setAssigned(e.target.value)} placeholder="Who owns this follow-up" className={inputCls} />
      </div>
      <div className="flex items-center gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm text-bcp-dark">
          <input type="checkbox" checked={isTrained} onChange={(e) => setIsTrained(e.target.checked)} className="w-4 h-4 rounded text-bcp-red focus:ring-bcp-red" /> Training completed
        </label>
        <label className="flex items-center gap-2 text-sm text-bcp-dark">
          <input type="checkbox" checked={guidance} onChange={(e) => setGuidance(e.target.checked)} className="w-4 h-4 rounded text-bcp-red focus:ring-bcp-red" /> Guidance / orientation done
        </label>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Follow-up notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Call outcome, availability, next step…" className={`${inputCls} resize-none`} />
      </div>
      <div className="md:col-span-2 flex items-center justify-between text-xs text-gray-400">
        <span>{row.contacted_at ? `First contacted ${fmtDate(row.contacted_at)}${row.contacted_by ? ` by ${row.contacted_by}` : ''}` : 'Not contacted yet'}</span>
        <button
          onClick={() => onSave({ engagement_stage: stage, assigned_to: assigned || null, is_trained: isTrained, guidance_done: guidance, followup_notes: notes || null })}
          className="bg-bcp-red hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-xl transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
