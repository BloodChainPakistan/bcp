import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { BloodGroup, DonorStatus } from '../../types/database';
import { StatusBadge, PageHeader } from '../../components/admin/ui';
import { PK_CITIES } from '../../lib/pkCities';

interface DonorRow {
  id: string;
  full_name: string;
  blood_group: BloodGroup;
  phone: string;
  gender: string | null;
  city: string;
  district: string | null;
  status: DonorStatus;
  created_at: string;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES: DonorStatus[] = ['pending', 'verified', 'active', 'inactive'];
const PAGE_SIZE = 25;

export default function AdminDonors() {
  const [rows, setRows] = useState<DonorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [bg, setBg] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from('donors')
      .select('id, full_name, blood_group, phone, gender, city, district, status, created_at', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);
    if (bg) query = query.eq('blood_group', bg);
    if (status) query = query.eq('status', status);
    if (city) query = query.ilike('city', `%${city}%`);
    const safeQ = q.replace(/[,()%*\\]/g, ' ').trim();
    if (safeQ) query = query.or(`full_name.ilike.%${safeQ}%,phone.ilike.%${safeQ}%`);
    const { data, error, count } = await query;
    if (error) setError(error.message);
    setRows((data as DonorRow[]) ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [bg, status, city, q, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch on filter/page change
    load();
  }, [load]);

  function resetTo0<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setPage(0);
    };
  }

  async function setDonorStatus(id: string, next: DonorStatus) {
    const { error } = await supabase.from('donors').update({ status: next }).eq('id', id);
    if (error) setError(error.message);
    else load();
  }
  async function softDelete(id: string) {
    const { error } = await supabase.from('donors').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) setError(error.message);
    else load();
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Donor Registry" subtitle={loading ? 'Loading…' : `${total} donor(s)`} />

      <div className="flex flex-wrap gap-3 mb-6">
        <input value={q} onChange={(e) => resetTo0(setQ)(e.target.value)} placeholder="Search name or phone…" className="px-4 py-2 rounded-xl border border-gray-200 min-w-[200px]" />
        <select value={bg} onChange={(e) => resetTo0(setBg)(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All blood groups</option>
          {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={status} onChange={(e) => resetTo0(setStatus)(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input value={city} onChange={(e) => resetTo0(setCity)(e.target.value)} placeholder="City…" list="pk-cities" className="px-4 py-2 rounded-xl border border-gray-200" />
        <datalist id="pk-cities">
          {PK_CITIES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Group</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Gender</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">District</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-bcp-dark">{d.full_name}</td>
                <td className="px-4 py-3 font-bold text-bcp-red">{d.blood_group}</td>
                <td className="px-4 py-3 text-gray-600">{d.phone}</td>
                <td className="px-4 py-3 text-gray-600">{d.gender ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{d.city}</td>
                <td className="px-4 py-3 text-gray-600">{d.district ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  {d.status !== 'verified' && <button onClick={() => setDonorStatus(d.id, 'verified')} className="text-xs font-semibold text-green-600 hover:underline">Verify</button>}
                  {d.status !== 'active' && <button onClick={() => setDonorStatus(d.id, 'active')} className="text-xs font-semibold text-blue-600 hover:underline">Activate</button>}
                  {d.status !== 'inactive' && <button onClick={() => setDonorStatus(d.id, 'inactive')} className="text-xs font-semibold text-gray-500 hover:underline">Deactivate</button>}
                  <button onClick={() => softDelete(d.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400">No donors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm">
        <span className="text-gray-500">Page {page + 1} of {pages}</span>
        <div className="space-x-2">
          <button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Previous</button>
          <button disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}
