import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { Trophy, Crown } from "lucide-react"

const podium = [
  { bg: "#ffe87a", text: "#111" },
  { bg: "#e8e2d8", text: "#111" },
  { bg: "#f5c89a", text: "#111" }
]

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: leaderboard } = await supabase.rpc("get_leaderboard")

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const rank = leaderboard?.findIndex(
    (row: { username: string }) => row.username === myProfile?.username
  ) ?? -1

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="nb-card bg-white p-6 mb-8 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{ background: "linear-gradient(135deg, transparent 50%, #ffe87a 50%)" }}
          />
          <p className="font-mono text-xs text-[#888] mb-1">Global Rankings</p>
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            Leaderboard
          </h1>
          {rank >= 0 && (
            <div className="inline-flex items-center gap-2 border-[3px] border-[#111] bg-[#ffe87a] font-mono text-xs px-3 py-1.5" style={{ boxShadow: "3px 3px 0 #111" }}>
              <Trophy size={11} strokeWidth={2.5} />
              Your Rank: #{rank + 1}
            </div>
          )}
        </div>

        {!leaderboard || leaderboard.length === 0 ? (
          <div className="nb-card bg-white p-10 text-center">
            <p className="font-mono text-sm text-[#888]">No entries yet.</p>
            <p className="font-mono text-xs text-[#bbb] mt-1">Be the first to solve a challenge!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {leaderboard.map((row: {
              username: string
              solves: number
              total_points: number
              last_solve: string | null
            }, idx: number) => {
              const isMe = row.username === myProfile?.username
              const rank = idx + 1
              const top3 = rank <= 3 ? podium[rank - 1] : null

              return (
                <div
                  key={row.username}
                  className="border-[3px] border-[#111] p-4 flex items-center gap-4"
                  style={{
                    background: isMe ? "#f0fff8" : "white",
                    boxShadow: isMe ? "4px 4px 0 #3d9e6a" : "4px 4px 0 #111",
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center border-[3px] border-[#111]"
                    style={{ background: top3 ? top3.bg : isMe ? "#b8f5a0" : "#f0ebe0" }}
                  >
                    {rank <= 3 ? (
                      <Crown size={15} strokeWidth={2} color={top3!.text} />
                    ) : (
                      <span className="font-mono text-xs text-[#888]">
                        {String(rank).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                        {row.username}
                      </span>
                      {isMe && (
                        <span className="nb-tag" style={{ background: "#b8f5a0" }}>you</span>
                      )}
                      {top3 && (
                        <span className="nb-tag" style={{ background: top3.bg }}>#{rank}</span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-[#888] mt-0.5">
                      {row.solves ?? 0} challenges solved
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div
                      className="font-mono text-sm border-[2px] border-[#111] px-2 py-0.5 inline-block"
                      style={{ background: top3?.bg ?? (isMe ? "#b8f5a0" : "#f0ebe0") }}
                    >
                      {row.total_points ?? 0}
                    </div>
                    <div className="font-mono text-xs text-[#aaa] mt-0.5">pts</div>
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