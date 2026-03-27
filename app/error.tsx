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
    <div className="min-h-screen bg-[#f0ebe0] flex flex-col items-center justify-center px-6">

      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 bg-[#ffe87a] border-[3px] border-[#111] flex items-center justify-center mx-auto mb-6">
          <TriangleAlert size={24} color="#111" strokeWidth={2} />
        </div>

        <div
          className="text-7xl leading-none mb-2"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          500
        </div>

        <p className="font-mono text-sm text-[#888] mb-1">Something went wrong</p>
        <p className="font-mono text-xs text-[#aaa] leading-relaxed mb-8">
          An unexpected error occurred. Try again or go back to home
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="nb-btn inline-flex items-center gap-2 bg-[#ffe87a] text-[#111] text-sm px-6 py-3"
          >
            <RotateCcw size={13} strokeWidth={2.5} /> Try again
          </button>
          <Link
            href="/"
            className="nb-btn inline-flex items-center gap-2 bg-[#f0ebe0] text-[#111] text-sm px-6 py-3"
          >
            Back to home <ChevronRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <span className="font-mono text-xs text-[#ccc]">NzrCTF Lab</span>
      </div>
    </div>
  )
}