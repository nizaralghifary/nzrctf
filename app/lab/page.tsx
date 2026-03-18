import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { User, Trophy, CheckCircle, ExternalLink, Database, Code2, ShieldOff, Globe } from "lucide-react"

export default async function Lab() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("is_active", true)
    .order("points", { ascending: true })

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

  const categoryConfig: Record<string, { color: string; border: string; glow: string; icon: React.ElementType }> = {
    sqli: {
      color: "text-[#ff3c6e]",
      border: "border-[#ff3c6e]/40",
      glow: "shadow-[0_0_12px_rgba(255,60,110,0.15)]",
      icon: Database,
    },
    xss: {
      color: "text-[#ffd700]",
      border: "border-[#ffd700]/40",
      glow: "shadow-[0_0_12px_rgba(255,215,0,0.15)]",
      icon: Code2,
    },
    idor: {
      color: "text-[#00bfff]",
      border: "border-[#00bfff]/40",
      glow: "shadow-[0_0_12px_rgba(0,191,255,0.15)]",
      icon: ShieldOff,
    },
    ssrf: {
      color: "text-[#bf5fff]",
      border: "border-[#bf5fff]/40",
      glow: "shadow-[0_0_12px_rgba(191,95,255,0.15)]",
      icon: Globe,
    },
  }

  const difficultyConfig: Record<string, { label: string; color: string; bars: number }> = {
    easy:   { label: "EASY",   color: "text-[#00ff88]", bars: 1 },
    medium: { label: "MEDIUM", color: "text-[#ffd700]", bars: 2 },
    hard:   { label: "HARD",   color: "text-[#ff3c6e]", bars: 3 },
  }

  async function logout() {
    "use server"
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = await createClient()
    await supabase.auth.signOut()
    const { redirect } = await import("next/navigation")
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/95 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <span className="text-[#00ff88] font-black font-mono text-lg tracking-tight">
          NzrCTF<span className="text-white"> Lab</span>
        </span>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs">
            <User size={12} className="text-[#00ff88]" />
            <span className="text-white">{profile?.username ?? user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#00ff88] font-mono text-xs font-bold">
            <Trophy size={12} />
            <span>{totalPoints} pts</span>
          </div>
          <form action={logout}>
            <button className="text-[#555570] hover:text-white font-mono text-xs transition-colors">
              Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-10">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            Welcome back
          </p>
          <h1 className="text-2xl font-black mb-4">
            {profile?.username ?? "Hacker"}
          </h1>
          <div className="flex flex-wrap gap-3">
            {[
              { val: totalPoints, label: "POINTS", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
              { val: solvedIds.size, label: "SOLVED", color: "text-[#00ff88]", accent: "border-[#00ff88]/20" },
              { val: challenges?.length ?? 0, label: "TOTAL", color: "text-white", accent: "border-[#1e1e2e]" },
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

        <div>
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
            Challenges
          </p>
          <div className="grid gap-3">
            {challenges?.map((challenge) => {
              const solved = solvedIds.has(challenge.id)
              const cat = categoryConfig[challenge.category]
              const diff = difficultyConfig[challenge.difficulty]
              const Icon = cat?.icon ?? Database

              return (
                <div
                  key={challenge.id}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                  }}
                  className={`relative bg-[#11111a] border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                    solved
                      ? "border-[#00ff88]/20 opacity-60"
                      : `${cat?.border ?? "border-[#1e1e2e]"} hover:${cat?.glow ?? ""}`
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <div
                      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                      className={`shrink-0 w-10 h-10 flex items-center justify-center bg-[#0a0a0f] border ${cat?.border ?? "border-[#1e1e2e]"}`}
                    >
                      {solved
                        ? <CheckCircle size={16} className="text-[#00ff88]" />
                        : <Icon size={16} className={cat?.color ?? "text-white"} />
                      }
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-sm break-words">{challenge.title}</span>
                        <span
                          style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                          className={`text-xs font-mono px-2 py-0.5 bg-[#0a0a0f] border ${cat?.border ?? "border-[#1e1e2e]"} ${cat?.color ?? "text-white"}`}
                        >
                          {challenge.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-[#555570] text-xs font-mono mb-2 leading-relaxed">
                        {challenge.description}
                      </p>

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
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
                    <span className="text-[#00ff88] font-black font-mono text-sm">
                      {challenge.points} pts
                    </span>
                    {solved ? (
                      <div
                        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                        className="flex items-center gap-1 bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-xs font-mono font-bold px-3 py-1.5"
                      >
                        <CheckCircle size={11} /> SOLVED
                      </div>
                    ) : (
                      <a
                        href={challenge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
                        className="flex items-center gap-1 bg-[#00ff88] text-black text-xs font-bold px-3 py-1.5 hover:opacity-90 transition-opacity"
                      >
                        OPEN <ExternalLink size={11} />
                      </a>
                    )}
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
