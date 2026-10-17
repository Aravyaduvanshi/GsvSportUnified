/**
 * ScoreDisplay Molecule
 * High-visibility score board block comparing opponents and game counts.
 */
export default function ScoreDisplay({
  player1 = "Side A",
  player2 = "Side B",
  score1 = 0,
  score2 = 0,
  sets,
  className = "",
}) {
  return (
    <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-[#111313] p-6 border border-white/10 ${className}`}>
      <div className="text-left">
        <p className="text-[9px] tracking-widest text-gray-500 mb-1">TEAM / PLAYER A</p>
        <h4 className="text-lg md:text-2xl font-black uppercase text-white truncate">{player1}</h4>
      </div>

      <div className="text-center px-4">
        <p className="text-[9px] tracking-widest text-gray-500 mb-1">SCORE</p>
        <div className="text-3xl md:text-5xl font-black text-[#07F080] tracking-tight">
          {score1} <span className="text-gray-600 px-1">:</span> {score2}
        </div>
        {sets && <p className="text-[10px] tracking-widest text-gray-400 mt-1">{sets}</p>}
      </div>

      <div className="text-right">
        <p className="text-[9px] tracking-widest text-gray-500 mb-1">TEAM / PLAYER B</p>
        <h4 className="text-lg md:text-2xl font-black uppercase text-white truncate">{player2}</h4>
      </div>
    </div>
  )
}
