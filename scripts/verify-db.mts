/**
 * Smoke test for the live DB security model (run against the remote Supabase).
 * Usage:
 *   VITE_SUPABASE_URL=... VITE_SUPABASE_PUBLISHABLE_KEY=... npx tsx scripts/verify-db.mts
 *
 * Verifies, using the PUBLIC (anon) key:
 *   1. SELECT on donors is blocked by RLS (no PII leakage).
 *   2. INSERT into donors succeeds (public intake policy).
 *   3. find_eligible_donors RPC is callable.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');

const supabase = createClient(url, key);

const sel = await supabase.from('donors').select('id').limit(1);
console.log('1) anon SELECT donors  →', sel.error ? `blocked ✅ (${sel.error.message})` : `rows=${sel.data?.length} (expected 0)`);

const ins = await supabase.from('donors').insert({
  full_name: 'VERIFY TEST — safe to delete',
  blood_group: 'O+',
  phone: '+920000000000',
  city: 'Peshawar',
  consent_accuracy: true,
  consent_voluntary: true,
  consent_contact: true,
});
console.log('2) anon INSERT donor   →', ins.error ? `FAILED ❌ (${ins.error.message})` : 'ok ✅ (row created, status forced to pending)');

const rpc = await supabase.rpc('find_eligible_donors', { p_blood_group: 'O+', p_lng: 71.52, p_lat: 34.01 });
console.log('3) RPC find_eligible   →', rpc.error ? `error ❌ (${rpc.error.message})` : `callable ✅ (rows=${rpc.data?.length})`);
