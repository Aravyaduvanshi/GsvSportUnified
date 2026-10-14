
export default function BracketMatch({ match }) {
  const hasResult = match.winner !== null

  const players = [
    {
      name: match.player1,
      score: match.score1,
    },
    {
      name: match.player2,
      score: match.score2,
    },
  ]

  return (
    <article className="w-full min-w-[220px] border border-white/10 bg-[#111313] transition hover:border-[#DFFF00]/50">
      {players.map((player, index) => {
        const isWinner = match.winner === player.name

        return (
          <div
            key={index}
            className={`flex items-center justify-between gap-4 px-4 py-4 ${
              index === 0 ? "border-b border-white/10" : ""
            } ${isWinner ? "bg-[#DFFF00]/5" : ""}`}
          >
            <span
              className={`truncate text-xs font-bold ${
                isWinner ? "text-[#DFFF00]" : "text-gray-300"
              }`}
            >
              {player.name}
            </span>

            <span
              className={`text-sm font-black ${
                isWinner ? "text-[#DFFF00]" : "text-gray-400"
              }`}
            >
              {player.score ?? "—"}
            </span>
          </div>
        )
      })}

      <div className="border-t border-white/10 px-4 py-2">
        <span className="text-[9px] font-bold tracking-widest text-gray-500">
          {hasResult ? "MATCH COMPLETE" : "AWAITING MATCH"}
        </span>
      </div>
    </article>
  )
}
