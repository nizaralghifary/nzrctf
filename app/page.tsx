import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import {
  Database,
  Code2,
  ShieldOff,
  Globe,
  UserPlus,
  LayoutDashboard,
  Flag,
  Trophy,
  ChevronRight,
  MoveRight
} from "lucide-react"

const features = [
  {
    icon: Database,
    title: "SQL Injection",
    description: "Bypass login panels, extract database contents, and exploit poorly sanitized queries.",
    difficultyFrom: "Easy",
    difficultyTo: "Hard",
    color: "text-[#ff3c6e]",
    border: "border-[#ff3c6e]/40",
    badge: "text-[#ff3c6e] border-[#ff3c6e]/30 bg-[#ff3c6e]/10",
  },
  {
    icon: Code2,
    title: "Cross-Site Scripting",
    description: "Inject malicious scripts, steal cookies, and hijack user sessions.",
    difficultyFrom: "Easy",
    difficultyTo: "Hard",
    color: "text-[#ffd700]",
    border: "border-[#ffd700]/40",
    badge: "text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10",
  },
  {
    icon: ShieldOff,
    title: "Broken Access Control",
    description: "Access resources you shouldn't, manipulate object references, and escalate privileges.",
    difficultyFrom: "Medium",
    difficultyTo: "Hard",
    color: "text-[#00bfff]",
    border: "border-[#00bfff]/40",
    badge: "text-[#00bfff] border-[#00bfff]/30 bg-[#00bfff]/10",
  },
  {
    icon: Globe,
    title: "SSRF / LFI / XXE",
    description: "Reach internal services, read sensitive files, and exploit XML parsers.",
    difficultyFrom: "Medium",
    difficultyTo: "Hard",
    color: "text-[#bf5fff]",
    border: "border-[#bf5fff]/40",
    badge: "text-[#bf5fff] border-[#bf5fff]/30 bg-[#bf5fff]/10",
  },
]

const steps = [
  { num: "01", icon: UserPlus, title: "Create an account", desc: "Register with your username, email, and password." },
  { num: "02", icon: LayoutDashboard, title: "Pick a challenge", desc: "Browse challenges across 4 web security categories." },
  { num: "03", icon: Flag, title: "Find the flag", desc: "Exploit the vulnerability and retrieve the hidden flag." },
  { num: "04", icon: Trophy, title: "Submit & score", desc: "Submit your flag to earn points and climb the leaderboard." },
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavbarServer />      

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
          className="inline-block bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-mono text-xs px-4 py-1.5 mb-6 tracking-widest uppercase"
        >
          Web Security CTF Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
          Learn Web Security<br />
          <span className="text-[#00ff88]">By Breaking Things</span>
        </h1>
        <p className="text-[#555570] font-mono text-sm max-w-lg mx-auto leading-relaxed mb-10">
          A hands-on CTF platform built for learning real-world web vulnerabilities.
          Exploit, find the flag, and level up your security skills.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href={user ? "/lab" : "/register"}
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
            className="bg-[#00ff88] text-black font-bold text-sm px-6 py-3 hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {user ? "Go to Lab" : "Start Hacking"} <ChevronRight size={14} />
          </Link>
          {!user && (
            <Link
              href="/login"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
              className="bg-[#11111a] border border-[#1e1e2e] text-white font-bold text-sm px-6 py-3 hover:border-[#333355] transition-all"
            >
              Sign In
            </Link>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mt-14 flex-wrap">
          {[
            { val: "4", label: "Categories" },
            { val: "7+", label: "Challenges" },
            { val: "3", label: "Difficulty Levels" },
            { val: "∞", label: "Things to Learn" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
              className="bg-[#11111a] border border-[#1e1e2e] px-5 py-3 text-center"
            >
              <div className="text-xl font-black text-[#00ff88] font-mono">{stat.val}</div>
              <div className="text-[#555570] font-mono text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-[#1e1e2e]" />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[#555570] font-mono text-xs tracking-widest uppercase mb-2">
          Challenge Categories
        </p>
        <h2 className="text-2xl font-black mb-8">What You&apos;ll Be Exploiting</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                }}
                className={`bg-[#11111a] border p-5 transition-all ${f.border} hover:shadow-[0_0_16px_rgba(0,0,0,0.3)]`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                      className={`w-7 h-7 flex items-center justify-center bg-[#0a0a0f] border ${f.border}`}
                    >
                      <Icon size={14} className={f.color} />
                    </div>
                    <span className="font-bold text-sm">{f.title}</span>
                  </div>
                  <span
                    style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                    className={`text-xs font-mono border px-2 py-0.5 shrink-0 flex items-center gap-1 ${f.badge}`}
                  >
                    {f.difficultyFrom} <MoveRight size={10} /> {f.difficultyTo}
                  </span>
                </div>
                <p className="text-[#555570] font-mono text-xs leading-relaxed">
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="border-t border-[#1e1e2e]" />
      <section className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-[#555570] font-mono text-xs tracking-widest uppercase mb-2">
          How It Works
        </p>
        <h2 className="text-2xl font-black mb-8">Four Steps to Your First Flag</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                style={{
                  clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                }}
                className="bg-[#11111a] border border-[#1e1e2e] p-5 flex gap-4"
              >
                <span className="text-[#00ff88] font-black font-mono text-2xl leading-none shrink-0">
                  {s.num}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-[#00ff88]" />
                    <span className="font-bold text-sm">{s.title}</span>
                  </div>
                  <p className="text-[#555570] font-mono text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="border-t border-[#1e1e2e]" />
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-black mb-3">Ready to Start?</h2>
        <p className="text-[#555570] font-mono text-xs mb-8">
          Create a free account and start solving challenges right away.
        </p>
        <Link
          href={user ? "/lab" : "/register"}
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
          className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-bold text-sm px-8 py-3 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {user ? "Go to Lab" : "Create Account"} <ChevronRight size={14} />
        </Link>
      </section>

      <div className="border-t border-[#1e1e2e] px-6 py-6 text-center">
        <span className="text-[#333350] font-mono text-xs">
          NzrCTF Lab — Web Security Challenge Platform
        </span>
      </div>

    </div>
  )
}