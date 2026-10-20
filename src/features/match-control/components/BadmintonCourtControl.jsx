/**
 * BadmintonCourtControl Component
 * Left workspace for Badminton scorekeeping.
 * Directly recreates the layout, court visual, action type buttons,
 * and large Team A (amber) / Team B (cyan) score buttons from the reference screenshot.
 */
import { useState } from "react"
import { Undo2, RotateCw } from "lucide-react"

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
  isPending = false,
}) {
  const [selectedType, setSelectedType] = useState("Smash")
  const [serverSide, setServerSide] = useState("A")

  const handlePoint = (side) => {
    onScorePoint({
      side,
      actionDetail: selectedType,
      type: "POINT",
    })
  }

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Court Diagram Visual (Matches reference screenshot's warm court surface) */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#C18844] rounded-lg border-2 border-[#8E5E2A] p-4 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Court Markings SVG */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          {/* Outer Boundary */}
          <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.8" />
          {/* Singles sideline */}
          <line x1="12%" y1="5%" x2="12%" y2="95%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="88%" y1="5%" x2="88%" y2="95%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Net Line (dashed like screenshot) */}
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="8 6" strokeOpacity="0.9" />
          {/* Center Line Top & Bottom */}
          <line x1="50%" y1="5%" x2="50%" y2="35%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="50%" y1="65%" x2="50%" y2="95%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Short Service Lines */}
          <line x1="5%" y1="35%" x2="95%" y2="35%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="5%" y1="65%" x2="95%" y2="65%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
        </svg>

        {/* Top Half (Team B / Opponent) */}
        <div className="relative z-10 flex items-center justify-around h-1/2">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white/80 bg-white/20 flex flex-col items-center justify-center text-white backdrop-blur-sm shadow">
              <span className="text-[10px] font-black">{match.teamB.shortName}</span>
              <span className="text-[8px] opacity-80">
               {serverSide === "B" ? "SRV" : "DEF"}
              </span>
            </div>
            <span className="mt-1 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded">
              {match.teamB.name}
            </span>
          </div>
        </div>

        {/* Bottom Half (Team A / Server) */}
        <div className="relative z-10 flex items-center justify-around h-1/2">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#FFAE00] bg-[#FFAE00]/30 flex flex-col items-center justify-center text-white backdrop-blur-sm shadow">
              <span className="text-[10px] font-black">{match.teamA.shortName}</span>
              <span className="text-[8px] opacity-80">
                {serverSide === "A" ? "SRV" : "DEF"}
               </span>
            </div>
            <span className="mt-1 text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded">
              {match.teamA.name}
            </span>
          </div>
        </div>

        {/* Court side label */}
        <div className="absolute bottom-2 left-4 text-[9px] font-mono tracking-widest text-white/60 uppercase">
          {match.court} · SET {match.currentSet}
        </div>
      </div>

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

      {/* Primary Score Buttons: Team A (Amber) and Team B (Cyan) (Directly matches screenshot) */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* +1 Team A (Solid Warm Amber) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handlePoint("A")}
          className="w-full bg-[#FFAE00] hover:bg-[#FFAE00]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">+1</span>
          <span className="truncate">{match.teamA.name}</span>
        </button>

        {/* +1 Team B (Solid Bright Cyan) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handlePoint("B")}
          className="w-full bg-[#35C5F4] hover:bg-[#35C5F4]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-xl">+1</span>
          <span className="truncate">{match.teamB.name}</span>
        </button>
      </div>

      {/* Bottom Sub-bar: Undo and Court Controls */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={onUndo}
          className="border border-[#25334B] bg-[#0F1A2D] hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-300 text-[#8491A7] py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
          title="Revert the most recent scoring action"
        >
          <Undo2 size={14} />
          <span>Undo Action</span>
        </button>

        <button
          type="button"
          onClick={() =>
            setServerSide((current) => (current === "A" ? "B" : "A"))
          }
          disabled={isPending || match.status === "COMPLETED"}
          className="border border-[#25334B] bg-[#0F1A2D] hover:border-[#8491A7] text-[#8491A7] hover:text-white py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RotateCw size={14} />
          <span>Switch Server</span>
          
        </button>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-[#FFAE00]">
  {`SET ${match.currentSet || 1} · ${match.teamA.score}–${match.teamB.score}`}
</div>
      </div>
    </div>
  )
}
