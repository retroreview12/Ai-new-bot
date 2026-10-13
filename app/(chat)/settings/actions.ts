"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { normalizeCompanionProfile, type CompanionProfile } from "@/lib/companion/profile";
import { saveCompanionProfile } from "@/lib/companion/store";

export async function saveSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const ageConfirmed = formData.get("ageConfirmed") === "on";
  const profile: CompanionProfile = normalizeCompanionProfile({
    ageConfirmed,
    personality: formData.get("personality"),
    roleplay: formData.get("roleplay"),
    memory: formData.get("memory"),
    tone: formData.get("tone"),
    boundaries: formData.get("boundaries"),
    characterName: formData.get("characterName"),
    characterDescription: formData.get("characterDescription"),
    scenario: formData.get("scenario"),
    avatarUrl: formData.get("avatarUrl"),
    memoryNotes: formData.get("memoryNotes"),
  });

  if (!ageConfirmed) {
    throw new Error("Please confirm that you are an adult before enabling adult-oriented companion features.");
  }
  if (profile.avatarUrl && !/^https:\/\//i.test(profile.avatarUrl)) {
    throw new Error("Avatar URL must use HTTPS.");
  }

  await saveCompanionProfile(session.user.id, profile);
  revalidatePath("/settings");
  revalidatePath("/");
  redirect("/settings?saved=1");
}
