import { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useEntityList, updateRow } from '../../lib/useEntityList';
import { PageHeader, MigrationNotice, isMissingTable } from '../../components/admin/ui';
import { validateFile, acceptAttr, IMAGE_RULE } from '../../lib/fileValidation';

interface Member {
  id: string;
  name: string;
  role: string | null;
  group_name: string | null;
  photo_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  tenure_start: string | null;
  tenure_end: string | null;
  is_current: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

const EMPTY = {
  name: '', role: '', group_name: 'core_cabinet', bio: '', email: '', phone: '',
  linkedin_url: '', facebook_url: '', twitter_url: '', tenure_start: '', sort_order: 0,
};

const GROUP_LABEL: Record<string, string> = { bog: 'Board of Governance', core_cabinet: 'Core Cabinet' };
const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none transition-colors focus:border-bcp-red focus:ring-2 focus:ring-bcp-red/30';

function Field({ label, required, error, hint, full, children }: {
  label: string; required?: boolean; error?: string | null; hint?: string; full?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2 lg:col-span-3' : ''}>
      <label className="block text-sm font-medium text-bcp-dark mb-1.5">
        {label} {required && <span className="text-bcp-red">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-bcp-red flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</p>}
    </div>
  );
}

export default function AdminTeam() {
  const { rows, error, reload, setError } = useEntityList<Member>(
    'team_members',
    'id, name, role, group_name, photo_url, bio, email, phone, linkedin_url, facebook_url, twitter_url, tenure_start, tenure_end, is_current, sort_order, is_published, created_at',
  );
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isMissingTable(error)) return <MigrationNotice />;

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    if (!f) { setFile(null); setFileErr(null); return; }
    const err = validateFile(f, IMAGE_RULE);
    setFileErr(err);
    setFile(err ? null : f);
  }

  function startAdd() { setForm(EMPTY); setFile(null); setFileErr(null); setEditingId(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditingId(null); setForm(EMPTY); setFile(null); setFileErr(null); }
  function startEdit(m: Member) {
    setForm({
      name: m.name, role: m.role ?? '', group_name: m.group_name ?? 'core_cabinet', bio: m.bio ?? '',
      email: m.email ?? '', phone: m.phone ?? '', linkedin_url: m.linkedin_url ?? '',
      facebook_url: m.facebook_url ?? '', twitter_url: m.twitter_url ?? '',
      tenure_start: m.tenure_start ?? '', sort_order: m.sort_order ?? 0,
    });
    setFile(null); setFileErr(null); setEditingId(m.id); setShowForm(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setBusy(true);
    setError(null);

    let photo_url: string | null = null;
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error: upErr } = await supabase.storage.from('team-photos').upload(path, file);
      if (upErr) { setError(`Photo upload failed: ${upErr.message}`); setBusy(false); return; }
      photo_url = supabase.storage.from('team-photos').getPublicUrl(path).data.publicUrl;
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      role: form.role || null,
      group_name: form.group_name,
      bio: form.bio || null,
      email: form.email || null,
      phone: form.phone || null,
      linkedin_url: form.linkedin_url || null,
      facebook_url: form.facebook_url || null,
      twitter_url: form.twitter_url || null,
      tenure_start: form.tenure_start || null,
      sort_order: Number(form.sort_order) || 0,
    };
    if (photo_url) payload.photo_url = photo_url; // only change the photo when a new one is uploaded

    const { error: e2 } = editingId
      ? await supabase.from('team_members').update(payload).eq('id', editingId)
      : await supabase.from('team_members').insert({ ...payload, photo_url });
    setBusy(false);
    if (e2) setError(e2.message);
    else { closeForm(); reload(); }
  }

  async function endTenure(m: Member) {
    const e = await updateRow('team_members', m.id, {
      is_current: false,
      tenure_end: new Date().toISOString().slice(0, 10),
    });
    if (e) setError(e); else reload();
  }
  async function togglePublish(m: Member) {
    const e = await updateRow('team_members', m.id, { is_published: !m.is_published });
    if (e) setError(e); else reload();
  }
  async function remove(id: string) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) setError(error.message); else reload();
  }

  const current = rows.filter((m) => m.is_current);
  const past = rows.filter((m) => !m.is_current);
  const currentBog = current.filter((m) => m.group_name === 'bog');
  const currentCore = current.filter((m) => m.group_name === 'core_cabinet');
  const currentOther = current.filter((m) => m.group_name !== 'bog' && m.group_name !== 'core_cabinet');

  function group(title: string, list: Member[], emptyText: string) {
    return (
      <>
        <h2 className="font-bold text-bcp-dark mb-3">{title} ({list.length})</h2>
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 mb-8">
          {list.map((m) => memberRow(m, false))}
          {list.length === 0 && <p className="px-5 py-8 text-center text-gray-400">{emptyText}</p>}
        </div>
      </>
    );
  }

  function memberRow(m: Member, isPast: boolean) {
    return (
      <div key={m.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
        {m.photo_url ? (
          <img src={m.photo_url} alt={m.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-bcp-light text-bcp-red flex items-center justify-center font-bold shrink-0">
            {m.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-bcp-dark">{m.name}</p>
          <p className="text-sm text-gray-500">
            {[m.role, GROUP_LABEL[m.group_name ?? ''] ?? m.group_name].filter(Boolean).join(' · ')}
            {isPast && m.tenure_end && <span className="text-gray-400"> · until {m.tenure_end}</span>}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => startEdit(m)} className="text-xs font-semibold text-blue-600 hover:underline">Edit</button>
          {!isPast && (
            <button onClick={() => endTenure(m)} className="text-xs font-semibold text-amber-600 hover:underline">End tenure</button>
          )}
          <button onClick={() => togglePublish(m)} className={`text-xs font-semibold ${m.is_published ? 'text-green-600' : 'text-gray-400'} hover:underline`}>
            {m.is_published ? 'Published' : 'Hidden'}
          </button>
          <button onClick={() => remove(m.id)} className="text-gray-400 hover:text-bcp-red transition-colors" aria-label={`Remove ${m.name}`}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Team" subtitle="Manage Board of Governance & Core Cabinet members." />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-bcp-dark">Members</h2>
        <button type="button" onClick={showForm ? closeForm : startAdd} className="btn btn-primary btn-sm">
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>
      {showForm && (
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <h2 className="sm:col-span-2 lg:col-span-3 font-bold text-bcp-dark">{editingId ? 'Edit member' : 'Add a member'}</h2>

        <Field label="Name" required>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required className={inputCls} />
        </Field>
        <Field label="Role / designation">
          <input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="e.g. President" className={inputCls} />
        </Field>
        <Field label="Group">
          <select value={form.group_name} onChange={(e) => set('group_name', e.target.value)} className={`${inputCls} bg-white`}>
            <option value="bog">Board of Governance</option>
            <option value="core_cabinet">Core Cabinet</option>
          </select>
        </Field>

        <Field label="Tenure start">
          <input type="date" value={form.tenure_start} onChange={(e) => set('tenure_start', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Display order" hint="Lower shows first">
          <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className={inputCls} />
        </Field>
        <Field label="Photo" error={fileErr} hint="JPG, PNG or WebP up to 2 MB">
          <input type="file" accept={acceptAttr(IMAGE_RULE)} onChange={onPick} className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-bcp-red file:text-white file:font-semibold file:cursor-pointer" />
        </Field>

        <Field label="Email"><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} /></Field>
        <Field label="Phone"><input inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></Field>
        <Field label="LinkedIn URL"><input value={form.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} placeholder="https://…" className={inputCls} /></Field>
        <Field label="Facebook URL"><input value={form.facebook_url} onChange={(e) => set('facebook_url', e.target.value)} placeholder="https://…" className={inputCls} /></Field>
        <Field label="Twitter / X URL"><input value={form.twitter_url} onChange={(e) => set('twitter_url', e.target.value)} placeholder="https://…" className={inputCls} /></Field>

        <Field label="Bio" full>
          <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={2} placeholder="Short bio (optional)" className={inputCls} />
        </Field>

        <button disabled={busy} className={`lg:col-span-3 ${busy ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-semibold py-2.5 rounded-xl transition-colors`}>
          {busy ? 'Saving…' : editingId ? 'Save changes' : 'Add Member'}
        </button>
      </form>
      )}

      {group('Board of Governance', currentBog, 'No board members yet.')}
      {group('Core Cabinet', currentCore, 'No cabinet members yet.')}
      {currentOther.length > 0 && group('Other / Ungrouped', currentOther, '')}

      {past.length > 0 && (
        <>
          <h2 className="font-bold text-bcp-dark mb-3">Past members ({past.length})</h2>
          <p className="text-sm text-gray-400 mb-3">Retained as a lifetime record — not shown on the public site.</p>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 opacity-80">
            {past.map((m) => memberRow(m, true))}
          </div>
        </>
      )}
    </div>
  );
}
