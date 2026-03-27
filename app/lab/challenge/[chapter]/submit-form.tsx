"use client"

import { useActionState } from "react"
import { submitFlag } from "@/lib/actions/challenge"
import { Flag, X, Check } from "lucide-react"
import { Spinner } from "@/components/spinner"

export default function SubmitForm({
  challengeId,
  chapterSlug,
}: {
  challengeId: string
  chapterSlug: string
}) {
  const [state, action, pending] = useActionState(submitFlag, null)

  return (
    <div className="flex flex-col gap-2 mt-1">
      <form action={action} className="flex gap-2">
        <input type="hidden" name="challengeId" value={challengeId} />
        <input type="hidden" name="chapterSlug" value={chapterSlug} />
        <input
          type="text"
          name="flag"
          placeholder="NzrCTF{...}"
          required
          className="bg-[#f0ebe0] border-[3px] border-[#111] font-mono text-xs px-3 py-2 w-40 sm:w-52 focus:outline-none focus:bg-white transition-colors placeholder:text-[#bbb]"
        />
        <button
          type="submit"
          disabled={pending}
          className="nb-btn flex items-center gap-1.5 bg-[#ff3c00] text-[#f0ebe0] font-mono text-xs px-3 py-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {pending
            ? <Spinner size="default" className="text-[#f0ebe0]" />
            : <><Flag size={11} strokeWidth={2.5} /> Submit</>
          }
        </button>
      </form>

      {state && (
        <div
          className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border-[2px] border-[#111] ${
            state.success ? "bg-[#b8f5a0]" : "bg-[#ffb3b3]"
          }`}
        >
          {state.success
            ? <Check size={11} strokeWidth={2.5} />
            : <X size={11} strokeWidth={2.5} />
          }
          {state.message}
        </div>
      )}
    </div>
  )
}