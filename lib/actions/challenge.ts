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
    .select("id, is_correct")
    .eq("user_id", user.id)
    .eq("challenge_id", challengeId)
    .single()

  if (existing?.is_correct) {
    return { success: false, message: "Already solved" }
  }

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, flag, points, chapter")
    .eq("id", challengeId)
    .single()

  if (!challenge) {
    return { success: false, message: "Challenge not found" }
  }

  const { data: allChallenges } = await supabase
    .from("challenges")
    .select("id, stage_order")
    .eq("chapter", challenge.chapter)
    .eq("is_active", true)
    .order("stage_order", { ascending: true })

  const currentIndex = allChallenges?.findIndex((c) => c.id === challengeId) ?? 0

  if (currentIndex > 0) {
    const prevChallenge = allChallenges![currentIndex - 1]
    const { data: prevSolved } = await supabase
      .from("submissions")
      .select("id")
      .eq("user_id", user.id)
      .eq("challenge_id", prevChallenge.id)
      .eq("is_correct", true)
      .single()

    if (!prevSolved) {
      return { success: false, message: "Complete previous stage first" }
    }
  }

  const isCorrect = flag.trim() === challenge.flag

  if (existing) {
    await supabase
      .from("submissions")
      .update({
        submitted_flag: flag.trim(),
        is_correct: isCorrect,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
  } else {
    await supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        challenge_id: challengeId,
        submitted_flag: flag.trim(),
        is_correct: isCorrect,
        submitted_at: new Date().toISOString(),
      })
  }

  if (!isCorrect) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { success: false, message: "Wrong flag, try again" }
  }
    
  revalidatePath(`/challenge/${chapterSlug}`)
  return { success: true, message: `Correct! +${challenge.points} pts` }
}