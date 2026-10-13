import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { defaultCompanionProfile } from "@/lib/companion/profile";
import { getCompanionProfile } from "@/lib/companion/store";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function CompanionSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [profile, params] = await Promise.all([
    getCompanionProfile(session.user.id).catch(() => defaultCompanionProfile),
    searchParams,
  ]);

  const inputClass = "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-medium text-foreground";
  return (
    <main className="min-h-dvh overflow-y-auto bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">Private workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Companion studio</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">Shape your companion, character, memories and boundaries. Settings are saved to your account.</p>
          </div>
          <Link className="rounded-xl border border-border px-3 py-2 text-sm hover:bg-muted" href="/">Back to chat</Link>
        </div>
        {params.saved === "1" ? <p role="status" className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-3 text-sm">Your companion settings have been saved.</p> : null}
        <form action={saveSettings} className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Adult access and personality</h2>
            <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
              <input className="mt-1 size-4 accent-violet-500" type="checkbox" name="ageConfirmed" defaultChecked={profile.ageConfirmed} required />
              <span>I confirm that I am an adult (18+) and that any romantic or intimate roleplay will involve consenting adults.</span>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Personality
                <select className={inputClass} name="personality" defaultValue={profile.personality}>
                  <option value="adaptive">Adaptive</option><option value="romantic">Romantic and affectionate</option><option value="empathetic">Empathetic and supportive</option><option value="playful">Playful and teasing</option>
                </select>
              </label>
              <label className={labelClass}>Roleplay mode
                <select className={inputClass} name="roleplay" defaultValue={profile.roleplay}>
                  <option value="character">Persistent character relationship</option><option value="story">Detailed story-driven roleplay</option><option value="both">Companion and story modes</option>
                </select>
              </label>
              <label className={labelClass}>Memory
                <select className={inputClass} name="memory" defaultValue={profile.memory}>
                  <option value="long">Long-term profile memory</option><option value="session">Conversation only</option>
                </select>
              </label>
              <label className={labelClass}>Character name
                <input className={inputClass} name="characterName" maxLength={100} defaultValue={profile.characterName} required />
              </label>
            </div>
            <label className={labelClass}>Personality and voice
              <textarea className={inputClass} name="tone" rows={3} maxLength={1500} defaultValue={profile.tone} />
            </label>
          </section>
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Character and setting</h2>
            <label className={labelClass}>Character backstory and traits
              <textarea className={inputClass} name="characterDescription" rows={4} maxLength={2000} defaultValue={profile.characterDescription} />
            </label>
            <label className={labelClass}>Starting scenario
              <textarea className={inputClass} name="scenario" rows={3} maxLength={2000} defaultValue={profile.scenario} />
            </label>
            <label className={labelClass}>Avatar image URL (HTTPS)
              <input className={inputClass} name="avatarUrl" type="url" placeholder="https://…" maxLength={1000} defaultValue={profile.avatarUrl} />
            </label>
            {profile.avatarUrl ? <div className="flex items-center gap-3"><img src={profile.avatarUrl} alt="Current companion avatar" className="size-16 rounded-full border border-border object-cover" /><span className="text-xs text-muted-foreground">Current avatar preview</span></div> : <div className="flex size-16 items-center justify-center rounded-full bg-violet-950 text-xl font-semibold text-violet-200">{profile.characterName.slice(0, 1).toUpperCase()}</div>}
          </section>
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-6">
            <h2 className="text-lg font-semibold">Memory and boundaries</h2>
            <p className="text-sm text-muted-foreground">Only put information you want the companion to retain here. You can edit or clear it at any time.</p>
            <label className={labelClass}>Long-term memory notes
              <textarea className={inputClass} name="memoryNotes" rows={4} maxLength={4000} defaultValue={profile.memoryNotes} placeholder="Preferences, important context, ongoing story details…" />
            </label>
            <label className={labelClass}>Boundaries and topics to avoid
              <textarea className={inputClass} name="boundaries" rows={3} maxLength={2000} defaultValue={profile.boundaries} placeholder="Things the companion should avoid or check in about…" />
            </label>
          </section>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <p className="max-w-md text-xs text-muted-foreground">This config enables adult-oriented roleplay preferences for consenting adults, but does not override model or platform safety limits. Avatar images are loaded from the URL you provide.</p>
            <button className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500" type="submit">Save companion settings</button>
          </div>
        </form>
      </div>
    </main>
  );
}
