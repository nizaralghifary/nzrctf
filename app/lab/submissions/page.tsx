import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import SubmissionDate from "@/components/submission-date"
import SubmissionFlag from "@/components/submission-flag"
import { CheckCircle, XCircle, Database, Code2, ShieldOff, Globe, Clock } from "lucide-react"

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  sqli: { label: "SQL Injection", icon: Database },
  xss: { label: "XSS", icon: Code2 },
  idor: { label: "IDOR", icon: ShieldOff },
  ssrf: { label: "SSRF / LFI", icon: Globe }
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
  const { data: { user } } = await supabase.auth.getUser()
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
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="nb-card bg-white p-6 mb-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{ background: "linear-gradient(135deg, transparent 50%, #ffe87a 50%)" }}
          />
          <p className="font-mono text-xs text-[#888] mb-1">My submissions</p>
          <h1 className="text-2xl mb-5" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            Submission History
          </h1>
          <div className="flex flex-wrap gap-3">
            {[
              { val: totalAttempts, label: "Total", bg: "#f0ebe0" },
              { val: correctCount, label: "Correct", bg: "#b8f5a0" },
              { val: wrongCount, label: "Wrong", bg: "#ffb3b3" }
            ].map((stat) => (
              <div
                key={stat.label}
                className="px-5 py-3 text-center border-[3px] border-[#111]"
                style={{ background: stat.bg, boxShadow: "3px 3px 0 #111" }}
              >
                <div className="text-xl" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                  {stat.val}
                </div>
                <div className="font-mono text-xs text-[#555] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {submissions?.length === 0 ? (
          <div className="nb-card bg-white p-10 text-center">
            <p className="font-mono text-sm text-[#888]">No submissions yet.</p>
            <p className="font-mono text-xs text-[#bbb] mt-1">
              Start solving challenges to see your history here
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

              const cat = categoryConfig[challenge.category]
              const Icon = cat?.icon ?? Database
              const correct = submission.is_correct

              return (
                <div
                  key={submission.id}
                  className="bg-white border-[3px] border-[#111] p-5 shadow-[4px_4px_0_#111]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 flex items-center justify-center border-[3px] border-[#111]"
                      style={{ background: correct ? "#b8f5a0" : "#ffb3b3" }}
                    >
                      {correct
                        ? <CheckCircle size={15} color="#111" strokeWidth={2} />
                        : <XCircle size={15} color="#111" strokeWidth={2} />
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-sm" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                          {challenge.title}
                        </span>
                        {cat && (
                          <span className="nb-tag bg-[#f0ebe0] flex items-center gap-1">
                            <Icon size={10} strokeWidth={2} />
                            {cat.label}
                          </span>
                        )}
                        <span
                          className="nb-tag"
                          style={{ background: correct ? "#b8f5a0" : "#ffb3b3" }}
                        >
                          {correct ? "correct" : "wrong"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="font-mono text-xs text-[#888]">
                          ch.{challenge.chapter} · stage {challenge.stage_order}
                        </span>
                        <span className="nb-tag" style={{ background: "#ffe87a" }}>
                          {challenge.points} pts
                        </span>
                      </div>

                      <div className="mb-2">
                        <SubmissionFlag flag={submission.submitted_flag} />
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#aaa]">
                        <Clock size={10} strokeWidth={2} />
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