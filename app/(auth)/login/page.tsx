"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "@/lib/actions/auth"
import { ArrowRight, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { Spinner } from "@/components/spinner"

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

  const inputClass = "w-full bg-[#f0ebe0] border-[3px] border-[#111] font-mono text-sm px-3 py-2.5 focus:outline-none focus:bg-white transition-colors placeholder:text-[#bbb]"
  const labelClass = "block font-mono text-[#555] text-xs mb-1.5"

  return (
    <div className="min-h-screen bg-[#f0ebe0] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-xl tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            NzrCTF<span className="text-[#ff3c00]"> Lab</span>
          </Link>
          <p className="font-mono text-[#888] text-xs mt-1">
            CTF Challenge Platform
          </p>
        </div>

        <div className="bg-white border-[3px] border-[#111] shadow-[6px_6px_0_#111] p-6">
          <div className="mb-6">
            <h2 className="text-lg uppercase" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              Login
            </h2>
            <p className="font-mono text-[#888] text-xs mt-0.5">
              Good to have you back
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Email or Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
                placeholder="h4ck3r or h4ck3r@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border-[2px] border-[#111] bg-white hover:bg-[#f0ebe0] transition-colors"
                  title="Toggle visibility"
                >
                  {showPass
                    ? <EyeOff size={11} strokeWidth={2.5} />
                    : <Eye size={11} strokeWidth={2.5} />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-[#ffb3b3] border-[3px] border-[#111] font-mono text-xs px-3 py-2.5">
                <AlertTriangle size={12} className="shrink-0 mt-0.5" strokeWidth={2.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="nb-btn w-full flex items-center justify-center gap-2 bg-[#ff3c00] text-[#f0ebe0] font-mono text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {loading
                ? <Spinner size="lg" className="text-[#f0ebe0]" />
                : <>Login <ArrowRight size={14} strokeWidth={2.5} /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[#888] text-xs mt-5">
          No account yet?{" "}
          <Link href="/register" className="text-[#111] nb-underline hover:text-[#ff3c00] transition-colors">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}