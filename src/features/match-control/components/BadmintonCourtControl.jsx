/**
 * BadmintonCourtControl Component
 * Left workspace for Badminton scorekeeping.
 * Directly recreates the layout, court visual, action type buttons,
 * and large Team A (amber) / Team B (cyan) score buttons from the reference screenshot.
 */
import { useState } from "react"
import { Undo2, RotateCw } from "lucide-react"
import BadmintonCourtVisual from "../../badminton/components/BadmintonCourtVisual"

const actionTypes = [
  { id: "Rally", label: "Rally Winner", icon: "🏸" },
  { id: "Smash", label: "Smash Kill", icon: "⚡" },
  { id: "Ace", label: "Service Ace", icon: "🎯" },
  { id: "Drop", label: "Net Drop", icon: "🪶" },
  { id: "Error", label: "Opponent Error", icon: "❌" },
]

export default function BadmintonCourtControl({
  match,
  onScorePoint,
  onUndo,
  onSwitchServer,
  isPending = false,
}) {
  const [selectedType, setSelectedType] = useState("Smash")

  const handlePoint = (side) => {
    onScorePoint({
      side,
      actionDetail: selectedType,
      type: "POINT",
    })
  }

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Official BWF Badminton Court Visual (Live Server, Service Court Box & Trajectory) */}
      <BadmintonCourtVisual
        match={match}
        interactive={true}
        onSwitchServer={onSwitchServer}
      />

      {/* Action Type Selector Row (Directly matches "Type: [Kill] [Ace] [Block] [Error]" from screenshot) */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-[#8491A7] mr-2">Type:</span>
        {actionTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setSelectedType(type.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono transition cursor-pointer ${
              selectedType === type.id
                ? "border-[#FFAE00] bg-[#FFAE00]/20 text-[#FFAE00] font-bold"
                : "border-[#25334B] bg-[#0F1A2D] text-[#8491A7] hover:text-white hover:border-[#8491A7]"
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Primary Score Buttons or Game Over Banner */}
      {match.status === "COMPLETED" ? (
        <div className="mt-4 p-5 rounded-lg border-2 border-emerald-500/50 bg-emerald-950/30 text-center shadow-xl">
          <div className="text-2xl mb-1">🏆</div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
            MATCH COMPLETED · BWF OFFICIAL RESULT
          </h3>
          <p className="text-base text-emerald-400 font-bold mt-1">
            WINNER: {match.winner || (match.teamA.setsWon > match.teamB.setsWon ? match.teamA.name : match.teamB.name)}
          </p>
          <p className="text-xs text-gray-300 font-mono mt-2">
            Sets Won: {match.teamA.name} ({match.teamA.setsWon}) — {match.teamB.name} ({match.teamB.setsWon})
          </p>
          {Array.isArray(match.setHistory) && match.setHistory.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {match.setHistory.map((s) => (
                <span
                  key={s.set}
                  className="border border-white/20 bg-white/10 px-3 py-1 rounded text-xs font-mono text-white font-bold"
                >
                  Set {s.set}: {s.scoreA}–{s.scoreB}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* +1 Team A (Solid Warm Amber) */}
          <button
            type="button"
            disabled={isPending}
            onClick={() => handlePoint("A")}
            className="w-full bg-[#FFAE00] hover:bg-[#FFAE00]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">+1</span>
            <span className="truncate">{match.teamA.name}</span>
          </button>

          {/* +1 Team B (Solid Bright Cyan) */}
          <button
            type="button"
            disabled={isPending}
            onClick={() => handlePoint("B")}
            className="w-full bg-[#35C5F4] hover:bg-[#35C5F4]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xl">+1</span>
            <span className="truncate">{match.teamB.name}</span>
          </button>
        </div>
      )}

      {/* Bottom Sub-bar: Undo and Court Controls */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={isPending}
          onClick={onUndo}
          className="border border-[#25334B] bg-[#0F1A2D] hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-300 text-[#8491A7] py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
          title="Revert the most recent scoring action"
        >
          <Undo2 size={14} />
          <span>Undo Action</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof onSwitchServer === "function") {
              onSwitchServer(match.servingSide === "A" ? "B" : "A")
            }
          }}
          disabled={isPending || match.status === "COMPLETED"}
          className="border border-[#25334B] bg-[#0F1A2D] hover:border-[#8491A7] text-[#8491A7] hover:text-white py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RotateCw size={14} />
          <span>Switch Server</span>
        </button>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-[#FFAE00]">
  {match.status === "COMPLETED" ? "FINAL" : `SET ${match.currentSet || 1} · ${match.teamA.score}–${match.teamB.score}`}
</div>
      </div>
    </div>
  )
}
