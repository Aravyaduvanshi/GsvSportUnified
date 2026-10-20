/**
 * BasketballCourtControl Component
 * Left workspace for Basketball scorekeeping.
 * Visual half-court diagram, point increments (+1, +2, +3),
 * team fouls, and primary score buttons.
 */
import { useState } from "react"
import { Undo2 } from "lucide-react"

const basketActions = [
  { id: "1", label: "+1 Free Throw", points: 1, type: "Free Throw" },
  { id: "2", label: "+2 Field Goal", points: 2, type: "Field Goal" },
  { id: "3", label: "+3 3-Pointer", points: 3, type: "Three Pointer" },
]

export default function BasketballCourtControl({
  match,
  onScoringAction,
  onUndo,
  isPending = false,
}) {
  const [selectedPoint, setSelectedPoint] = useState("2")

  const handleScore = (side) => {
    const action = basketActions.find((a) => a.id === selectedPoint) || basketActions[1]
    onScoringAction({
      side,
      points: action.points,
      pointType: action.type,
      type: "BASKETBALL_SCORE",
    })
  }

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Half Court Graphic */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#1E293B] rounded-lg border-2 border-[#334155] p-5 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Court Markings SVG */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          {/* Half court perimeter */}
          <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" />
          {/* 3-Point Arc */}
          <path d="M 120 18 L 120 100 A 130 130 0 0 0 480 100 L 480 18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
          {/* Paint Key */}
          <rect x="35%" y="5%" width="30%" height="45%" fill="#F97316" fillOpacity="0.15" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" />
          {/* Free throw circle */}
          <circle cx="50%" cy="50%" r="40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 6" strokeOpacity="0.7" />
          {/* Rim */}
          <circle cx="50%" cy="16%" r="8" fill="none" stroke="#FFAE00" strokeWidth="3" />
        </svg>

        {/* Court Indicators */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/80">
          <span className="bg-black/50 px-2.5 py-1 rounded border border-white/10">
            {match.court}
          </span>
          <span className="bg-black/50 px-2.5 py-1 rounded border border-white/10 text-[#FFAE00] font-bold">
            {match.periodLabel} · CLOCK: {match.clock}
          </span>
        </div>

        {/* Players / Team Badges on Court */}
        <div className="relative z-10 flex items-center justify-around my-auto">
          <div className="border border-[#FFAE00]/60 bg-[#FFAE00]/20 px-3 py-2 rounded text-center backdrop-blur-sm shadow">
            <span className="text-[10px] font-mono text-gray-300 block">HOME TEAM</span>
            <span className="text-sm font-black text-[#FFAE00]">{match.teamA.name}</span>
            <span className="text-xs font-mono block text-white mt-0.5">Fouls: {match.teamA.fouls || 0}</span>
          </div>

          <div className="border border-[#35C5F4]/60 bg-[#35C5F4]/20 px-3 py-2 rounded text-center backdrop-blur-sm shadow">
            <span className="text-[10px] font-mono text-gray-300 block">AWAY TEAM</span>
            <span className="text-sm font-black text-[#35C5F4]">{match.teamB.name}</span>
            <span className="text-xs font-mono block text-white mt-0.5">Fouls: {match.teamB.fouls || 0}</span>
          </div>
        </div>

        <div className="relative z-10 text-[9px] font-mono text-white/50 tracking-widest text-center">
          FIBA 10-MINUTE QUARTERS · 24-SECOND SHOT CLOCK
        </div>
      </div>

      {/* Point Type Selector */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-[#8491A7] mr-1">Bucket Value:</span>
        {basketActions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => setSelectedPoint(action.id)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-mono transition cursor-pointer ${
              selectedPoint === action.id
                ? "border-[#FFAE00] bg-[#FFAE00]/20 text-[#FFAE00] font-bold"
                : "border-[#25334B] bg-[#0F1A2D] text-[#8491A7] hover:text-white hover:border-[#8491A7]"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* Primary Score Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Team A (Amber) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handleScore("A")}
          className="w-full bg-[#FFAE00] hover:bg-[#FFAE00]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="text-xl">+{selectedPoint}</span>
          <span className="truncate">{match.teamA.name}</span>
        </button>

        {/* Team B (Cyan) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handleScore("B")}
          className="w-full bg-[#35C5F4] hover:bg-[#35C5F4]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span className="text-xl">+{selectedPoint}</span>
          <span className="truncate">{match.teamB.name}</span>
        </button>
      </div>

      {/* Bottom Sub-bar */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={onUndo}
          className="border border-[#25334B] bg-[#0F1A2D] hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-300 text-[#8491A7] py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
        >
          <Undo2 size={14} />
          <span>Undo Score</span>
        </button>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-gray-300">
          Period: {match.periodLabel}
        </div>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-[#FFAE00]">
          Shot Clock: 24s
        </div>
      </div>
    </div>
  )
}
