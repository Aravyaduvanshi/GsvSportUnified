/**
 * Cricket Experience Dedicated Navbar
 * Features sport switcher, platform links, and in-page anchor navigation.
 */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const navLinks = [
  { label: "HOME", href: "/", isRouter: true },
  { label: "CRICKET", href: "#top", active: true },
  { label: "BADMINTON", href: "/sports/badminton", isRouter: true },
  { label: "BASKETBALL", href: "/sports/basketball", isRouter: true },
  { label: "LIVE SCORES", href: "#live" },
  { label: "SCHEDULE", href: "#schedule" },
  { label: "TEAMS", href: "#teams" },
  { label: "STANDINGS", href: "#standings" },
]

export default function CricketNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-emerald-500/20 bg-[#080909]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          : "border-transparent bg-[#080909]/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-16">
        {/* Brand identity */}
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-85">
          <div className="grid h-9 w-9 rotate-45 place-items-center border border-[#07F080] bg-[#07F080]/10">
            <span className="-rotate-45 text-sm font-black text-[#07F080]">🏏</span>
          </div>

          <div>
            <p className="text-sm font-black tracking-widest text-white">
              GSV<span className="text-[#07F080]">.</span>CRICKET
            </p>
            <p className="text-[9px] tracking-[0.2em] text-emerald-400/80">
              MAIN OVAL ARENA
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 xl:gap-7 lg:flex">
          {navLinks.map((link) =>
            link.isRouter ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-[10px] font-bold tracking-widest text-gray-300 transition-colors hover:text-[#07F080]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`text-[10px] font-bold tracking-widest transition-colors ${
                  link.active
                    ? "border-b border-[#07F080] pb-1 text-[#07F080]"
                    : "text-gray-300 hover:text-[#07F080]"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* Live indicator button */}
        <div className="hidden items-center gap-3 sm:flex">
          <a
            href="#live"
            className="flex items-center gap-2 border border-[#07F080]/40 bg-[#07F080]/10 px-4 py-2 text-[10px] font-bold tracking-widest text-[#07F080] transition hover:bg-[#07F080] hover:text-black"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
            LIVE SCORECARD
          </a>

          <Link
            to="/sports"
            className="border border-white/15 px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 transition hover:border-white/40 hover:text-white"
          >
            ALL SPORTS
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center text-2xl text-white lg:hidden cursor-pointer"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`absolute inset-x-0 top-full border-b border-white/10 bg-[#080909]/98 px-6 py-6 backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="space-y-4">
          {navLinks.map((link) =>
            link.isRouter ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/10 pb-3 text-xs font-bold tracking-widest text-gray-300 hover:text-[#07F080]"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block border-b border-white/10 pb-3 text-xs font-bold tracking-widest ${
                  link.active ? "text-[#07F080]" : "text-gray-300 hover:text-[#07F080]"
                }`}
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </header>
  )
}
