"use client"

import { useActionState } from "react"
import { submitFlag } from "@/lib/actions/challenge"
import { Flag } from "lucide-react"

export default function SubmitForm({
  challengeId,
  chapterSlug,
}: {
  challengeId: string
  chapterSlug: string
}) {
  const [state, action, pending] = useActionState(submitFlag, null)

  return (
    <div className="flex flex-col gap-1.5">
      <form action={action} className="flex gap-2">
        <input type="hidden" name="challengeId" value={challengeId} />
        <input type="hidden" name="chapterSlug" value={chapterSlug} />
        <input
          type="text"
          name="flag"
          placeholder="NzrCTF{...}"
          className="bg-[#0a0a0f] border border-[#1e1e2e] text-white font-mono text-xs px-3 py-1.5 rounded focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/20 transition-all placeholder:text-[#333350] w-40 sm:w-48"
        />
        <button
          type="submit"
          disabled={pending}
          style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }}
          className="flex items-center gap-1 bg-[#00ff88] text-black text-xs font-bold px-3 py-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Flag size={11} /> {pending ? "..." : "SUBMIT"}
        </button>
      </form>
      {state && (
        <p className={`text-xs font-mono ${state.success ? "text-[#00ff88]" : "text-[#ff3c6e]"}`}>
          {state.success ? "✓" : "✗"} {state.message}
        </p>
      )}
    </div>
  )
}
