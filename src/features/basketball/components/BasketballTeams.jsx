/**
 * BasketballTeams Component
 * Directory of conference basketball teams, captains, and records.
 */
import { basketballTeams } from "../data/basketballTeams"

export default function BasketballTeams() {
  return (
    <section id="teams" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            04 / TEAM DIRECTORY
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            CAMPUS <span className="text-[#F97316]">TEAMS.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          6 participating squads across university hostels and academic departments competing on the North Hardcourts.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {basketballTeams.map((team) => (
          <div
            key={team.id}
            className="border border-white/10 bg-[#111313] p-6 transition hover:border-[#F97316]/60 relative group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="inline-block px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest text-black uppercase mb-2"
                  style={{ backgroundColor: team.color }}
                >
                  {team.shortName}
                </span>
                <h3 className="text-xl font-black uppercase text-white group-hover:text-[#F97316] transition-colors">
                  {team.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{team.conference}</p>
              </div>

              <div
                className="grid h-12 w-12 place-items-center font-black text-white text-base border"
                style={{ borderColor: team.color, backgroundColor: `${team.color}15` }}
              >
                {team.shortName.slice(0, 3)}
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">CAPTAIN</p>
                <p className="font-bold text-white mt-0.5">{team.captain}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-widest text-gray-500 uppercase">RECORD</p>
                <p className="font-bold text-[#F97316] mt-0.5">{team.won}W - {team.lost}L ({team.pct})</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>{team.squadCount} Athletes</span>
              <span>{team.homeCourt}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
