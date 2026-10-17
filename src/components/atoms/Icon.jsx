/**
 * Icon Atom
 * Safe wrapper around Lucide icons with fallback handling.
 */
import * as Icons from "lucide-react"

export default function Icon({ name, size = 18, className = "", ...props }) {
  const LucideIcon = Icons[name]

  if (!LucideIcon) {
    return <span className={`inline-block ${className}`} style={{ width: size, height: size }} />
  }

  return <LucideIcon size={size} className={className} {...props} />
}
