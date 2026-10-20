/**
 * BasketballMatchCard Component
 * Displays individual game fixture with quarter scores and team initials.
 */
import Badge from "../../../components/atoms/Badge"

export default function BasketballMatchCard({ game, onSelect, isSelected = false }) {
  const isLive = game.status === "LIVE"
  const isFinal = game.status === "FINAL"

  return (
    <article
      onClick={() => onSelect && onSelect(game)}
      className={`border p-6 transition-all duration-300 ${
        isSelected
          ? "border-[#F97316] bg-[#F97316]/5 shadow-[0_4px_24px_rgba(249,115,22,0.08)]"
          : "border-white/10 bg-[#111313] hover:border-[#F97316]/50"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="border border-[#F97316]/40 bg-[#F97316]/10 px-2 py-0.5 text-[8px] font-black tracking-widest text-[#F97316]">
            5V5 HOOPS
          </span>
          <span className="text-[10px] font-mono tracking-widest text-gray-400">
            {game.period}
          </span>
        </div>

        <Badge variant={isLive ? "warning" : isFinal ? "completed" : "upcoming"}>
          {game.status}
        </Badge>
      </div>

      {/* Teams & Scores */}
      <div className="my-5 space-y-4">
        {/* Home Team */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: game.homeTeam.color || "#F97316" }}
            />
            <p className="text-sm font-bold uppercase text-white truncate">
              {game.homeTeam.name}
            </p>
          </div>
          <div className="text-right font-mono font-black text-white shrink-0 text-base">
            {game.homeTeam.score !== null ? game.homeTeam.score : "—"}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: game.awayTeam.color || "#38BDF8" }}
            />
            <p className="text-sm font-bold uppercase text-white truncate">
              {game.awayTeam.name}
            </p>
          </div>
          <div className="text-right font-mono font-black text-[#F97316] shrink-0 text-base">
            {game.awayTeam.score !== null ? game.awayTeam.score : "—"}
          </div>
        </div>
      </div>

      {/* Result note / Top Performer */}
      {isFinal && game.winner && (
        <p className="text-[10px] font-bold text-orange-400/90 border-t border-white/5 pt-3">
          {game.winner} Won ({game.finalDifference})
        </p>
      )}

      {isLive && game.clock && (
        <p className="text-[10px] font-mono text-gray-300 border-t border-white/5 pt-3">
          Clock: {game.clock} · {game.period}
        </p>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[9px] tracking-widest text-gray-500 font-mono">
        <span>{game.court.split("·")[0]}</span>
        <span>{game.date} {game.time}</span>
      </div>
    </article>
  )
}
