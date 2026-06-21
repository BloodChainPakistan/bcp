import { useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useEntityList } from '../../lib/useEntityList';
import { PageHeader, StatusBadge } from '../../components/admin/ui';
import { PK_CITIES } from '../../lib/pkCities';
import {
  waLink,
  donorAlertMessage,
  requesterAlertedMessage,
  requesterFulfilledMessage,
} from '../../lib/messageTemplates';
import type { BloodGroup, EligibleDonor } from '../../types/database';

const MATCH_STATES = ['notified', 'contacted', 'accepted', 'declined', 'donated'] as const;

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const STATUSES = ['open', 'matching', 'fulfilled', 'cancelled', 'expired'];

interface RequestRow {
  id: string;
  request_code: string | null;
  requester_name: string;
  requester_phone: string | null;
  requester_whatsapp: string | null;
  patient_name: string | null;
  blood_group: string;
  units_needed: number;
  urgency: string;
  hospital_name: string | null;
  city: string | null;
  status: string;
  created_at: string;
  lat: number | null;
  lng: number | null;
}

interface Contact {
  id: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  blood_group: string;
  city: string;
}
interface Match extends Partial<Contact> {
  distance_m: number;
  status?: string; // request_matches.status
}

function severity(urgency: string): { label: string; cls: string } {
  if (urgency === 'critical') return { label: 'CRITICAL', cls: 'bg-red-100 text-red-700' };
  if (urgency === 'urgent') return { label: 'HIGH', cls: 'bg-orange-100 text-orange-700' };
  return { label: 'NORMAL', cls: 'bg-gray-100 text-gray-600' };
}

