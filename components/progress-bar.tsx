"use client"

import { useEffect, useState } from "react"

export default function ProgressBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex-1 max-w-[160px] h-1.5 bg-[#e8e2d8] overflow-hidden">
      <div
        style={{
          width: `${width}%`,
          backgroundColor: color,
          height: "100%",
          transition: "width 0.8s ease-out",
        }}
      />
    </div>
  )
}