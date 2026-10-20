/**
 * CricketSchedule Component
 * Filterable match fixtures calendar by format and status.
 */
import { useState } from "react"
import { cricketMatches } from "../data/cricketMatches"
import CricketMatchCard from "./CricketMatchCard"

const formatFilters = ["ALL FORMATS", "T20", "ODI", "TEST"]
const statusFilters = ["ALL", "LIVE", "UPCOMING", "COMPLETED"]

export default function CricketSchedule() {
  const [selectedFormat, setSelectedFormat] = useState("ALL FORMATS")
  const [selectedStatus, setSelectedStatus] = useState("ALL")

  const filteredMatches = cricketMatches.filter((match) => {
    const matchesFormat =
      selectedFormat === "ALL FORMATS" || match.format === selectedFormat
    const matchesStatus =
      selectedStatus === "ALL" || match.status === selectedStatus
    return matchesFormat && matchesStatus
  })

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-5 py-20 md:px-10 lg:px-16 border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
            02 / TOURNAMENT FIXTURES & CALENDAR
          </p>
          <h2 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            MATCH <span className="text-[#07F080]">SCHEDULE.</span>
          </h2>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-gray-400">
          Official match schedule for inter-departmental T20s, collegiate 50-over ODIs, and annual varsity 3-day test fixtures.
        </p>
      </div>

      {/* Filter Bars */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`border px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${
                selectedStatus === status
                  ? "border-[#07F080] bg-[#07F080] text-[#0A0A0A]"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Format Filters */}
        <div className="flex flex-wrap gap-2">
          {formatFilters.map((format) => (
            <button
              key={format}
              type="button"
              onClick={() => setSelectedFormat(format)}
              className={`border px-3 py-1.5 text-[9px] font-mono tracking-widest transition cursor-pointer ${
                selectedFormat === format
                  ? "border-[#07F080]/60 bg-[#07F080]/15 text-[#07F080]"
                  : "border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((m) => (
            <CricketMatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#111313] p-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            No fixtures found matching selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFormat("ALL FORMATS")
              setSelectedStatus("ALL")
            }}
            className="mt-4 border border-[#07F080] px-4 py-2 text-[10px] font-bold tracking-widest text-[#07F080]"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </section>
  )
}
