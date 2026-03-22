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
  ChevronRight,
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
  { slug: "chapter-01", label: "SQL Injection", icon: Database, color: "text-[#ff3c6e]", border: "border-[#ff3c6e]/30" },
  { slug: "chapter-02", label: "Cross-Site Scripting", icon: Code2, color: "text-[#ffd700]", border: "border-[#ffd700]/30" },
  { slug: "chapter-03", label: "Broken Access Control", icon: ShieldOff, color: "text-[#00bfff]", border: "border-[#00bfff]/30" },
  { slug: "chapter-04", label: "SSRF / LFI / XXE", icon: Globe, color: "text-[#bf5fff]", border: "border-[#bf5fff]/30" },
]

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
      <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/95 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-[#00ff88] font-black font-mono text-lg tracking-tight">
          NzrCTF<span className="text-white"> Lab</span>
        </Link>

        {/* Desktop */}
        {isLoggedIn ? (
          <div className="hidden sm:flex items-center gap-5">
            <Link
              href="/lab"
              className={`font-mono text-xs transition-colors ${pathname.startsWith("/lab") ? "text-[#00ff88]" : "text-[#555570] hover:text-white"}`}
            >
              Lab
            </Link>
            <Link
              href="/leaderboard"
              className={`font-mono text-xs transition-colors ${pathname.startsWith("/leaderboard") ? "text-[#00ff88]" : "text-[#555570] hover:text-white"}`}
            >
              Leaderboard
            </Link>
            <Link
              href="/submissions"
              className={`font-mono text-xs transition-colors ${pathname.startsWith("/submissions") ? "text-[#00ff88]" : "text-[#555570] hover:text-white"}`}
            >
              Submissions
            </Link>
            <div className="w-px h-4 bg-[#1e1e2e]" />
            <Link
              href="/account"
              className={`flex items-center gap-1.5 font-mono text-xs transition-colors ${pathname.startsWith("/account") ? "text-[#00ff88]" : "text-[#555570] hover:text-white"}`}
            >
              <User size={12} className={pathname.startsWith("/account") ? "text-[#00ff88]" : "text-[#00ff88]"} />
              <span>{displayName}</span>
            </Link>
            <div className="flex items-center gap-1.5 text-[#00ff88] font-mono text-xs font-bold">
              <Trophy size={12} />
              <span>{totalPoints} pts</span>
            </div>
            {logoutAction && (
              <form action={logoutAction}>
                <button className="text-[#555570] hover:text-white font-mono text-xs transition-colors">
                  Logout
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/login" className="text-[#555570] hover:text-white font-mono text-xs transition-colors px-3 py-1.5">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-[#00ff88] text-black font-bold font-mono text-xs px-3 py-1.5 rounded hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              Register <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-[#555570] hover:text-white transition-colors p-1"
          aria-label="toggle-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-60 sm:hidden"
        style={{
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mobile Menu */}
      <div
        className="fixed top-0 right-0 h-full w-72 z-70 sm:hidden flex flex-col"
        style={{
          background: "#0d0d18",
          borderLeft: "1px solid #1e1e2e",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
          <span className="text-[#00ff88] font-black font-mono text-base tracking-tight">
            NzrCTF<span className="text-white"> Lab</span>
          </span>
          <button onClick={() => setOpen(false)} className="text-[#555570] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {isLoggedIn ? (
          <>
            <div className="px-5 py-4 border-b border-[#1e1e2e]">
              <Link
                href="/account"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                className={`block bg-[#11111a] border px-4 py-3 transition-all ${
                  pathname.startsWith("/account") ? "border-[#00ff88]/30" : "border-[#1e1e2e] hover:border-[#333355]"
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    style={{ clipPath: "polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%)" }}
                    className="w-8 h-8 bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center shrink-0"
                  >
                    <User size={14} className="text-[#00ff88]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-bold text-sm font-mono truncate">{displayName}</div>
                    {email && username && (
                      <div className="text-[#555570] font-mono text-xs truncate">{email}</div>
                    )}
                  </div>
                  <ChevronRight size={13} className="text-[#555570] shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 text-[#00ff88] font-mono text-xs font-bold">
                  <Trophy size={11} />
                  <span>{totalPoints} pts</span>
                </div>
              </Link>
            </div>

            <div className="flex-1 px-4 py-4 flex flex-col gap-1.5 overflow-y-auto">
              <Link
                href="/lab"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold transition-all ${
                  pathname.startsWith("/lab")
                    ? "bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                    : "bg-[#11111a] border border-[#1e1e2e] text-[#555570] hover:text-white hover:border-[#333355]"
                }`}
              >
                <FlaskConical size={15} />
                Lab
                {pathname.startsWith("/lab") && <ChevronRight size={13} className="ml-auto" />}
              </Link>

              <div>
                <button
                  onClick={() => setChallengesOpen(!challengesOpen)}
                  style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold transition-all ${
                    isChallengeActive
                      ? "bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                      : "bg-[#11111a] border border-[#1e1e2e] text-[#555570] hover:text-white hover:border-[#333355]"
                  }`}
                >
                  <Swords size={15} />
                  Challenges
                  <ChevronDown
                    size={13}
                    className="ml-auto transition-transform duration-200"
                    style={{ transform: challengesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: challengesOpen ? "300px" : "0px" }}
                >
                  <div className="pl-4 pt-1.5 flex flex-col gap-1.5">
                    {chapters.map((chapter) => {
                      const Icon = chapter.icon
                      const active = pathname === `/challenge/${chapter.slug}`
                      return (
                        <Link
                          key={chapter.slug}
                          href={`/challenge/${chapter.slug}`}
                          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                          className={`flex items-center gap-2.5 px-3 py-2.5 font-mono text-xs font-bold transition-all ${
                            active
                              ? `bg-[#0a0a0f] border ${chapter.border} ${chapter.color}`
                              : "bg-[#0a0a0f] border border-[#1e1e2e] text-[#555570] hover:text-white hover:border-[#333355]"
                          }`}
                        >
                          <Icon size={13} className={active ? chapter.color : ""} />
                          {chapter.label}
                          {active && <ChevronRight size={11} className="ml-auto" />}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              <Link
                href="/leaderboard"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold transition-all ${
                  pathname.startsWith("/leaderboard")
                    ? "bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                    : "bg-[#11111a] border border-[#1e1e2e] text-[#555570] hover:text-white hover:border-[#333355]"
                }`}
              >
                <BarChart2 size={15} />
                Leaderboard
                {pathname.startsWith("/leaderboard") && <ChevronRight size={13} className="ml-auto" />}
              </Link>

              <Link
                href="/submissions"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                className={`flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold transition-all ${
                  pathname.startsWith("/submissions")
                    ? "bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88]"
                    : "bg-[#11111a] border border-[#1e1e2e] text-[#555570] hover:text-white hover:border-[#333355]"
                }`}
              >
                <BookOpenText size={15} />
                Submissions
                {pathname.startsWith("/submissions") && <ChevronRight size={13} className="ml-auto" />}
              </Link>
            </div>

            <div className="px-4 py-4 border-t border-[#1e1e2e]">
              {logoutAction && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-[#11111a] border border-[#ff3c6e]/20 text-[#ff3c6e] font-mono text-sm font-bold hover:border-[#ff3c6e]/40 transition-all"
                  >
                    <LogOut size={15} />
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
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
              className="flex items-center justify-center px-4 py-3 bg-[#11111a] border border-[#1e1e2e] text-white font-mono text-sm font-bold hover:border-[#333355] transition-all"
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)" }}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00ff88] text-black font-mono text-sm font-bold hover:opacity-90 transition-all"
            >
              Register <ChevronRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}