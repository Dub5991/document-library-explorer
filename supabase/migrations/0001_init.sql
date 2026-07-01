-- Document Library Explorer schema: folders, tags, documents + read-only-plus-status RLS.
-- Mirrors src/shared/types and the DataSource filter/sort surface.

-- Trigram matching powers the case-insensitive title search (ilike '%term%').
create extension if not exists pg_trgm;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table folders (
  id        text primary key,
  name      text not null,
  parent_id text references folders (id) -- self-reference; null at the hierarchy root
);

create table tags (
  id   text primary key,
  name text not null
);

create table documents (
  id         text primary key,
  title      text not null,
  folder_id  text references folders (id),
  tag_ids    text[] not null default '{}', -- denormalized tag ids; matched with array overlap
  status     text not null
    check (status in ('draft', 'review', 'approved', 'archived')),
  mime_type  text not null,
  size_bytes bigint not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

-- ---------------------------------------------------------------------------
-- Indexes -- every one backs a specific DocumentQuery filter or sort.
-- ---------------------------------------------------------------------------

-- status filter (in (...)) and sort by status.
create index documents_status_idx on documents (status);

-- folder filter (eq) and folder-scoped browsing.
create index documents_folder_id_idx on documents (folder_id);

-- default and explicit sort by updated_at (descending "recently changed" view).
create index documents_updated_at_idx on documents (updated_at);

-- tag filter (overlaps): GIN over the text[] answers "shares any of these tags".
create index documents_tag_ids_idx on documents using gin (tag_ids);

-- title search (ilike '%term%'): only a trigram GIN index can serve a leading-wildcard
-- match; a btree on lower(title) would help prefix search but not the substring case the UI uses.
create index documents_title_trgm_idx on documents using gin (lower(title) gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Row-Level Security -- deny by default, then grant the minimum the app needs.
-- ---------------------------------------------------------------------------

alter table folders enable row level security;
alter table tags enable row level security;
alter table documents enable row level security;

-- Catalog is public read: the explorer lists folders, tags, and documents for anyone.
create policy folders_public_read on folders
  for select using (true);

create policy tags_public_read on tags
  for select using (true);

create policy documents_public_read on documents
  for select using (true);

-- The only write the app performs is a status transition. This UPDATE policy admits the
-- row but the status check constraint plus the app's narrow update payload keep it to
-- status (+ updated_at); no insert or delete policy exists, so those are denied outright.
create policy documents_status_update on documents
  for update using (true) with check (status in ('draft', 'review', 'approved', 'archived'));
