-- Seed matching src/data/local/seed.ts in shape and scale: 8 folders, 14 tags, 520 documents.
-- Idempotent: truncate first so re-running the file is safe.

truncate documents, tags, folders restart identity cascade;

-- Folders -- f-legal nests under f-contracts to exercise the parent_id hierarchy.
insert into folders (id, name, parent_id) values
  ('f-contracts', 'Contracts',       null),
  ('f-invoices',  'Invoices',        null),
  ('f-policies',  'Policies',        null),
  ('f-reports',   'Reports',         null),
  ('f-manuals',   'Manuals',         null),
  ('f-memos',     'Memos',           null),
  ('f-hr',        'Human Resources', null),
  ('f-legal',     'Legal',           'f-contracts');

-- Tags -- ids t-0..t-13 line up with the local seed's index-based ids.
insert into tags (id, name) values
  ('t-0',  'vendor'),
  ('t-1',  'client'),
  ('t-2',  'internal'),
  ('t-3',  'compliance'),
  ('t-4',  'finance'),
  ('t-5',  'onboarding'),
  ('t-6',  'safety'),
  ('t-7',  'q1'),
  ('t-8',  'q2'),
  ('t-9',  'q3'),
  ('t-10', 'q4'),
  ('t-11', 'urgent'),
  ('t-12', 'confidential'),
  ('t-13', 'audit');

-- Documents -- generate_series drives 520 deterministic rows. Prime-modulo indexing spreads
-- subjects, folders, tags, and dates without an RNG so the set is reproducible on every load.
-- Status mix (3/3/11/3 per 20) approximates the local weights (0.15 / 0.15 / 0.55 / 0.15).
insert into documents (id, title, folder_id, tag_ids, status, mime_type, size_bytes, created_at, updated_at)
select
  'doc-' || i,
  subjects[1 + (i * 7) % array_length(subjects, 1)]
    || ' ' || doc_types[1 + (i * 3) % array_length(doc_types, 1)]
    || ' ' || (i + 1),
  folder_ids[1 + (i * 5) % array_length(folder_ids, 1)],
  (
    select array_agg(distinct 't-' || ((i + k * 5) % 14))
    from generate_series(0, i % 3) as k
  ),
  case
    when i % 20 < 3  then 'draft'
    when i % 20 < 6  then 'review'
    when i % 20 < 17 then 'approved'
    else 'archived'
  end,
  mime_types[1 + (i * 11) % array_length(mime_types, 1)],
  10000 + (i * 104729) % 5000000,
  created_at,
  created_at + make_interval(days => (i * 71) % 150)
from
  generate_series(0, 519) as g(i),
  (values (array['Vendor', 'Client', 'Employee', 'Facilities', 'IT', 'Marketing', 'Sales', 'Product', 'Finance', 'Operations'])) as s(subjects),
  (values (array['Contract', 'Invoice', 'Policy', 'Report', 'Manual', 'Memo', 'Agreement', 'Handbook', 'Summary', 'Audit'])) as d(doc_types),
  (values (array['f-contracts', 'f-invoices', 'f-policies', 'f-reports', 'f-manuals', 'f-memos', 'f-hr', 'f-legal'])) as f(folder_ids),
  (values (array['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'])) as m(mime_types),
  lateral (select timestamptz '2023-01-01 00:00:00+00' + make_interval(days => (i * 131) % 400) as created_at) as c;
