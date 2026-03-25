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
  BookOpenText,
  LogOut,
  ArrowRight,
  ChevronDown,
  Database,
  Code2,
  ShieldOff,
  Globe,
} from "lucide-react"

type NavbarProps = {
  username?: string | null
  email?: string | null
  totalPoints?: number
  isLoggedIn: boolean
  logoutAction?: () => Promise<void>
}

const chapters = [
  { slug: "chapter-01", label: "SQL Injection",        icon: Database,  accent: "#ff3c6e" },
  { slug: "chapter-02", label: "Cross-Site Scripting",  icon: Code2,     accent: "#e6c200" },
  { slug: "chapter-03", label: "Broken Access Control", icon: ShieldOff, accent: "#0066ff" },
  { slug: "chapter-04", label: "SSRF / LFI / XXE",      icon: Globe,     accent: "#9900cc" },
]

const navFont  = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

const CUT     = "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))"
const CUT_SM  = "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px))"
const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"

const press = "shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
const pressBig = "shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"

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
  const isChallengeActive = pathname.startsWith("/challenge")

  return (
    <>
      <nav
        className="border-b-4 border-black bg-white sticky top-0 z-50 px-5 py-3 flex items-center justify-between"
        style={navFont}
      >
        <Link
          href="/"
          className="font-black text-base tracking-tight"
          style={navFont}
        >
          NzrCTF<span className="text-[#00e676]"> Lab</span>
        </Link>

        {isLoggedIn ? (
          <div className="hidden sm:flex items-center gap-1">
            {[
              { href: "/lab",         label: "Lab"         },
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/submissions", label: "Submissions"  },
            ].map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-black uppercase px-3 py-2 border-2 border-black transition-all ${
                    active
                      ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                      : `bg-white text-black ${press}`
                  }`}
                  style={{ ...monoFont, clipPath: CUT_BTN }}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="w-px h-5 bg-black mx-2" />

            <Link
              href="/account"
              className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-2 border-2 border-black transition-all ${
                pathname.startsWith("/account")
                  ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]"
                  : `bg-white text-black ${press}`
              }`}
              style={{ ...monoFont, clipPath: CUT_BTN }}
            >
              <User size={12} strokeWidth={3} />
              {displayName}
            </Link>

            <div
              className="flex items-center gap-1.5 bg-[#00e676] border-2 border-black text-black text-xs font-black uppercase px-3 py-2"
              style={{ ...monoFont, clipPath: CUT_BTN }}
            >
              <Trophy size={12} strokeWidth={3} />
              {totalPoints} pts
            </div>

            {logoutAction && (
              <form action={logoutAction}>
                <button
                  className={`text-xs font-black uppercase px-3 py-2 border-2 border-black text-black bg-white ${press}`}
                  style={{ ...monoFont, clipPath: CUT_BTN }}
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className={`text-xs font-black uppercase px-4 py-2 border-2 border-black bg-white text-black ${press}`}
              style={{ ...monoFont, clipPath: CUT_BTN }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`flex items-center gap-1.5 text-xs font-black uppercase px-4 py-2 border-2 border-black bg-[#00e676] text-black ${press}`}
              style={{ ...monoFont, clipPath: CUT_BTN }}
            >
              Register <ArrowRight size={12} strokeWidth={3} />
            </Link>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`sm:hidden border-2 border-black p-1.5 bg-white ${press}`}
          aria-label="toggle-menu"
        >
          {open ? <X size={18} strokeWidth={3} /> : <Menu size={18} strokeWidth={3} />}
        </button>
      </nav>

      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] sm:hidden"
        style={{
          background: "rgba(244,239,228,0.55)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      <div
        className="fixed top-0 right-0 h-full w-72 z-[70] sm:hidden flex flex-col bg-[#f4efe4] border-l-4 border-black"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          ...navFont,
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-4 border-black bg-white">
          <span className="font-black text-base tracking-tight" style={navFont}>
            NzrCTF<span className="text-[#00e676]"> Lab</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            className={`border-2 border-black p-1 bg-white ${press}`}
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {isLoggedIn ? (
          <>
            <Link
              href="/account"
              className={`mx-4 mt-4 border-4 border-black p-4 ${pressBig} ${
                pathname.startsWith("/account") ? "bg-[#00e676]" : "bg-white"
              }`}
              style={{ clipPath: CUT }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 bg-black flex items-center justify-center shrink-0"
                  style={{ clipPath: CUT_SM }}
                >
                  <User size={14} color="#00e676" strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black text-sm uppercase truncate" style={navFont}>{displayName}</div>
                  {email && username && (
                    <div className="text-[#666] text-xs truncate" style={monoFont}>{email}</div>
                  )}
                </div>
                <ArrowRight size={14} strokeWidth={3} className="shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase" style={monoFont}>
                <Trophy size={11} strokeWidth={3} />
                {totalPoints} pts
              </div>
            </Link>

            <div className="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
              {[
                { href: "/lab",         label: "Lab",         icon: FlaskConical },
                { href: "/leaderboard", label: "Leaderboard", icon: BarChart2    },
                { href: "/submissions", label: "Submissions",  icon: BookOpenText },
              ].map((item) => {
                const Icon = item.icon
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 border-4 border-black font-black text-sm uppercase transition-all ${
                      active
                        ? "bg-black text-white shadow-none translate-x-[4px] translate-y-[4px]"
                        : `bg-white text-black ${pressBig}`
                    }`}
                    style={{ ...navFont, clipPath: CUT }}
                  >
                    <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                    {item.label}
                    {active && <ArrowRight size={13} strokeWidth={3} className="ml-auto" />}
                  </Link>
                )
              })}

              <div>
                <button
                  onClick={() => setChallengesOpen(!challengesOpen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-4 border-black font-black text-sm uppercase transition-all ${
                    isChallengeActive
                      ? "bg-black text-white shadow-none translate-x-[4px] translate-y-[4px]"
                      : `bg-white text-black ${pressBig}`
                  }`}
                  style={{ ...navFont, clipPath: CUT }}
                >
                  <Swords size={15} strokeWidth={2} />
                  Challenges
                  <ChevronDown
                    size={13}
                    strokeWidth={3}
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
                      const active = pathname === `/challenge/${ch.slug}`
                      return (
                        <Link
                          key={ch.slug}
                          href={`/challenge/${ch.slug}`}
                          className={`flex items-center gap-2.5 px-3 py-2.5 border-4 border-black text-xs font-black uppercase transition-all ${
                            active
                              ? "shadow-none translate-x-[3px] translate-y-[3px]"
                              : press
                          }`}
                          style={{
                            ...navFont,
                            clipPath: CUT,
                            backgroundColor: active ? ch.accent : "white",
                            color: active ? "white" : "#111",
                          }}
                        >
                          <Icon size={13} strokeWidth={2.5} />
                          {ch.label}
                          {active && <ArrowRight size={11} strokeWidth={3} className="ml-auto" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 border-t-4 border-black">
              {logoutAction && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className={`w-full flex items-center gap-3 px-4 py-3 border-4 border-black bg-[#ff3c6e] text-white font-black text-sm uppercase ${pressBig}`}
                    style={{ ...navFont, clipPath: CUT }}
                  >
                    <LogOut size={15} strokeWidth={2.5} />
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
              className={`flex items-center justify-center px-4 py-3 border-4 border-black bg-white text-black font-black text-sm uppercase ${pressBig}`}
              style={{ ...navFont, clipPath: CUT }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className={`flex items-center justify-center gap-2 px-4 py-3 border-4 border-black bg-[#00e676] text-black font-black text-sm uppercase ${pressBig}`}
              style={{ ...navFont, clipPath: CUT }}
            >
              Register <ArrowRight size={13} strokeWidth={3} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}