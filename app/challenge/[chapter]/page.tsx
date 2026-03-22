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
  ChevronLeft,
  Lock,
} from "lucide-react"

const chapterConfig: Record<string, {
  id: number
  title: string
  icon: React.ElementType
  color: string
  hex: string
  border: string
  glow: string
}> = {
  "chapter-01": {
    id: 1,
    title: "SQL Injection",
    icon: Database,
    color: "text-[#ff3c6e]",
    hex: "#ff3c6e",
    border: "border-[#ff3c6e]/40",
    glow: "shadow-[0_0_12px_rgba(255,60,110,0.15)]",
  },
  "chapter-02": {
    id: 2,
    title: "Cross-Site Scripting",
    icon: Code2,
    color: "text-[#ffd700]",
    hex: "#ffd700",
    border: "border-[#ffd700]/40",
    glow: "shadow-[0_0_12px_rgba(255,215,0,0.15)]",
  },
  "chapter-03": {
    id: 3,
    title: "Broken Access Control",
    icon: ShieldOff,
    color: "text-[#00bfff]",
    hex: "#00bfff",
    border: "border-[#00bfff]/40",
    glow: "shadow-[0_0_12px_rgba(0,191,255,0.15)]",
  },
  "chapter-04": {
    id: 4,
    title: "SSRF / LFI / XXE",
    icon: Globe,
    color: "text-[#bf5fff]",
    hex: "#bf5fff",
    border: "border-[#bf5fff]/40",
    glow: "shadow-[0_0_12px_rgba(191,95,255,0.15)]",
  },
}

const difficultyConfig: Record<string, { label: string; color: string; bars: number }> = {
  easy:   { label: "EASY",   color: "text-[#00ff88]", bars: 1 },
  medium: { label: "MEDIUM", color: "text-[#ffd700]", bars: 2 },
  hard:   { label: "HARD",   color: "text-[#ff3c6e]", bars: 3 },
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
  const chapterTotal = challenges?.length ?? 0
  const percentage = chapterTotal > 0 ? Math.round((chapterSolved / chapterTotal) * 100) : 0

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-10">
          <Link
            href="/lab"
            className="inline-flex items-center gap-1 text-[#555570] hover:text-white font-mono text-xs transition-colors mb-6"
          >
            <ChevronLeft size={12} /> Back to Lab
          </Link>

          <div className="flex items-start gap-4">
            <div
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
              className={`shrink-0 w-12 h-12 flex items-center justify-center bg-[#11111a] border ${config.border}`}
            >
              <Icon size={20} className={config.color} />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`font-mono text-xs ${config.color}`}>
                {String(config.id).padStart(2, "0")} Chapter
              </span>
              <h1 className="text-2xl font-black mb-3">{config.title}</h1>
              <div className="flex items-center gap-3">
                <ProgressBar value={percentage} color={config.hex} />
                <span className={`text-xs font-mono font-bold ${config.color}`}>
                  {percentage}%
                </span>
                <span className="text-[#555570] text-xs font-mono">
                  {chapterSolved}/{chapterTotal} stages
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
            Stages
          </p>
          <div className="grid gap-3">
            {challenges?.map((challenge, idx) => {
              const solved = solvedIds.has(challenge.id)
              const diff = difficultyConfig[challenge.difficulty]
              const prevChallenge = idx > 0 ? challenges[idx - 1] : null
              const isLocked = prevChallenge !== null && !solvedIds.has(prevChallenge.id)

              return (
                <div
                  key={challenge.id}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  }}
                  className={`relative bg-[#11111a] border p-4 sm:p-5 transition-all ${
                    isLocked
                      ? "border-[#1e1e2e] opacity-50"
                      : solved
                      ? `${config.border} opacity-60`
                      : `${config.border} ${config.glow}`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                      className={`shrink-0 w-10 h-10 flex items-center justify-center bg-[#0a0a0f] border ${
                        isLocked ? "border-[#1e1e2e]" : config.border
                      }`}
                    >
                      {isLocked ? (
                        <Lock size={16} className="text-[#333355]" />
                      ) : solved ? (
                        <CheckCircle size={16} className="text-[#00ff88]" />
                      ) : (
                        <span className={`font-black font-mono text-xs ${config.color}`}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-bold text-sm ${isLocked ? "text-[#333355]" : "text-white"}`}>
                          {challenge.title}
                        </span>
                        {!isLocked && (
                          <span
                            style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                            className={`text-xs font-mono px-2 py-0.5 bg-[#0a0a0f] border ${config.border} ${config.color}`}
                          >
                            Stage {idx + 1}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs font-mono leading-relaxed mb-3 ${isLocked ? "text-[#333355]" : "text-[#555570]"}`}>
                        {isLocked ? "Complete previous stage to unlock" : challenge.description}
                      </p>

                      {!isLocked && (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-4 h-1 rounded-sm ${
                                      i <= (diff?.bars ?? 1)
                                        ? diff?.color.replace("text-", "bg-") ?? "bg-[#00ff88]"
                                        : "bg-[#1e1e2e]"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className={`text-xs font-mono font-bold ${diff?.color ?? "text-white"}`}>
                                {diff?.label}
                              </span>
                            </div>
                            <span className="text-[#00ff88] font-black font-mono text-sm">
                              {challenge.points} pts
                            </span>
                            <a
                              href={challenge.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                              className="flex items-center gap-1 bg-[#11111a] border border-[#1e1e2e] hover:border-[#333355] text-white text-xs font-bold px-3 py-1.5 transition-all"
                            >
                              OPEN <ExternalLink size={11} />
                            </a>
                          </div>

                          {solved ? (
                            <div
                              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                              className="inline-flex items-center gap-1 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono font-bold px-3 py-1.5"
                            >
                              <CheckCircle size={11} /> SOLVED
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