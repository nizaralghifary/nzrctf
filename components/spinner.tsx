import { Loader2 } from "lucide-react"

type SpinnerSize = "sm" | "default" | "lg" | "icon"

const sizes: Record<SpinnerSize, string> = {
  sm: "h-2 w-2",
  default: "h-4 w-4",
  lg: "h-6 w-6",
  icon: "h-10 w-10",
}

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  style?: React.CSSProperties
}

export function Spinner({ size = "default", className, style }: SpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-[#888] ${sizes[size]} ${className ?? ""}`}
      style={style}
    />
  )
}