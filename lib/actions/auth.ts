"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { createClient as createAdminClient } from "@supabase/supabase-js"

function createAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! 
  )
}

export async function login(emailOrUsername: string, password: string) {
  let loginEmail = emailOrUsername.trim()

  if (!loginEmail.includes("@")) {
    const admin = createAdmin()

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("email")
      .eq("username", loginEmail)
      .single()

    if (profileError || !profile) {
      return { error: "Invalid username or password" }
    }

    loginEmail = profile.email
  }

  const supabase = await createClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password
  })

  if (signInError) {
    return { error: "Invalid username or password" }
  }

  redirect("/lab")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}