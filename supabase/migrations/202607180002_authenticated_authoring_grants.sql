-- Record the authenticated-role privileges required by the Authoring Portal.
-- Row-level security policies from the initial portal migration remain the
-- authority for which rows an authenticated user may access.

grant usage on schema public to authenticated;

grant select, insert, update on table
  public.authoring_sources,
  public.authoring_source_versions,
  public.authoring_source_files,
  public.authoring_evidence_revisions
to authenticated;

grant select, insert on table
  public.authoring_specialist_reviews,
  public.authoring_audit_events
to authenticated;
