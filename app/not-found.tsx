import Link from "next/link"
import { ChevronRight, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6">

      <div className="text-center max-w-md w-full">

        <div
          style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
          className="w-16 h-16 bg-[#11111a] border border-[#ff3c6e]/30 flex items-center justify-center mx-auto mb-6"
        >
          <SearchX size={28} className="text-[#ff3c6e]" />
        </div>

        <div className="font-black font-mono text-7xl text-[#ff3c6e] mb-2 leading-none">
          404
        </div>
        <p className="text-[#555570] font-mono text-xs tracking-widest uppercase mb-2">
          Page Not Found
        </p>
        <p className="text-[#333355] font-mono text-xs leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }}
          className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-bold text-sm px-6 py-3 hover:opacity-90 transition-all"
        >
          Back to Home <ChevronRight size={14} />
        </Link>
      </div>

      <div className="mt-12 text-center">
        <span className="text-[#1a1a2e] font-mono text-xs">
          NzrCTF Lab — Web Security Challenge Platform
        </span>
      </div>
    </div>
  )
}