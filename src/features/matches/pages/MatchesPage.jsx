/**
 * MatchesPage
 * Route: /matches
 * Displays campus match fixtures, schedules, and filters.
 */
import { useState } from "react"
import { Link } from "react-router-dom"
import MatchCard from "../../../components/molecules/MatchCard"
import badmintonMatches from "../../badminton/data/matches"
import badmintonSchedule from "../../badminton/data/schedule"

const filters = ["ALL", "LIVE", "UPCOMING", "COMPLETED"]

export default function MatchesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [sportFilter] = useState("ALL")

  // Combine live matches & scheduled matches
  const allMatches = [
    ...badmintonMatches.map((m) => ({ ...m, sport: "Badminton" })),
    ...badmintonSchedule.map((s) => ({ ...s, sport: "Badminton" })),
  ]

  const filteredMatches = allMatches.filter((match) => {
    const matchesStatus = activeFilter === "ALL" || match.status === activeFilter
    const matchesSport = sportFilter === "ALL" || match.sport.toUpperCase() === sportFilter
    return matchesStatus && matchesSport
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
          CENTRAL FIXTURES
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
          CAMPUS MATCH <span className="text-[#07F080]">SCHEDULE</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Complete fixture list for collegiate tournaments. Follow current on-court action or check upcoming clash times across all sports.
        </p>
      </div>

      {/* Filters Row */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`border px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${
                activeFilter === filter
                  ? "border-[#07F080] bg-[#07F080] text-[#080909]"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-bold tracking-widest text-gray-400">
          SHOWING {filteredMatches.length} MATCHES
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMatches.map((m, index) => (
          <Link key={`${m.id}-${index}`} to={`/matches/${m.id}`}>
            <MatchCard
              sport={m.sport}
              category={m.category}
              court={m.court}
              status={m.status}
              player1={m.player1}
              player2={m.player2}
              score1={m.score1}
              score2={m.score2}
              time={m.time}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
