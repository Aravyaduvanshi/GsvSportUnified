import { useState, useEffect, useCallback } from "react"
import { Trophy } from "lucide-react"
import ScheduleRow from "./BadmintonScheduleRow"
import {
  fetchBadmintonSchedule,
  fetchTournaments,
  subscribeToTournaments,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
} from "../services/badmintonApiService"

const filters = ["ALL", "LIVE", "UPCOMING", "COMPLETED"]

export default function Schedule() {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const [activeTournamentFilter, setActiveTournamentFilter] = useState("ALL")
  const [tournaments, setTournaments] = useState([])
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadMatches = useCallback(async () => {
    try {
      const [data, tList] = await Promise.all([
        fetchBadmintonSchedule("ALL"),
        fetchTournaments(),
      ])
      if (Array.isArray(data)) {
        setMatches(data)
      } else {
        setMatches([])
      }
      if (Array.isArray(tList)) {
        setTournaments(tList)
      }
    } catch (e) {
      console.warn("Failed to load badminton schedule:", e)
      setMatches([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMatches()

    const unsubTourn = subscribeToTournaments(() => loadMatches())
    const unsubLive = subscribeToBadmintonLiveScores(() => loadMatches())
    const unsubDel = subscribeToMatchDeletion(({ matchId }) => {
      if (matchId) {
        setMatches((prev) => prev.filter((m) => m.id !== matchId))
      } else {
        loadMatches()
      }
    })
    const unsubMatches = subscribeToMatchUpdates(() => loadMatches())
    const unsubSched = subscribeToScheduleUpdates(() => loadMatches())

    const interval = setInterval(loadMatches, 4000)

    return () => {
      unsubTourn()
      unsubLive()
      unsubDel()
      unsubMatches()
      unsubSched()
      clearInterval(interval)
    }
  }, [loadMatches])

  const filteredMatches = matches.filter((match) => {
    const matchesStatus =
      activeFilter === "ALL" || match.status === activeFilter
    const matchesTournament =
      activeTournamentFilter === "ALL" ||
      match.tournamentId === activeTournamentFilter ||
      match.tournament === activeTournamentFilter ||
      (match.id && typeof match.id === "string" && match.id.startsWith(activeTournamentFilter))
    return matchesStatus && matchesTournament
  })

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

        {/* Tournament Selector Filter */}
        {tournaments.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mr-1">
              Tournament:
            </span>
            <button
              type="button"
              onClick={() => setActiveTournamentFilter("ALL")}
              className={`border px-3.5 py-2 text-[10px] font-bold tracking-wider transition cursor-pointer rounded ${
                activeTournamentFilter === "ALL"
                  ? "border-[#DFFF00] bg-[#DFFF00] text-black"
                  : "border-white/10 bg-[#162032] text-gray-400 hover:text-white"
              }`}
            >
              ALL TOURNAMENTS
            </button>
            {tournaments.map((t) => {
              const isSelected = activeTournamentFilter === t.id
              const catName = (t.category?.name || t.category || "").toString().replace(/_/g, " ")
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTournamentFilter(t.id)}
                  className={`flex items-center gap-1.5 border px-3.5 py-2 text-[10px] font-bold tracking-wider transition cursor-pointer rounded ${
                    isSelected
                      ? "border-[#DFFF00] bg-[#DFFF00] text-black"
                      : "border-white/10 bg-[#162032] text-gray-300 hover:text-white"
                  }`}
                >
                  <Trophy size={12} className={isSelected ? "text-black" : "text-[#DFFF00]"} />
                  <span>{t.tournamentName}</span>
                  {catName && (
                    <span
                      className={`text-[9px] uppercase px-1 py-0.2 rounded font-mono ${
                        isSelected ? "bg-black/20 text-black font-black" : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {catName}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

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
        <div className="border border-white/10 bg-[#0C0E0D] rounded-xl overflow-hidden">
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
            <div className="px-6 py-16 text-center text-sm text-gray-500 font-mono">
              <p className="text-white font-bold mb-1">NO MATCHES SCHEDULED YET</p>
              <p className="text-xs text-gray-400">
                Matches will appear here as soon as administrators schedule them on the courts.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-[10px] tracking-widest text-gray-500">
          SHOWING {filteredMatches.length} OF {matches.length} MATCHES
        </p>
      </div>
    </section>
  )
}
