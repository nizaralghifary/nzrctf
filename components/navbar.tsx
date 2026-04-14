"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  User, 
  Trophy, 
  X, 
  Menu, 
  FlaskConical, 
  Swords, 
  BarChart2, 
  History, 
  LogOut, 
  ArrowRight, 
  ChevronDown, 
  Database, 
  Code2, 
  ShieldOff, 
  Globe 
} from "lucide-react"

type NavbarProps = {
  username?: string | null
  email?: string | null
  totalPoints?: number
  isLoggedIn: boolean
  logoutAction?: () => Promise<void>
}

const chapters = [
  { slug: "chapter-01", label: "SQL Injection", icon: Database },
  { slug: "chapter-02", label: "Cross-Site Scripting", icon: Code2 },
  { slug: "chapter-03", label: "Broken Access Control", icon: ShieldOff },
  { slug: "chapter-04", label: "SSRF", icon: Globe }
]

const navItems = [
  { href: "/lab", label: "Lab", icon: FlaskConical, exact: true },
  { href: "/lab/leaderboard", label: "Leaderboard", icon: BarChart2, exact: false },
  { href: "/lab/submissions", label: "Submissions", icon: History, exact: false }
]

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname.startsWith(href)
}

const btn = "border-[3px] border-[#111] transition-all shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
const btnLg = "border-[3px] border-[#111] transition-all shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"

