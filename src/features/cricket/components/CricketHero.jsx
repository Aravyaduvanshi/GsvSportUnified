/**
 * Cricket Experience Hero Component
 * Broadcast aesthetic with pitch geometry markings and featured matchup preview.
 */
import { cricketMatches } from "../data/cricketMatches"

export default function CricketHero() {
  const liveMatch = cricketMatches.find((m) => m.status === "LIVE") || cricketMatches[0]

  return (
    <section id="top" className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-[#0A0A0A] px-6 sm:px-10 lg:px-[8vw] pt-28 pb-16">
      {/* Background cricket pitch markings & ambient glow */}
      <div className="absolute inset-0 -z-30 opacity-25">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <radialGradient id="pitchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#07F080" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#pitchGlow)" />
        </svg>
      </div>

      {/* Stylized Cricket Pitch Diagram in corner */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 -z-20 hidden lg:block opacity-20 pointer-events-none">
        <svg width="420" height="420" viewBox="0 0 400 400" fill="none" stroke="#07F080" strokeWidth="1.5">
          {/* Inner 30 yard circle */}
          <ellipse cx="200" cy="200" rx="170" ry="170" strokeDasharray="6 6" />
          {/* Rectangular Pitch 22 yards */}
          <rect x="165" y="90" width="70" height="220" stroke="#07F080" strokeWidth="2" fill="#063D29" fillOpacity="0.2" />
          {/* Popping creases */}
          <line x1="150" y1="130" x2="250" y2="130" stroke="#07F080" strokeWidth="2" />
          <line x1="150" y1="270" x2="250" y2="270" stroke="#07F080" strokeWidth="2" />
          {/* Stumps */}
          <circle cx="190" cy="115" r="3" fill="#07F080" />
          <circle cx="200" cy="115" r="3" fill="#07F080" />
          <circle cx="210" cy="115" r="3" fill="#07F080" />
          <circle cx="190" cy="285" r="3" fill="#07F080" />
          <circle cx="200" cy="285" r="3" fill="#07F080" />
          <circle cx="210" cy="285" r="3" fill="#07F080" />
        </svg>
      </div>

      <div className="w-full max-w-5xl">
        {/* Category badge */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-[#07F080]/50 bg-[#07F080]/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] text-[#07F080] uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
            GSV T20 TROPHY 2026
          </span>
          <span className="text-xs font-mono tracking-widest text-gray-400">
            SUPER 4 STAGE · MAIN OVAL
          </span>
        </div>

        {/* Hero headline */}
        <h1 className="mt-6 text-[clamp(2.75rem,7vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
          CRICKET
          <span className="mt-1 block text-[#07F080]">CHAMPIONSHIP.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          The pinnacle of collegiate cricket at Gati Shakti Vishwavidyalaya. Follow real-time ball-by-ball scorecards, tournament net run rates, player rosters, and departmental championship rivalries.
        </p>

        {/* Featured matchup pill */}
        {liveMatch && (
          <div className="mt-8 border border-white/10 bg-[#111313]/90 p-4 max-w-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-emerald-400">
                  FEATURED MATCH · {liveMatch.stage}
                </p>
                <p className="text-sm font-bold text-white">
                  {liveMatch.team1.shortName} ({liveMatch.team1.overs ? liveMatch.team1.runs + "/" + liveMatch.team1.wickets : "—"}) vs {liveMatch.team2.shortName} ({liveMatch.team2.overs ? liveMatch.team2.runs + "/" + liveMatch.team2.wickets : "—"})
                </p>
              </div>
            </div>

            <a
              href="#live"
              className="border border-[#07F080] bg-[#07F080] px-4 py-2 text-[9px] font-black tracking-widest text-[#0A0A0A] hover:bg-transparent hover:text-[#07F080] transition"
            >
              SCORECARD →
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#live"
            className="inline-flex items-center gap-2 border border-[#07F080] bg-[#07F080] px-6 py-3.5 text-[10px] font-black tracking-widest text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:border-[#07F080] hover:text-[#07F080]"
          >
            ENTER LIVE MATCH CENTER <span aria-hidden="true">●</span>
          </a>

          <a
            href="#schedule"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-6 py-3.5 text-[10px] font-black tracking-widest text-white transition hover:border-[#07F080] hover:text-[#07F080]"
          >
            FIXTURES CALENDAR
          </a>

          <a
            href="#standings"
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 text-[10px] font-black tracking-widest text-gray-400 transition hover:border-white/40 hover:text-white"
          >
            STANDINGS & NRR
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-black text-white">08</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">CAMPUS TEAMS</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#07F080]">T20 / ODI</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">ACTIVE FORMATS</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">22 YARDS</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">TURF OVAL GROUND</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#07F080]">SUPER 4</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">CHAMPIONSHIP STAGE</p>
          </div>
        </div>
      </div>
    </section>
  )
}
