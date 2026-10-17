/**
 * Button Atom
 * Reusable button supporting variant styling and link wrapping.
 */
import { Link } from "react-router-dom"

export default function Button({
  children,
  variant = "primary", // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = "md", // 'sm' | 'md' | 'lg'
  to,
  href,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-black tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  const sizeStyles = {
    sm: "px-4 py-2 text-[9px]",
    md: "px-6 py-3.5 text-[10px]",
    lg: "px-8 py-4 text-xs",
  }

  const variantStyles = {
    primary: "bg-[#07F080] border border-[#07F080] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:border-[#07F080] hover:-translate-y-0.5",
    secondary: "bg-white/10 text-[#DFFF00] border border-white/15 hover:bg-white/20 hover:border-[#07F080] hover:text-[#07F080] hover:bg-[#07F080]",
    outline: "border border-white/25 text-[#DFFF00] hover:border-[#07F080] hover:text-[#07F080] hover:bg-[#07F080]",
    ghost: "text-gray-300 hover:text-[#DFFF00] hover:bg-white/5",
  }

  const classes = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}
