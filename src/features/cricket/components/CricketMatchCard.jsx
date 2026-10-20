/**
 * CricketMatchCard Component
 * Displays match fixtures with format tags, team scores, and pitch venue.
 */
import Badge from "../../../components/atoms/Badge"
import { formatScore, formatOvers } from "../utils/cricketFormatters"

export default function CricketMatchCard({ match, onSelect, isSelected = false }) {
  const isLive = match.status === "LIVE"
  const isCompleted = match.status === "COMPLETED"

  return (
    <article
      onClick={() => onSelect && onSelect(match)}
      className={`border p-6 transition-all duration-300 ${
        isSelected
          ? "border-[#07F080] bg-[#07F080]/5 shadow-[0_4px_24px_rgba(7,240,128,0.08)]"
          : "border-white/10 bg-[#111313] hover:border-[#07F080]/50"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="border border-[#07F080]/40 bg-[#07F080]/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-[#07F080]">
            {match.format}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-gray-400">
            {match.stage}
          </span>
        </div>

        <Badge variant={isLive ? "live" : isCompleted ? "completed" : "upcoming"}>
          {match.status}
        </Badge>
      </div>

      {/* Teams & Scores */}
      <div className="my-5 space-y-4">
        {/* Team 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: match.team1.color || "#07F080" }}
            />
            <p className="text-sm font-bold uppercase text-white truncate">
              {match.team1.name}
            </p>
          </div>
          <div className="text-right font-mono font-black text-white shrink-0">
            {match.team1.runs !== null && match.team1.runs !== undefined ? (
              <span>
                {formatScore(match.team1.runs, match.team1.wickets)}
                {match.team1.overs && (
                  <span className="text-[10px] font-normal text-gray-500 ml-1">
                    ({formatOvers(match.team1.overs)})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: match.team2.color || "#38BDF8" }}
            />
            <p className="text-sm font-bold uppercase text-white truncate">
              {match.team2.name}
            </p>
          </div>
          <div className="text-right font-mono font-black text-[#07F080] shrink-0">
            {match.team2.runs !== null && match.team2.runs !== undefined ? (
              <span>
                {formatScore(match.team2.runs, match.team2.wickets)}
                {match.team2.overs && (
                  <span className="text-[10px] font-normal text-emerald-400/70 ml-1">
                    ({formatOvers(match.team2.overs)})
                  </span>
                )}
              </span>
            ) : (
              <span className="text-gray-500">—</span>
            )}
          </div>
        </div>
      </div>

      {/* Result note or Target */}
      {isCompleted && match.result && (
        <p className="text-[10px] font-bold text-emerald-400/90 border-t border-white/5 pt-3">
          {match.result}
        </p>
      )}

      {isLive && match.target && (
        <p className="text-[10px] font-mono text-gray-300 border-t border-white/5 pt-3">
          Target: {match.target} · Need {match.runsNeeded} off {match.ballsRemaining} balls
        </p>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[9px] tracking-widest text-gray-500 font-mono">
        <span>{match.venue}</span>
        <span>{match.date} {match.time}</span>
      </div>
    </article>
  )
}
