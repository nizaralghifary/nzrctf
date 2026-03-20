import { createClient } from "@/lib/supabase/server"
import { logout } from "@/lib/actions/auth"
import Navbar from "./navbar"

export default async function NavbarServer() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <Navbar isLoggedIn={false} />
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, points")
    .eq("is_active", true)

  const { data: submissions } = await supabase
    .from("submissions")
    .select("challenge_id, is_correct")
    .eq("user_id", user.id)

  const solvedIds = new Set(
    submissions?.filter((s) => s.is_correct).map((s) => s.challenge_id) ?? []
  )

  const totalPoints =
    challenges
      ?.filter((c) => solvedIds.has(c.id))
      .reduce((sum, c) => sum + c.points, 0) ?? 0

  return (
    <Navbar
      isLoggedIn={true}
      username={profile?.username}
      email={user.email}
      totalPoints={totalPoints}
      logoutAction={logout}
    />
  )
}