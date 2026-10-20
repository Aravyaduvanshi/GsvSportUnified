/**
 * BasketballSchedule Component
 * Filterable game schedule by status (ALL, LIVE, UPCOMING, FINAL).
 */
import { useState } from "react"
import { basketballGames } from "../data/basketballGames"
import BasketballMatchCard from "./BasketballMatchCard"

const statusFilters = ["ALL", "LIVE", "UPCOMING", "FINAL"]

export default function BasketballSchedule() {
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  const filteredGames = basketballGames.filter((game) => {
    if (selectedStatus === "ALL") return true
    return game.status === selectedStatus
  })

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#F97316]">
            02 / TOURNAMENT CALENDAR
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            GAME <span className="text-[#F97316]">SCHEDULE.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          Complete slate of inter-hostel and academic department 5v5 basketball games hosted on North Hardcourts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`border px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${
                selectedStatus === status
                  ? "border-[#F97316] bg-[#F97316] text-[#0A0A0A]"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-gray-400">
          SHOWING {filteredGames.length} GAMES
        </div>
      </div>

      {/* Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((g) => (
            <BasketballMatchCard key={g.id} game={g} />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#111313] p-12 text-center">
          <p className="text-sm font-bold text-gray-400">No games found for selected filter.</p>
          <button
            type="button"
            onClick={() => setSelectedStatus("ALL")}
            className="mt-4 border border-[#F97316] px-4 py-2 text-[10px] font-bold tracking-widest text-[#F97316]"
          >
            SHOW ALL GAMES
          </button>
        </div>
      )}
    </section>
  )
}
