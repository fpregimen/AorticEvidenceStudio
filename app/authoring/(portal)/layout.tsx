import{redirect}from"next/navigation";
import{authoringSetup}from"@/lib/authoring/config";
import{requireAuthoringUser}from"@/lib/authoring/supabase-server";
export const dynamic="force-dynamic";
export default async function Layout({children}:{children:React.ReactNode}){if(!authoringSetup().configured)redirect("/authoring/login?setup=required");try{await requireAuthoringUser()}catch{redirect("/authoring/login")}return children}
