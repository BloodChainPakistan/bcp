import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useEntityList, updateRow } from '../../lib/useEntityList';
import { PageHeader, MigrationNotice, isMissingTable } from '../../components/admin/ui';

interface Faq {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  created_at: string;
}

export default function AdminFaq() {
  const { rows, error, reload, setError } = useEntityList<Faq>(
    'faqs',
    'id, question, answer, is_published, created_at',
  );
  const [form, setForm] = useState({ question: '', answer: '' });
  const [busy, setBusy] = useState(false);

  if (isMissingTable(error)) return <MigrationNotice />;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from('faqs').insert(form);
    setBusy(false);
    if (error) setError(error.message);
    else {
      setForm({ question: '', answer: '' });
      reload();
    }
  }

  async function togglePublish(f: Faq) {
    const e = await updateRow('faqs', f.id, { is_published: !f.is_published });
    if (e) setError(e);
    else reload();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) setError(error.message);
    else reload();
  }

  return (
    <div className="p-4 sm:p-8">
      <PageHeader title="FAQ" subtitle="Frequently asked questions shown on the site." />
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}

      <form onSubmit={add} className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 space-y-4">
        <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-bcp-red" />
        <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Answer" required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-bcp-red resize-none" />
        <button type="submit" disabled={busy} className={`${busy ? 'bg-gray-400' : 'bg-bcp-red hover:bg-red-700'} text-white font-semibold py-2.5 px-6 rounded-xl transition-colors`}>
          {busy ? 'Adding…' : 'Add FAQ'}
        </button>
      </form>

      <div className="space-y-3">
        {rows.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-bcp-dark">{f.question}</p>
                <p className="text-sm text-gray-600 mt-1">{f.answer}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => togglePublish(f)} className={`text-xs font-semibold ${f.is_published ? 'text-green-600' : 'text-gray-400'} hover:underline`}>
                  {f.is_published ? 'Published' : 'Hidden'}
                </button>
                <button onClick={() => remove(f.id)} className="text-gray-400 hover:text-bcp-red" aria-label="Remove FAQ">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-center text-gray-400 py-12">No FAQs yet.</p>}
      </div>
    </div>
  );
}
