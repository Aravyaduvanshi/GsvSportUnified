
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ShieldCheck,
  CircleDot,
} from "lucide-react"

const SPORT_META = {
  badminton: {
    label: "BADMINTON TRACKER",
    icon: "🏸",
    accent: "#DFFF00",
  },

  throwball: {
  label: "THROWBALL TRACKER",
  icon: "🏐",
  accent: "#35C5F4",
},

  cricket: {
    label: "CRICKET TRACKER",
    icon: "🏏",
    accent: "#07F080",
  },
  basketball: {
    label: "BASKETBALL TRACKER",
    icon: "🏀",
    accent: "#FFAE00",
  },
}

export default function MatchControlHeader({ currentUser, match }) {
  const sport = SPORT_META[match?.sport] || SPORT_META.badminton

  return (
    <header className="sticky top-0 z-40 border-b border-[#25334B] bg-[#25272B] text-[#F4F6FA] shadow-lg">
      <div className="mx-auto flex min-h-16 max-w-[1680px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Link
            to="/sport-admin"
            aria-label="Return to assigned matches"
            className="flex shrink-0 items-center gap-2 text-xs text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline font-bold tracking-wider">
              MATCHES
            </span>
          </Link>

          <div className="h-8 w-px bg-white/10" />

          <span className="text-2xl" aria-hidden="true">
            {sport.icon}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-black tracking-widest sm:text-base">
              {sport.label}
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-gray-400">
              MATCH OPERATIONS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div
            className={`flex items-center gap-2 border px-2.5 py-1.5 text-[9px] font-black tracking-wider ${
              match.status === "LIVE"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-white/5 text-gray-300"
            }`}
          >
            <CircleDot size={12} />
            {match.status}
          </div>

          <div className="hidden items-center gap-2 border-l border-white/10 pl-4 sm:flex">
            <ShieldCheck size={17} color={sport.accent} />
            <div>
              <p className="max-w-36 truncate text-xs font-bold">
                {currentUser?.name || "Demo Admin"}
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-wider text-gray-400">
                {currentUser?.role === "super_admin"
                  ? "Super Admin"
                  : "Assigned Admin"}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="border border-white/15 px-3 py-2 text-[9px] font-bold tracking-widest text-gray-300 transition hover:border-white/40 hover:text-white"
          >
            EXIT
          </Link>
        </div>
      </div>
    </header>
  )
}
