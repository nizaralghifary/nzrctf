import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { User, Trophy, Database, Code2, ShieldOff, Globe, ChevronRight } from "lucide-react"

const chapterConfig = [
  {
    id: 1,
    slug: "chapter-01",
    title: "SQL Injection",
    description: "Bypass login panels, extract database contents, and exploit poorly sanitized queries.",
    icon: Database,
    color: "text-[#ff3c6e]",
    border: "border-[#ff3c6e]/40",
    glow: "hover:shadow-[0_0_16px_rgba(255,60,110,0.15)]",
  },
  {
    id: 2,
    slug: "chapter-02",
    title: "Cross-Site Scripting",
    description: "Inject malicious scripts, steal cookies, and hijack user sessions.",
    icon: Code2,
    color: "text-[#ffd700]",
    border: "border-[#ffd700]/40",
    glow: "hover:shadow-[0_0_16px_rgba(255,215,0,0.15)]",
  },
  {
    id: 3,
    slug: "chapter-03",
    title: "Broken Access Control",
    description: "Access resources you shouldn't, manipulate object references, and escalate privileges.",
    icon: ShieldOff,
    color: "text-[#00bfff]",
    border: "border-[#00bfff]/40",
    glow: "hover:shadow-[0_0_16px_rgba(0,191,255,0.15)]",
  },
  {
    id: 4,
    slug: "chapter-04",
    title: "SSRF / LFI / XXE",
    description: "Reach internal services, read sensitive files, and exploit XML parsers.",
    icon: Globe,
    color: "text-[#bf5fff]",
    border: "border-[#bf5fff]/40",
    glow: "hover:shadow-[0_0_16px_rgba(191,95,255,0.15)]",
  },
]

export default async function Lab() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, chapter, points")
    .eq("is_active", true)

  const { data: submissions } = await supabase
    .from("submissions")
    .select("challenge_id, is_correct")
    .eq("user_id", user.id)

  const solvedIds = new Set(
    submissions?.filter((s) => s.is_correct).map((s) => s.challenge_id) ?? []
  )

  const totalPoints =
    challenges
      ?.filter((c) => solvedIds.has(c.id))
      .reduce((sum, c) => sum + c.points, 0) ?? 0

  async function logout() {
    "use server"
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    await supabase.auth.signOut()
    const { redirect } = await import("next/navigation")
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/95 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <span className="text-[#00ff88] font-black font-mono text-lg tracking-tight">
          NzrCTF<span className="text-white"> Lab</span>
        </span>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            <User size={12} className="text-[#00ff88]" />
            <span className="text-white">{profile?.username ?? user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00ff88] font-mono text-xs font-bold">
            <Trophy size={12} />
            <span>{totalPoints} pts</span>
          </div>
          <form action={logout}>
            <button className="text-[#555570] hover:text-white font-mono text-xs transition-colors">
              Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-10">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl font-black mb-4">
            {profile?.username ?? "Hacker"}
          </h1>
          <div className="flex flex-wrap gap-3">
            {[
              { val: totalPoints, label: "POINTS", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
              { val: solvedIds.size, label: "SOLVED", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
              { val: challenges?.length ?? 0, label: "TOTAL", color: "text-white", accent: "border-[#1e1e2e]" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                className={`bg-[#11111a] border ${stat.accent} px-5 py-3 text-center`}
              >
                <div className={`${stat.color} font-black font-mono text-xl`}>{stat.val}</div>
                <div className="text-[#555570] font-mono text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
            Chapters
          </p>
          <div className="grid gap-3">
            {chapterConfig.map((chapter) => {
              const chapterChallenges = challenges?.filter((c) => c.chapter === chapter.id) ?? []
              const chapterSolved = chapterChallenges.filter((c) => solvedIds.has(c.id)).length
              const chapterTotal = chapterChallenges.length
              const percentage = chapterTotal > 0 ? Math.round((chapterSolved / chapterTotal) * 100) : 0
              const Icon = chapter.icon

              return (
                <Link
                  key={chapter.id}
                  href={`/challenge/${chapter.slug}`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  }}
                  className={`block bg-[#11111a] border p-5 transition-all ${chapter.border} ${chapter.glow}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                        className={`shrink-0 w-10 h-10 flex items-center justify-center bg-[#0a0a0f] border ${chapter.border}`}
                      >
                        <Icon size={16} className={chapter.color} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-mono text-xs ${chapter.color}`}>
                            {String(chapter.id).padStart(2, "0")}
                          </span>
                          <span className="font-bold text-sm">{chapter.title}</span>
                        </div>
                        <p className="text-[#555570] text-xs font-mono leading-relaxed mb-3">
                          {chapter.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[160px] h-1 bg-[#1e1e2e] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${chapter.color.replace("text-", "bg-")}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={`text-xs font-mono font-bold ${chapter.color}`}>
                            {percentage}%
                          </span>
                          <span className="text-[#555570] text-xs font-mono">
                            {chapterSolved}/{chapterTotal} stages
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`${chapter.color} shrink-0 hidden sm:block`} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
