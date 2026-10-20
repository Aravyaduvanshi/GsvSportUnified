/**
 * BasketballScoreboard Component
 * Scoreboard-inspired layout with quarter-by-quarter breakdown, game clock, and fouls.
 */
import { useState } from "react"
import { basketballGames } from "../data/basketballGames"
import { formatPeriod } from "../utils/basketballFormatters"

export default function BasketballScoreboard() {
  const [selectedGameId, setSelectedGameId] = useState(basketballGames[0]?.id)
  const game = basketballGames.find((g) => g.id === selectedGameId) || basketballGames[0]

  const isLive = game.status === "LIVE"
  const isFinal = game.status === "FINAL"
  const isScheduled = game.status === "UPCOMING"

  return (
    <section id="live" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            01 / LIVE HOOPS SCOREBOARD
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            COURT <span className="text-[#F97316]">SCOREBOARD.</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
          <span>COLLAB DEMO FEED · {game.court}</span>
        </div>
      </div>

      {/* Main Scoreboard Display */}
      <div className="border border-white/15 bg-[#111313] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Accent top stripe */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#9A3412] via-[#F97316] to-[#9A3412]" />

        {/* Top bar: Conference & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="border border-[#F97316]/60 bg-[#F97316]/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#F97316]">
              {game.tournament}
            </span>
            <span className="text-xs font-bold text-gray-300">
              {game.conference}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLive && (
              <span className="inline-flex items-center gap-2 border border-[#F97316] bg-[#F97316]/20 px-3 py-1 text-[9px] font-bold tracking-widest text-[#F97316]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#F97316]" />
                {game.period} · {game.clock}
              </span>
            )}
            {isFinal && (
              <span className="border border-gray-600 bg-gray-800/80 px-3 py-1 text-[9px] font-bold tracking-widest text-gray-300">
                FINAL SCORE
              </span>
            )}
            {isScheduled && (
              <span className="border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[9px] font-bold tracking-widest text-sky-400">
                UPCOMING · {game.date} {game.time}
              </span>
            )}
          </div>
        </div>

        {/* Main Teams & Scores Display */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 items-center">
          {/* Home Team */}
          <div className="lg:col-span-2 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center font-black text-white text-lg border border-white/20"
                style={{ backgroundColor: `${game.homeTeam.color || "#F97316"}20`, borderColor: game.homeTeam.color || "#F97316" }}
              >
                {game.homeTeam.initials || game.homeTeam.shortName?.slice(0, 2)}
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">HOME</p>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {game.homeTeam.name}
                </h3>
              </div>
            </div>

            {/* Score */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                {game.homeTeam.score !== null ? game.homeTeam.score : "—"}
              </span>
              {isLive && game.homeTeam.fouls !== undefined && (
                <span className="text-xs font-mono text-gray-400">
                  Fouls: {game.homeTeam.fouls} | TO: {game.homeTeam.timeoutsRemaining}
                </span>
              )}
            </div>
          </div>

          {/* Center Clock / Status */}
          <div className="lg:col-span-1 text-center py-4 flex flex-col items-center justify-center">
            <div className="border border-white/10 bg-black/60 px-4 py-2 font-mono">
              <p className="text-[9px] font-bold tracking-widest text-[#F97316] uppercase">PERIOD</p>
              <p className="text-lg font-black text-white">
                {formatPeriod(game.period, game.clock)}
              </p>
            </div>

            {isFinal && game.winner && (
              <p className="mt-2 text-xs font-bold text-orange-400 text-center max-w-[140px]">
                {game.winner} Won ({game.finalDifference})
              </p>
            )}

            {isScheduled && (
              <p className="mt-2 text-xs font-mono text-gray-400">
                Tip-off at {game.time}
              </p>
            )}
          </div>

          {/* Away Team */}
          <div className="lg:col-span-2 md:pl-6">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center font-black text-white text-lg border border-white/20"
                style={{ backgroundColor: `${game.awayTeam.color || "#38BDF8"}20`, borderColor: game.awayTeam.color || "#38BDF8" }}
              >
                {game.awayTeam.initials || game.awayTeam.shortName?.slice(0, 2)}
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest text-gray-400 uppercase">AWAY</p>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {game.awayTeam.name}
                </h3>
              </div>
            </div>

            {/* Score */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-black text-[#F97316] tracking-tight">
                {game.awayTeam.score !== null ? game.awayTeam.score : "—"}
              </span>
              {isLive && game.awayTeam.fouls !== undefined && (
                <span className="text-xs font-mono text-gray-400">
                  Fouls: {game.awayTeam.fouls} | TO: {game.awayTeam.timeoutsRemaining}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quarter-by-Quarter Box Score Table (when available) */}
        {game.homeTeam.quarterScores && game.awayTeam.quarterScores && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
              QUARTER BREAKDOWN
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[10px]">
                    <th className="text-left py-2 px-3">TEAM</th>
                    <th className="py-2 px-3">Q1</th>
                    <th className="py-2 px-3">Q2</th>
                    <th className="py-2 px-3">Q3</th>
                    <th className="py-2 px-3">Q4</th>
                    <th className="py-2 px-3 font-bold text-white">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="text-left py-2.5 px-3 font-bold text-white">{game.homeTeam.name}</td>
                    {game.homeTeam.quarterScores.map((score, idx) => (
                      <td key={idx} className="py-2.5 px-3 text-gray-300">
                        {score !== null ? score : "—"}
                      </td>
                    ))}
                    <td className="py-2.5 px-3 font-black text-white text-sm">{game.homeTeam.score}</td>
                  </tr>
                  <tr>
                    <td className="text-left py-2.5 px-3 font-bold text-[#F97316]">{game.awayTeam.name}</td>
                    {game.awayTeam.quarterScores.map((score, idx) => (
                      <td key={idx} className="py-2.5 px-3 text-orange-400/80">
                        {score !== null ? score : "—"}
                      </td>
                    ))}
                    <td className="py-2.5 px-3 font-black text-[#F97316] text-sm">{game.awayTeam.score}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Performer or Play Banner */}
        {game.topPerformer && (
          <div className="mt-6 border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-bold">TOP PERFORMER:</span>
              <span className="text-white font-bold">{game.topPerformer.name} ({game.topPerformer.team})</span>
            </div>
            <span className="font-mono text-[#F97316] font-bold">{game.topPerformer.stats}</span>
          </div>
        )}
      </div>

      {/* Match Selector Tabs */}
      <div className="mt-8">
        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">
          SELECT GAME
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {basketballGames.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGameId(g.id)}
              className={`border p-4 text-left transition cursor-pointer ${
                selectedGameId === g.id
                  ? "border-[#F97316] bg-[#F97316]/10"
                  : "border-white/10 bg-[#111313] hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold tracking-widest">
                <span className="text-gray-400">{g.period}</span>
                <span className={g.status === "LIVE" ? "text-[#F97316] font-black" : "text-gray-500"}>
                  {g.status === "LIVE" ? "● LIVE" : g.status}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-white truncate">
                {g.homeTeam.shortName} vs {g.awayTeam.shortName}
              </p>
              <p className="mt-1 text-[9px] text-gray-500 font-mono truncate">
                {g.court.split("·")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
