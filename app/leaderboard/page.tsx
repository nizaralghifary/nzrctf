import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { Trophy, Crown } from "lucide-react"

const CUT     = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM  = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const navFont  = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

const podium = [
  { bg: "#e6c200", text: "#111" },
  { bg: "#aaaaaa", text: "#111" },
  { bg: "#cd7f32", text: "#fff" },
]

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: leaderboard } = await supabase.rpc("get_leaderboard")

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const myRank = leaderboard?.findIndex(
    (row: { username: string }) => row.username === myProfile?.username
  ) ?? -1

  return (
    <div className="min-h-screen bg-[#f4efe4] text-black" style={navFont}>
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <div
            className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6 relative overflow-hidden"
            style={{ clipPath: CUT }}
          >
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-[#e6c200] border-r-transparent" />
            <p className="text-xs font-black tracking-widest text-[#888] mb-1" style={monoFont}>
              Global Rankings
            </p>
            <h1 className="text-2xl font-black mb-4" style={navFont}>
              Leaderboard
            </h1>
            {myRank >= 0 && (
              <div
                className="inline-flex items-center gap-2 bg-[#00e676] border-4 border-black text-black text-xs font-black px-3 py-1.5"
                style={{ ...monoFont, clipPath: CUT_BTN }}
              >
                <Trophy size={12} strokeWidth={3} />
                Your Rank: #{myRank + 1}
              </div>
            )}
          </div>
        </div>

        {!leaderboard || leaderboard.length === 0 ? (
          <div
            className="bg-white border-4 border-black p-10 text-center shadow-[6px_6px_0_#111]"
            style={{ clipPath: CUT }}
          >
            <p className="font-black uppercase text-sm text-[#888]" style={monoFont}>No entries yet.</p>
            <p className="text-xs font-bold mt-1 text-[#bbb]" style={monoFont}>
              Be the first to solve a challenge!
            </p>
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
                  className="border-4 border-black p-4 flex items-center gap-4 transition-all"
                  style={{
                    clipPath: CUT,
                    backgroundColor: isMe ? "#e8fff3" : top3 ? `${top3.bg}22` : "white",
                    boxShadow: isMe ? "6px 6px 0 #00c45a" : "4px 4px 0 #111",
                  }}
                >
                  <div
                    className="shrink-0 w-10 h-10 flex items-center justify-center border-4 border-black"
                    style={{
                      clipPath: CUT_SM,
                      backgroundColor: top3 ? top3.bg : isMe ? "#00e676" : "#f4efe4",
                    }}
                  >
                    {rank <= 3 ? (
                      <Crown
                        size={16}
                        strokeWidth={2.5}
                        color={top3!.text}
                      />
                    ) : (
                      <span className="font-black text-xs text-black" style={monoFont}>
                        {String(rank).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm" style={navFont}>
                        {row.username}
                      </span>
                      {isMe && (
                        <span
                          className="text-xs font-black uppercase px-1.5 py-0.5 bg-[#00e676] border-2 border-black text-black"
                          style={{ ...monoFont, clipPath: CUT_BTN }}
                        >
                          You
                        </span>
                      )}
                      {rank <= 3 && (
                        <span
                          className="text-xs font-black uppercase px-1.5 py-0.5 border-2 border-black"
                          style={{
                            ...monoFont,
                            clipPath: CUT_BTN,
                            backgroundColor: top3!.bg,
                            color: top3!.text,
                          }}
                        >
                          #{rank}
                        </span>
                      )}
                    </div>
                    <div className="text-[#888] text-xs font-black mt-0.5" style={monoFont}>
                      {row.solves ?? 0} challenges solved
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div
                      className="font-black text-sm uppercase px-2 py-0.5 border-2 border-black"
                      style={{
                        ...monoFont,
                        clipPath: CUT_BTN,
                        backgroundColor: rank === 1 ? "#e6c200" : isMe ? "#00e676" : "#f4efe4",
                        color: "#111",
                      }}
                    >
                      {row.total_points ?? 0}
                    </div>
                    <div className="text-[#aaa] text-xs font-black mt-0.5" style={monoFont}>pts</div>
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