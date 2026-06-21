import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Faq {
  id: string;
  question: string;
  answer: string;
}

/**
 * Public FAQ accordion. Reads published rows from the `faqs` table (admin-editable
 * at /admin/faq). Renders nothing when there are no published FAQs.
 */
export default function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });
      if (active) setFaqs((data as Faq[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-bcp-red font-bold tracking-widest uppercase mb-3 text-sm">FAQ</p>
        <h2 id="faq-heading" className="text-3xl md:text-4xl font-semibold text-bcp-dark">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => {
          const open = openId === f.id;
          return (
            <div key={f.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-colors hover:border-bcp-red/30">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : f.id)}
                aria-expanded={open}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-bcp-dark">{f.question}</span>
                <ChevronDown className={`w-5 h-5 text-bcp-red shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && <div className="px-5 pb-5 -mt-1 text-gray-600 leading-relaxed">{f.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
