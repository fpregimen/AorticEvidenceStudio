create extension if not exists pgcrypto;

create table public.authoring_sources (
  source_id text primary key check (source_id ~ '^SRC_[0-9a-f-]{36}$'), title text not null, source_type text not null,
  identifier_type text not null check (identifier_type in ('doi','pmid','official_identifier','url')),
  identifier_value text not null, source_language text not null, lifecycle text not null default 'active' check (lifecycle in ('active','superseded','withdrawn')),
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(identifier_type,identifier_value)
);
create table public.authoring_source_versions (
  source_version_id text primary key check (source_version_id ~ '^SRV_[0-9a-f-]{36}$'), source_id text not null references public.authoring_sources(source_id),
  version_label text not null, created_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table public.authoring_source_files (
  source_file_id text primary key check (source_file_id ~ '^SFL_[0-9a-f-]{36}$'), source_id text not null references public.authoring_sources(source_id),
  source_version_id text not null references public.authoring_source_versions(source_version_id), object_path text not null unique,
  sha256 text not null, byte_length bigint not null check(byte_length>0), created_by uuid not null references auth.users(id), created_at timestamptz not null default now()
);
create table public.authoring_evidence_revisions (
  revision_ref text primary key, evidence_item_id text not null check(evidence_item_id ~ '^EVI_[0-9a-f-]{36}$'), revision_number integer not null check(revision_number>0), predecessor_ref text references public.authoring_evidence_revisions(revision_ref),
  source_id text not null references public.authoring_sources(source_id), source_version_id text not null references public.authoring_source_versions(source_version_id),
  exact_quotation text not null, printed_page text, pdf_page integer check(pdf_page>0), section_or_recommendation text, text_anchor text not null,
  table_location text, figure_location text, interpretation text not null default '', limitation text not null default '',
  authority_type text not null check(authority_type in ('guideline_recommendation','primary_study_result','systematic_review_synthesis','regulatory_statement','ifu_requirement','expert_interpretation')),
  verification_status text not null check(verification_status in ('original_source_verified','underlying_primary_evidence_verified','secondary_citation_only','primary_source_not_yet_verified','unable_to_verify','citation_mismatch','conflicting_interpretation')),
  review_lifecycle text not null default 'pending' check(review_lifecycle in ('draft','pending','needs_correction','approved','excluded')),
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(evidence_item_id,revision_number),
  check(revision_ref = evidence_item_id || '@r' || revision_number::text), check(printed_page is not null or pdf_page is not null), check(section_or_recommendation is not null or length(text_anchor)>0 or table_location is not null or figure_location is not null)
);
create table public.authoring_specialist_reviews (
  review_id text primary key check(review_id ~ '^REV_[0-9a-f-]{36}$'), revision_ref text not null references public.authoring_evidence_revisions(revision_ref), source_id text not null references public.authoring_sources(source_id),
  decision text not null check(decision in ('pending','approved','needs_correction','excluded')), reviewer_name text not null, review_date date not null,
  original_source_confirmed boolean not null default false, reviewer_note text not null default '', created_by uuid not null references auth.users(id), created_at timestamptz not null default now(),
  check(decision <> 'approved' or original_source_confirmed)
);
create table public.authoring_audit_events (
  audit_id uuid primary key default gen_random_uuid(), source_id text references public.authoring_sources(source_id), action text not null, entity_type text not null,
  entity_id text not null, actor_id uuid references auth.users(id), details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

alter table public.authoring_sources enable row level security; alter table public.authoring_source_versions enable row level security;
alter table public.authoring_source_files enable row level security; alter table public.authoring_evidence_revisions enable row level security;
alter table public.authoring_specialist_reviews enable row level security; alter table public.authoring_audit_events enable row level security;
create policy "authenticated read sources" on public.authoring_sources for select to authenticated using(true);
create policy "authenticated insert sources" on public.authoring_sources for insert to authenticated with check(created_by=auth.uid());
create policy "authenticated read versions" on public.authoring_source_versions for select to authenticated using(true);
create policy "authenticated insert versions" on public.authoring_source_versions for insert to authenticated with check(created_by=auth.uid());
create policy "authenticated read file metadata" on public.authoring_source_files for select to authenticated using(true);
create policy "authenticated insert file metadata" on public.authoring_source_files for insert to authenticated with check(created_by=auth.uid());
create policy "authenticated read revisions" on public.authoring_evidence_revisions for select to authenticated using(true);
create policy "authenticated insert revisions" on public.authoring_evidence_revisions for insert to authenticated with check(created_by=auth.uid());
create policy "authenticated read reviews" on public.authoring_specialist_reviews for select to authenticated using(true);
create policy "authenticated insert reviews" on public.authoring_specialist_reviews for insert to authenticated with check(created_by=auth.uid());
create policy "authenticated read audit" on public.authoring_audit_events for select to authenticated using(true);
create policy "authenticated insert audit" on public.authoring_audit_events for insert to authenticated with check(actor_id=auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('aes-private-sources','aes-private-sources',false,52428800,array['application/pdf']) on conflict(id) do update set public=false;
create policy "authenticated upload own private PDFs" on storage.objects for insert to authenticated with check(bucket_id='aes-private-sources' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "authenticated read own private PDFs" on storage.objects for select to authenticated using(bucket_id='aes-private-sources' and (storage.foldername(name))[1]=auth.uid()::text);

-- Synthetic, non-medical seed identity only. It contains no patient or clinical evidence.
insert into public.authoring_sources(source_id,title,source_type,identifier_type,identifier_value,source_language,created_by)
values('SRC_018f22e2-4f00-7a00-8000-000000000101','Synthetic Polymer Durability Report','journal_article','doi','10.0000/synthetic.authoring.001','en',null)
on conflict do nothing;
insert into public.authoring_source_versions(source_version_id,source_id,version_label,created_by)
values('SRV_018f22e2-4f00-7a00-8000-000000000102','SRC_018f22e2-4f00-7a00-8000-000000000101','Synthetic version 1',null)
on conflict do nothing;
