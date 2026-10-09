
import { useState } from "react"
import matches from "../data/matches"

export default function LiveMatch() {
  const [selectedId, setSelectedId] = useState(matches[0]?.id)
  const selectedMatch = matches.find(
    (match) => match.id === selectedId
  )

  if (!selectedMatch) {
    return null
  }

  return (
    <section
      id="live"
      className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32"
    >
      <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
        01 / LIVE ACTION
      </p>

      <div className="mb-12 mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl">
          POINT BY
          <span className="block text-[#DFFF00]">POINT.</span>
        </h2>

        <p className="max-w̦-xs text-sm leading-6 text-gray-400">
          Follow the matches, scores and action from
          your college badminton championship.
        </p>
      </div>

      {/* Selected match */}
      <div className="border border-white/10 bg-[#111313]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#DFFF00]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFFF00]" />
            {selectedMatch.status}
          </span>

          <span className="text-[10px] tracking-widest text-gray-400">
            {selectedMatch.category} · {selectedMatch.court}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-12 sm:gap-8 sm:px-10 md:px-16">
          <div>
            <p className="mb-3 text-[9px] tracking-widest text-gray-500">
              PLAYER A
            </p>
            <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
              {selectedMatch.player1}
            </h3>
          </div>

          <div className="text-center">
            <p className="text-[9px] tracking-widest text-gray-500">
              SCORE
            </p>
            <p className="my-3 whitespace-nowrap text-3xl font-black text-[#DFFF00] sm:text-5xl">
              {selectedMatch.score1}
              <span className="px-2 text-gray-600">:</span>
              {selectedMatch.score2}
            </p>
          </div>

          <div className="text-right">
            <p className="mb-3 text-[9px] tracking-widest text-gray-500">
              PLAYER B
            </p>
            <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
              {selectedMatch.player2}
            </h3>
          </div>
        </div>
      </div>

      {/* Match selector */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {matches.map((match) => (
          <button
            key={match.id}
            type="button"
            aria-pressed={selectedId === match.id}
            onClick={() => setSelectedId(match.id)}
            className={`border p-5 text-left transition hover:border-[#DFFF00]/60 ${
              selectedId === match.id
                ? "border-[#DFFF00] bg-[#DFFF00]/5"
                : "border-white/10 bg-[#111313]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold tracking-widest text-gray-400">
                {match.category}
              </span>

              <span className="text-[9px] font-bold text-[#DFFF00]">
                {match.status}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="space-y-3">
                <p className="text-sm font-semibold">
                  {match.player1}
                </p>
                <p className="text-sm font-semibold">
                  {match.player2}
                </p>
              </div>

              <div className="space-y-3 text-right font-black text-[#DFFF00]">
                <p>{match.score1}</p>
                <p>{match.score2}</p>
              </div>
            </div>

            <p className="mt-5 text-[9px] tracking-widest text-gray-500">
              {match.court}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
