import { useState, useEffect } from "react"
import initialScheduleData from "../data/schedule"
import ScheduleRow from "./BadmintonScheduleRow"
import { fetchBadmintonSchedule } from "../services/badmintonApiService"

const filters = ["ALL", "LIVE", "UPCOMING", "COMPLETED"]

export default function Schedule() {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [matches, setMatches] = useState(initialScheduleData)

  // Fetch matches / previous matches from Kotlin backend whenever filter changes
  useEffect(() => {
    let isMounted = true

    async function loadMatches() {
      const data = await fetchBadmintonSchedule(activeFilter)
      if (isMounted && data && data.length > 0) {
        setMatches(data)
      }
    }

    loadMatches()

    return () => {
      isMounted = false
    }
  }, [activeFilter])

  const filteredMatches = matches.filter(
    (match) =>
      activeFilter === "ALL" || match.status === activeFilter
  )

  return (
    <section
      id="schedule"
      className="border-t border-white/10 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
              04 / DON'T MISS A RALLY
            </p>

            <h2 className="mt-5 text-5xl font-black uppercase sm:text-7xl">
              MATCH
              <span className="block text-[#DFFF00]">
                {activeFilter === "COMPLETED" ? "RESULTS." : "SCHEDULE."}
              </span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-gray-400">
            {activeFilter === "COMPLETED"
              ? "All previous match outcomes, sets won, and official championship scores."
              : "Every fixture. Every court. Follow the road to the championship."}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`border px-4 py-3 text-[9px] font-bold tracking-widest transition cursor-pointer ${
                activeFilter === filter
                  ? "border-[#DFFF00] bg-[#DFFF00] text-black"
                  : "border-white/10 text-gray-400 hover:border-[#DFFF00]/50 hover:text-white"
              }`}
            >
              {filter === "COMPLETED" ? "PREVIOUS MATCHES" : filter}
            </button>
          ))}
        </div>

        {/* Schedule table */}
        <div className="border border-white/10 bg-[#0C0E0D]">
          <div className="hidden grid-cols-[100px_1fr_1.5fr_120px] gap-4 border-b border-white/10 px-6 py-4 text-[9px] font-bold tracking-widest text-gray-500 md:grid">
            <span>TIME</span>
            <span>MATCH</span>
            <span>PLAYERS</span>
            <span className="text-right">STATUS</span>
          </div>

          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <ScheduleRow key={match.id} match={match} />
            ))
          ) : (
            <p className="px-6 py-12 text-center text-sm text-gray-500">
              No matches found for this filter.
            </p>
          )}
        </div>

        <p className="mt-5 text-[10px] tracking-widest text-gray-500">
          SHOWING {filteredMatches.length} OF {matches.length} MATCHES
        </p>
      </div>
    </section>
  )
}
