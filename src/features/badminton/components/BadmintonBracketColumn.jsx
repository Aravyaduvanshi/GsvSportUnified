
import BracketMatch from "./BadmintonBracketMatch"

export default function BracketColumn({ round }) {
  return (
    <div className="flex min-w-[240px] flex-1 flex-col">
      <h3 className="mb-6 border-b border-white/10 pb-4 text-[10px] font-black tracking-[0.2em] text-[#DFFF00]">
        {round.title}
      </h3>

      <div className="flex flex-1 flex-col justify-around gap-6">
        {round.matches.map((match) => (
          <div key={match.id} className="relative">
            <BracketMatch match={match} />
          </div>
        ))}
      </div>
    </div>
  )
}
