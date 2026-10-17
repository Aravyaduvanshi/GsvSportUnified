/**
 * Sport Admin Dashboard (Frontend Boundary)
 * Route: /sport-admin
 * Reserved for sport-specific match management and live score entry.
 */
import { useState } from "react"
import Badge from "../../../components/atoms/Badge"
import badmintonMatches from "../../badminton/data/matches"

export default function SportAdminDashboard() {
  const [selectedMatch, setSelectedMatch] = useState(badmintonMatches[0])

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Banner */}
      <div className="border border-[#DFFF00]/20 bg-[#DFFF00]/5 p-8 md:p-12 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DFFF00]/20 pb-4 mb-6">
          <Badge variant="live">SCOREKEEPER STUB</Badge>
          <span className="text-xs text-[#DFFF00] font-mono">ASSIGNMENT: BADMINTON COURT 01</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          SPORT SCOREKEEPER <span className="text-[#DFFF00]">CONSOLE</span>
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm text-gray-300 leading-relaxed">
          Frontend interface stub for court-side scorekeepers. When backend real-time endpoints (e.g. WebSockets or SSE) are connected, this view will transmit live point increments to the public match board.
        </p>
      </div>

      {/* Match Selector & Score Input Stub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Match Picker */}
        <div className="border border-white/10 bg-[#111313] p-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-white mb-4">
            Assigned Matches
          </h3>
          <div className="space-y-3">
            {badmintonMatches.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMatch(m)}
                className={`w-full text-left p-4 border transition cursor-pointer ${
                  selectedMatch?.id === m.id
                    ? "border-[#DFFF00] bg-[#DFFF00]/10 text-white"
                    : "border-white/10 bg-[#0C0E0D] text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span>{m.category}</span>
                  <span className="text-[#DFFF00]">{m.court}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-white">
                  {m.player1} vs {m.player2}
                </p>
                <p className="mt-1 text-[10px] text-gray-500">
                  Current Score: {m.score1} - {m.score2}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Score Input Pad (Stub) */}
        <div className="lg:col-span-2 border border-white/10 bg-[#111313] p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-white">
              Score Entry Panel
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              {selectedMatch?.court} · {selectedMatch?.category}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 my-8">
            <div className="border border-white/10 bg-[#0C0E0D] p-6 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Side A</p>
              <h4 className="text-lg font-black text-white mt-1">{selectedMatch?.player1}</h4>
              <p className="text-5xl font-black text-[#DFFF00] my-4">{selectedMatch?.score1}</p>
              <button
                type="button"
                disabled
                className="w-full border border-white/20 py-2.5 text-[10px] font-bold uppercase text-gray-500 cursor-not-allowed"
              >
                +1 Point (Stub)
              </button>
            </div>

            <div className="border border-white/10 bg-[#0C0E0D] p-6 text-center">
              <p className="text-[10px] text-gray-500 uppercase font-bold">Side B</p>
              <h4 className="text-lg font-black text-white mt-1">{selectedMatch?.player2}</h4>
              <p className="text-5xl font-black text-[#DFFF00] my-4">{selectedMatch?.score2}</p>
              <button
                type="button"
                disabled
                className="w-full border border-white/20 py-2.5 text-[10px] font-bold uppercase text-gray-500 cursor-not-allowed"
              >
                +1 Point (Stub)
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-500 text-center">
            Note: This interface represents the frontend boundary stub. Live score mutation requires future authentication and backend websocket infrastructure.
          </p>
        </div>
      </div>
    </div>
  )
}
