"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "@/lib/actions/auth"
import { ArrowRight, AlertTriangle, Eye, EyeOff } from "lucide-react"

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_BTN = "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)"
const CUT_SM = "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)"

const navFont = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await login(emailOrUsername, password)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-[#f4efe4] text-black flex items-center justify-center px-4"
      style={navFont}
    >
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-black text-xl tracking-tight text-black"
            style={navFont}
          >
            NzrCTF<span className="text-[#00e676]"> Lab</span>
          </Link>
          <p className="text-[#666] text-xs mt-1 font-bold uppercase tracking-widest" style={monoFont}>
            CTF Challenge Platform
          </p>
        </div>

        <div
          className="bg-white border-4 border-black shadow-[8px_8px_0_#111] p-6"
          style={{ clipPath: CUT }}
        >
          <div className="mb-6">
            <h2 className="font-black text-lg uppercase text-black" style={navFont}>Login</h2>
            <p className="text-[#555] text-xs font-bold mt-0.5" style={monoFont}>
              Good to have you back
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[#444] text-xs font-black uppercase tracking-widest mb-1.5" style={monoFont}>
                Email or Username
              </label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="h4ck3r or you@example.com"
                className="w-full bg-[#f4efe4] border-4 border-black text-black text-sm px-3 py-2.5 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
                style={{ ...monoFont, clipPath: CUT_SM }}
              />
            </div>

            <div>
              <label className="block text-[#444] text-xs font-black uppercase tracking-widest mb-1.5" style={monoFont}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f4efe4] border-4 border-black text-black text-sm px-3 py-2.5 pr-12 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
                  style={{ ...monoFont, clipPath: CUT_SM }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                  title="Toggle visibility"
                  style={{ clipPath: CUT_BTN }}
                >
                  {showPass
                    ? <EyeOff size={11} strokeWidth={3} />
                    : <Eye size={11} strokeWidth={3} />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 bg-[#fff0f3] border-4 border-[#ff3c6e] text-[#ff3c6e] text-xs font-black px-3 py-2.5"
                style={{ ...monoFont, clipPath: CUT_SM }}
              >
                <AlertTriangle size={13} className="shrink-0 mt-0.5" strokeWidth={3} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#00e676] border-4 border-black text-black font-black text-sm py-3 uppercase tracking-wide shadow-[5px_5px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[3px] hover:translate-y-[3px] active:shadow-none active:translate-x-[5px] active:translate-y-[5px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
              style={{ ...navFont, clipPath: CUT_BTN }}
            >
              {loading ? "Hold on..." : <>Login <ArrowRight size={15} strokeWidth={3} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-[#888] text-xs font-black uppercase mt-5" style={monoFont}>
          No account yet?{" "}
          <Link
            href="/register"
            className="text-black underline underline-offset-2 hover:text-[#00e676] transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}