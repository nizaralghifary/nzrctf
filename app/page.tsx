import Link from "next/link"
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
} from "lucide-react"

export default function LandingPage() {
  const features = [
    {
      icon: Database,
      title: "SQL Injection",
      description: "Bypass login panels, extract database contents, and exploit poorly sanitized queries.",
      difficulty: "Easy to Hard",
      color: "text-[#ff3c6e] border-[#ff3c6e]/30 bg-[#ff3c6e]/10",
      iconColor: "text-[#ff3c6e]",
    },
    {
      icon: Code2,
      title: "Cross-Site Scripting",
      description: "Inject malicious scripts, steal cookies, and hijack user sessions.",
      difficulty: "Easy to Hard",
      color: "text-[#ffd700] border-[#ffd700]/30 bg-[#ffd700]/10",
      iconColor: "text-[#ffd700]",
    },
    {
      icon: ShieldOff,
      title: "Broken Access Control",
      description: "Access resources you shouldn't, manipulate object references, and escalate privileges.",
      difficulty: "Medium to Hard",
      color: "text-[#00bfff] border-[#00bfff]/30 bg-[#00bfff]/10",
      iconColor: "text-[#00bfff]",
    },
    {
      icon: Globe,
      title: "SSRF / LFI / XXE",
      description: "Reach internal services, read sensitive files, and exploit XML parsers.",
      difficulty: "Medium to Hard",
      color: "text-[#bf5fff] border-[#bf5fff]/30 bg-[#bf5fff]/10",
      iconColor: "text-[#bf5fff]",
    },
  ]

  const steps = [
    {
      num: "01",
      icon: UserPlus,
      title: "Create an account",
      desc: "Register with your username, email, and password.",
    },
    {
      num: "02",
      icon: LayoutDashboard,
      title: "Pick a challenge",
      desc: "Browse challenges across 4 web security categories.",
    },
    {
      num: "03",
      icon: Flag,
      title: "Find the flag",
      desc: "Exploit the vulnerability and retrieve the hidden flag.",
    },
    {
      num: "04",
      icon: Trophy,
      title: "Submit & score",
      desc: "Submit your flag to earn points and climb the leaderboard.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/95 sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <span className="text-[#00ff88] font-black font-mono text-lg tracking-tight">
          NzrCTF
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[#555570] hover:text-white font-mono text-xs transition-colors px-3 py-1.5"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[#00ff88] text-black font-bold font-mono text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Register <ChevronRight size={12} />
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] font-mono text-xs px-3 py-1 rounded mb-6 tracking-widest uppercase">
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
            href="/register"
            className="bg-[#00ff88] text-black font-bold text-sm px-6 py-3 rounded hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            Start Hacking <ChevronRight size={14} />
          </Link>
          <Link
            href="/login"
            className="bg-[#11111a] border border-[#1e1e2e] text-white font-bold text-sm px-6 py-3 rounded hover:border-[#333355] transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="flex items-center justify-center gap-8 mt-14 flex-wrap">
          {[
            { val: "4", label: "Categories" },
            { val: "10+", label: "Challenges" },
            { val: "3", label: "Difficulty Levels" },
            { val: "∞", label: "Things to Learn" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-[#00ff88] font-mono">{stat.val}</div>
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
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-[#11111a] border border-[#1e1e2e] rounded-lg p-5 hover:border-[#333355] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className={f.iconColor} />
                    <span className="font-bold text-sm">{f.title}</span>
                  </div>
                  <span className={`text-xs font-mono border px-1.5 py-0.5 rounded shrink-0 ${f.color}`}>
                    {f.difficulty}
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
        <div className="grid sm:grid-cols-2 gap-4">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.num} className="bg-[#11111a] border border-[#1e1e2e] rounded-lg p-5 flex gap-4">
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
          href="/register"
          className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-bold text-sm px-8 py-3 rounded hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Create Account <ChevronRight size={14} />
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