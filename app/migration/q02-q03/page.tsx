import { MigrationReviewClient } from "@/components/migration-review-client";
import { getMigrationReviewData } from "@/lib/migration-review-store";
export const dynamic = "force-dynamic";
export default async function Page() { const { report, decisionFile } = await getMigrationReviewData(); return <MigrationReviewClient report={report} initialDecisions={decisionFile}/>; }
