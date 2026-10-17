/**
 * Global Platform Navbar Organism
 * Top navigation for the unified sports portal.
 */
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const navLinks = [
  { label: "HOME", path: "/" },
  { label: "SPORTS", path: "/sports" },
  { label: "MATCHES", path: "/matches" },
  { label: "TOURNAMENTS", path: "/tournaments" },
  { label: "STUDENT", path: "/student" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])



  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#080909]/95 backdrop-blur-xl"
          : "border-transparent bg-[#080909]/60 backdrop-blur-md"
      }`}
    >
      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between px-5 md:px-10 lg:px-16">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 transition hover:opacity-85"
        >
          <div className="grid h-9 w-9 rotate-45 place-items-center border border-[#07F080] bg-[#07F080]/10">
            <span className="-rotate-45 text-lg font-black text-[#07F080]">
              S
            </span>
          </div>

          <div>
            <p className="text-sm font-black tracking-widest text-white">
              GSV<span className="text-[#07F080]">.</span>SPORTS
            </p>
            <p className="text-[9px] tracking-[0.2em] text-gray-400">
              COLLEGE ATHLETICS
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-[10px] font-bold tracking-widest transition-colors ${
                isActive(link.path)
                  ? "text-[#07F080] border-b border-[#07F080] pb-1"
                  : "text-gray-300 hover:text-[#07F080]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Quick link to live Badminton hub & Admin */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/sports/badminton"
            className="flex items-center gap-2 border border-[#07F080]/40 bg-[#07F080]/10 px-4 py-2 text-[10px] font-bold tracking-widest text-[#07F080] transition hover:bg-[#07F080] hover:text-black"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
            BADMINTON LIVE
          </Link>

          <Link
            to="/admin"
            className="border border-white/15 px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 transition hover:text-white hover:border-white/40"
          >
            ADMIN
          </Link>
        </div>

        {/* Mobile menu trigger */}
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
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`block border-b border-white/10 pb-3 text-xs font-bold tracking-widest ${
                isActive(link.path) ? "text-[#07F080]" : "text-gray-300 hover:text-[#07F080]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/sports/badminton"
            className="flex items-center gap-2 pt-2 text-xs font-bold tracking-widest text-[#07F080]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
            BADMINTON CHAMPIONSHIP
          </Link>

          <div className="pt-4 flex items-center gap-3">
            <Link
              to="/admin"
              className="border border-white/20 px-4 py-2 text-[10px] font-bold tracking-widest text-gray-300"
            >
              SUPER ADMIN
            </Link>
            <Link
              to="/sport-admin"
              className="border border-white/20 px-4 py-2 text-[10px] font-bold tracking-widest text-gray-300"
            >
              SPORT ADMIN
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
