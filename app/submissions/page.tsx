import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import SubmissionDate from "@/components/submission-date"
import SubmissionFlag from "@/components/submission-flag"
import {
  CheckCircle,
  XCircle,
  Database,
  Code2,
  ShieldOff,
  Globe,
  Clock,
} from "lucide-react"

const categoryConfig: Record<string, {
  label: string
  icon: React.ElementType
  color: string
  border: string
}> = {
  sqli: { label: "SQL Injection", icon: Database, color: "text-[#ff3c6e]", border: "border-[#ff3c6e]/40" },
  xss:  { label: "XSS",          icon: Code2,     color: "text-[#ffd700]", border: "border-[#ffd700]/40" },
  idor: { label: "IDOR",         icon: ShieldOff,  color: "text-[#00bfff]", border: "border-[#00bfff]/40" },
  ssrf: { label: "SSRF / LFI",   icon: Globe,      color: "text-[#bf5fff]", border: "border-[#bf5fff]/40" },
}

type ChallengeJoin = {
  title: string
  category: string
  difficulty: string
  points: number
  chapter: number
  stage_order: number
}

export default async function SubmissionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: submissions } = await supabase
    .from("submissions")
    .select(`
      id,
      submitted_flag,
      is_correct,
      submitted_at,
      challenges (
        title,
        category,
        difficulty,
        points,
        chapter,
        stage_order
      )
    `)
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })

  const totalAttempts = submissions?.length ?? 0
  const correctCount = submissions?.filter((s) => s.is_correct).length ?? 0
  const wrongCount = totalAttempts - correctCount

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            My Submissions
          </p>
          <h1 className="text-2xl font-black mb-4">Submission History</h1>

          <div className="flex flex-wrap gap-3">
            {[
              { val: totalAttempts, label: "TOTAL",   color: "text-white",      accent: "border-[#1e1e2e]" },
              { val: correctCount,  label: "CORRECT",  color: "text-[#00ff88]",  accent: "border-[#00ff88]/20" },
              { val: wrongCount,    label: "WRONG",    color: "text-[#ff3c6e]",  accent: "border-[#ff3c6e]/20" },
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

        {submissions?.length === 0 ? (
          <div
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            className="bg-[#11111a] border border-[#1e1e2e] p-10 text-center"
          >
            <p className="text-[#555570] font-mono text-sm">No submissions yet.</p>
            <p className="text-[#333355] font-mono text-xs mt-1">Start solving challenges to see your history here.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {submissions?.map((submission) => {
              const raw = submission.challenges
              const challenge: ChallengeJoin | null = Array.isArray(raw)
                ? (raw[0] as ChallengeJoin) ?? null
                : (raw as ChallengeJoin) ?? null

              if (!challenge) return null

              const cat = categoryConfig[challenge.category]
              const Icon = cat?.icon ?? Database

              return (
                <div
                  key={submission.id}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  }}
                  className={`bg-[#11111a] border p-4 sm:p-5 transition-all ${
                    submission.is_correct ? "border-[#00ff88]/20" : "border-[#ff3c6e]/15"
                  }`}
                >
                  <div className="flex items-start gap-4">

                    <div
                      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                      className={`shrink-0 w-10 h-10 flex items-center justify-center bg-[#0a0a0f] border ${
                        submission.is_correct ? "border-[#00ff88]/30" : "border-[#ff3c6e]/20"
                      }`}
                    >
                      {submission.is_correct
                        ? <CheckCircle size={16} className="text-[#00ff88]" />
                        : <XCircle size={16} className="text-[#ff3c6e]" />
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-sm">{challenge.title}</span>
                        <span
                          style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                          className={`text-xs font-mono px-2 py-0.5 bg-[#0a0a0f] border flex items-center gap-1 ${cat?.border ?? "border-[#1e1e2e]"} ${cat?.color ?? "text-white"}`}
                        >
                          <Icon size={10} />
                          {cat?.label ?? challenge.category.toUpperCase()}
                        </span>
                        <span
                          style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                          className={`text-xs font-mono px-2 py-0.5 bg-[#0a0a0f] border border-[#1e1e2e] ${
                            submission.is_correct ? "text-[#00ff88]" : "text-[#ff3c6e]"
                          }`}
                        >
                          {submission.is_correct ? "CORRECT" : "WRONG"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-[#555570] font-mono text-xs">
                          Ch.{challenge.chapter} Stage {challenge.stage_order}
                        </span>
                        <span className="text-[#00ff88] font-bold font-mono text-xs">
                          {challenge.points} pts
                        </span>
                      </div>

                      <div className="mb-2">
                        <SubmissionFlag flag={submission.submitted_flag} />
                      </div>

                      <div className="flex items-center gap-1.5 text-[#333355] font-mono text-xs">
                        <Clock size={10} />
                        <SubmissionDate dateString={submission.submitted_at} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}