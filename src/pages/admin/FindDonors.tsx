import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { geocode, reverseGeocode } from '../../lib/geocode';
import { PageHeader } from '../../components/admin/ui';
import type { BloodGroup, EligibleDonor } from '../../types/database';
import { PK_CITIES } from '../../lib/pkCities';

const GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RADII = [10, 25, 50, 100];

interface DonorLite {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  gender: string | null;
  blood_group: string;
  city: string | null;
}
interface ResultRow {
  donor_id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  gender: string | null;
  blood_group: string;
  city: string | null;
  distance_m: number;
}

function waLink(phone?: string | null): string {
  let d = (phone || '').replace(/\D/g, '');
  if (d.startsWith('0')) d = '92' + d.slice(1);
  return d ? `https://wa.me/${d}` : '#';
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-bcp-red focus:ring-2 focus:ring-bcp-red/30';

export default function AdminFindDonors() {
  const [bg, setBg] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState(25);
  const [gender, setGender] = useState('');
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSearched(true);
    const loc = await geocode(`${city}, Pakistan`);
    if (!loc) {
      setError('Could not locate that place. Try a larger/known city name.');
      setRows([]);
      setBusy(false);
      return;
    }
    const { data, error: rpcErr } = await supabase.rpc('find_eligible_donors', {
      p_blood_group: bg,
      p_lng: loc.lng,
      p_lat: loc.lat,
      p_radius_m: radius * 1000,
      p_limit: 50,
    });
    if (rpcErr) {
      setError(rpcErr.message);
      setRows([]);
      setBusy(false);
      return;
    }
    const elig = (data as EligibleDonor[]) ?? [];
    if (!elig.length) {
      setRows([]);
      setBusy(false);
      return;
    }
    const { data: donors } = await supabase
      .from('donors')
      .select('id, full_name, phone, whatsapp, gender, blood_group, city')
      .in('id', elig.map((d) => d.donor_id));
    const by = Object.fromEntries(((donors as DonorLite[]) ?? []).map((d) => [d.id, d]));
    setRows(
      elig.map((d) => ({
        donor_id: d.donor_id,
        blood_group: d.blood_group,
        distance_m: d.distance_m,
        full_name: by[d.donor_id]?.full_name ?? null,
        phone: by[d.donor_id]?.phone ?? null,
        whatsapp: by[d.donor_id]?.whatsapp ?? null,
        gender: by[d.donor_id]?.gender ?? null,
        city: by[d.donor_id]?.city ?? d.city,
      })),
    );
    setBusy(false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        if (c) setCity(c);
        else setError('Could not detect your city — please type it.');
      },
      () => setError('Location permission denied — please type your city.'),
    );
  }

  const filtered = rows.filter((r) => !gender || r.gender === gender);

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Find Donors" subtitle="Search nearest eligible donors by blood group and location." />

      <form onSubmit={search} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-bcp-dark mb-1.5">Blood group</label>
          <select value={bg} onChange={(e) => setBg(e.target.value as BloodGroup)} className={inputCls}>
            {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-bcp-dark mb-1.5">City / area</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} required list="fd-cities" placeholder="e.g. Peshawar" className={inputCls} />
          <datalist id="fd-cities">{PK_CITIES.map((c) => <option key={c} value={c} />)}</datalist>
          <button type="button" onClick={useMyLocation} className="mt-1 text-xs text-bcp-red font-medium hover:underline">Use my location</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-bcp-dark mb-1.5">Radius</label>
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className={inputCls}>
            {RADII.map((r) => <option key={r} value={r}>{r} km</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-bcp-dark mb-1.5">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit" disabled={busy} className={`sm:col-span-2 lg:col-span-4 ${busy ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-semibold py-2.5 rounded-xl transition-colors`}>
          {busy ? 'Searching…' : 'Search Eligible Donors'}
        </button>
      </form>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
      {filtered.length > 0 && <p className="text-sm text-gray-500 mb-3">{filtered.length} eligible donor(s), nearest first.</p>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">Donor</th>
              <th className="text-left px-4 py-3">Group</th>
              <th className="text-left px-4 py-3">City</th>
              <th className="text-left px-4 py-3">Gender</th>
              <th className="text-left px-4 py-3">Distance</th>
              <th className="text-right px-4 py-3">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((r) => (
              <tr key={r.donor_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-bcp-dark">{r.full_name ?? '—'}<div className="text-xs text-gray-400">{r.phone ?? ''}</div></td>
                <td className="px-4 py-3 font-bold text-bcp-red">{r.blood_group}</td>
                <td className="px-4 py-3 text-gray-600">{r.city ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{r.gender ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500 tabular-nums">{(r.distance_m / 1000).toFixed(1)} km</td>
                <td className="px-4 py-3 text-right">
                  <a href={waLink(r.whatsapp || r.phone)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-600 hover:underline font-semibold">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </td>
              </tr>
            ))}
            {searched && !busy && filtered.length === 0 && !error && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No eligible donors in range. Donors must be verified/active and have a geocoded location.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
