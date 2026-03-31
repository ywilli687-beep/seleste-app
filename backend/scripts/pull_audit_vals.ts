import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const latestAudit = await prisma.auditSnapshot.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!latestAudit) {
    console.log("No audits found.");
    return;
  }

  console.log("AI Narrative for " + latestAudit.inputUrl + ":");
  console.log(latestAudit.aiNarrative);
  console.log("\nSignal Snapshot Keys:");
  console.log(Object.keys(latestAudit.signalSnapshot as any));
  console.log("\nSignal Snapshot:");
  console.log(JSON.stringify(latestAudit.signalSnapshot, null, 2));
}

main().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
