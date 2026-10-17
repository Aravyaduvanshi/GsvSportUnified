/**
 * Badge Atom
 * Renders status, category, or court tag.
 */
export default function Badge({
  children,
  variant = "default", // 'default' | 'live' | 'upcoming' | 'completed' | 'neon' | 'warning'
  size = "md", // 'sm' | 'md'
  className = "",
}) {
  const baseStyles = "inline-flex items-center gap-1.5 font-bold tracking-widest uppercase transition-colors"

  const sizeStyles = {
    sm: "px-2.5 py-1 text-[8px]",
    md: "px-3 py-1.5 text-[9px]",
  }

  const variantStyles = {
    default: "border border-white/10 bg-white/5 text-gray-400",
    live: "border border-[#07F080]/40 bg-[#07F080]/10 text-[#07F080]",
    upcoming: "border border-blue-400/30 bg-blue-400/10 text-blue-300",
    completed: "border border-gray-700 bg-gray-900/50 text-gray-500",
    neon: "border border-[#07F080] bg-[#07F080] text-[#080909]",
    warning: "border border-amber-400/30 bg-amber-400/10 text-amber-300",
  }

  return (
    <span className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {variant === "live" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#07F080]" />
      )}
      {children}
    </span>
  )
}
