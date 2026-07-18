import "server-only";
import{redirect}from"next/navigation";
import{authoringSetup}from"./config";
import{requireAuthoringUser}from"./supabase-server";
export async function authorizeAuthoringPage(){if(!authoringSetup().configured)redirect("/authoring/login?setup=required");try{return await requireAuthoringUser()}catch{redirect("/authoring/login")}}
