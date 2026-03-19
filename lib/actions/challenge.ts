"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type State = { success: boolean; message: string } | null

export async function submitFlag(prevState: State, formData: FormData): Promise<State> {
  const flag = formData.get("flag") as string
  const challengeId = formData.get("challengeId") as string
  const chapterSlug = formData.get("chapterSlug") as string

  if (!flag || !challengeId) {
    return { success: false, message: "Invalid submission" }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  const { data: existing } = await supabase
    .from("submissions")
    .select("is_correct")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .single()

  if (existing?.is_correct) {
    return { success: false, message: "Already solved" }
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, flag, points")
    .eq("id", challengeId)
    .single()

  if (!challenge) {
    return { success: false, message: "Challenge not found" }
  }

  const isCorrect = flag.trim() === challenge.flag

  await supabase.from("submissions").upsert({
    user_id: user.id,
    challenge_id: challengeId,
    submitted_flag: flag.trim(),
    is_correct: isCorrect,
  }, {
    onConflict: "user_id,challenge_id",
  })

  if (isCorrect) {
    revalidatePath(`/challenge/${chapterSlug}`)
    return { success: true, message: `Correct! +${challenge.points} pts` }
  }

  return { success: false, message: "Wrong flag, try again" }
}
