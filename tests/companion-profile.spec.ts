import { expect, test } from "@playwright/test";
import { buildCompanionInstructions, defaultCompanionProfile, normalizeCompanionProfile } from "../lib/companion/profile";

test("companion preferences are normalized with safe defaults", () => {
  const profile = normalizeCompanionProfile({
    ...defaultCompanionProfile,
    ageConfirmed: true,
    supportStyle: "listen",
    connectionStyle: "balanced",
    checkInPreference: "gentle",
    selfDescription: "I feel most understood when someone listens.",
  });
  expect(profile.supportStyle).toBe("listen");
  expect(profile.connectionStyle).toBe("balanced");
  expect(profile.checkInPreference).toBe("gentle");
  expect(profile.selfDescription).toContain("someone listens");
  expect(normalizeCompanionProfile({ supportStyle: "invalid" }).supportStyle).toBe("adaptive");
});

test("companion instructions respect emotional support, consent and memory choices", () => {
  const profile = normalizeCompanionProfile({
    ...defaultCompanionProfile,
    ageConfirmed: true,
    supportStyle: "reflect",
    connectionStyle: "romantic",
    checkInPreference: "ask",
    memory: "session",
    memoryNotes: "PRIVATE NOTE SHOULD NOT APPEAR",
  });
  const instructions = buildCompanionInstructions(profile);
  expect(instructions).toContain("reflect");
  expect(instructions).toContain("romantic");
  expect(instructions).toContain("ask");
  expect(instructions).not.toContain("PRIVATE NOTE SHOULD NOT APPEAR");
  expect(instructions).toContain("not a substitute for professional care");
});

test("non-adult profile does not enable intimate companion instructions", () => {
  const instructions = buildCompanionInstructions(defaultCompanionProfile);
  expect(instructions).toContain("not enabled");
  expect(instructions).not.toContain("PERSONAL COMPANION CONFIGURATION");
});
