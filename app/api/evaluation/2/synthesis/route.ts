import{NextResponse}from"next/server";import{updateSynthesis}from"@/lib/synthesis-validation";
export async function POST(request:Request){try{return NextResponse.json(await updateSynthesis(await request.json()))}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Synthesis validation failed."},{status:400})}}
