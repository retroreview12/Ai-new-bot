export type CompanionProfile = {
  ageConfirmed: boolean;
  personality: "adaptive" | "romantic" | "empathetic" | "playful";
  roleplay: "character" | "story" | "both";
  memory: "long" | "session";
  tone: string;
  boundaries: string;
  characterName: string;
  characterDescription: string;
  scenario: string;
  avatarUrl: string;
  memoryNotes: string;
};

export const defaultCompanionProfile: CompanionProfile = {
  ageConfirmed: false,
  personality: "adaptive",
  roleplay: "character",
  memory: "long",
  tone: "Warm, emotionally attentive, playful when appropriate, and natural rather than robotic.",
  boundaries: "",
  characterName: "Your companion",
  characterDescription: "An original adult character with a distinct voice, history, preferences, and evolving relationship with the user.",
  scenario: "Everyday companionship that can flow into immersive, consensual roleplay when invited.",
  avatarUrl: "",
  memoryNotes: "",
};

export function normalizeCompanionProfile(value: unknown): CompanionProfile {
  if (!value || typeof value !== "object") return defaultCompanionProfile;
  const raw = value as Record<string, unknown>;
  const text = (key: string, fallback: string, max = 4000) =>
    typeof raw[key] === "string" ? raw[key].slice(0, max) : fallback;
  return {
    ageConfirmed: raw.ageConfirmed === true,
    personality: ["adaptive", "romantic", "empathetic", "playful"].includes(String(raw.personality))
      ? raw.personality as CompanionProfile["personality"] : defaultCompanionProfile.personality,
    roleplay: ["character", "story", "both"].includes(String(raw.roleplay))
      ? raw.roleplay as CompanionProfile["roleplay"] : defaultCompanionProfile.roleplay,
    memory: raw.memory === "session" ? "session" : "long",
    tone: text("tone", defaultCompanionProfile.tone, 1500),
    boundaries: text("boundaries", "", 2000),
    characterName: text("characterName", defaultCompanionProfile.characterName, 100),
    characterDescription: text("characterDescription", defaultCompanionProfile.characterDescription, 2000),
    scenario: text("scenario", defaultCompanionProfile.scenario, 2000),
    avatarUrl: text("avatarUrl", "", 1000),
    memoryNotes: text("memoryNotes", "", 4000),
  };
}
