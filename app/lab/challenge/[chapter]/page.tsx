import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import SubmitForm from "./submit-form"
import ProgressBar from "@/components/progress-bar"
import NavbarServer from "@/components/navbar-server"
import { CheckCircle, ExternalLink, Database, Code2, ShieldOff, Globe, ArrowLeft, Lock } from "lucide-react"

const chapterConfig: Record<string, { id: number; title: string; icon: React.ElementType; tag: string }> = {
  "chapter-01": { id: 1, title: "SQL Injection",        icon: Database,  tag: "sqli" },
  "chapter-02": { id: 2, title: "Cross-Site Scripting",  icon: Code2,     tag: "xss"  },
  "chapter-03": { id: 3, title: "Broken Access Control", icon: ShieldOff, tag: "bac"  },
  "chapter-04": { id: 4, title: "SSRF / LFI / XXE",      icon: Globe,     tag: "ssrf" },
}

const diffColor: Record<string, string> = {
  easy:   "#b8f5a0",
  medium: "#ffe87a",
  hard:   "#ffb3b3",
}

export default async function Chapter({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: chapterSlug } = await params
  const config = chapterConfig[chapterSlug]
  if (!config) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, title, description, difficulty, points, url, chapter, stage_order, is_active")
    .eq("is_active", true)
    .eq("chapter", config.id)
    .order("stage_order", { ascending: true })

  const { data: submissions } = await supabase
    .from("submissions")
    .select("challenge_id, is_correct")
    .eq("user_id", user.id)

  const solvedIds = new Set(
    submissions?.filter((s) => s.is_correct).map((s) => s.challenge_id) ?? []
  )

  const chapterSolved = challenges?.filter((c) => solvedIds.has(c.id)).length ?? 0
  const chapterTotal  = challenges?.length ?? 0
  const percentage    = chapterTotal > 0 ? Math.round((chapterSolved / chapterTotal) * 100) : 0
  const Icon          = config.icon

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <Link
          href="/lab"
          className="inline-flex items-center gap-1.5 font-mono text-xs border-[3px] border-[#111] bg-[#f0ebe0] px-3 py-1.5 mb-6 shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <ArrowLeft size={11} strokeWidth={2.5} /> Back to Lab
        </Link>

        <div className="nb-card bg-white p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="shrink-0 w-12 h-12 bg-[#111] flex items-center justify-center">
              <Icon size={20} color="#f0ebe0" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-mono text-xs text-[#888]">[{config.tag}] · chapter {String(config.id).padStart(2, "0")}</span>
              <h1 className="text-2xl mb-3" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                {config.title}
              </h1>
              <div className="flex items-center gap-3">
                <ProgressBar value={percentage} color="#111" />
                <span className="font-mono text-xs text-[#888]">{chapterSolved}/{chapterTotal} stages</span>
                <span className="font-mono text-xs text-[#aaa]">{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-[#111]" />
          <p className="font-mono text-xs text-[#888] uppercase tracking-widest">Stages</p>
        </div>

        <div className="grid gap-4">
          {challenges?.map((challenge, idx) => {
            const solved     = solvedIds.has(challenge.id)
            const prevChallenge = idx > 0 ? challenges[idx - 1] : null
            const isLocked   = prevChallenge !== null && !solvedIds.has(prevChallenge.id)

            return (
              <div
                key={challenge.id}
                className={`border-[3px] border-[#111] p-5 transition-all ${
                  isLocked
                    ? "bg-[#e8e2d8] opacity-60"
                    : solved
                    ? "bg-white"
                    : "bg-white shadow-[5px_5px_0_#111]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center border-[3px] border-[#111]"
                    style={{ background: isLocked ? "#ccc" : solved ? "#b8f5a0" : "#f0ebe0" }}
                  >
                    {isLocked ? (
                      <Lock size={14} color="#888" strokeWidth={2} />
                    ) : solved ? (
                      <CheckCircle size={14} color="#111" strokeWidth={2} />
                    ) : (
                      <span className="font-mono text-xs font-medium text-[#888]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-sm ${isLocked ? "text-[#aaa]" : "text-[#111]"}`}
                        style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                      >
                        {challenge.title}
                      </span>
                      {solved && (
                        <span className="nb-tag" style={{ background: "#b8f5a0" }}>solved ✓</span>
                      )}
                    </div>

                    <p className={`font-mono text-xs leading-relaxed mb-3 ${isLocked ? "text-[#bbb]" : "text-[#666]"}`}>
                      {isLocked ? "Complete the previous stage to unlock this one." : challenge.description}
                    </p>

                    {!isLocked && (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {challenge.difficulty && (
                            <span
                              className="nb-tag"
                              style={{ background: diffColor[challenge.difficulty] ?? "#f0ebe0" }}
                            >
                              {challenge.difficulty}
                            </span>
                          )}

                          <span className="nb-tag" style={{ background: "#ffe87a" }}>
                            {challenge.points} pts
                          </span>

                          <a
                            href={challenge.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs border-[2px] border-[#111] bg-[#f0ebe0] px-3 py-1 shadow-[2px_2px_0_#111] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                          >
                            Open Web <ExternalLink size={10} strokeWidth={2.5} />
                          </a>
                        </div>

                        {!solved && (
                          <SubmitForm challengeId={challenge.id} chapterSlug={chapterSlug} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}