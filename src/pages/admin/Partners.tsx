import { useState } from 'react';
import { useEntityList, updateRow } from '../../lib/useEntityList';
import type { DonorStatus, PartnerType } from '../../types/database';
import { StatusBadge, PageHeader } from '../../components/admin/ui';

interface Row {
  id: string;
  org_name: string;
  org_type: PartnerType;
  city: string | null;
  status: DonorStatus;
  created_at: string;
}

const STATUSES: DonorStatus[] = ['pending', 'verified', 'active', 'inactive'];

export default function AdminPartners() {
  const { rows, loading, error, reload, setError } = useEntityList<Row>(
    'partners',
    'id, org_name, org_type, city, status, created_at',
  );
  const [q, setQ] = useState('');
  const [st, setSt] = useState('');
  const filtered = rows.filter(
    (r) =>
      (!q || `${r.org_name} ${r.city ?? ''}`.toLowerCase().includes(q.toLowerCase())) &&
      (!st || r.status === st),
  );

  async function setStatus(id: string, next: DonorStatus) {
    const e = await updateRow('partners', id, { status: next });
    if (e) setError(e);
    else reload();
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Partners" subtitle={loading ? 'Loading…' : `${filtered.length} of ${rows.length}`} />
      <div className="flex flex-wrap gap-3 mb-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search organization or city…" className="px-4 py-2 rounded-xl border border-gray-200 min-w-[220px]" />
        <select value={st} onChange={(e) => setSt(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Organization</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-bcp-dark">{r.org_name}</td>
                <td className="px-4 py-3 text-gray-600">{r.org_type?.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3 text-gray-600">{r.city ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  {r.status !== 'verified' && <button onClick={() => setStatus(r.id, 'verified')} className="text-xs font-semibold text-green-600 hover:underline">Verify</button>}
                  {r.status !== 'active' && <button onClick={() => setStatus(r.id, 'active')} className="text-xs font-semibold text-blue-600 hover:underline">Activate</button>}
                  {r.status !== 'inactive' && <button onClick={() => setStatus(r.id, 'inactive')} className="text-xs font-semibold text-gray-500 hover:underline">Deactivate</button>}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No partners found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
