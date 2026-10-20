/**
 * BasketballBracket Component
 * Playoff championship bracket from Semifinals to Trophy game.
 */

const playoffRounds = [
  {
    title: "SEMIFINALS (BEST OF 1)",
    matches: [
      {
        id: "semi-1",
        team1: "Hostel 3 Ballers",
        seed1: "#1",
        score1: 74,
        team2: "Hostel 1 Warriors",
        seed2: "#4",
        score2: 68,
        winner: "Hostel 3 Ballers",
        status: "FINAL",
      },
      {
        id: "semi-2",
        team1: "CSE Cyber Dunkers",
        seed1: "#2",
        score1: null,
        team2: "Civil Slammers",
        seed2: "#3",
        score2: null,
        winner: null,
        status: "UPCOMING · TOMORROW",
      },
    ],
  },
  {
    title: "GSV CHAMPIONSHIP FINAL",
    matches: [
      {
        id: "final-1",
        team1: "Hostel 3 Ballers",
        seed1: "#1",
        score1: null,
        team2: "TBD (Winner SF2)",
        seed2: "—",
        score2: null,
        winner: null,
        status: "OCT 25 · 07:00 PM",
      },
    ],
  },
]

export default function BasketballBracket() {
  return (
    <section id="playoffs" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            06 / ROAD TO THE TROPHY
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            PLAYOFF <span className="text-[#F97316]">BRACKET.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          Single elimination championship knockout round for the GSV Hoops Classic 2026-27 trophy.
        </p>
      </div>

      {/* Bracket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {playoffRounds.map((round, rIdx) => (
          <div key={rIdx} className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" />
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#F97316]">
                {round.title}
              </h3>
            </div>

            <div className="space-y-4">
              {round.matches.map((m) => (
                <div
                  key={m.id}
                  className="border border-white/10 bg-[#111313] p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pb-3 border-b border-white/5">
                    <span>{m.status}</span>
                    <span>NORTH COURT 1</span>
                  </div>

                  <div className="space-y-3 mt-3">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">{m.seed1}</span>
                        <span className={`text-sm font-bold uppercase ${
                          m.winner === m.team1 ? "text-white" : "text-gray-300"
                        }`}>
                          {m.team1}
                        </span>
                      </div>
                      <span className="font-mono font-black text-sm text-white">
                        {m.score1 !== null ? m.score1 : "—"}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">{m.seed2}</span>
                        <span className={`text-sm font-bold uppercase ${
                          m.winner === m.team2 ? "text-white" : "text-gray-400"
                        }`}>
                          {m.team2}
                        </span>
                      </div>
                      <span className="font-mono font-black text-sm text-[#F97316]">
                        {m.score2 !== null ? m.score2 : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
