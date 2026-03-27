import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { User, Mail, Calendar, Trophy, CheckCircle } from "lucide-react"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
    challenges?.filter((c) => solvedIds.has(c.id)).reduce((sum, c) => sum + c.points, 0) ?? 0

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "—"

  const solvePercent = challenges?.length
    ? Math.round((solvedIds.size / challenges.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="nb-card bg-white p-6 mb-5 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-16 h-16"
            style={{ background: "linear-gradient(135deg, transparent 50%, #ffe87a 50%)" }}
          />

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#111] flex items-center justify-center shrink-0">
              <User size={22} color="#f0ebe0" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-xl" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                {profile?.username ?? "—"}
              </h2>
              <p className="font-mono text-xs text-[#888] mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { val: totalPoints,            label: "Points",            accent: true  },
              { val: solvedIds.size,          label: "Solved",            accent: true  },
              { val: challenges?.length ?? 0, label: "Total challenges",  accent: false },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border-[3px] border-[#111] px-4 py-3"
                style={{ background: stat.accent ? "#ffe87a" : "#f0ebe0", boxShadow: "3px 3px 0 #111" }}
              >
                <div className="text-2xl" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                  {stat.val}
                </div>
                <div className="font-mono text-xs text-[#555] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="nb-card bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#111]" />
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest">Account details</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: User, label: "Username", val: profile?.username ?? "—" },
                { icon: Mail, label: "Email", val: user.email ?? "—" },
                { icon: Calendar, label: "Joined", val: joinedDate }
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#f0ebe0] border-[3px] border-[#111] flex items-center justify-center shrink-0">
                    <Icon size={12} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#888] mb-0.5">{label}</p>
                    <p className="font-mono text-sm text-[#111]">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="nb-card bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-[#111]" />
              <p className="font-mono text-xs text-[#888] uppercase tracking-widest">Progress</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#ffe87a] border-[3px] border-[#111] flex items-center justify-center shrink-0">
                  <Trophy size={12} strokeWidth={2} />
                </div>
                <div>
                  <p className="font-mono text-xs text-[#888] mb-0.5">Total points</p>
                  <p className="font-mono text-sm text-[#111]">{totalPoints} pts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#b8f5a0] border-[3px] border-[#111] flex items-center justify-center shrink-0">
                  <CheckCircle size={12} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#888] mb-0.5">Challenges solved</p>
                  <p className="font-mono text-sm text-[#111] mb-2">
                    {solvedIds.size}
                    <span className="text-[#aaa]"> / {challenges?.length ?? 0}</span>
                  </p>
                  <div className="w-full max-w-[160px] h-1.5 bg-[#e8e2d8] overflow-hidden">
                    <div
                      className="h-full bg-[#111]"
                      style={{ width: `${solvePercent}%` }}
                    />
                  </div>
                  <p className="font-mono text-xs text-[#888] mt-1">{solvePercent}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}