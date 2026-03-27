import Link from "next/link"
import { ChevronRight, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f0ebe0] flex flex-col items-center justify-center px-6">

      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 bg-[#111] flex items-center justify-center mx-auto mb-6">
          <SearchX size={24} color="#f0ebe0" strokeWidth={2} />
        </div>

        <div
          className="text-7xl leading-none mb-2"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          404
        </div>

        <p className="font-mono text-sm text-[#888] mb-1">Page not found</p>
        <p className="font-mono text-xs text-[#aaa] leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved
        </p>

        <Link
          href="/"
          className="nb-btn inline-flex items-center gap-2 bg-[#ff3c00] text-[#f0ebe0] text-sm px-6 py-3"
        >
          Back to home <ChevronRight size={14} strokeWidth={2.5} />
        </Link>
      </div>

      <div className="mt-12">
        <span className="font-mono text-xs text-[#ccc]">NzrCTF Lab</span>
      </div>
    </div>
  )
}