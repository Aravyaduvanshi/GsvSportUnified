/**
 * BasketballPlayerCard Component
 * Player cards featuring points per game (PPG), rebounds (RPG), assists (APG), and FG%.
 */
import { basketballPlayers } from "../data/basketballPlayers"

export default function BasketballPlayerCard() {
  return (
    <section id="players" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            05 / ALL-STAR CANDIDATES
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            TOP <span className="text-[#F97316]">PERFORMERS.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          Individual stat leaders dominating scoring, rebounding, and floor playmaking across campus.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {basketballPlayers.map((player) => (
          <div
            key={player.id}
            className="border border-white/10 bg-[#111313] p-6 transition hover:border-[#F97316]/60 relative group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-orange-400 font-bold block mb-1">
                  #{player.jerseyNumber} · {player.position}
                </span>
                <h3 className="text-xl font-black uppercase text-white group-hover:text-[#F97316] transition-colors">
                  {player.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{player.teamName}</p>
              </div>

              {player.isCaptain && (
                <span className="border border-[#F97316]/40 bg-[#F97316]/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-[#F97316]">
                  CAPTAIN
                </span>
              )}
            </div>

            {/* Stats Breakdown */}
            <div className="mt-6 border-t border-white/10 pt-4 grid grid-cols-4 gap-2 text-center font-mono">
              <div className="border-r border-white/5 pr-1">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">PPG</p>
                <p className="text-base font-black text-white mt-1">{player.ppg}</p>
              </div>

              <div className="border-r border-white/5 px-1">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">RPG</p>
                <p className="text-base font-black text-[#F97316] mt-1">{player.rpg}</p>
              </div>

              <div className="border-r border-white/5 px-1">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">APG</p>
                <p className="text-base font-black text-sky-400 mt-1">{player.apg}</p>
              </div>

              <div className="pl-1">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">FG%</p>
                <p className="text-base font-black text-emerald-400 mt-1">{player.fgPercentage}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-gray-400 flex items-center justify-between">
              <span>Games Played:</span>
              <span className="text-white font-bold">{player.gamesPlayed} games</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
