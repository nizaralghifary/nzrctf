"use client"

import { useActionState } from "react"
import { submitFlag } from "@/lib/actions/challenge"
import { Flag, X, Check } from "lucide-react"

const CUT_BTN = "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)"
const CUT_SM  = "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)"

const monoFont = { fontFamily: "'Courier New', monospace" }

export default function SubmitForm({
  challengeId,
  chapterSlug,
}: {
  challengeId: string
  chapterSlug: string
}) {
  const [state, action, pending] = useActionState(submitFlag, null)

  return (
    <div className="flex flex-col gap-2">
      <form action={action} className="flex gap-2">
        <input type="hidden" name="challengeId" value={challengeId} />
        <input type="hidden" name="chapterSlug" value={chapterSlug} />
        <input
          type="text"
          name="flag"
          placeholder="NzrCTF{...}"
          required
          className="bg-[#f4efe4] border-4 border-black text-black text-xs px-3 py-2 w-40 sm:w-52 focus:outline-none focus:bg-white transition-all placeholder:text-[#bbb]"
          style={{ ...monoFont, clipPath: CUT_SM }}
        />
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 bg-[#00e676] border-4 border-black text-black text-xs font-black uppercase px-3 py-2 shadow-[3px_3px_0_#111] hover:shadow-[1px_1px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
          style={{ ...monoFont, clipPath: CUT_BTN }}
        >
          <Flag size={11} strokeWidth={3} />
          {pending ? "..." : "Submit"}
        </button>
      </form>

      {state && (
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 border-2 border-black ${
            state.success
              ? "bg-[#00e676] text-black"
              : "bg-[#fff0f3] text-[#ff3c6e] border-[#ff3c6e]"
          }`}
          style={{ ...monoFont, clipPath: CUT_SM }}
        >
          {state.success
            ? <Check size={11} strokeWidth={3} />
            : <X size={11} strokeWidth={3} />
          }
          {state.message}
        </div>
      )}
    </div>
  )
}