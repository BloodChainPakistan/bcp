import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useEntityList } from '../../lib/useEntityList';
import { PageHeader } from '../../components/admin/ui';

interface AdminEmail {
  email: string;
  created_at: string;
}

export default function AdminManageAdmins() {
  const { rows, error, reload, setError } = useEntityList<AdminEmail>('admin_emails', 'email, created_at');
  const [newEmail, setNewEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from('admin_emails').insert({ email: newEmail.trim().toLowerCase() });
    setBusy(false);
    if (error) setError(error.message);
    else {
      setNewEmail('');
      reload();
    }
  }

  async function remove(email: string) {
    const { error } = await supabase.from('admin_emails').delete().eq('email', email);
    if (error) setError(error.message);
    else reload();
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="Manage Admins" subtitle="Emails listed here become admins automatically on signup." />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
      <form onSubmit={add} className="flex gap-3 mb-6">
        <input
          type="email"
          required
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="admin@example.com"
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-bcp-red outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className={`${busy ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-semibold px-6 rounded-xl transition-colors`}
        >
          Add
        </button>
      </form>
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {rows.map((a) => (
          <div key={a.email} className="flex items-center justify-between px-5 py-4">
            <span className="text-bcp-dark font-medium">{a.email}</span>
            <button
              onClick={() => remove(a.email)}
              className="text-gray-400 hover:text-bcp-red transition-colors"
              aria-label={`Remove ${a.email}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && <p className="px-5 py-8 text-center text-gray-400">No admins listed.</p>}
      </div>
    </div>
  );
}
