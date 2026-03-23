"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ChevronRight, AlertTriangle } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const usernameRegex = /^[a-zA-Z0-9]{3,10}$/
    if (!usernameRegex.test(username.trim())) {
      setError("Username only allows letters and numbers (3-10 characters)")
      setLoading(false)
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters, include uppercase, lowercase, and a number")
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
        setError("Username is already taken, please choose another")
      } else {
        //setError(signUpError.message)
        setError("Failed to create account, please try again later")
      }
      setLoading(false)
      return
    }

    if (!data.user) {
      setError("Failed to create account, please try again")
      setLoading(false)
      return
    }

    router.push("/lab")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-[#00ff88] tracking-tight font-mono">
            NzrCTF<span className="text-white"> Lab</span>
          </Link>
          <p className="text-[#555570] text-xs mt-1 font-mono">CTF Challenge Platform</p>
        </div>

        <div
          style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          className="bg-[#11111a] border border-[#1e1e2e] p-6"
        >
          <div className="mb-6">
            <h2 className="text-white font-black text-lg font-mono">Register</h2>
            <p className="text-[#555570] text-xs font-mono mt-0.5">Create a new account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[#555570] text-xs font-mono uppercase tracking-widest mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="h4ck3r"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350]"
              />
            </div>

            <div>
              <label className="block text-[#555570] text-xs font-mono uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="h4ck3r@h4cker.com"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350]"
              />
            </div>

            <div>
              <label className="block text-[#555570] text-xs font-mono uppercase tracking-widest mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="e.g. HackerPass123"
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350]"
              />
            </div>

            {error && (
              <div
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
                className="flex items-center gap-2 bg-[#ff3c6e]/10 border border-[#ff3c6e]/30 text-[#ff3c6e] text-xs font-mono px-3 py-2"
              >
                <AlertTriangle size={12} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
              className="w-full flex items-center justify-center gap-2 bg-[#00ff88] text-black font-bold text-sm py-2.5 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : <>REGISTER <ChevronRight size={14} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-[#555570] text-xs font-mono mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#00ff88] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}