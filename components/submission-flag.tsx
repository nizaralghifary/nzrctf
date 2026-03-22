"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function SubmissionFlag({ flag }: { flag: string }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
      className="inline-flex items-center gap-2 bg-[#0a0a0f] border border-[#1e1e2e] px-2 py-0.5"
    >
      <button
        onClick={() => setRevealed((prev) => !prev)}
        className="shrink-0 text-[#555570] hover:text-white transition-colors"
      >
        {revealed ? <EyeOff size={10} /> : <Eye size={10} />}
      </button>
      <span className={`font-mono text-xs text-[#555570] tracking-wider transition-all duration-200 ${revealed ? "" : "blur-sm select-none"}`}>
        {flag}
      </span>
    </div>
  )
}