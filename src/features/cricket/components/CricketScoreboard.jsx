/**
 * Reusable Cricket Scoreboard Component
 * Adapts intelligently between T20, ODI, and Test cricket formats.
 * Handles LIVE DEMO, UPCOMING, and COMPLETED match states.
 */
import { useState } from "react"
import { cricketMatches } from "../data/cricketMatches"
import { formatScore, formatOvers, calculateRunRate, calculateRequiredRunRate } from "../utils/cricketFormatters"

export default function CricketScoreboard() {
  const [selectedMatchId, setSelectedMatchId] = useState(cricketMatches[0]?.id)
  const match = cricketMatches.find((m) => m.id === selectedMatchId) || cricketMatches[0]

  const isLive = match.status === "LIVE"
  const isCompleted = match.status === "COMPLETED"
  const isUpcoming = match.status === "UPCOMING"
  const isTest = match.format === "TEST"

  return (
    <section id="live" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
            01 / LIVE SCORECARD & MATCH CENTER
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            INNINGS <span className="text-[#07F080]">DASHBOARD.</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>COLLAB DEMO FEED · {match.venue}</span>
        </div>
      </div>

      {/* Main Scoreboard Display Card */}
      <div className="border border-white/15 bg-[#111313] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Accent top stripe */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#063D29] via-[#07F080] to-[#063D29]" />

        {/* Top bar: Format, Tournament & Live indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="border border-[#07F080]/60 bg-[#07F080]/10 px-2.5 py-1 text-[9px] font-black tracking-widest text-[#07F080]">
              {match.format} MATCH
            </span>
            <span className="text-xs font-bold text-gray-300">
              {match.tournament} · {match.stage}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isLive && (
              <span className="inline-flex items-center gap-2 border border-[#07F080] bg-[#07F080]/20 px-3 py-1 text-[9px] font-bold tracking-widest text-[#07F080]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
                LIVE INNINGS
              </span>
            )}
            {isCompleted && (
              <span className="border border-gray-600 bg-gray-800/80 px-3 py-1 text-[9px] font-bold tracking-widest text-gray-300">
                MATCH COMPLETED
              </span>
            )}
            {isUpcoming && (
              <span className="border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-[9px] font-bold tracking-widest text-sky-400">
                SCHEDULED FIXTURE
              </span>
            )}
            <span className="text-xs font-mono text-gray-500">{match.date} {match.time}</span>
          </div>
        </div>

        {/* Toss info */}
        {match.toss && (
          <p className="mt-4 text-xs font-mono text-emerald-400/90 flex items-center gap-2">
            <span className="text-gray-500">🪙 Toss:</span> {match.toss}
          </p>
        )}

        {/* Teams and Scores Row */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 items-center">
          {/* Team 1 */}
          <div className="lg:col-span-2 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center font-black text-white text-lg border border-white/20"
                style={{ backgroundColor: `${match.team1.color || "#07F080"}20`, borderColor: match.team1.color || "#07F080" }}
              >
                {match.team1.shortName?.slice(0, 3)}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {match.team1.name}
                </h3>
                <p className="text-xs text-gray-400">{match.team1.department}</p>
              </div>
            </div>

            {/* Team 1 Score */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {match.team1.runs !== null && match.team1.runs !== undefined
                  ? formatScore(match.team1.runs, match.team1.wickets)
                  : "Yet to bat"}
              </span>
              {match.team1.overs && (
                <span className="text-sm font-mono text-gray-400">
                  ({formatOvers(match.team1.overs)})
                </span>
              )}
            </div>

            {match.team1.overs && !isTest && (
              <p className="mt-2 text-xs font-mono text-gray-500">
                Run Rate: {calculateRunRate(match.team1.runs, match.team1.overs)}
              </p>
            )}
          </div>

          {/* Versus / Match Center Info */}
          <div className="lg:col-span-1 text-center py-4 flex flex-col items-center justify-center">
            <div className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase">
              VS
            </div>

            {match.target && (
              <div className="mt-3 border border-[#07F080]/30 bg-[#07F080]/5 px-3 py-1.5 text-center">
                <p className="text-[9px] font-bold tracking-widest text-[#07F080]">TARGET</p>
                <p className="text-lg font-black text-white">{match.target}</p>
              </div>
            )}

            {isCompleted && match.result && (
              <p className="mt-2 text-xs font-bold text-emerald-400 text-center max-w-[140px]">
                {match.result}
              </p>
            )}

            {isUpcoming && match.time && (
              <p className="mt-2 text-xs font-mono text-sky-400">
                Starts {match.time}
              </p>
            )}
          </div>

          {/* Team 2 */}
          <div className="lg:col-span-2 md:pl-6">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center font-black text-white text-lg border border-white/20"
                style={{ backgroundColor: `${match.team2.color || "#38BDF8"}20`, borderColor: match.team2.color || "#38BDF8" }}
              >
                {match.team2.shortName?.slice(0, 3)}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                  {match.team2.name}
                </h3>
                <p className="text-xs text-gray-400">{match.team2.department}</p>
              </div>
            </div>

            {/* Team 2 Score */}
            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-4xl sm:text-5xl font-black text-[#07F080] tracking-tight">
                {match.team2.runs !== null && match.team2.runs !== undefined
                  ? formatScore(match.team2.runs, match.team2.wickets)
                  : "Yet to bat"}
              </span>
              {match.team2.overs && (
                <span className="text-sm font-mono text-gray-400">
                  ({formatOvers(match.team2.overs)})
                </span>
              )}
            </div>

            {match.team2.overs && !isTest && (
              <p className="mt-2 text-xs font-mono text-gray-500">
                Current Run Rate: {calculateRunRate(match.team2.runs, match.team2.overs)}
              </p>
            )}
          </div>
        </div>

        {/* Live Equation / Target bar (only for live limited overs) */}
        {isLive && match.target && (
          <div className="mt-8 border border-white/10 bg-[#063D29]/40 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest text-[#07F080] uppercase">
                EQUATION
              </p>
              <p className="text-base sm:text-lg font-bold text-white mt-1">
                {match.team2.name} need <span className="text-[#07F080]">{match.runsNeeded} runs</span> in <span className="text-white">{match.ballsRemaining} balls</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Req Run Rate</span>
                <span className="text-emerald-300 font-bold text-sm">
                  {calculateRequiredRunRate(match.target, match.team2.runs, match.ballsRemaining) || match.requiredRunRate}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[9px] uppercase">Curr Run Rate</span>
                <span className="text-white font-bold text-sm">{match.currentRunRate}</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Batting & Bowling Stats Grid (if available) */}
        {isLive && match.batters && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-white/10 pt-6">
            {/* Batter Box */}
            <div className="border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                BATTERS AT CREASE
              </p>
              <div className="space-y-3">
                {match.batters.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {b.name} {b.isStriker && <span className="text-[#07F080] font-black">*</span>}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {b.runs} <span className="text-gray-500 font-normal">({b.balls}b, {b.fours}x4, {b.sixes}x6)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bowler Box & Recent Balls */}
            <div className="border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
              {match.bowler && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                    CURRENT BOWLER
                  </p>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{match.bowler.name}</span>
                    <span className="text-gray-300">
                      {match.bowler.overs} ov · {match.bowler.runs}/{match.bowler.wickets} (Econ: {match.bowler.economy})
                    </span>
                  </div>
                </div>
              )}

              {match.recentBalls && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase block mb-1.5">
                    THIS OVER
                  </span>
                  <div className="flex items-center gap-1.5">
                    {match.recentBalls.map((ball, i) => (
                      <span
                        key={i}
                        className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold font-mono ${
                          ball === "6"
                            ? "bg-[#07F080] text-black"
                            : ball === "4"
                            ? "bg-emerald-700 text-white"
                            : ball === "W"
                            ? "bg-red-600 text-white"
                            : "bg-white/10 text-gray-300"
                        }`}
                      >
                        {ball}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Match Result or Player of the match banner */}
        {isCompleted && match.playerOfMatch && (
          <div className="mt-6 border border-white/10 bg-white/5 p-4 flex items-center justify-between text-xs">
            <span className="text-gray-400">PLAYER OF THE MATCH</span>
            <span className="font-bold text-[#07F080]">{match.playerOfMatch}</span>
          </div>
        )}
      </div>

      {/* Match Selector Tabs */}
      <div className="mt-8">
        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-3">
          SELECT ACTIVE SCORECARD
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {cricketMatches.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMatchId(m.id)}
              className={`border p-4 text-left transition cursor-pointer ${
                selectedMatchId === m.id
                  ? "border-[#07F080] bg-[#07F080]/10"
                  : "border-white/10 bg-[#111313] hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-bold tracking-widest">
                <span className="text-gray-400">{m.format}</span>
                <span className={m.status === "LIVE" ? "text-[#07F080] font-black" : "text-gray-500"}>
                  {m.status === "LIVE" ? "● LIVE" : m.status}
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-white truncate">
                {m.team1.shortName} vs {m.team2.shortName}
              </p>
              <p className="mt-1 text-[9px] text-gray-500 font-mono truncate">
                {m.venue.split(",")[0]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
