import "server-only";
import {createServerClient}from"@supabase/ssr";
import{cookies}from"next/headers";
import{authoringSetup}from"./config";
export async function supabaseServer(){const config=authoringSetup();if(!config.configured)throw new Error("Authoring Portal setup required");const store=await cookies();return createServerClient(config.url,config.anonKey,{cookies:{getAll:()=>store.getAll(),setAll(values){try{values.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}})}
export async function requireAuthoringUser(){const client=await supabaseServer(),{data:{user}}=await client.auth.getUser();if(!user)throw new Error("AUTH_REQUIRED");return{client,user}}
