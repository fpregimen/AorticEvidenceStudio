-- Payload-safe direct uploads and extraction status. Existing RLS remains enabled.

alter table public.authoring_source_files
  add column extraction_status text not null default 'pending' check (extraction_status in ('pending','extracting','complete','failed')),
  add column page_count integer not null default 0 check (page_count >= 0),
  add column text_page_count integer not null default 0 check (text_page_count >= 0),
  add column extraction_error text;

update public.authoring_source_files file set
  page_count = summary.page_count,
  text_page_count = summary.text_page_count,
  extraction_status = 'complete'
from (
  select source_file_id, count(*)::integer page_count,
    count(*) filter (where length(extracted_text) > 0)::integer text_page_count
  from public.authoring_pdf_pages group by source_file_id
) summary where summary.source_file_id = file.source_file_id;

create policy "authenticated update own file extraction status" on public.authoring_source_files
  for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

create table public.authoring_upload_sessions (
  upload_id uuid primary key default gen_random_uuid(),
  source_file_id text not null unique check (source_file_id ~ '^SFL_[0-9a-f-]{36}$'),
  source_id text not null references public.authoring_sources(source_id),
  source_version_id text not null references public.authoring_source_versions(source_version_id),
  object_path text not null unique,
  expected_sha256 text not null check (expected_sha256 ~ '^[0-9a-f]{64}$'),
  expected_byte_length bigint not null check (expected_byte_length > 0 and expected_byte_length <= 52428800),
  expected_mime_type text not null check (expected_mime_type = 'application/pdf'),
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  finalized_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.authoring_upload_sessions enable row level security;
create policy "authenticated insert own upload sessions" on public.authoring_upload_sessions
  for insert to authenticated with check (created_by = auth.uid());
create policy "authenticated read own upload sessions" on public.authoring_upload_sessions
  for select to authenticated using (created_by = auth.uid());
create policy "authenticated update own upload sessions" on public.authoring_upload_sessions
  for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());

grant select, insert, update on table public.authoring_upload_sessions to authenticated;

create policy "authenticated delete own extracted pages for retry" on public.authoring_pdf_pages
  for delete to authenticated using (exists (
    select 1 from public.authoring_source_files file
    where file.source_file_id = authoring_pdf_pages.source_file_id and file.created_by = auth.uid()
  ));
grant delete on table public.authoring_pdf_pages to authenticated;

