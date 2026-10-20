
import { basketballGames } from "../data/basketballGames"

export default function BasketballHero() {
  const liveGame = basketballGames.find((g) => g.status === "LIVE") || basketballGames[0]

  return (
    <section id="top" className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-[#0A0A0A] px-6 sm:px-10 lg:px-[8vw] pt-28 pb-16">
      {/* Background warm court glow */}
      <div className="absolute inset-0 -z-30 opacity-20">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <radialGradient id="courtGlow" cx="60%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#courtGlow)" />
        </svg>
      </div>

      {/* Stylized Basketball Half-Court Diagram */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 -z-20 hidden lg:block opacity-20 pointer-events-none">
        <svg width="420" height="420" viewBox="0 0 400 400" fill="none" stroke="#F97316" strokeWidth="1.5">
          {/* Half court perimeter */}
          <rect x="50" y="30" width="300" height="340" stroke="#F97316" strokeWidth="2" />
          {/* Center half circle */}
          <path d="M 140 370 A 60 60 0 0 1 260 370" stroke="#F97316" strokeWidth="2" />
          {/* 3-point Arc */}
          <path d="M 80 30 L 80 100 A 130 130 0 0 0 320 100 L 320 30" stroke="#F97316" strokeWidth="2" />
          {/* Free Throw Key / Paint */}
          <rect x="150" y="30" width="100" height="150" stroke="#F97316" strokeWidth="2" fill="#F97316" fillOpacity="0.08" />
          {/* Free throw circle top */}
          <ellipse cx="200" cy="180" rx="50" ry="50" strokeDasharray="6 6" />
          {/* Backboard & Rim */}
          <line x1="175" y1="55" x2="225" y2="55" stroke="#F97316" strokeWidth="3" />
          <circle cx="200" cy="68" r="10" stroke="#F97316" strokeWidth="2" />
        </svg>
      </div>

      <div className="w-full max-w-5xl">
        {/* Category badge */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 border border-[#F97316]/50 bg-[#F97316]/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.25em] text-[#F97316] uppercase">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#F97316]" />
            GSV HOOPS CLASSIC 2026-27
          </span>
          <span className="text-xs font-mono tracking-widest text-gray-400">
            5V5 DIVISION · THE HARDCOURT
          </span>
        </div>

        {/* Hero headline */}
        <h1 className="mt-6 text-[clamp(2.75rem,7vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] text-white">
          BASKETBALL
          <span className="mt-1 block text-[#F97316]">LEAGUE.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
          Full-court collegiate basketball action. High-speed transition offenses, lockdown perimeter defense, buzzer-beater finishes, and conference tournament playoff brackets.
        </p>

        {/* Featured matchup pill */}
        {liveGame && (
          <div className="mt-8 border border-white/10 bg-[#111313]/90 p-4 max-w-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#F97316]" />
              <div>
                <p className="text-[10px] font-bold tracking-widest text-orange-400">
                  LIVE GAME · {liveGame.period} ({liveGame.clock})
                </p>
                <p className="text-sm font-bold text-white">
                  {liveGame.homeTeam.name} ({liveGame.homeTeam.score}) vs {liveGame.awayTeam.name} ({liveGame.awayTeam.score})
                </p>
              </div>
            </div>

            <a
              href="#live"
              className="border border-[#F97316] bg-[#F97316] px-4 py-2 text-[9px] font-black tracking-widest text-[#0A0A0A] hover:bg-transparent hover:text-[#F97316] transition"
            >
              BOX SCORE →
            </a>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#live"
            className="inline-flex items-center gap-2 border border-[#F97316] bg-[#F97316] px-6 py-3.5 text-[10px] font-black tracking-widest text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:border-[#F97316] hover:text-[#F97316]"
          >
            LIVE HOOPS SCOREBOARD <span aria-hidden="true">●</span>
          </a>

          <a
            href="#schedule"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-6 py-3.5 text-[10px] font-black tracking-widest text-white transition hover:border-[#F97316] hover:text-[#F97316]"
          >
            GAME SCHEDULE
          </a>

          <a
            href="#playoffs"
            className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 text-[10px] font-black tracking-widest text-gray-400 transition hover:border-white/40 hover:text-white"
          >
            PLAYOFF BRACKET
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 sm:grid-cols-4">
          <div>
            <p className="text-2xl font-black text-white">06</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">CONFERENCE SQUADS</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#F97316]">4x10 MIN</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">FIBA QUARTERS</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">SYNTHETIC</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">THE HARDCOURTS</p>
          </div>
          <div>
            <p className="text-2xl font-black text-[#F97316]">PLAYOFFS</p>
            <p className="mt-1 text-[9px] tracking-widest text-gray-400">TOP 4 POSTSEASON</p>
          </div>
        </div>
      </div>
    </section>
  )
}