export default function Navbar({ username, email, totalPoints = 0, isLoggedIn, logoutAction }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [challengesOpen, setChallengesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
    setChallengesOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const displayName = username ?? email ?? "Hacker"
  const isChallengeActive = pathname.startsWith("/lab/challenge")

  return (
    <>
      <nav className="border-b-[3px] border-[#111] bg-[#f0ebe0] sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
          NzrCTF<span className="text-[#ff3c00]"> Lab</span>
        </Link>

        {isLoggedIn ? (
          <div className="hidden sm:flex items-center gap-1.5">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-mono text-xs px-3 py-2 border-[3px] border-[#111] transition-all ${
                    active
                      ? "bg-[#111] text-[#f0ebe0] translate-x-[2px] translate-y-[2px]"
                      : `bg-[#f0ebe0] text-[#111] ${btn}`
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="w-px h-4 bg-[#ccc] mx-1" />

            <Link
              href="/lab/account"
              className={`font-mono flex items-center gap-1.5 text-xs px-3 py-2 border-[3px] border-[#111] transition-all ${
                pathname.startsWith("/lab/account")
                  ? "bg-[#111] text-[#f0ebe0] translate-x-[2px] translate-y-[2px]"
                  : `bg-[#f0ebe0] text-[#111] ${btn}`
              }`}
            >
              <User size={11} strokeWidth={2.5} />
              {displayName}
            </Link>

            <div className="font-mono flex items-center gap-1.5 bg-[#ffe87a] border-[3px] border-[#111] text-[#111] text-xs px-3 py-2">
              <Trophy size={11} strokeWidth={2.5} />
              {totalPoints} pts
            </div>

            {logoutAction && (
              <form action={logoutAction}>
                <button className={`font-mono text-xs px-3 py-2 bg-[#f0ebe0] text-[#111] ${btn}`}>
                  Logout
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login" className={`font-mono text-xs px-4 py-2 bg-[#f0ebe0] text-[#111] ${btn}`}>
              Login
            </Link>
            <Link href="/register" className={`nb-btn font-mono flex items-center gap-1.5 text-xs px-4 py-2 bg-[#ff3c00] text-[#f0ebe0] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]`}>
              Register <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`sm:hidden p-1.5 bg-[#f0ebe0] ${btn}`}
          aria-label="toggle-menu"
        >
          {open ? <X size={16} strokeWidth={2.5} /> : <Menu size={16} strokeWidth={2.5} />}
        </button>
      </nav>

      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] sm:hidden"
        style={{
          background: "rgba(240,235,224,0.6)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease",
        }}
      />

      <div
        className="fixed top-0 right-0 h-full w-72 z-[70] sm:hidden flex flex-col bg-[#f0ebe0] border-l-[3px] border-[#111]"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-[3px] border-[#111]">
          <span className="text-base tracking-tight" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
            NzrCTF<span className="text-[#ff3c00]"> Lab</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className={`p-1 bg-[#f0ebe0] ${btn}`}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {isLoggedIn ? (
          <>
            <Link
              href="/lab/account"
              className={`mx-4 mt-4 border-[3px] border-[#111] p-4 transition-all ${
                pathname.startsWith("/lab/account")
                  ? "bg-[#ffe87a]"
                  : `bg-white ${btnLg}`
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 bg-[#111] flex items-center justify-center shrink-0">
                  <User size={13} color="#f0ebe0" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm font-medium truncate">{displayName}</div>
                  {email && username && (
                    <div className="text-[#888] text-xs font-mono truncate">{email}</div>
                  )}
                </div>
                <ArrowRight size={13} strokeWidth={2.5} className="shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <Trophy size={10} strokeWidth={2.5} />
                {totalPoints} pts
              </div>
            </Link>

            <div className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(pathname, item.href, item.exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 border-[3px] border-[#111] font-mono text-sm transition-all ${
                      active
                        ? "bg-[#111] text-[#f0ebe0] translate-x-[3px] translate-y-[3px]"
                        : `bg-white text-[#111] ${btnLg}`
                    }`}
                  >
                    <Icon size={14} strokeWidth={2} />
                    {item.label}
                    {active && <ArrowRight size={12} strokeWidth={2.5} className="ml-auto" />}
                  </Link>
                )
              })}

              <div>
                <button
                  onClick={() => setChallengesOpen(!challengesOpen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-[3px] border-[#111] font-mono text-sm transition-all ${
                    isChallengeActive
                      ? "bg-[#111] text-[#f0ebe0] translate-x-[3px] translate-y-[3px]"
                      : `bg-white text-[#111] ${btnLg}`
                  }`}
                >
                  <Swords size={14} strokeWidth={2} />
                  Challenges
                  <ChevronDown
                    size={12}
                    strokeWidth={2.5}
                    className="ml-auto transition-transform duration-200"
                    style={{ transform: challengesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: challengesOpen ? "400px" : "0px" }}
                >
                  <div className="pl-3 pt-2 flex flex-col gap-2">
                    {chapters.map((ch) => {
                      const Icon = ch.icon
                      const active = pathname === `/lab/challenge/${ch.slug}`
                      return (
                        <Link
                          key={ch.slug}
                          href={`/lab/challenge/${ch.slug}`}
                          className={`flex items-center gap-2.5 px-3 py-2.5 border-[3px] border-[#111] font-mono text-xs transition-all ${
                            active
                              ? "bg-[#111] text-[#f0ebe0] translate-x-[2px] translate-y-[2px]"
                              : `bg-white text-[#111] ${btn}`
                          }`}
                        >
                          <Icon size={12} strokeWidth={2.5} />
                          {ch.label}
                          {active && <ArrowRight size={10} strokeWidth={2.5} className="ml-auto" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 border-t-[3px] border-[#111]">
              {logoutAction && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className={`w-full flex items-center gap-3 px-4 py-3 border-[3px] border-[#111] bg-[#ff3c00] text-[#f0ebe0] font-mono text-sm ${btnLg}`}
                  >
                    <LogOut size={14} strokeWidth={2.5} />
                    Logout
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 px-4 py-6 flex flex-col gap-3">
            <Link
              href="/login"
              className={`flex items-center justify-center px-4 py-3 border-[3px] border-[#111] bg-white text-[#111] font-mono text-sm ${btnLg}`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={`flex items-center justify-center gap-2 px-4 py-3 border-[3px] border-[#111] bg-[#ff3c00] text-[#f0ebe0] font-mono text-sm ${btnLg}`}
            >
              Register <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}