
import players from "../data/players"
import PlayerCard from "./playerCard"

export default function PlayerGrid() {
  return (
    <section
      id="players"
      className="mx-auto max-w-7xl border-t border-white/10 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
            02 / THE ATHLETES
          </p>

          <h2 className="mt-5 text-5xl font-black uppercase sm:text-7xl">
            BUILT TO
            <span className="block text-[#DFFF00]">COMPETE.</span>
          </h2>
        </div>

        <p className="max-w-xs text-sm leading-6 text-gray-400">
          Meet the athletes representing your campus.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
