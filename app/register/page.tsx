"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, AlertTriangle, RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react"

const CUT = "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))"
const CUT_BTN = "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)"
const CUT_SM = "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)"

const navFont = { fontFamily: "'Arial Black', Impact, sans-serif" }
const monoFont = { fontFamily: "'Courier New', monospace" }

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
    const pw = generatePassword()
    setPassword(pw)
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

    const usernameRegex = /^[a-zA-Z0-9]{3,10}$/
    if (!usernameRegex.test(username.trim())) {
      setError("Username only allows letters and numbers (3–10 characters)")
      setLoading(false)
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      setError("Password needs 8+ chars, one uppercase, one lowercase, and a number")
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim() },
      },
    })

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("username")) {
        setError("That username is taken, pick another one")
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
            <h2 className="font-black text-lg uppercase text-black" style={navFont}>Create Account</h2>
            <p className="text-[#555] text-xs font-bold mt-0.5" style={monoFont}>
              Pick a name and get in
            </p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-[#444] text-xs font-black uppercase tracking-widest mb-1.5" style={monoFont}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="h4ck3r"
                className="w-full bg-[#f4efe4] border-4 border-black text-black text-sm px-3 py-2.5 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
                style={{ ...monoFont, clipPath: CUT_SM }}
              />
            </div>

            <div>
              <label className="block text-[#444] text-xs font-black uppercase tracking-widest mb-1.5" style={monoFont}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="h4ck3r@example.com"
                className="w-full bg-[#f4efe4] border-4 border-black text-black text-sm px-3 py-2.5 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
                style={{ ...monoFont, clipPath: CUT_SM }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[#444] text-xs font-black uppercase tracking-widest" style={monoFont}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-1 text-xs font-black uppercase border-2 border-black px-2 py-0.5 bg-[#f4efe4] hover:bg-black hover:text-white transition-all shadow-[2px_2px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  style={{ ...monoFont, clipPath: CUT_BTN }}
                >
                  <RefreshCw size={10} strokeWidth={3} />
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
                  className="w-full bg-[#f4efe4] border-4 border-black text-black text-sm px-3 py-2.5 pr-20 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
                  style={{ ...monoFont, clipPath: CUT_SM }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
                    title="Copy password"
                    style={{ clipPath: CUT_BTN }}
                  >
                    {copied
                      ? <Check size={11} strokeWidth={3} className="text-[#00e676]" />
                      : <Copy size={11} strokeWidth={3} />
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-all"
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

              <p className="text-[#aaa] text-xs mt-1.5 font-bold" style={monoFont}>
                Min. 8 chars, uppercase, lowercase, number.
              </p>
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
              {loading ? "Hold on..." : <>Register <ArrowRight size={15} strokeWidth={3} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-[#888] text-xs font-black uppercase mt-5" style={monoFont}>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black underline underline-offset-2 hover:text-[#00e676] transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}