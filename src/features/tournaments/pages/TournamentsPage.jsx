/**
 * TournamentsPage
 * Route: /tournaments
 * Lists tournament brackets across sports.
 * Authoritative backend dynamic bracket synchronized across multiple browsers.
 */
import { useState, useEffect, useCallback } from "react"
import { Trophy } from "lucide-react"
import BadmintonBracketColumn from "../../badminton/components/BadmintonBracketColumn"
import { buildBracketFromMatches } from "../../badminton/services/tournamentService"
import {
  fetchTournaments,
  fetchBadmintonSchedule,
  subscribeToTournaments,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
  subscribeToStompTopic,
} from "../../badminton/services/badmintonApiService"
import Button from "../../../components/atoms/Button"
import Badge from "../../../components/atoms/Badge"

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([])
  const [selectedTournamentId, setSelectedTournamentId] = useState(null)
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [tList, mList] = await Promise.all([
        fetchTournaments(),
        fetchBadmintonSchedule("ALL"),
      ])

      const validTournaments = Array.isArray(tList) ? tList : []
      const validMatches = Array.isArray(mList) ? mList : []

      setTournaments(validTournaments)
      setMatches(validMatches)
    } catch (e) {
      console.warn("Failed to load tournaments on TournamentsPage:", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    const unsubTourn = subscribeToTournaments(() => loadData())
    const unsubTournDel = subscribeToStompTopic("/topic/tournaments/deleted", () => loadData())
    const unsubLive = subscribeToBadmintonLiveScores(() => loadData())
    const unsubDel = subscribeToMatchDeletion(() => loadData())
    const unsubMatches = subscribeToMatchUpdates(() => loadData())
    const unsubSched = subscribeToScheduleUpdates(() => loadData())

    const interval = setInterval(loadData, 4000)

    return () => {
      unsubTourn()
      unsubTournDel()
      unsubLive()
      unsubDel()
      unsubMatches()
      unsubSched()
      clearInterval(interval)
    }
  }, [loadData])

  const activeTournament =
    tournaments.find((t) => t.id === selectedTournamentId) ||
    tournaments[0] ||
    null

  const bracket = activeTournament
    ? buildBracketFromMatches(activeTournament, matches)
    : []

  const tournamentTitle = activeTournament?.tournamentName || "GSV BADMINTON CHAMPIONSHIP 2026"
  const categoryLabel = (activeTournament?.category?.name || activeTournament?.category || "Men's Singles").toString().replace(/_/g, " ")

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
          KNOCKOUT CENTRAL
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
          CAMPUS <span className="text-[#DFFF00]">TOURNAMENTS</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Championship brackets, elimination ladders, and stage progression. Currently featuring the official badminton championship tournament bracket.
        </p>
      </div>

      {/* Multi-Tournament Switcher */}
      {tournaments.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2.5 items-center">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mr-2">
            Select Tournament:
          </span>
          {tournaments.map((tour) => {
            const isSelected = activeTournament?.id === tour.id
            const catName = (tour.category?.name || tour.category || "").toString().replace(/_/g, " ")
            return (
              <button
                key={tour.id}
                type="button"
                onClick={() => setSelectedTournamentId(tour.id)}
                className={`flex items-center gap-2 border px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "border-[#DFFF00] bg-[#DFFF00] text-black shadow-lg shadow-[#DFFF00]/20"
                    : "border-white/10 bg-[#162032] text-gray-300 hover:border-white/30 hover:text-white"
                }`}
              >
                <Trophy size={14} className={isSelected ? "text-black" : "text-[#DFFF00]"} />
                <span>{tour.tournamentName}</span>
                {catName && (
                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.5 font-mono ${
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

      {/* Featured Tournament Bracket Card */}
      <div className="border border-white/10 bg-[#111313] p-8 md:p-12 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-[#DFFF00]" />
            <div>
              <h2 className="text-xl font-black uppercase text-white">
                {tournamentTitle}
              </h2>
              <p className="text-[10px] tracking-widest text-gray-400 uppercase">
                {categoryLabel} · KNOCKOUT STAGE
              </p>
            </div>
          </div>

          <Badge variant={activeTournament ? "live" : "default"}>
            {activeTournament ? `CURRENT: ${activeTournament.currentRoundName || "IN PROGRESS"}` : "NO ACTIVE TOURNAMENT"}
          </Badge>
        </div>

        {/* Bracket Viewer */}
        {bracket.length > 0 ? (
          <>
            <div className="overflow-x-auto pb-6">
              <div className="flex min-w-[760px] gap-6">
                {bracket.map((round) => (
                  <BadmintonBracketColumn key={round.title} round={round} />
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-[10px] tracking-widest text-gray-500">
                SCROLL HORIZONTALLY TO VIEW ALL BRACKET ROUNDS →
              </span>
              <Button to="/sports/badminton#brackets" variant="primary" size="sm">
                Open in Badminton Arena →
              </Button>
            </div>
          </>
        ) : (
          <div className="border border-dashed border-white/10 bg-[#0C0E0D] px-6 py-16 text-center rounded-xl">
            <Trophy size={36} className="mx-auto text-gray-600 mb-3" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              No Tournaments Available Yet
            </h3>
            <p className="mt-2 text-xs text-gray-400 max-w-md mx-auto leading-5 font-mono">
              The tournament bracket will appear here once officially launched by administrators.
            </p>
          </div>
        )}
      </div>

      {/* Other Upcoming Tournaments */}
      <div className="border-t border-white/10 pt-12">
        <h3 className="text-xl font-black uppercase text-white mb-6">
          UPCOMING TOURNAMENTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 bg-[#0C0E0D] p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400">CRICKET</span>
              <Badge variant="default">SPRING 2026</Badge>
            </div>
            <h4 className="mt-3 text-lg font-bold text-white">Inter-Department T20 Cup</h4>
            <p className="mt-2 text-xs text-gray-400">Group stages + Knockout semifinals & finals</p>
          </div>

          <div className="border border-white/10 bg-[#0C0E0D] p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-orange-400">VOLLEYBALL</span>
              <Badge variant="default">SPRING 2026</Badge>
            </div>
            <h4 className="mt-3 text-lg font-bold text-white">Campus Spikers Super League</h4>
            <p className="mt-2 text-xs text-gray-400">Double elimination tournament ladder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
