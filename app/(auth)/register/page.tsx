"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, AlertTriangle, RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react"
import { Spinner } from "@/components/spinner"

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const LOWER = "abcdefghijklmnopqrstuvwxyz"
const DIGITS = "0123456789"

function generatePassword(): string {
  const pool = UPPER + LOWER + DIGITS
  const rand = (str: string) => str[Math.floor(Math.random() * str.length)]
  const base = [rand(UPPER), rand(LOWER), rand(DIGITS)]
  for (let i = 0; i < 9; i++) base.push(rand(pool))
  return base.sort(() => Math.random() - 0.5).join("")
}

export default function Register() {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    setPassword(generatePassword())
    setShowPass(true)
  }

  async function handleCopy() {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!/^[a-zA-Z0-9]{3,10}$/.test(username.trim())) {
      setError("Username only allows letters and numbers (3–10 characters)")
      setLoading(false)
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError("Password needs 8+ chars, one uppercase, one lowercase, and a number")
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username: username.trim() } },
    })

    if (signUpError) {
      const msg = signUpError.message
      if (msg.includes("Database error saving new user") || msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("unique")) {
        setError("That username is taken, pick another one")
      } else if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("user already exists")) {
        setError("That email is already registered")
      } else {
        setError("Couldn't create your account, try again later")
      }
      setLoading(false)
      return
    }

    if (!data.user) {
      setError("Something went wrong, please try again")
      setLoading(false)
      return
    }

    router.push("/lab")
    router.refresh()
  }

  const inputClass = "w-full bg-[#f0ebe0] border-[3px] border-[#111] text-[#111] font-mono text-sm px-3 py-2.5 focus:outline-none focus:bg-white transition-colors placeholder:text-[#bbb]"
  const labelClass = "block font-mono text-[#555] text-xs tracking-widest mb-1.5"

  return (
    <div className="min-h-screen bg-[#f0ebe0] text-[#111] flex items-center justify-center px-4">
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
              Create Account
            </h2>
            <p className="font-mono text-[#888] text-xs mt-0.5">
              Pick a name and get in
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="h4ck3r"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="h4ck3r@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelClass.replace(" mb-1.5", "")}>Password</label>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-1 font-mono text-xs border-[2px] border-[#111] px-2 py-0.5 bg-[#f0ebe0] shadow-[2px_2px_0_#111] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <RefreshCw size={10} strokeWidth={2.5} />
                  Generate
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="H4ck3r123"
                  className={inputClass + " pr-20"}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 border-[2px] border-[#111] bg-white hover:bg-[#f0ebe0] transition-colors"
                    title="Copy password"
                  >
                    {copied
                      ? <Check size={11} strokeWidth={2.5} className="text-[#ff3c00]" />
                      : <Copy size={11} strokeWidth={2.5} />
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="p-1 border-[2px] border-[#111] bg-white hover:bg-[#f0ebe0] transition-colors"
                    title="Toggle visibility"
                  >
                    {showPass
                      ? <EyeOff size={11} strokeWidth={2.5} />
                      : <Eye size={11} strokeWidth={2.5} />
                    }
                  </button>
                </div>
              </div>

              <p className="font-mono text-[#aaa] text-xs mt-1.5">
                Min. 8 chars, uppercase, lowercase, number
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-[#ffb3b3] border-[3px] border-[#111] text-[#111] font-mono text-xs px-3 py-2.5">
                <AlertTriangle size={12} className="shrink-0 mt-0.5" strokeWidth={2.5} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="nb-btn w-full flex items-center justify-center gap-2 bg-[#ff3c00] text-[#f0ebe0] text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
            >
              {loading
                ? <Spinner size="lg" className="text-[#f0ebe0]" />
                : <>Register <ArrowRight size={14} strokeWidth={2.5} /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-[#888] text-xs mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-[#111] nb-underline hover:text-[#ff3c00] transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}