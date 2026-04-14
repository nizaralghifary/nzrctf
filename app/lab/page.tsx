import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Database, Code2, ShieldOff, Globe, ArrowRight } from "lucide-react"
import ProgressBar from "@/components/progress-bar"
import NavbarServer from "@/components/navbar-server"

const chapterConfig = [
  {
    id: 1,
    slug: "chapter-01",
    title: "SQL Injection",
    description: "Bypass login panels, extract database contents, and exploit poorly sanitized queries.",
    icon: Database,
    tag: "sqli",
  },
  {
    id: 2,
    slug: "chapter-02",
    title: "Cross-Site Scripting",
    description: "Inject malicious scripts, steal cookies, and hijack user sessions.",
    icon: Code2,
    tag: "xss",
  },
  {
    id: 3,
    slug: "chapter-03",
    title: "Broken Access Control",
    description: "Access resources you shouldn't, manipulate object references, and escalate privileges.",
    icon: ShieldOff,
    tag: "bac",
  },
  {
    id: 4,
    slug: "chapter-04",
    title: "SSRF",
    description: "Make the server send requests on your behalf. Hit internal services, bypass firewalls, reach what's supposed to be unreachable.",
    icon: Globe,
    tag: "ssrf",
  },
]

export default async function Lab() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
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
    challenges?.filter((c) => solvedIds.has(c.id)).reduce((sum, c) => sum + c.points, 0) ?? 0

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="nb-card bg-white p-6 mb-10 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{ background: "linear-gradient(135deg, transparent 50%, #ffe87a 50%)" }}
          />
          <p className="font-mono text-xs text-[#888] mb-1">Welcome back</p>
          <h1 className="text-2xl mb-5" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            {profile?.username ?? "Hacker"}
          </h1>

          <div className="flex flex-wrap gap-3">
            {[
              { val: totalPoints, label: "Points", accent: true  },
              { val: solvedIds.size, label: "Solved", accent: true  },
              { val: challenges?.length ?? 0, label: "Total", accent: false }
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-5 py-3 text-center border-[3px] border-[#111]"
                style={{ background: stat.accent ? "#ffe87a" : "#f0ebe0", boxShadow: "3px 3px 0 #111" }}
              >
                <div className="text-xl" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                  {stat.val}
                </div>
                <div className="font-mono text-xs text-[#555] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#111]" />
          <p className="font-mono text-xs text-[#888] uppercase tracking-widest">Chapters</p>
        </div>

        <div className="grid gap-4">
          {chapterConfig.map((chapter) => {
            const Icon = chapter.icon
            const chapterChallenges = challenges?.filter((c) => c.chapter === chapter.id) ?? []
            const chapterSolved = chapterChallenges.filter((c) => solvedIds.has(c.id)).length
            const chapterTotal = chapterChallenges.length
            const percentage = chapterTotal > 0 ? Math.round((chapterSolved / chapterTotal) * 100) : 0
            const done = chapterSolved === chapterTotal && chapterTotal > 0

            return (
              <Link
                key={chapter.id}
                href={`/lab/challenge/${chapter.slug}`}
                className="nb-card-white block p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">

                    <div className="shrink-0 w-10 h-10 bg-[#111] flex items-center justify-center">
                      <Icon size={16} color="#f0ebe0" strokeWidth={2} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs text-[#888]">
                          [{chapter.tag}]
                        </span>
                        <span className="text-sm" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                          {chapter.title}
                        </span>
                        {done && (
                          <span className="nb-tag" style={{ background: "#b8f5a0" }}>done</span>
                        )}
                      </div>

                      <p className="font-mono text-xs text-[#666] leading-relaxed mb-3">
                        {chapter.description}
                      </p>

                      <div className="flex items-center gap-3">
                        <ProgressBar value={percentage} color="#111" />
                        <span className="font-mono text-xs text-[#888]">
                          {chapterSolved}/{chapterTotal}
                        </span>
                        <span className="font-mono text-xs text-[#aaa]">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight size={16} strokeWidth={2} className="shrink-0 hidden sm:block text-[#aaa]" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}