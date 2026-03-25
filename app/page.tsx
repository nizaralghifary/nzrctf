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
  ArrowRight,
  Zap,
} from "lucide-react"

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_SM = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))"
const CUT_BTN = "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)"
const CUT_BADGE = "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)"

const features = [
  {
    icon: Database,
    title: "SQL Injection",
    description: "Bypass login panels, dump database contents, exploit unsanitized queries. Classic but never gets old.",
    accent: "#ff3c6e",
    bg: "#fff0f3",
  },
  {
    icon: Code2,
    title: "Cross-Site Scripting",
    description: "Inject scripts, steal cookies, hijack sessions. The browser is your playground.",
    accent: "#e6c200",
    bg: "#fffbe0",
  },
  {
    icon: ShieldOff,
    title: "Broken Access Control",
    description: "Touch things you're not supposed to. Manipulate references, escalate privileges, go where you shouldn't.",
    accent: "#0066ff",
    bg: "#eef3ff",
  },
  {
    icon: Globe,
    title: "SSRF / LFI / XXE",
    description: "Hit internal services, read sensitive files, bend XML parsers to your will.",
    accent: "#9900cc",
    bg: "#f8eeff",
  },
]

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Make an account",
    desc: "Pick a username, drop your email, set a password. That's it.",
  },
  {
    num: "02",
    icon: LayoutDashboard,
    title: "Pick a challenge",
    desc: "Four categories of web security chaos. Start wherever you want.",
  },
  {
    num: "03",
    icon: Flag,
    title: "Hunt the flag",
    desc: "Find the vulnerability, exploit it, grab the hidden flag.",
  },
  {
    num: "04",
    icon: Trophy,
    title: "Submit & score",
    desc: "Drop the flag, collect points, climb the board.",
  },
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
    profile = data ? { username: data.username } : null
  }

  return (
    <div
      className="min-h-screen bg-[#f4efe4] text-[#111]"
      style={{ fontFamily: "'Arial Black', 'Haettenschweiler', Impact, sans-serif" }}
    >
      <NavbarServer />

      <section className="max-w-5xl mx-auto px-5 pt-16 pb-12">
        <div
          className="bg-white border-4 border-black shadow-[10px_10px_0_#111] p-8 md:p-12 relative overflow-hidden"
          style={{ clipPath: CUT }}
        >
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[72px] border-r-[72px] border-t-[#00e676] border-r-transparent" />

          <div
            className="inline-block bg-[#00e676] border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest mb-7"
            style={{ fontFamily: "monospace", clipPath: CUT_BADGE, transform: "rotate(-1.2deg)" }}
          >
            Web Security CTF Platform
          </div>

          <h1
            className="text-5xl md:text-7xl font-black uppercase leading-none mb-6 tracking-tight"
            style={{ fontFamily: "'Arial Black', Impact, sans-serif", lineHeight: 0.92 }}
          >
            Learn Security
            <br />
            <span
              className="bg-black text-white px-2 py-1"
              style={{ display: "inline-block", transform: "skewX(-2deg)", clipPath: CUT_BTN }}
            >
              By Breaking
            </span>
            <br />
            Stuff
          </h1>

          <p
            className="text-[15px] font-bold text-[#444] max-w-lg mt-4 mb-9 leading-snug"
            style={{ fontFamily: "'Courier New', monospace" }}
          >
            A hands-on CTF platform for real web vulnerabilities. No slides,
            no theory. Just you, a broken app, and a flag to find.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href={user ? "/lab" : "/register"}
              className="inline-flex items-center gap-2 bg-[#00e676] border-4 border-black text-black font-black text-sm px-6 py-3 uppercase tracking-wide shadow-[5px_5px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:shadow-none active:translate-x-[5px] active:translate-y-[5px]"
              style={{ clipPath: CUT_BTN }}
            >
              {user ? "Go to Lab" : "Start Hacking"} <ArrowRight size={16} strokeWidth={3} />
            </Link>
            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white border-4 border-black text-black font-black text-sm px-6 py-3 uppercase tracking-wide shadow-[5px_5px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                style={{ clipPath: CUT_BTN }}
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="flex flex-wrap mt-10 border-t-4 border-black pt-6">
            {[
              { val: "4",  label: "Categories"      },
              { val: "7+", label: "Challenges"      },
              { val: "3",  label: "Difficulties"    },
              { val: "∞",  label: "Things to Learn" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-3 text-center ${i < 3 ? "border-r-4 border-black" : ""}`}
              >
                <div className="text-3xl font-black" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
                  {s.val}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#666] mt-0.5" style={{ fontFamily: "monospace" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-4 h-9 bg-black" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#888] mb-0.5" style={{ fontFamily: "monospace" }}>
              Challenge Categories
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
              What You'll Break
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="border-4 border-black p-5 shadow-[6px_6px_0_#111] hover:shadow-[3px_3px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all cursor-default"
                style={{ backgroundColor: f.bg, clipPath: CUT }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: f.accent, border: "3px solid #111", clipPath: CUT_SM }}
                  >
                    <Icon size={16} color="#fff" strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-wide">{f.title}</span>
                </div>
                <p className="text-sm text-[#333] leading-snug" style={{ fontFamily: "'Courier New', monospace", fontWeight: 600 }}>
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-4 h-9 bg-[#00e676] border-r-4 border-black" />
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#888] mb-0.5" style={{ fontFamily: "monospace" }}>
              How It Works
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
              Four Steps to Your First Flag
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                className="bg-white border-4 border-black p-5 flex gap-4 shadow-[6px_6px_0_#111] hover:shadow-[3px_3px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
                style={{ clipPath: CUT }}
              >
                <span
                  className="text-5xl font-black leading-none shrink-0 select-none"
                  style={{ fontFamily: "'Arial Black', Impact, sans-serif", color: "#e8e2d8", WebkitTextStroke: "2px #111" }}
                >
                  {s.num}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={15} strokeWidth={2.5} />
                    <span className="font-black text-sm uppercase tracking-wide">{s.title}</span>
                  </div>
                  <p className="text-sm text-[#555] leading-snug" style={{ fontFamily: "'Courier New', monospace", fontWeight: 600 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-10 pb-20">
        <div
          className="border-4 border-black bg-[#00e676] p-10 text-center shadow-[10px_10px_0_#111]"
          style={{ clipPath: CUT }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 bg-black border-4 border-black mb-5"
            style={{ clipPath: CUT_SM }}
          >
            <Zap size={26} color="#00e676" strokeWidth={3} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-black uppercase mb-3 tracking-tight text-black"
            style={{ fontFamily: "'Arial Black', Impact, sans-serif", lineHeight: 0.95 }}
          >
            Ready to Start?
          </h2>
          <p className="text-sm mb-8 text-[#1a4a2a]" style={{ fontFamily: "'Courier New', monospace", fontWeight: 600 }}>
            Free account. No credit card. Just a browser and curiosity.
          </p>
          <Link
            href={user ? "/lab" : "/register"}
            className="inline-flex items-center gap-2 bg-black border-4 border-black text-white font-black text-sm px-8 py-3 uppercase tracking-wide shadow-[5px_5px_0_#1a4a2a] hover:shadow-[2px_2px_0_#1a4a2a] hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
            style={{ clipPath: CUT_BTN }}
          >
            {user ? "Go to Lab" : "Create Free Account"} <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </section>

      <footer className="border-t-4 border-black bg-white px-6 py-5 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-[#bbb]" style={{ fontFamily: "monospace" }}>
          NzrCTF Lab — Web Security Challenge Platform
        </span>
      </footer>
    </div>
  )
}