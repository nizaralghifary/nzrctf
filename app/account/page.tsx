import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { User, Mail, Calendar, Trophy, CheckCircle } from "lucide-react"

const CUT     = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM  = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const navFont  = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

export default async function AccountPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, created_at")
    .eq("id", user.id)
    .single()

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, points")
    .eq("is_active", true)

  const { data: submissions } = await supabase
    .from("submissions")
    .select("challenge_id, is_correct")
    .eq("user_id", user.id)

  const solvedIds = new Set(
    submissions?.filter((s) => s.is_correct).map((s) => s.challenge_id) ?? []
  )

  const totalPoints =
    challenges
      ?.filter((c) => solvedIds.has(c.id))
      .reduce((sum, c) => sum + c.points, 0) ?? 0

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—"

  const solvePercent = challenges?.length
    ? Math.round((solvedIds.size / challenges.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#f4efe4] text-black" style={navFont}>
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div
          className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6 relative overflow-hidden mb-5 sm:col-span-2"
          style={{ clipPath: CUT }}
        >
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-[#00e676] border-r-transparent" />

          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 bg-black flex items-center justify-center shrink-0 border-4 border-black"
              style={{ clipPath: CUT_SM }}
            >
              <User size={24} color="#00e676" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black" style={navFont}>
                {profile?.username ?? "—"}
              </h2>
              <p className="text-[#888] text-xs font-bold mt-0.5" style={monoFont}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: totalPoints,             label: "Points",           highlight: true  },
              { val: solvedIds.size,           label: "Solved",           highlight: true  },
              { val: challenges?.length ?? 0,  label: "Total Challenges", highlight: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-4 border-black px-4 py-3"
                style={{
                  clipPath: CUT_BTN,
                  backgroundColor: stat.highlight ? "#00e676" : "#f4efe4",
                }}
              >
                <div className="font-black text-2xl text-black" style={navFont}>{stat.val}</div>
                <div className="text-xs font-black tracking-widest text-[#444] mt-0.5" style={monoFont}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">

          <div
            className="bg-white border-4 border-black shadow-[6px_6px_0_#111] p-5"
            style={{ clipPath: CUT }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-7 bg-black" />
              <p className="text-xs font-black tracking-widest text-[#888]" style={monoFont}>
                Account Details
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: User,     label: "Username", val: profile?.username ?? "—" },
                { icon: Mail,     label: "Email",    val: user.email ?? "—"         },
                { icon: Calendar, label: "Joined",   val: joinedDate                },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 bg-[#f4efe4] border-4 border-black flex items-center justify-center shrink-0"
                    style={{ clipPath: CUT_SM }}
                  >
                    <Icon size={13} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[#888] text-xs font-black tracking-widest mb-0.5" style={monoFont}>
                      {label}
                    </p>
                    <p className="text-black text-sm font-black" style={monoFont}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-white border-4 border-black shadow-[6px_6px_0_#111] p-5"
            style={{ clipPath: CUT }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-7 bg-[#00e676] border-r-4 border-black" />
              <p className="text-xs font-black tracking-widest text-[#888]" style={monoFont}>
                Progress
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 bg-[#00e676] border-4 border-black flex items-center justify-center shrink-0"
                  style={{ clipPath: CUT_SM }}
                >
                  <Trophy size={13} color="#111" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[#888] text-xs font-black tracking-widest mb-0.5" style={monoFont}>
                    Total Points
                  </p>
                  <p className="text-black text-sm font-black" style={monoFont}>
                    {totalPoints} Points
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 bg-[#00e676] border-4 border-black flex items-center justify-center shrink-0"
                  style={{ clipPath: CUT_SM }}
                >
                  <CheckCircle size={13} color="#111" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[#888] text-xs font-black tracking-widest mb-0.5" style={monoFont}>
                    Challenges Solved
                  </p>
                  <p className="text-black text-sm font-black mb-2" style={monoFont}>
                    {solvedIds.size}
                    <span className="text-[#aaa] font-bold"> / {challenges?.length ?? 0}</span>
                  </p>
                  <div className="w-full max-w-[160px] h-1.5 bg-[#e0dbd2] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00e676]"
                      style={{ width: `${solvePercent}%` }}
                    />
                  </div>
                  <p className="text-xs font-black mt-1" style={{ ...monoFont, color: "#00c45a" }}>
                    {solvePercent}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}