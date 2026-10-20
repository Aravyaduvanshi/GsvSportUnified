/**
 * MatchScoreboardStrip Component
 * Directly mirrors the reference screenshot's centered scoreboard strip:
 * Team A card in warm amber (#FFAE00), VS/Period badge, and Team B card in cyan (#35C5F4).
 */

export default function MatchScoreboardStrip({ match }) {
  if (!match) return null

  const isCricket = match.sport === "cricket"
  const isBasketball = match.sport === "basketball"

  // Derive scores and sub-captions
  const scoreA = isCricket ? `${match.teamA.runs}/${match.teamA.wickets}` : match.teamA.score
  const scoreB = isCricket ? `${match.teamB.runs}/${match.teamB.wickets}` : match.teamB.score

  const subCaptionA = isCricket
    ? `OVERS: ${match.teamA.overs || "0.0"}`
    : isBasketball
    ? `FOULS: ${match.teamA.fouls || 0}`
    : `SETS: ${match.teamA.setsWon}`

  const subCaptionB = isCricket
    ? `OVERS: ${match.teamB.overs || "0.0"}`
    : isBasketball
    ? `FOULS: ${match.teamB.fouls || 0}`
    : `SETS: ${match.teamB.setsWon}`

  return (
    <div className="bg-[#080D18] py-4 px-4 sm:px-8 border-b border-[#25334B]">
      <div className="mx-auto max-w-4xl flex items-stretch justify-center gap-2 sm:gap-8">
        {/* Team A Card (Amber Accent) */}
        <div className="flex-1 max-w-[280px] border border-[#FFAE00]/40 bg-[#0F1A2D] p-3 sm:p-4 text-center rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[#FFAE00]" />
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#FFAE00] truncate">
            {match.teamA.name}
          </p>
          <div className="my-1 sm:my-2 text-4xl sm:text-5xl font-black font-mono text-[#FFAE00] tracking-tight">
            {scoreA}
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#8491A7] uppercase">
            {subCaptionA}
          </p>
        </div>

        {/* Center VS & Period Indicator */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className="text-xs font-mono font-bold tracking-widest text-[#8491A7]">
            VS
          </span>
          <div className="mt-1.5 border border-[#25334B] bg-[#17243A] px-3 py-1 rounded-full text-[10px] font-mono font-bold text-white shadow">
            {match.periodLabel || "LIVE"}
          </div>
          <span className="mt-1 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {match.status}
          </span>
        </div>

        {/* Team B Card (Cyan Accent) */}
        <div className="flex-1 max-w-[280px] border border-[#35C5F4]/40 bg-[#0F1A2D] p-3 sm:p-4 text-center rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-[#35C5F4]" />
          <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#35C5F4] truncate flex items-center justify-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#35C5F4] shrink-0" />
            <span>{match.teamB.name}</span>
          </p>
          <div className="my-1 sm:my-2 text-4xl sm:text-5xl font-black font-mono text-[#35C5F4] tracking-tight">
            {scoreB}
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#8491A7] uppercase">
            {subCaptionB}
          </p>
        </div>
      </div>
    </div>
  )
}
