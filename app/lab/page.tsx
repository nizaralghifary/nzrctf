import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
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

  const categoryColors: Record<string, string> = {
    sqli: "text-[#ff3c6e] border-[#ff3c6e]/30 bg-[#ff3c6e]/10",
    xss: "text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10",
    idor: "text-[#00bfff] border-[#00bfff]/30 bg-[#00bfff]/10",
    ssrf: "text-[#bf5fff] border-[#bf5fff]/30 bg-[#bf5fff]/10",
  }

  const difficultyLabel: Record<string, string> = {
    easy: "text-[#00ff88]",
    medium: "text-[#ffd700]",
    hard: "text-[#ff3c6e]",
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
          <span className="text-[#555570] font-mono text-xs">
            {profile?.username ?? user.email}
          </span>
          <span className="text-[#00ff88] font-mono text-xs font-bold">
            {totalPoints} pts
          </span>
          <form action={logout}>
            <button className="text-[#555570] hover:text-white font-mono text-xs transition-colors">
              Logout
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-1">
            Welcome Back,
          </p>
          <h1 className="text-2xl font-black">
            {profile?.username ?? "Hacker"} 👾
          </h1>
          <div className="flex gap-4 mt-3">
            <div className="bg-[#11111a] border border-[#1e1e2e] rounded px-4 py-2 text-center">
              <div className="text-[#00ff88] font-black font-mono text-xl">{totalPoints}</div>
              <div className="text-[#555570] font-mono text-xs">POINTS</div>
            </div>
            <div className="bg-[#11111a] border border-[#1e1e2e] rounded px-4 py-2 text-center">
              <div className="text-[#00ff88] font-black font-mono text-xl">{solvedIds.size}</div>
              <div className="text-[#555570] font-mono text-xs">SOLVED</div>
            </div>
            <div className="bg-[#11111a] border border-[#1e1e2e] rounded px-4 py-2 text-center">
              <div className="text-white font-black font-mono text-xl">{challenges?.length ?? 0}</div>
              <div className="text-[#555570] font-mono text-xs">TOTAL</div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[#555570] font-mono text-xs tracking-widest mb-4">
            Challenges
          </p>
          <div className="grid gap-3">
            {challenges?.map((challenge) => {
              const solved = solvedIds.has(challenge.id)
              return (
                <div
                  key={challenge.id}
                  className={`bg-[#11111a] border rounded-lg p-4 flex items-center justify-between gap-4 transition-all ${
                    solved
                      ? "border-[#00ff88]/30 opacity-70"
                      : "border-[#1e1e2e] hover:border-[#333355]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-lg">{solved ? "✅" : "🔓"}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{challenge.title}</span>
                        <span
                          className={`text-xs font-mono border px-1.5 py-0.5 rounded ${
                            categoryColors[challenge.category] ??
                            "text-white border-white/20 bg-white/5"
                          }`}
                        >
                          {challenge.category.toUpperCase()}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            difficultyLabel[challenge.difficulty] ?? "text-white"
                          }`}
                        >
                          {challenge.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[#555570] text-xs font-mono mt-0.5 truncate">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[#00ff88] font-black font-mono text-sm">
                      {challenge.points} pts
                    </span>
                    {!solved && (
                      <a
                        href={challenge.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#00ff88] text-black text-xs font-bold px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                      >
                        OPEN
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
