"use server";
import{redirect}from"next/navigation";
import{revalidatePath}from"next/cache";
import{authoringSetup}from"./config";
import{supabaseServer}from"./supabase-server";
import{createEvidenceRevision,createSourceRecord,reviewEvidenceRevision,uploadSourcePdf}from"./repository";
export async function loginAction(form:FormData){if(!authoringSetup().configured)redirect("/authoring/login?setup=required");const client=await supabaseServer(),email=String(form.get("email")??""),password=String(form.get("password")??"");const{error}=await client.auth.signInWithPassword({email,password});if(error)redirect(`/authoring/login?error=${encodeURIComponent(error.message)}`);redirect("/authoring")}
export async function logoutAction(){const client=await supabaseServer();await client.auth.signOut();redirect("/authoring/login")}
export async function createSourceAction(form:FormData){const id=await createSourceRecord(form);revalidatePath("/authoring");redirect(`/authoring/sources/${id}`)}
export async function uploadSourcePdfAction(form:FormData){const id=await uploadSourcePdf(form);revalidatePath(`/authoring/sources/${id}`);redirect(`/authoring/sources/${id}`)}
export async function createEvidenceAction(form:FormData){const source=String(form.get("source_id"));await createEvidenceRevision(form);revalidatePath(`/authoring/sources/${source}`);redirect(`/authoring/sources/${source}`)}
export async function correctEvidenceAction(form:FormData){const source=String(form.get("source_id")),predecessor=String(form.get("predecessor_ref"));await createEvidenceRevision(form,predecessor);revalidatePath(`/authoring/sources/${source}`);redirect(`/authoring/sources/${source}`)}
export async function reviewEvidenceAction(form:FormData){const source=String(form.get("source_id"));await reviewEvidenceRevision(form);revalidatePath(`/authoring/sources/${source}`);redirect(`/authoring/sources/${source}`)}
