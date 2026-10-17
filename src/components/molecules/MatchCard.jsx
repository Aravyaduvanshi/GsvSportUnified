/**
 * MatchCard Molecule
 * Displays match summary between two opponents, scores, status, and court location.
 */
import Badge from "../atoms/Badge"

export default function MatchCard({
  category = "SINGLES",
  court = "COURT 01",
  status = "UPCOMING",
  player1 = "Player 1",
  player2 = "Player 2",
  score1 = "—",
  score2 = "—",
  sport = "Badminton",
  time,
  onClick,
  active = false,
}) {
  const isLive = status === "LIVE"

  return (
    <article
      onClick={onClick}
      className={`relative border p-6 transition-all duration-300 ${
        active
          ? "border-[#07F080] bg-[#07F080]/5"
          : "border-white/10 bg-[#111313] hover:border-[#07F080]/50"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest text-white/90">
            {sport.toUpperCase()}
          </span>
          <span className="text-[9px] text-gray-500">·</span>
          <span className="text-[10px] tracking-widest text-gray-400">
            {category}
          </span>
        </div>

        <Badge variant={isLive ? "live" : status === "COMPLETED" ? "completed" : "upcoming"}>
          {status}
        </Badge>
      </div>

      <div className="my-5 flex items-center justify-between gap-4">
        <div className="space-y-3 flex-1">
          <p className="text-sm font-bold uppercase text-white truncate">
            {player1}
          </p>
          <p className="text-sm font-bold uppercase text-white truncate">
            {player2}
          </p>
        </div>

        <div className="space-y-3 text-right font-black text-[#07F080] min-w-[32px]">
          <p>{score1 ?? "—"}</p>
          <p>{score2 ?? "—"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[9px] tracking-widest text-gray-500">
        <span>{court}</span>
        {time && <span>{time}</span>}
      </div>
    </article>
  )
}
