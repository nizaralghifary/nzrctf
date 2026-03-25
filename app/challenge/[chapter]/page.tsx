import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import SubmitForm from "./submit-form"
import ProgressBar from "@/components/progress-bar"
import NavbarServer from "@/components/navbar-server"
import {
  CheckCircle,
  ExternalLink,
  Database,
  Code2,
  ShieldOff,
  Globe,
  ArrowLeft,
  Lock,
} from "lucide-react"

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const navFont = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

const chapterConfig: Record<string, {
  id: number
  title: string
  icon: React.ElementType
  accent: string
  bg: string
}> = {
  "chapter-01": { id: 1, title: "SQL Injection",        icon: Database,  accent: "#ff3c6e", bg: "#fff0f3" },
  "chapter-02": { id: 2, title: "Cross-Site Scripting",  icon: Code2,     accent: "#e6c200", bg: "#fffbe0" },
  "chapter-03": { id: 3, title: "Broken Access Control", icon: ShieldOff, accent: "#0066ff", bg: "#eef3ff" },
  "chapter-04": { id: 4, title: "SSRF / LFI / XXE",      icon: Globe,     accent: "#9900cc", bg: "#f8eeff" },
}

const difficultyConfig: Record<string, { label: string; color: string; bars: number }> = {
  easy: { label: "Easy",   color: "#00c45a", bars: 1 },
  medium: { label: "Medium", color: "#e6c200", bars: 2 },
  hard: { label: "Hard",   color: "#ff3c6e", bars: 3 },
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>
}) {
  const { chapter: chapterSlug } = await params
  const config = chapterConfig[chapterSlug]

  if (!config) notFound()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-[#f4efe4] text-black" style={navFont}>
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase border-2 border-black bg-white px-3 py-1.5 mb-6 shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
            style={{ ...monoFont, clipPath: CUT_BTN }}
          >
            <ArrowLeft size={11} strokeWidth={3} /> Back to Lab
          </Link>

          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6 relative overflow-hidden"
            style={{ clipPath: CUT }}
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-r-transparent" style={{ borderTopColor: config.accent }} />

            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-12 h-12 flex items-center justify-center border-4 border-black"
                style={{ backgroundColor: config.accent, clipPath: CUT_SM }}
              >
                <Icon size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black uppercase" style={{ ...monoFont, color: config.accent }}>
                  Chapter {String(config.id).padStart(2, "0")}
                </span>
                <h1 className="text-2xl font-black uppercase mb-3" style={navFont}>
                  {config.title}
                </h1>
                <div className="flex items-center gap-3">
                  <ProgressBar value={percentage} color={config.accent} />
                  <span className="text-xs font-black" style={{ ...monoFont, color: config.accent }}>
                    {percentage}%
                  </span>
                  <span className="text-[#888] text-xs font-black" style={monoFont}>
                    {chapterSolved}/{chapterTotal} stages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-8 bg-black" />
            <p className="text-xs font-black uppercase tracking-widest text-[#888]" style={monoFont}>
              Stages
            </p>
          </div>

          <div className="grid gap-4">
            {challenges?.map((challenge, idx) => {
              const solved   = solvedIds.has(challenge.id)
              const diff     = difficultyConfig[challenge.difficulty]
              const prevChallenge = idx > 0 ? challenges[idx - 1] : null
              const isLocked = prevChallenge !== null && !solvedIds.has(prevChallenge.id)

              return (
                <div
                  key={challenge.id}
                  className={`border-4 border-black p-4 sm:p-5 transition-all ${
                    isLocked
                      ? "bg-[#e8e2d8] opacity-60"
                      : solved
                      ? "bg-[#f0fff7]"
                      : "shadow-[6px_6px_0_#111]"
                  }`}
                  style={{
                    clipPath: CUT,
                    backgroundColor: isLocked ? "#e8e2d8" : solved ? "#f0fff7" : config.bg,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 flex items-center justify-center border-4 border-black"
                      style={{
                        clipPath: CUT_SM,
                        backgroundColor: isLocked ? "#ccc" : solved ? "#00e676" : config.accent,
                      }}
                    >
                      {isLocked ? (
                        <Lock size={15} color="#888" strokeWidth={2.5} />
                      ) : solved ? (
                        <CheckCircle size={15} color="#111" strokeWidth={2.5} />
                      ) : (
                        <span className="font-black text-xs text-white" style={monoFont}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-black text-sm ${isLocked ? "text-[#aaa]" : "text-black"}`} style={navFont}>
                          {challenge.title}
                        </span>
                        {!isLocked && (
                          <span
                            className="text-xs font-black uppercase px-1.5 py-0.5 border-2 border-black"
                            style={{ ...monoFont, clipPath: CUT_BTN, backgroundColor: config.accent, color: "#fff" }}
                          >
                            Stage {idx + 1}
                          </span>
                        )}
                        {solved && (
                          <span
                            className="text-xs font-black uppercase px-1.5 py-0.5 bg-[#00e676] border-2 border-black text-black"
                            style={{ ...monoFont, clipPath: CUT_BTN }}
                          >
                            Solved
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs leading-relaxed mb-3 ${isLocked ? "text-[#bbb]" : "text-[#333]"}`}
                        style={{ ...monoFont, fontWeight: 700 }}
                      >
                        {isLocked ? "Complete previous stage to unlock." : challenge.description}
                      </p>

                      {!isLocked && (
                        <>
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="w-4 h-1.5 rounded-full"
                                    style={{ backgroundColor: i <= (diff?.bars ?? 1) ? diff?.color : "#ddd" }}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-black uppercase" style={{ ...monoFont, color: diff?.color }}>
                                {diff?.label}
                              </span>
                            </div>

                            <span
                              className="text-xs font-black uppercase px-2 py-0.5 bg-[#00e676] border-2 border-black text-black"
                              style={{ ...monoFont, clipPath: CUT_BTN }}
                            >
                              {challenge.points} pts
                            </span>

                            <a
                              href={challenge.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-black uppercase px-3 py-1.5 border-2 border-black bg-white text-black shadow-[2px_2px_0_#111] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                              style={{ ...monoFont, clipPath: CUT_BTN }}
                            >
                              Open <ExternalLink size={11} strokeWidth={3} />
                            </a>
                          </div>

                          {solved ? (
                            <div
                              className="inline-flex items-center gap-1.5 bg-[#00e676] border-2 border-black text-black text-xs font-black uppercase px-3 py-1.5"
                              style={{ ...monoFont, clipPath: CUT_BTN }}
                            >
                              <CheckCircle size={11} strokeWidth={3} /> Solved
                            </div>
                          ) : (
                            <SubmitForm
                              challengeId={challenge.id}
                              chapterSlug={chapterSlug}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}