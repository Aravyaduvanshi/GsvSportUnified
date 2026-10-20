/**
 * CricketStandings Component
 * Responsive points table with sticky headers and Net Run Rate calculations.
 */
import { cricketStandings } from "../data/cricketStandings"

export default function CricketStandings() {
  return (
    <section id="standings" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
            03 / TOURNAMENT STANDINGS & NRR
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            POINTS <span className="text-[#07F080]">TABLE.</span>
          </h2>
        </div>

        <div className="text-xs text-gray-400">
          <span className="text-[#07F080] font-bold">Top 2 Teams</span> qualify directly for the Championship Final.
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto border border-white/10 bg-[#111313]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-white/10 bg-black/60 text-[9px] uppercase tracking-widest text-gray-400 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th scope="col" className="py-4 px-4 sm:px-6">POS</th>
              <th scope="col" className="py-4 px-4 sm:px-6">TEAM</th>
              <th scope="col" className="py-4 px-3 text-center">P</th>
              <th scope="col" className="py-4 px-3 text-center">W</th>
              <th scope="col" className="py-4 px-3 text-center">L</th>
              <th scope="col" className="py-4 px-3 text-center">T/NR</th>
              <th scope="col" className="py-4 px-4 text-center font-bold text-white">PTS</th>
              <th scope="col" className="py-4 px-4 text-center">NRR</th>
              <th scope="col" className="py-4 px-6 text-right hidden sm:table-cell">RECENT FORM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cricketStandings.map((row) => {
              const isTopTwo = row.rank <= 2
              return (
                <tr
                  key={row.teamId}
                  className={`transition-colors hover:bg-white/5 ${
                    isTopTwo ? "bg-[#07F080]/[0.02]" : ""
                  }`}
                >
                  {/* Position */}
                  <td className="py-4 px-4 sm:px-6 font-bold">
                    <span
                      className={`inline-grid h-6 w-6 place-items-center rounded-sm text-[10px] ${
                        isTopTwo
                          ? "bg-[#07F080] text-black font-black"
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
                      {isTopTwo && (
                        <span className="text-[8px] border border-[#07F080]/60 bg-[#07F080]/10 text-[#07F080] px-1.5 py-0.5 tracking-widest font-sans">
                          QUALIFIED
                        </span>
                      )}
                    </div>
                  </td>

                  {/* P, W, L, T/NR */}
                  <td className="py-4 px-3 text-center text-gray-300">{row.played}</td>
                  <td className="py-4 px-3 text-center font-bold text-emerald-400">{row.won}</td>
                  <td className="py-4 px-3 text-center text-rose-400">{row.lost}</td>
                  <td className="py-4 px-3 text-center text-gray-500">{row.tied + row.noResult}</td>

                  {/* Points */}
                  <td className="py-4 px-4 text-center text-base font-black text-[#07F080]">
                    {row.points}
                  </td>

                  {/* NRR */}
                  <td className={`py-4 px-4 text-center font-bold ${
                    row.netRunRate.startsWith("+") ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {row.netRunRate}
                  </td>

                  {/* Form */}
                  <td className="py-4 px-6 text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1.5">
                      {row.form.map((res, idx) => (
                        <span
                          key={idx}
                          className={`grid h-5 w-5 place-items-center rounded-sm text-[8px] font-bold ${
                            res === "W"
                              ? "bg-emerald-600/80 text-white"
                              : "bg-rose-900/80 text-rose-200"
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-[10px] font-mono text-gray-500 gap-4">
        <p>P: Played · W: Won · L: Lost · T/NR: Tied / No Result · PTS: Points · NRR: Net Run Rate</p>
        <p className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#07F080]" />
          Official calculations verified by GSV Sports Bureau
        </p>
      </div>
    </section>
  )
}
