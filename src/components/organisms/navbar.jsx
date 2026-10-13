
import { useEffect, useState } from "react"

const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "LIVE SCORES", href: "#live" },
  { label: "SCHEDULE", href: "#schedule" },
  { label: "PLAYERS", href: "#players" },
  { label: "BRACKETS", href: "#brackets" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#080909]/90 backdrop-blur-xl"
          : "border-transparent bg-[#080909]/20"
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-16">

        {/* Brand */}
        <a
          href="#home"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 transition hover:opacity-80"
        >
          <div className="grid h-9 w-9 rotate-45 place-items-center border border-[#DFFF00]">
            <span className="-rotate-45 text-lg font-black text-[#DFFF00]">
              S
            </span>
          </div>

          <div>
            <p className="text-sm font-black tracking-widest text-white">
              SMASH<span className="text-[#DFFF00]">.</span>
            </p>
            <p className="text-[9px] tracking-[0.2em] text-gray-400">
              GSV BADMINTON
            </p>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] font-bold tracking-widest text-gray-300 transition-colors hover:text-[#DFFF00]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Live status */}
        <a
          href="#live"
          className="hidden items-center gap-2 border border-[#DFFF00]/30 bg-[#DFFF00]/5 px-4 py-2 text-[10px] font-bold tracking-widest text-[#DFFF00] transition hover:bg-[#DFFF00] hover:text-black sm:flex"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFFF00]" />
          LIVE NOW
        </a>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center text-2xl text-white lg:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile navigation */}
      <div
        className={`absolute inset-x-0 top-full border-b border-white/10 bg-[#080909]/95 px-5 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="block border-b border-white/10 py-4 text-xs font-bold tracking-widest text-gray-300 hover:text-[#DFFF00]"
          >
            {link.label}
          </a>
        ))}

        <p className="py-4 text-[10px] font-bold tracking-widest text-[#DFFF00]">
          ● LIVE NOW
        </p>
      </div>
    </header>
  )
}
