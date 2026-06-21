-- Seed starter FAQs (admin can edit/add/remove them at /admin/faq).
-- Idempotent: only inserts a question that isn't already present.

insert into faqs (question, answer, sort_order)
select q, a, o
from (values
  ('Who can donate blood?',
   'Generally, healthy individuals aged 18–60, weighing at least 50 kg, with no major illness can donate. A quick screening at the time of donation confirms eligibility.',
   1),
  ('How often can I donate blood?',
   'A healthy donor can usually give blood once every 3 months (about 90 days). This lets your body fully replenish before the next donation.',
   2),
  ('Is donating blood safe?',
   'Yes. A fresh, sterile, single-use needle and kit are used for every donor, so there is no risk of infection from donating.',
   3),
  ('How do I register as a donor?',
   'Tap “Become a Donor” and fill the short form, or message us on WhatsApp. Once registered, we contact you only when a matching patient nearby needs blood.',
   4),
  ('What should I do before and after donating?',
   'Before: eat a proper meal, drink plenty of water, and get good sleep. After: rest a few minutes, keep hydrated, and avoid heavy exertion for the rest of the day.',
   5),
  ('How will you contact me for an emergency?',
   'When a patient needs your blood group near your city, we reach out by phone or WhatsApp. Donating is always your choice — you can decline any request.',
   6),
  ('Does donating blood cost anything?',
   'No. Blood Chain Pakistan is a voluntary, non-profit network — donating and requesting through us is completely free.',
   7)
) as t(q, a, o)
where not exists (select 1 from faqs f where f.question = t.q);
