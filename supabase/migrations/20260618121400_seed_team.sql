-- Seed the current Board of Governance + Core Cabinet into team_members so they
-- become manageable in the admin (edit/delete/reorder). Photos stay bundled in
-- the app and are matched by name on the public site, so photo_url is left null.
-- Idempotent: a name already present is skipped.

insert into team_members (name, role, group_name, sort_order, is_current, is_published)
select n, r, g, o, true, true
from (values
  -- Board of Governance
  ('Dr Luqman Hakim',         'Founder',    'bog', 1),
  ('Engr Rehan Khan',         'Co Founder', 'bog', 2),
  ('Afaq Karim',              'Member',     'bog', 3),
  ('Engr Kamran Khan',        'Member',     'bog', 4),
  ('Ibadullah Jan',           'Member',     'bog', 5),
  ('Muhamad Waqas Bloodwala', 'Member',     'bog', 6),
  ('Saeed Anwar',             'Member',     'bog', 7),
  ('Usman Ali',               'Member',     'bog', 8),
  ('Sajjad Saeed',            'Member',     'bog', 9),
  -- Core Cabinet
  ('Sana Ur Rehman',  'Country Governor',                                       'core_cabinet', 1),
  ('Qandeel Saleem',  'Secretary General',                                      'core_cabinet', 2),
  ('Arsal Imran',     'Director Media and Communication',                       'core_cabinet', 3),
  ('Saif Ullah',      'Assistant Director Media and Communication',             'core_cabinet', 4),
  ('Arshia Amraiz',   'Director Communications and Liaisons',                   'core_cabinet', 5),
  ('Ayesha Javaid',   'Director Donor Database and Volunteer Management',       'core_cabinet', 6),
  ('Harnain Ayub',    'Assistant Director Donor Database and Volunteer Management', 'core_cabinet', 7),
  ('Masood Khan',     'Director Training and Development',                      'core_cabinet', 8),
  ('Jehan Badshah',   'Director Thalassemia Prevention',                        'core_cabinet', 9)
) as t(n, r, g, o)
where not exists (select 1 from team_members m where m.name = t.n);
