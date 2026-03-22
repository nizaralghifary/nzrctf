import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { User, Mail, Calendar, Trophy, CheckCircle } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            Account
          </p>
          <h1 className="text-2xl font-black">My Profile</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            className="bg-[#11111a] border border-[#1e1e2e] p-6 sm:col-span-2"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                className="w-14 h-14 bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center shrink-0"
              >
                <User size={24} className="text-[#00ff88]" />
              </div>
              <div>
                <h2 className="text-xl font-black font-mono">{profile?.username ?? "—"}</h2>
                <p className="text-[#555570] font-mono text-xs mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: totalPoints, label: "POINTS", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
                { val: solvedIds.size, label: "SOLVED", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
                { val: challenges?.length ?? 0, label: "TOTAL CHALLENGES", color: "text-white", accent: "border-[#1e1e2e]" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                  className={`bg-[#0a0a0f] border ${stat.accent} px-4 py-3`}
                >
                  <div className={`${stat.color} font-black font-mono text-2xl`}>{stat.val}</div>
                  <div className="text-[#555570] font-mono text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            className="bg-[#11111a] border border-[#1e1e2e] p-5"
          >
            <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
              Account Details
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                  className="w-8 h-8 bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center shrink-0"
                >
                  <User size={13} className="text-[#555570]" />
                </div>
                <div>
                  <p className="text-[#555570] font-mono text-xs uppercase tracking-widest mb-0.5">Username</p>
                  <p className="text-white font-mono text-sm font-bold">{profile?.username ?? "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                  className="w-8 h-8 bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center shrink-0"
                >
                  <Mail size={13} className="text-[#555570]" />
                </div>
                <div>
                  <p className="text-[#555570] font-mono text-xs uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-white font-mono text-sm font-bold">{user.email ?? "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                  className="w-8 h-8 bg-[#0a0a0f] border border-[#1e1e2e] flex items-center justify-center shrink-0"
                >
                  <Calendar size={13} className="text-[#555570]" />
                </div>
                <div>
                  <p className="text-[#555570] font-mono text-xs uppercase tracking-widest mb-0.5">Joined</p>
                  <p className="text-white font-mono text-sm font-bold">{joinedDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
            className="bg-[#11111a] border border-[#1e1e2e] p-5"
          >
            <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
              Progress
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                  className="w-8 h-8 bg-[#0a0a0f] border border-[#00ff88]/20 flex items-center justify-center shrink-0"
                >
                  <Trophy size={13} className="text-[#00ff88]" />
                </div>
                <div>
                  <p className="text-[#555570] font-mono text-xs uppercase tracking-widest mb-0.5">Total Points</p>
                  <p className="text-[#00ff88] font-mono text-sm font-black">{totalPoints} pts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                  className="w-8 h-8 bg-[#0a0a0f] border border-[#00ff88]/20 flex items-center justify-center shrink-0"
                >
                  <CheckCircle size={13} className="text-[#00ff88]" />
                </div>
                <div>
                  <p className="text-[#555570] font-mono text-xs uppercase tracking-widest mb-0.5">Challenges Solved</p>
                  <p className="text-white font-mono text-sm font-bold">
                    {solvedIds.size}
                    <span className="text-[#555570] font-normal"> / {challenges?.length ?? 0}</span>
                  </p>
                  <div className="mt-2 w-full max-w-[160px] h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#00ff88]"
                      style={{
                        width: challenges?.length
                          ? `${Math.round((solvedIds.size / challenges.length) * 100)}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}