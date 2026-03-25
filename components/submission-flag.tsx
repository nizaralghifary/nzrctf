"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const CUT_SM = "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)"

const monoFont = { fontFamily: "'Courier New', monospace" }

export default function SubmissionFlag({ flag }: { flag: string }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div
      className="flex items-center gap-2 bg-[#f4efe4] border-4 border-black px-3 py-1.5 w-full max-w-sm"
      style={{ clipPath: CUT_SM }}
    >
      <button
        onClick={() => setRevealed((prev) => !prev)}
        className="shrink-0 border-2 border-black bg-white p-0.5 hover:bg-black hover:text-white transition-all"
        style={{ clipPath: CUT_SM }}
      >
        {revealed
          ? <EyeOff size={10} strokeWidth={3} />
          : <Eye    size={10} strokeWidth={3} />
        }
      </button>
      <span
        className={`text-xs font-black text-[#333] tracking-wider transition-all duration-200 truncate ${revealed ? "" : "blur-sm select-none"}`}
        style={monoFont}
      >
        {flag}
      </span>
    </div>
  )
}