/**
 * CricketPlayerCard Component
 * Displays player profiles with batting and bowling statistics.
 */
import { cricketPlayers } from "../data/cricketPlayers"

export default function CricketPlayerCard() {
  return (
    <section id="players" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
            05 / TOP ATHLETES & ROSTER
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            STANDOUT <span className="text-[#07F080]">PLAYERS.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          Leading run-scorers, wicket-takers, and key impact players across university departmental squads.
        </p>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cricketPlayers.map((player) => (
          <div
            key={player.id}
            className="border border-white/10 bg-[#111313] p-6 transition hover:border-[#07F080]/60 relative group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold block mb-1">
                  #{player.jerseyNumber} · {player.role.toUpperCase()}
                </span>
                <h3 className="text-xl font-black uppercase text-white group-hover:text-[#07F080] transition-colors">
                  {player.name}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{player.teamName}</p>
              </div>

              {player.isCaptain && (
                <span className="border border-[#07F080]/40 bg-[#07F080]/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-[#07F080]">
                  CAPTAIN
                </span>
              )}
            </div>

            {/* Stats Breakdown */}
            <div className="mt-6 border-t border-white/10 pt-4 grid grid-cols-3 gap-3 text-center font-mono">
              <div className="border-r border-white/5 pr-2">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">RUNS</p>
                <p className="text-base font-black text-white mt-1">{player.runs}</p>
                <p className="text-[9px] text-gray-500">Avg {player.battingAverage}</p>
              </div>

              <div className="border-r border-white/5 px-2">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">STRIKE RATE</p>
                <p className="text-base font-black text-[#07F080] mt-1">{player.strikeRate}</p>
                <p className="text-[9px] text-gray-500">HS: {player.highestScore}</p>
              </div>

              <div className="pl-2">
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">WICKETS</p>
                <p className="text-base font-black text-sky-400 mt-1">{player.wickets}</p>
                <p className="text-[9px] text-gray-500">
                  {player.bowlingEconomy !== "—" ? `Econ ${player.bowlingEconomy}` : "Pure Bat"}
                </p>
              </div>
            </div>

            {/* Best figures / additional note */}
            {player.bestBowling && (
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono text-gray-400 flex items-center justify-between">
                <span>Best Bowling:</span>
                <span className="text-white font-bold">{player.bestBowling}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
