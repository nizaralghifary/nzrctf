"use client"

import { useState, useEffect } from "react"

export default function SubmissionDate({ dateString }: { dateString: string }) {
  const [text, setText] = useState("—")

  useEffect(() => { 
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
    setText(`${formatted} at ${time}`)
  }, [dateString])

  return <span suppressHydrationWarning>{text}</span>
}