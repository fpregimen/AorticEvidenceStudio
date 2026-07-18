-- Immutable native-text extraction and provenance for PDF-assisted authoring.
-- The private object remains in the existing non-public storage bucket.

create table public.authoring_pdf_pages (
  source_file_id text not null references public.authoring_source_files(source_file_id),
  pdf_page integer not null check (pdf_page > 0),
  extracted_text text not null,
  text_sha256 text not null check (text_sha256 ~ '^[0-9a-f]{64}$'),
  extracted_at timestamptz not null default now(),
  primary key (source_file_id, pdf_page)
);

alter table public.authoring_pdf_pages enable row level security;
create policy "authenticated read extracted PDF pages" on public.authoring_pdf_pages for select to authenticated using (true);
create policy "authenticated insert extracted PDF pages" on public.authoring_pdf_pages for insert to authenticated
  with check (exists (
    select 1 from public.authoring_source_files file
    where file.source_file_id = authoring_pdf_pages.source_file_id and file.created_by = auth.uid()
  ));

grant select, insert on table public.authoring_pdf_pages to authenticated;

alter table public.authoring_evidence_revisions
  add column source_file_id text references public.authoring_source_files(source_file_id),
  add column source_text_sha256 text,
  add column quotation_sha256 text,
  add column authoring_method text not null default 'manual' check (authoring_method in ('manual','ai_suggested')),
  add column quotation_location_verified boolean not null default false,
  add column ai_provider text,
  add column ai_model text,
  add check (source_text_sha256 is null or source_text_sha256 ~ '^[0-9a-f]{64}$'),
  add check (quotation_sha256 is null or quotation_sha256 ~ '^[0-9a-f]{64}$'),
  add check (source_file_id is null or (pdf_page is not null and source_text_sha256 is not null and quotation_sha256 is not null));

