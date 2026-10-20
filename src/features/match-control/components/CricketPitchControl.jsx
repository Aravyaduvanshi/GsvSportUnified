/**
 * CricketPitchControl Component
 * Left workspace for Cricket scorekeeping.
 * Visual pitch diagram, delivery outcomes (0, 1, 2, 3, 4, 6, W, Wd, Nb),
 * and primary scoring triggers following the reference layout.
 */
import { useState } from "react"
import { Undo2, Users } from "lucide-react"

const deliveryOutcomes = [
  { id: "0", label: "0 Dot", runs: 0, type: "RUNS" },
  { id: "1", label: "1 Run", runs: 1, type: "RUNS" },
  { id: "2", label: "2 Runs", runs: 2, type: "RUNS" },
  { id: "3", label: "3 Runs", runs: 3, type: "RUNS" },
  { id: "4", label: "4 Four", runs: 4, type: "RUNS", highlight: "#FFAE00" },
  { id: "6", label: "6 Six", runs: 6, type: "RUNS", highlight: "#FFAE00" },
  { id: "W", label: "Wicket", type: "WICKET", highlight: "#EF4444" },
  { id: "Wd", label: "Wide (+1)", extraType: "Wide", extraRuns: 1, type: "EXTRA" },
  { id: "Nb", label: "No Ball (+1)", extraType: "No-Ball", extraRuns: 1, type: "EXTRA" },
]

export default function CricketPitchControl({
  match,
  onScoringAction,
  onUndo,
  isPending = false,
}) {
  const [selectedOutcome, setSelectedOutcome] = useState("1")

  const battingTeam = match.teamB.isBatting ? match.teamB : match.teamA
  const bowlingTeam = match.teamB.isBatting ? match.teamA : match.teamB

  const handleApplyDelivery = (outcomeOverride) => {
    const outcomeId = outcomeOverride || selectedOutcome
    const matched = deliveryOutcomes.find((d) => d.id === outcomeId) || deliveryOutcomes[1]

    if (matched.type === "RUNS") {
      onScoringAction({
        actionType: "RUNS",
        runs: matched.runs,
        type: "CRICKET_DELIVERY",
      })
    } else if (matched.type === "WICKET") {
      onScoringAction({
        actionType: "WICKET",
        dismissal: "Bowled / Caught",
        type: "CRICKET_WICKET",
      })
    } else if (matched.type === "EXTRA") {
      onScoringAction({
        actionType: "EXTRA",
        extraType: matched.extraType,
        extraRuns: matched.extraRuns,
        type: "CRICKET_EXTRA",
      })
    }
  }

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Cricket Pitch Graphic */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-[#143022] rounded-lg border-2 border-[#1E4D36] p-5 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Pitch Turf Strip */}
        <div className="absolute inset-x-8 inset-y-6 bg-[#C2A36B]/80 rounded border border-[#8C6D3B] flex flex-col justify-between p-3 opacity-95">
          {/* Bowling End */}
          <div className="border-b border-white/60 pb-1 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] font-bold text-black uppercase">
              BOWLER: {match.bowler || "Active Bowler"}
            </span>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-700" />
              <span className="h-2 w-2 rounded-full bg-red-700" />
              <span className="h-2 w-2 rounded-full bg-red-700" />
            </div>
          </div>

          {/* 22 Yards Center Pitch Details */}
          <div className="flex items-center justify-between text-center font-mono my-auto">
            <div className="border border-black/40 bg-black/20 p-2 rounded text-left">
              <span className="text-[9px] text-black font-bold block uppercase">NON-STRIKER</span>
              <span className="text-xs font-black text-black">{match.nonStriker || "Non-Striker"}</span>
            </div>

            <div className="bg-black/60 px-3 py-1 rounded text-white font-mono text-xs">
              22 YDS · TURF PITCH 1
            </div>

            <div className="border border-black/40 bg-[#FFAE00]/40 p-2 rounded text-right">
              <span className="text-[9px] text-black font-bold block uppercase">STRIKER *</span>
              <span className="text-xs font-black text-black">{match.striker || "Striker"}</span>
            </div>
          </div>

          {/* Batting Crease End */}
          <div className="border-t border-white/60 pt-1 flex items-center justify-between text-xs font-mono">
            <span className="text-[10px] font-bold text-black uppercase">
              CREASE: {battingTeam.shortName} BATTING
            </span>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-red-700" />
              <span className="h-2 w-2 rounded-full bg-red-700" />
              <span className="h-2 w-2 rounded-full bg-red-700" />
            </div>
          </div>
        </div>

        {/* Current Over Balls Pill Strip */}
        <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-md p-2 rounded border border-white/10 mt-auto">
          <span className="text-[10px] font-mono text-[#8491A7] uppercase">THIS OVER:</span>
          <div className="flex items-center gap-1.5">
            {(match.currentOverBalls || []).map((b, idx) => (
              <span
                key={idx}
                className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold font-mono ${
                  b === "6"
                    ? "bg-[#FFAE00] text-black font-black"
                    : b === "4"
                    ? "bg-emerald-600 text-white"
                    : b === "W"
                    ? "bg-red-600 text-white"
                    : "bg-[#25334B] text-white"
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Outcome Selector */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-[#8491A7] mr-1">Ball Outcome:</span>
        {deliveryOutcomes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedOutcome(item.id)}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-mono transition cursor-pointer ${
              selectedOutcome === item.id
                ? "border-[#FFAE00] bg-[#FFAE00]/20 text-[#FFAE00] font-bold"
                : "border-[#25334B] bg-[#0F1A2D] text-[#8491A7] hover:text-white hover:border-[#8491A7]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Primary Score Buttons */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Apply Ball to Batting Team (Amber) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handleApplyDelivery()}
          className="w-full bg-[#FFAE00] hover:bg-[#FFAE00]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>RECORD BALL ({selectedOutcome}) → {battingTeam.shortName}</span>
        </button>

        {/* Wicket for Bowling Team (Cyan) */}
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={() => handleApplyDelivery("W")}
          className="w-full bg-[#35C5F4] hover:bg-[#35C5F4]/90 active:scale-[0.98] text-[#080D18] py-4 sm:py-5 px-4 rounded font-black text-sm sm:text-base tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>+ WICKET FOR {bowlingTeam.shortName}</span>
        </button>
      </div>

      {/* Bottom Sub-bar: Undo and Striker Controls */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <button
          type="button"
          disabled={isPending || match.status === "COMPLETED"}
          onClick={onUndo}
          className="border border-[#25334B] bg-[#0F1A2D] hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-300 text-[#8491A7] py-2.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40"
        >
          <Undo2 size={14} />
          <span>Undo Ball</span>
        </button>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-gray-300">
          Target: {match.target || 173} runs
        </div>

        <div className="border border-[#25334B] bg-[#0F1A2D] py-2.5 px-3 rounded text-xs font-mono text-center flex items-center justify-center text-[#FFAE00]">
          Need {match.runsNeeded || 25} in {match.ballsRemaining || 20}b
        </div>
      </div>
    </div>
  )
}
