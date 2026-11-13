/**
 * TournamentDetailPage
 * Route: /tournaments/:tournamentId
 */
import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import BadmintonBracketColumn from "../../badminton/components/BadmintonBracketColumn"
import { buildBracketFromMatches } from "../../badminton/services/tournamentService"
import {
  fetchTournamentById,
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

export default function TournamentDetailPage() {
  const { tournamentId } = useParams()
  const [tournament, setTournament] = useState(null)
  const [bracket, setBracket] = useState([])

  const loadData = useCallback(async () => {
    try {
      const [tData, mList] = await Promise.all([
        fetchTournamentById(tournamentId),
        fetchBadmintonSchedule("ALL"),
      ])

      const validMatches = Array.isArray(mList) ? mList : []
      if (tData) {
        setTournament(tData)
        const built = buildBracketFromMatches(tData, validMatches)
        setBracket(built)
      } else {
        setTournament(null)
        setBracket([])
      }
    } catch (e) {
      console.warn("Failed to load tournament detail:", e)
      setTournament(null)
      setBracket([])
    }
  }, [tournamentId])

  useEffect(() => {
    loadData()

    const unsubTourn = subscribeToTournaments(() => loadData())
    const unsubDel = subscribeToStompTopic("/topic/tournaments/deleted", () => loadData())
    const unsubLive = subscribeToBadmintonLiveScores(() => loadData())
    const unsubMatchDel = subscribeToMatchDeletion(() => loadData())
    const unsubUpdates = subscribeToMatchUpdates(() => loadData())
    const unsubSched = subscribeToScheduleUpdates(() => loadData())

    const interval = setInterval(loadData, 4000)

    return () => {
      unsubTourn()
      unsubDel()
      unsubLive()
      unsubMatchDel()
      unsubUpdates()
      unsubSched()
      clearInterval(interval)
    }
  }, [loadData])

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10">
      <Link
        to="/tournaments"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#DFFF00] hover:underline mb-8"
      >
        ← BACK TO TOURNAMENTS
      </Link>

      <div className="border border-white/10 bg-[#111313] p-8 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <Badge variant={tournament ? "live" : "default"}>
              {tournament ? (tournament.status || "ACTIVE KNOCKOUT") : "NOT FOUND"}
            </Badge>
            <h1 className="mt-3 text-3xl md:text-5xl font-black uppercase text-white">
              {tournament?.tournamentName || `TOURNAMENT #${tournamentId}`}
            </h1>
          </div>
          <Button to="/sports/badminton#brackets" variant="outline">
            Badminton Center
          </Button>
        </div>

        {bracket.length > 0 ? (
          <div className="overflow-x-auto pb-6">
            <div className="flex min-w-[760px] gap-6">
              {bracket.map((round) => (
                <BadmintonBracketColumn key={round.title} round={round} />
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-white/10 p-12 text-center text-gray-500 font-mono text-xs">
            No active bracket found for tournament ID {tournamentId}.
          </div>
        )}
      </div>
    </div>
  )
}
