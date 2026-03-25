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

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const navFont = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

const categoryConfig: Record<string, {
  label: string
  icon: React.ElementType
  accent: string
}> = {
  sqli: { label: "SQL Injection", icon: Database,  accent: "#ff3c6e" },
  xss:  { label: "XSS",           icon: Code2,     accent: "#e6c200" },
  idor: { label: "IDOR",          icon: ShieldOff, accent: "#0066ff" },
  ssrf: { label: "SSRF / LFI",    icon: Globe,     accent: "#9900cc" },
}

type ChallengeJoin = {
  title: string
  category: string
  difficulty: string
  points: number
  chapter: number
  stage_order: number
}

export default async function Submissions() {
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
  const correctCount  = submissions?.filter((s) => s.is_correct).length ?? 0
  const wrongCount    = totalAttempts - correctCount

  return (
    <div className="min-h-screen bg-[#f4efe4] text-black" style={navFont}>
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6 relative overflow-hidden"
            style={{ clipPath: CUT }}
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-[#00e676] border-r-transparent" />
            <p className="text-xs font-black tracking-widest text-[#888] mb-1" style={monoFont}>
              My Submissions
            </p>
            <h1 className="text-2xl font-black mb-5" style={navFont}>
              Submission History
            </h1>
            <div className="flex flex-wrap gap-3">
              {[
                { val: totalAttempts, label: "Total",   bg: "#f4efe4" },
                { val: correctCount,  label: "Correct", bg: "#00e676" },
                { val: wrongCount,    label: "Wrong",   bg: "#ff3c6e" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="px-5 py-3 text-center border-4 border-black"
                  style={{ clipPath: CUT_BTN, backgroundColor: stat.bg }}
                >
                  <div className="font-black text-xl text-black" style={navFont}>{stat.val}</div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#444] mt-0.5" style={monoFont}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {submissions?.length === 0 ? (
          <div
            className="bg-white border-4 border-black p-10 text-center shadow-[6px_6px_0_#111]"
            style={{ clipPath: CUT }}
          >
            <p className="font-black uppercase text-sm text-[#888]" style={monoFont}>No submissions yet.</p>
            <p className="text-xs font-bold mt-1 text-[#bbb]" style={monoFont}>
              Start solving challenges to see your history here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions?.map((submission) => {
              const raw = submission.challenges
              const challenge: ChallengeJoin | null = Array.isArray(raw)
                ? (raw[0] as ChallengeJoin) ?? null
                : (raw as ChallengeJoin) ?? null

              if (!challenge) return null

              const cat  = categoryConfig[challenge.category]
              const Icon = cat?.icon ?? Database
              const correct = submission.is_correct

              return (
                <div
                  key={submission.id}
                  className="bg-white border-4 border-black p-4 sm:p-5 shadow-[4px_4px_0_#111]"
                  style={{ clipPath: CUT }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 flex items-center justify-center border-4 border-black"
                      style={{
                        clipPath: CUT_SM,
                        backgroundColor: correct ? "#00e676" : "#ff3c6e",
                      }}
                    >
                      {correct
                        ? <CheckCircle size={16} color="#111" strokeWidth={2.5} />
                        : <XCircle    size={16} color="#fff" strokeWidth={2.5} />
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="font-black text-sm" style={navFont}>
                          {challenge.title}
                        </span>
                        {cat && (
                          <span
                            className="text-xs font-black uppercase px-1.5 py-0.5 border-2 border-black flex items-center gap-1"
                            style={{ ...monoFont, clipPath: CUT_BTN, backgroundColor: cat.accent, color: "#fff" }}
                          >
                            <Icon size={10} strokeWidth={2.5} />
                            {cat.label}
                          </span>
                        )}
                        <span
                          className="text-xs font-black uppercase px-1.5 py-0.5 border-2 border-black"
                          style={{
                            ...monoFont,
                            clipPath: CUT_BTN,
                            backgroundColor: correct ? "#00e676" : "#ff3c6e",
                            color: correct ? "#111" : "#fff",
                          }}
                        >
                          {correct ? "Correct" : "Wrong"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-xs font-black text-[#888]" style={monoFont}>
                          Ch.{challenge.chapter} Stage {challenge.stage_order}
                        </span>
                        <span
                          className="text-xs font-black uppercase px-1.5 py-0.5 bg-[#00e676] border-2 border-black text-black"
                          style={{ ...monoFont, clipPath: CUT_BTN }}
                        >
                          {challenge.points} pts
                        </span>
                      </div>

                      <div className="mb-2">
                        <SubmissionFlag flag={submission.submitted_flag} />
                      </div>

                      <div className="flex items-center gap-1.5 text-[#aaa] text-xs font-black" style={monoFont}>
                        <Clock size={10} strokeWidth={2.5} />
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