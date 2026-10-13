import "server-only";

import postgres from "postgres";
import { defaultCompanionProfile, normalizeCompanionProfile, type CompanionProfile } from "./profile";

const client = postgres(process.env.POSTGRES_URL ?? "", { prepare: false, max: 1 });

export async function getCompanionProfile(userId: string): Promise<CompanionProfile> {
  const rows = await client`
    SELECT "settings" FROM "CompanionProfile" WHERE "userId" = ${userId} LIMIT 1
  `;
  return rows.length ? normalizeCompanionProfile(rows[0].settings) : defaultCompanionProfile;
}

export async function saveCompanionProfile(userId: string, profile: CompanionProfile) {
  const settings = normalizeCompanionProfile(profile);
  await client`
    INSERT INTO "CompanionProfile" ("userId", "settings", "updatedAt")
    VALUES (${userId}, ${client.json(settings)}, NOW())
    ON CONFLICT ("userId") DO UPDATE
    SET "settings" = EXCLUDED."settings", "updatedAt" = NOW()
  `;
  return settings;
}
