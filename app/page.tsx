import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import NavbarServer from "@/components/navbar-server"
import { Database, Code2, ShieldOff, Globe, UserPlus, LayoutDashboard, Flag, Trophy, ArrowRight } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single()
    profile = data ? { username: data.username } : null
  }

  const categories = [
    { tag: "sqli", title: "SQL Injection", desc: "Bypass logins, dump tables, read data you're not supposed to see. Old school, still hits.", icon: Database },
    { tag: "xss", title: "Cross-Site Scripting", desc: "Inject scripts, steal cookies, hijack sessions. The browser is your weapon.", icon: Code2 },
    { tag: "bac", title: "Broken Access Control", desc: "Access endpoints you shouldn't, manipulate references, escalate your way up.", icon: ShieldOff },
    { tag: "ssrf", title: "SSRF", desc: "Make the server send requests on your behalf. Hit internal services, bypass firewalls, reach what's supposed to be unreachable.", icon: Globe }
  ]

  const steps = [
    { n: "01", title: "Make an account", desc: "Pick a username, drop your email, set a password. That's it.", icon: UserPlus },
    { n: "02", title: "Pick a challenge", desc: "Four categories, start anywhere. Go at your own pace.", icon: LayoutDashboard },
    { n: "03", title: "Find and exploit", desc: "Spot the vulnerability, exploit it, grab the hidden flag.", icon: Flag },
    { n: "04", title: "Submit and score", desc: "Drop the flag, collect your points, climb the board.", icon: Trophy }
  ]

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111]">
      <NavbarServer />

      <section className="max-w-5xl mx-auto px-6 pt-14 pb-4 fade-up">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <p className="font-mono text-xs text-[#888] mb-5">
              Web Exploit CTF Platform
            </p>
            <h1
              className="text-[clamp(3.2rem,10vw,7rem)] leading-none tracking-tight uppercase mb-6"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              Learn<br />
              to{" "}
              <span
                className="inline-block bg-[#ff3c00] text-[#f0ebe0] px-3 leading-tight"
                style={{ transform: "rotate(-1.5deg)", display: "inline-block" }}
              >
                Break
              </span>
              <br />
              Stuff
            </h1>

            <p className="font-mono text-sm text-[#444] max-w-md leading-relaxed mb-8">
              Hands-on CTF for real web vulnerabilities. No slides —
              just a broken app and a flag to find.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={user ? "/lab" : "/register"}
                className="nb-btn bg-[#ff3c00] text-[#f0ebe0] text-sm px-7 py-3 inline-flex items-center gap-2"
              >
                {user ? "Go to Lab" : "Start Hacking"} <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
              {!user && (
                <Link href="/login" className="nb-btn bg-[#f0ebe0] text-[#111] text-sm px-6 py-3">
                  Login
                </Link>
              )}
            </div>
          </div>

          <div
            className="hidden md:flex flex-col items-start mb-1 shrink-0 pr-8"
            style={{ gap: "10px" }}
          >
            <div
              className="border-[3px] border-[#111] px-6 py-4 text-center"
              style={{ background: "#fff", transform: "rotate(-2.4deg) translateX(8px)", boxShadow: "4px 4px 0 #111", width: "130px" }}
            >
              <div className="text-4xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>7+</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">challenges</div>
            </div>
            <div
              className="border-[3px] border-[#111] px-4 py-2 text-center"
              style={{ background: "#ffe87a", transform: "rotate(1.6deg) translateX(-4px)", boxShadow: "3px 3px 0 #111", width: "100px" }}
            >
              <div className="text-2xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>4</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">categories</div>
            </div>
            <div
              className="border-[3px] border-[#111] px-5 py-3 text-center"
              style={{ background: "#b8f5a0", transform: "rotate(-1.1deg) translateX(12px)", boxShadow: "3px 3px 0 #111", width: "115px" }}
            >
              <div className="text-3xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>3</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">difficulties</div>
            </div>
          </div>

          <div className="md:hidden flex mt-8" style={{ position: "relative", height: "90px" }}>
            <div
              className="border-[3px] border-[#111] px-5 py-3 text-center absolute"
              style={{ background: "#fff", transform: "rotate(-2.4deg)", boxShadow: "4px 4px 0 #111", width: "110px", left: "0px", top: "0px" }}
            >
              <div className="text-3xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>7+</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">challenges</div>
            </div>
            <div
              className="border-[3px] border-[#111] px-4 py-2 text-center absolute"
              style={{ background: "#ffe87a", transform: "rotate(2.8deg)", boxShadow: "3px 3px 0 #111", width: "90px", left: "100px", top: "12px" }}
            >
              <div className="text-2xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>4</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">categories</div>
            </div>
            <div
              className="border-[3px] border-[#111] px-4 py-2 text-center absolute"
              style={{ background: "#b8f5a0", transform: "rotate(-1.8deg)", boxShadow: "3px 3px 0 #111", width: "100px", left: "188px", top: "4px" }}
            >
              <div className="text-2xl leading-none" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>3</div>
              <div className="font-mono text-[10px] text-[#555] mt-0.5">difficulties</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl mb-8" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
          What You'll Break
        </h2>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
          <div className="nb-card-white p-7 flex flex-col justify-between min-h-[240px]">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#111] flex items-center justify-center shrink-0">
                  <Database size={14} color="#f0ebe0" strokeWidth={2} />
                </div>
                <span className="font-mono text-xs text-[#888]">[{categories[0].tag}]</span>
              </div>
              <h3 className="text-3xl leading-tight mb-3" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                {categories[0].title}
              </h3>
              <p className="font-mono text-sm text-[#555] leading-relaxed">
                {categories[0].desc}
              </p>
            </div>
            <div
              className="mt-3 text-[100px] leading-none select-none text-right"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "transparent", WebkitTextStroke: "2px #e8e2d8" }}
            >
              01
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {categories.slice(1).map((f, i) => {
              const Icon = f.icon
              return (
                <div key={f.tag} className="nb-card-white p-5 flex gap-4 items-start">
                  <div className="w-8 h-8 bg-[#111] flex items-center justify-center shrink-0">
                    <Icon size={14} color="#f0ebe0" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] text-[#888]">[{f.tag}]</span>
                    <h3 className="text-base mb-1 mt-0.5" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                      {f.title}
                    </h3>
                    <p className="font-mono text-xs text-[#666] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl mb-10" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
          How It Works
        </h2>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[40px] right-[40px] h-[3px] bg-[#111]" />

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.n} className="relative">
                  <div
                    className="relative z-10 w-16 h-16 border-[3px] border-[#111] flex items-center justify-center mb-4"
                    style={{ background: i === 0 ? "#ff3c00" : i === 3 ? "#ffe87a" : "#f0ebe0", boxShadow: "3px 3px 0 #111" }}
                  >
                    <Icon size={20} strokeWidth={2} color={i === 0 ? "#f0ebe0" : "#111"} />
                  </div>
                  <div className="text-sm mb-1" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                    {s.title}
                  </div>
                  <p className="font-mono text-xs text-[#555] leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="nb-card bg-[#111] p-10 md:p-14 relative overflow-hidden">
          <div
            className="absolute -right-4 -bottom-6 text-[160px] leading-none select-none pointer-events-none"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "transparent", WebkitTextStroke: "2px #222" }}
          >
            CTF
          </div>

          <div className="relative z-10">
            <p className="font-mono text-xs text-[#555] mb-2">Ready to start?</p>
            <br />
            <span 
              className="text-[#ff3c00] text-4xl md:text-6xl uppercase text-[#f0ebe0] leading-none mb-4"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              Break Things
            </span>
            <p className="font-mono text-sm text-[#555] mb-8 max-w-sm leading-relaxed">
              Free account. No credit card. Just a browser and curiosity.
            </p>
            <Link
              href={user ? "/lab" : "/register"}
              className="nb-btn bg-[#ff3c00] text-[#f0ebe0] text-sm px-8 py-3 inline-flex items-center gap-2"
              style={{ boxShadow: "4px 4px 0 #7a1e00" }}
            >
              {user ? "Go to Lab" : "Create Free Account"} <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t-[3px] border-[#111] bg-[#f0ebe0] px-6 py-5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="font-mono text-xs text-[#888]">NzrCTF Lab</span>
          <span className="font-mono text-xs text-[#888]">Made with ❤️ by Nzr</span>
        </div>
      </footer>
    </div>
  )
}