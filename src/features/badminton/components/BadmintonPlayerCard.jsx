
export default function PlayerCard({ player, index }) {
  return (
    <article className="group relative overflow-hidden border border-white/10 bg-[#111313] transition duration-300 hover:-translate-y-1 hover:border-[#DFFF00]/60">

      {/* Player image placeholder */}
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-gradient-to-br from-[#20251C] to-[#080909]">
        {player.image ? (
          <img
            src={player.image}
            alt={player.name}
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <span className="text-8xl font-black text-white/10">
            0{index + 1}
          </span>
        )} 

        <span className="absolute left-4 top-4 border border-[#DFFF00]/40 px-3 py-2 text-[10px] font-bold text-[#DFFF00]">
          {player.ranking}
        </span>

        <span className="absolute bottom-4 left-4 text-[9px] font-bold tracking-[0.2em] text-[#DFFF00]">
          {player.category}
        </span>
      </div>

      {/* Player information */}
      <div className="p-5">
        <h3 className="text-xl font-black uppercase tracking-tight">
          {player.name}
        </h3>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-[10px] tracking-widest text-gray-500">
            MATCH WINS
          </span>

          <span className="text-lg font-black text-[#DFFF00]">
            {player.wins}
          </span>
        </div>
      </div>
    </article>
  )
}
