import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle2, Building2, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface Stat {
  key: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  accent: string; // border + icon tint
}

const STATS: Stat[] = [
  { key: 'active', label: 'Active Requests', hint: 'live monitoring', icon: Activity, accent: 'text-bcp-red bg-red-50 border-red-100' },
  { key: 'fulfilledToday', label: 'Fulfilled Today', hint: 'successful dispatches', icon: CheckCircle2, accent: 'text-green-600 bg-green-50 border-green-100' },
  { key: 'banks', label: 'Registered Banks', hint: 'partner blood banks', icon: Building2, accent: 'text-blue-600 bg-blue-50 border-blue-100' },
  { key: 'critical', label: 'Critical Shortages', hint: 'immediate attention', icon: AlertTriangle, accent: 'text-amber-600 bg-amber-50 border-amber-100' },
];

interface FeedRow {
  id: string;
  request_code: string | null;
  blood_group: string;
  hospital_name: string | null;
  city: string | null;
  status: string;
  created_at: string;
}

const ACTIVE = ['open', 'matching'];
const GROUPS_ORDER = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function statusPill(status: string): { label: string; cls: string } {
  switch (status) {
    case 'matching':
      return { label: 'SEARCHING', cls: 'bg-amber-100 text-amber-700' };
    case 'fulfilled':
      return { label: 'FULFILLED', cls: 'bg-green-100 text-green-700' };
    case 'open':
      return { label: 'PENDING', cls: 'bg-blue-100 text-blue-700' };
    case 'cancelled':
      return { label: 'CANCELLED', cls: 'bg-gray-100 text-gray-500' };
    case 'expired':
      return { label: 'EXPIRED', cls: 'bg-gray-100 text-gray-500' };
    default:
      return { label: status.toUpperCase(), cls: 'bg-gray-100 text-gray-600' };
  }
}

export default function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});
  const [feed, setFeed] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [byGroup, setByGroup] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const countOf = (build: (q: ReturnType<typeof baseReq>) => ReturnType<typeof baseReq>) =>
        build(baseReq()).then(({ count, error }) => (error ? null : count ?? 0));
      function baseReq() {
        return supabase.from('blood_requests').select('*', { count: 'exact', head: true });
      }

      const [activeC, fulfilledC, criticalC, banksRes, feedRes] = await Promise.all([
        countOf((q) => q.in('status', ACTIVE)),
        countOf((q) => q.eq('status', 'fulfilled').gte('fulfilled_at', todayStart.toISOString())),
        countOf((q) => q.eq('urgency', 'critical').in('status', ACTIVE)),
        supabase.from('partners').select('*', { count: 'exact', head: true }).eq('org_type', 'blood_bank'),
        supabase
          .from('blood_requests')
          .select('id, request_code, blood_group, hospital_name, city, status, created_at')
          .order('created_at', { ascending: false })
          .limit(8),
      ]);

      if (!active) return;
      setCounts({
        active: activeC,
        fulfilledToday: fulfilledC,
        critical: criticalC,
        banks: banksRes.error ? null : banksRes.count ?? 0,
      });
      setFeed((feedRes.data as FeedRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.from('donors').select('blood_group').is('deleted_at', null);
      if (!active || !data) return;
      const tally: Record<string, number> = {};
      for (const d of data as { blood_group: string }[]) {
        tally[d.blood_group] = (tally[d.blood_group] ?? 0) + 1;
      }
      setByGroup(tally);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-bcp-dark mb-1">Overview</h1>
      <p className="text-gray-500 mb-8">Here’s what’s happening across the Blood Chain network in Pakistan.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map((s) => (
          <div key={s.key} className={`bg-white rounded-2xl border p-6 ${s.accent.split(' ')[2]}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-bcp-dark tabular-nums">
                  {loading ? '…' : (counts[s.key] ?? '—')}
                </div>
                <div className="text-gray-700 text-sm font-semibold mt-1">{s.label}</div>
                <div className="text-gray-400 text-xs mt-0.5">{s.hint}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.accent.split(' ').slice(0, 2).join(' ')}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-bcp-dark mb-3">Donors by Blood Group</h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-10">
        {GROUPS_ORDER.map((g) => (
          <div key={g} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="text-2xl font-bold text-bcp-red tabular-nums">{byGroup[g] ?? 0}</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">{g}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-bcp-dark">Live Operations Feed</h2>
        <Link to="/admin/requests" className="text-sm font-semibold text-bcp-red hover:underline">View All</Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Entity</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feed.map((r) => {
              const p = statusPill(r.status);
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-bold text-bcp-red mr-2">{r.blood_group}</span>
                    <span className="text-gray-400 text-xs">{r.request_code ?? ''}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.hospital_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.cls}`}>{p.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(r.created_at).toLocaleString()}</td>
                </tr>
              );
            })}
            {!loading && feed.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