export default function AdminBloodRequests() {
  const { rows, loading, reload } = useEntityList<RequestRow>(
    'blood_requests',
    'id, request_code, requester_name, requester_phone, requester_whatsapp, patient_name, blood_group, units_needed, urgency, hospital_name, city, status, created_at, lat, lng',
  );

  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Record<string, Match[]>>({});
  const [alerting, setAlerting] = useState<string | null>(null);

  // ── Filters (client-side over the loaded page) ──
  const [bg, setBg] = useState('');
  const [status, setStatus] = useState('');
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (bg && r.blood_group !== bg) return false;
      if (status && r.status !== status) return false;
      if (city && !(r.city ?? '').toLowerCase().includes(city.toLowerCase())) return false;
      if (needle) {
        const hay = `${r.requester_name} ${r.patient_name ?? ''} ${r.request_code ?? ''} ${r.requester_phone ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, bg, status, city, q]);

  const activeRequests = useMemo(
    () => rows.filter((r) => r.status === 'open' || r.status === 'matching'),
    [rows],
  );

  async function fulfill(id: string) {
    const { error: e } = await supabase
      .from('blood_requests')
      .update({ status: 'fulfilled', fulfilled_at: new Date().toISOString() })
      .eq('id', id);
    if (e) setError(e.message);
    else reload();
  }

  /** Record a real donation so the donor's cooldown/eligibility kicks in. */
  async function recordDonation(donorId: string, requestId: string) {
    const today = new Date().toISOString().slice(0, 10);
    await supabase.from('donations').insert({ donor_id: donorId, request_id: requestId, donated_at: today });
    await supabase.from('donors').update({ last_donation_date: today }).eq('id', donorId);
  }

  /** Track a donor's response in the relay ledger (and log a donation if donated). */
  async function setMatchStatus(requestId: string, donorId: string, next: string) {
    const { error: e } = await supabase
      .from('request_matches')
      .update({ status: next, responded_at: new Date().toISOString() })
      .eq('request_id', requestId)
      .eq('donor_id', donorId);
    if (e) {
      setError(e.message);
      return;
    }
    if (next === 'donated') await recordDonation(donorId, requestId);
    setAlerts((a) => ({
      ...a,
      [requestId]: (a[requestId] ?? []).map((m) => (m.id === donorId ? { ...m, status: next } : m)),
    }));
  }

  async function alertDonors(r: RequestRow) {
    if (r.lat == null || r.lng == null) {
      setError(`Request ${r.request_code ?? ''} has no geocoded location to match against.`);
      return;
    }
    setAlerting(r.id);
    setError(null);
    const { data: el } = await supabase.rpc('find_eligible_donors', {
      p_blood_group: r.blood_group,
      p_lng: r.lng,
      p_lat: r.lat,
      p_radius_m: 50000,
      p_limit: 20,
    });
    const elig = (el as EligibleDonor[]) ?? [];
    let matched: Match[] = [];
    if (elig.length) {
      await supabase
        .from('request_matches')
        .upsert(
          elig.map((d) => ({ request_id: r.id, donor_id: d.donor_id, distance_m: d.distance_m })),
          { onConflict: 'request_id,donor_id' },
        );
      const { data } = await supabase
        .from('donors')
        .select('id, full_name, phone, whatsapp, blood_group, city')
        .in('id', elig.map((d) => d.donor_id));
      const by = Object.fromEntries(((data as Contact[]) ?? []).map((c) => [c.id, c]));
      // Pull any existing responses so re-alerting doesn't wipe tracked statuses.
      const { data: rm } = await supabase
        .from('request_matches')
        .select('donor_id, status')
        .eq('request_id', r.id);
      const statusBy = Object.fromEntries(((rm as { donor_id: string; status: string }[]) ?? []).map((x) => [x.donor_id, x.status]));
      matched = elig.map((d) => ({
        ...(by[d.donor_id] ?? {}),
        distance_m: d.distance_m,
        status: statusBy[d.donor_id] ?? 'notified',
      }));
    }
    await supabase.from('blood_requests').update({ status: 'matching' }).eq('id', r.id).eq('status', 'open');
    setAlerts((a) => ({ ...a, [r.id]: matched }));
    setAlerting(null);
    reload();
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader
        title="Blood Requests"
        subtitle={loading ? 'Loading…' : `${rows.length} request(s) · submitted from the public "Request Blood" form`}
      />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}

      {/* ── Active emergencies: match & fulfill ── */}
      {activeRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-bcp-dark mb-3">Active Emergency Requests ({activeRequests.length})</h2>
          <div className="space-y-3">
            {activeRequests.map((r) => {
              const sev = severity(r.urgency);
              const alertMatches = alerts[r.id];
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-bcp-red">{r.blood_group}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sev.cls}`}>{sev.label}</span>
                        <span className="text-gray-400 text-xs">{r.request_code}</span>
                      </div>
                      <div className="font-medium text-bcp-dark mt-1">{r.patient_name || r.requester_name}</div>
                      <div className="text-gray-500 text-sm">
                        {r.hospital_name} · {r.city} · {r.units_needed} unit(s) · {r.status}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={waLink(
                          r.requester_whatsapp || r.requester_phone,
                          alertMatches?.length ? requesterAlertedMessage(r, alertMatches.length) : undefined,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-green-600 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" /> Message Requester
                      </a>
                      <button
                        onClick={() => alertDonors(r)}
                        disabled={alerting === r.id}
                        className="text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        {alerting === r.id ? 'Alerting…' : 'Alert Donors'}
                      </button>
                      <button
                        onClick={() => fulfill(r.id)}
                        className="text-xs font-semibold px-3 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        Fulfill
                      </button>
                    </div>
                  </div>
                  {alertMatches && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-500 mb-2">{alertMatches.length} eligible donor(s) nearby</p>
                      <div className="space-y-1">
                        {alertMatches.map((m) => (
                          <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            <span>
                              <span className="font-bold text-bcp-red mr-2">{m.blood_group}</span>
                              {m.full_name}
                              <span className="text-gray-400"> · {m.city} · {(m.distance_m / 1000).toFixed(1)} km</span>
                              {m.status && m.status !== 'notified' && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 uppercase">{m.status}</span>
                              )}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <a href={waLink(m.whatsapp || m.phone, donorAlertMessage(r, m.full_name))} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:underline font-semibold">
                                <MessageCircle className="w-4 h-4" /> WhatsApp
                              </a>
                              <select
                                value={m.status ?? 'notified'}
                                onChange={(e) => m.id && setMatchStatus(r.id, m.id, e.target.value)}
                                className="text-xs rounded-lg border border-gray-200 px-1.5 py-1 bg-white capitalize"
                                title="Donor response"
                              >
                                {MATCH_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                        ))}
                        {alertMatches.length === 0 && <p className="text-gray-400 text-sm">No eligible donors found nearby.</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search requester, patient, code…" className="px-4 py-2 rounded-xl border border-gray-200 min-w-[220px]" />
        <select value={bg} onChange={(e) => setBg(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All blood groups</option>
          {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City…" list="req-cities" className="px-4 py-2 rounded-xl border border-gray-200" />
        <datalist id="req-cities">
          {PK_CITIES.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>

      {/* ── All requests table (mirrors the Donor registry) ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Code</th>
              <th className="text-left px-4 py-3">Group</th>
              <th className="text-left px-4 py-3">Requester</th>
              <th className="text-left px-4 py-3">Patient</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Hospital</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Units</th>
              <th className="text-left px-4 py-3">Urgency</th>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => {
              const sev = severity(r.urgency);
              const isActive = r.status === 'open' || r.status === 'matching';
              return (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.request_code ?? '—'}</td>
                  <td className="px-4 py-3 font-bold text-bcp-red">{r.blood_group}</td>
                  <td className="px-4 py-3 font-medium text-bcp-dark">{r.requester_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.patient_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {r.requester_phone ? (
                      <a href={waLink(r.requester_whatsapp || r.requester_phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" /> {r.requester_phone}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.hospital_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.city ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{r.units_needed}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sev.cls}`}>{sev.label}</span></td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                    {isActive ? (
                      <>
                        <button onClick={() => alertDonors(r)} disabled={alerting === r.id} className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50">
                          {alerting === r.id ? 'Alerting…' : 'Alert'}
                        </button>
                        <button onClick={() => fulfill(r.id)} className="text-xs font-semibold text-green-600 hover:underline">Fulfill</button>
                      </>
                    ) : r.status === 'fulfilled' ? (
                      <a href={waLink(r.requester_whatsapp || r.requester_phone, requesterFulfilledMessage(r))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline">
                        <MessageCircle className="w-3.5 h-3.5" /> Notify
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={12} className="px-4 py-12 text-center text-gray-400">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
