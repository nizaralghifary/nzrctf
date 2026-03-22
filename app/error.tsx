"use client"

import Link from "next/link"
import { useEffect } from "react"
import { ChevronRight, TriangleAlert, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">

      <div className="text-center max-w-md w-full">

        <div
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          className="w-16 h-16 bg-[#11111a] border border-[#ffd700]/30 flex items-center justify-center mx-auto mb-6"
        >
          <TriangleAlert size={28} className="text-[#ffd700]" />
        </div>

        <div className="font-black font-mono text-7xl text-[#ffd700] mb-2 leading-none">
          500
        </div>
        <p className="text-[#555570] font-mono text-xs tracking-widest uppercase mb-2">
          Something Went Wrong
        </p>
        <p className="text-[#333355] font-mono text-xs leading-relaxed mb-8">
          An unexpected error occurred. Try again or go back to home.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
            className="inline-flex items-center gap-2 bg-[#ffd700] text-black font-bold text-sm px-6 py-3 hover:opacity-90 transition-all"
          >
            <RotateCcw size={14} /> Try Again
          </button>
          <Link
            href="/"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
            className="inline-flex items-center gap-2 bg-[#11111a] border border-[#1e1e2e] text-white font-bold text-sm px-6 py-3 hover:border-[#333355] transition-all"
          >
            Back to Home <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-12 text-center">
        <span className="text-[#1a1a2e] font-mono text-xs">
          NzrCTF Lab — Web Security Challenge Platform
        </span>
      </div>
    </div>
  )
}