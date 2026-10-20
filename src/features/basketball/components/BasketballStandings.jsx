/**
 * BasketballStandings Component
 * League conference standings with win percentage, point differential, and streak.
 */
import { basketballStandings } from "../data/basketballStandings"

export default function BasketballStandings() {
  return (
    <section id="standings" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            03 / LEAGUE STANDINGS & RANKINGS
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            CONFERENCE <span className="text-[#F97316]">TABLE.</span>
          </h2>
        </div>

        <div className="text-xs text-gray-400">
          <span className="text-[#F97316] font-bold">Top 4 Seeds</span> advance to the GSV Hoops Championship Playoffs.
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-white/10 bg-[#111313]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-white/10 bg-black/60 text-[9px] uppercase tracking-widest text-gray-400 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th scope="col" className="py-4 px-4 sm:px-6">RANK</th>
              <th scope="col" className="py-4 px-4 sm:px-6">TEAM</th>
              <th scope="col" className="py-4 px-3 text-center">W</th>
              <th scope="col" className="py-4 px-3 text-center">L</th>
              <th scope="col" className="py-4 px-3 text-center">PCT</th>
              <th scope="col" className="py-4 px-3 text-center hidden sm:table-cell">PTS+</th>
              <th scope="col" className="py-4 px-3 text-center hidden sm:table-cell">PTS-</th>
              <th scope="col" className="py-4 px-4 text-center font-bold text-white">DIFF</th>
              <th scope="col" className="py-4 px-4 text-center">STRK</th>
              <th scope="col" className="py-4 px-6 text-right hidden md:table-cell">HOME/AWAY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {basketballStandings.map((row) => {
              const isPlayoffBound = row.rank <= 4
              return (
                <tr
                  key={row.teamId}
                  className={`transition-colors hover:bg-white/5 ${
                    isPlayoffBound ? "bg-[#F97316]/[0.02]" : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-4 sm:px-6 font-bold">
                    <span
                      className={`inline-grid h-6 w-6 place-items-center rounded-sm text-[10px] ${
                        isPlayoffBound
                          ? "bg-[#F97316] text-black font-black"
                          : "bg-white/10 text-gray-300"
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-white text-sm">
                        {row.team}
                      </span>
                      {isPlayoffBound && (
                        <span className="text-[8px] border border-[#F97316]/60 bg-[#F97316]/10 text-[#F97316] px-1.5 py-0.5 tracking-widest font-sans">
                          PLAYOFF SEED
                        </span>
                      )}
                    </div>
                  </td>

                  {/* W, L, PCT */}
                  <td className="py-4 px-3 text-center font-bold text-emerald-400">{row.won}</td>
                  <td className="py-4 px-3 text-center text-rose-400">{row.lost}</td>
                  <td className="py-4 px-3 text-center font-bold text-white">{row.winPct}</td>

                  {/* PTS+, PTS- */}
                  <td className="py-4 px-3 text-center text-gray-400 hidden sm:table-cell">{row.pointsFor}</td>
                  <td className="py-4 px-3 text-center text-gray-400 hidden sm:table-cell">{row.pointsAgainst}</td>

                  {/* DIFF */}
                  <td className={`py-4 px-4 text-center font-bold ${
                    row.diff.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {row.diff}
                  </td>

                  {/* Streak */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded-sm ${
                        row.streak.startsWith("W")
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                          : "bg-rose-950 text-rose-400 border border-rose-800/40"
                      }`}
                    >
                      {row.streak}
                    </span>
                  </td>

                  {/* Home / Away */}
                  <td className="py-4 px-6 text-right text-gray-400 hidden md:table-cell">
                    {row.home} / {row.away}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-[10px] font-mono text-gray-500 gap-4">
        <p>W: Wins · L: Losses · PCT: Win Percentage · DIFF: Point Differential · STRK: Current Streak</p>
        <p className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F97316]" />
          Top 4 seeds advance to the GSV Championship Semifinals
        </p>
      </div>
    </section>
  )
}
