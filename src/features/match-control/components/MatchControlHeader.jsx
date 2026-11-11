
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

export default function MatchControlHeader({ currentUser, match, assignedMatches = [], onResetMatch }) {
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

      {/* Quick Match Switcher Bar */}
      {assignedMatches && assignedMatches.length > 1 && (
        <div className="border-t border-[#1C273B] bg-[#101724] px-4 py-2 sm:px-8 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono font-bold tracking-wider text-[#8491A7]">
              SWITCH MATCH:
            </span>
            <div className="flex items-center gap-2">
              {assignedMatches.map((m) => {
                const isActive = m.id === match.id
                return (
                  <Link
                    key={m.id}
                    to={`/sport-admin/matches/${m.id}/control`}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[10px] font-mono font-bold transition whitespace-nowrap ${
                      isActive
                        ? "border border-[#DFFF00] bg-[#DFFF00]/20 text-[#DFFF00]"
                        : "border border-[#25334B] bg-[#17243A] text-gray-300 hover:text-white hover:border-[#8491A7]"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${m.status === "LIVE" ? "bg-emerald-400 animate-pulse" : "bg-gray-400"}`} />
                    <span>{m.court || m.id}: {m.teamA?.shortName || m.teamA?.name} vs {m.teamB?.shortName || m.teamB?.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {onResetMatch && (
            <button
              type="button"
              onClick={onResetMatch}
              title="Reset scores for this match back to 0-0"
              className="shrink-0 border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>↺ RESTART MATCH (0-0)</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
