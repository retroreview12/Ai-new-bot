CREATE TABLE IF NOT EXISTS "CompanionProfile" (
  "userId" uuid PRIMARY KEY NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "settings" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

ALTER TABLE "CompanionProfile" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "CompanionProfile" FROM anon, authenticated;
