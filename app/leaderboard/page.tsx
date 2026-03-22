import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { Trophy, Crown } from "lucide-react"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: leaderboard } = await supabase
    .rpc("get_leaderboard")

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const myRank = leaderboard?.findIndex(
    (row: { username: string }) => row.username === myProfile?.username
  ) ?? -1

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            Global Rankings
          </p>
          <h1 className="text-2xl font-black mb-4">Leaderboard</h1>

          {myRank >= 0 && (
            <div
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
              className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-mono text-xs px-3 py-1.5 mb-4"
            >
              <Trophy size={12} />
              Your rank: #{myRank + 1}
            </div>
          )}
        </div>

        {!leaderboard || leaderboard.length === 0 ? (
          <div
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            className="bg-[#11111a] border border-[#1e1e2e] p-10 text-center"
          >
            <p className="text-[#555570] font-mono text-sm">No entries yet.</p>
            <p className="text-[#333355] font-mono text-xs mt-1">Be the first to solve a challenge!</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {leaderboard.map((row: {
              username: string
              solves: number
              total_points: number
              last_solve: string | null
            }, idx: number) => {
              const isMe = row.username === myProfile?.username
              const rank = idx + 1

              const rankConfig =
                rank === 1
                  ? { icon: Crown, color: "text-[#ffd700]", border: "border-[#ffd700]/40", bg: "bg-[#ffd700]/5" }
                  : rank === 2
                  ? { icon: Crown, color: "text-[#aaaaaa]", border: "border-[#aaaaaa]/30", bg: "bg-[#aaaaaa]/5" }
                  : rank === 3
                  ? { icon: Crown, color: "text-[#cd7f32]", border: "border-[#cd7f32]/30", bg: "bg-[#cd7f32]/5" }
                  : null

              const RankIcon = rankConfig?.icon ?? null

              return (
                <div
                  key={row.username}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  }}
                  className={`border p-4 flex items-center gap-4 transition-all ${
                    isMe
                      ? "bg-[#00ff88]/5 border-[#00ff88]/30"
                      : rankConfig
                      ? `${rankConfig.bg} ${rankConfig.border}`
                      : "bg-[#11111a] border-[#1e1e2e]"
                  }`}
                >
                  <div
                    style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                    className={`shrink-0 w-10 h-10 flex items-center justify-center bg-[#0a0a0f] border ${
                      rankConfig ? rankConfig.border : "border-[#1e1e2e]"
                    }`}
                  >
                    {RankIcon ? (
                      <RankIcon size={16} className={rankConfig!.color} />
                    ) : (
                      <span className="text-[#555570] font-black font-mono text-xs">
                        {String(rank).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold text-sm font-mono ${isMe ? "text-[#00ff88]" : "text-white"}`}>
                        {row.username}
                      </span>
                      {isMe && (
                        <span
                          style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                          className="text-xs font-mono px-2 py-0.5 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                        >
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[#555570] font-mono text-xs mt-0.5">
                      {row.solves ?? 0} challenges solved
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className={`font-black font-mono text-sm ${
                      rank === 1 ? "text-[#ffd700]" : isMe ? "text-[#00ff88]" : "text-white"
                    }`}>
                      {row.total_points ?? 0}
                    </div>
                    <div className="text-[#555570] font-mono text-xs">pts</div>
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