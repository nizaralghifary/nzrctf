import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Database, Code2, ShieldOff, Globe, ArrowRight } from "lucide-react"
import ProgressBar from "@/components/progress-bar"
import NavbarServer from "@/components/navbar-server"

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const navFont = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

const chapterConfig = [
  {
    id: 1,
    slug: "chapter-01",
    title: "SQL Injection",
    description: "Bypass login panels, extract database contents, and exploit poorly sanitized queries.",
    icon: Database,
    accent: "#ff3c6e",
    bg: "#fff0f3",
  },
  {
    id: 2,
    slug: "chapter-02",
    title: "Cross-Site Scripting",
    description: "Inject malicious scripts, steal cookies, and hijack user sessions.",
    icon: Code2,
    accent: "#e6c200",
    bg: "#fffbe0",
  },
  {
    id: 3,
    slug: "chapter-03",
    title: "Broken Access Control",
    description: "Access resources you shouldn't, manipulate object references, and escalate privileges.",
    icon: ShieldOff,
    accent: "#0066ff",
    bg: "#eef3ff",
  },
  {
    id: 4,
    slug: "chapter-04",
    title: "SSRF / LFI / XXE",
    description: "Reach internal services, read sensitive files, and exploit XML parsers.",
    icon: Globe,
    accent: "#9900cc",
    bg: "#f8eeff",
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

  return (
    <div
      className="min-h-screen bg-[#f4efe4] text-black"
      style={navFont}
    >
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-10">
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6 relative overflow-hidden"
            style={{ clipPath: CUT }}
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-[#00e676] border-r-transparent" />
            <p className="text-xs font-black tracking-widest text-[#888] mb-1" style={{ ...monoFont, fontWeight: 700 }}>
              Welcome back
            </p>
            <h1 className="text-2xl font-black mb-5" style={navFont}>
              {profile?.username ?? "Hacker"}
            </h1>
            <div className="flex flex-wrap gap-3">
              {[
                { val: totalPoints,          label: "Points",     highlight: true  },
                { val: solvedIds.size,        label: "Solved",     highlight: true  },
                { val: challenges?.length ?? 0, label: "Total",   highlight: false },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`px-5 py-3 text-center border-4 border-black ${stat.highlight ? "bg-[#00e676]" : "bg-[#f4efe4]"}`}
                  style={{ clipPath: CUT_BTN }}
                >
                  <div className="font-black text-xl" style={navFont}>{stat.val}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#444] mt-0.5" style={monoFont}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-8 bg-black" />
            <p className="text-xs font-black uppercase tracking-widest text-[#888]" style={monoFont}>
              Chapters
            </p>
          </div>

          <div className="grid gap-4">
            {chapterConfig.map((chapter) => {
              const chapterChallenges = challenges?.filter((c) => c.chapter === chapter.id) ?? []
              const chapterSolved = chapterChallenges.filter((c) => solvedIds.has(c.id)).length
              const chapterTotal = chapterChallenges.length
              const percentage = chapterTotal > 0 ? Math.round((chapterSolved / chapterTotal) * 100) : 0
              const Icon = chapter.icon
              const done = chapterSolved === chapterTotal && chapterTotal > 0

              return (
                <Link
                  key={chapter.id}
                  href={`/challenge/${chapter.slug}`}
                  className="block border-4 border-black p-5 shadow-[6px_6px_0_#111] hover:shadow-[3px_3px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                  style={{ backgroundColor: chapter.bg, clipPath: CUT }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="shrink-0 w-10 h-10 flex items-center justify-center border-4 border-black"
                        style={{ backgroundColor: chapter.accent, clipPath: CUT_SM }}
                      >
                        <Icon size={16} color="#fff" strokeWidth={2.5} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-xs" style={{ ...monoFont, color: chapter.accent }}>
                            {String(chapter.id).padStart(2, "0")}
                          </span>
                          <span className="font-black text-sm uppercase" style={navFont}>
                            {chapter.title}
                          </span>
                          {done && (
                            <span
                              className="text-xs font-black uppercase px-1.5 py-0.5 bg-[#00e676] border-2 border-black text-black"
                              style={{ ...monoFont, clipPath: CUT_BTN }}
                            >
                              Done
                            </span>
                          )}
                        </div>
                        <p className="text-[#555] text-xs leading-relaxed mb-3" style={{ ...monoFont, fontWeight: 700 }}>
                          {chapter.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <ProgressBar value={percentage} color={chapter.accent} />
                          <span className="text-xs font-black" style={{ ...monoFont, color: chapter.accent }}>
                            {percentage}%
                          </span>
                          <span className="text-[#888] text-xs font-black" style={monoFont}>
                            {chapterSolved}/{chapterTotal} stages
                          </span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight size={18} strokeWidth={3} className="shrink-0 hidden sm:block" style={{ color: chapter.accent }} />
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