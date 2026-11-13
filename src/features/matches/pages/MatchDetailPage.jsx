/**
 * MatchDetailPage
 * Route: /matches/:matchId
 * Public spectator detail view with real-time score updates,
 * court visual, and public match statistics (LOG, STATS, MATCH; FAULTS is admin-only).
 */
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import ScoreDisplay from "../../../components/molecules/ScoreDisplay"
import Badge from "../../../components/atoms/Badge"
import Button from "../../../components/atoms/Button"
import BadmintonCourtVisual from "../../badminton/components/BadmintonCourtVisual"
import MatchControlInfoPanel from "../../match-control/components/MatchControlInfoPanel"
import {
  fetchBadmintonMatchById,
  fetchBadmintonMatchEvents,
  subscribeToBadmintonLiveScores,
} from "../../badminton/services/badmintonApiService"
import badmintonMatches from "../../badminton/data/matches"
import badmintonSchedule from "../../badminton/data/schedule"

export default function MatchDetailPage() {
  const { matchId } = useParams()
  const [match, setMatch] = useState(() => {
    const allFallback = [
      ...badmintonMatches.map((m) => ({ ...m, sport: "badminton" })),
      ...badmintonSchedule.map((s) => ({ ...s, sport: "badminton" })),
    ]
    return allFallback.find((m) => String(m.id) === String(matchId)) || {
      id: matchId,
      sport: "badminton",
      sportLabel: "Badminton",
      player1: "Player 1",
      player2: "Player 2",
      score1: 0,
      score2: 0,
      court: "Badminton Court 01",
      status: "UPCOMING",
    }
  })
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const backendMatch = await fetchBadmintonMatchById(matchId)
        if (isMounted && backendMatch) {
          setMatch(backendMatch)
        }
        const backendEvents = await fetchBadmintonMatchEvents(matchId)
        if (isMounted && Array.isArray(backendEvents)) {
          setEvents(backendEvents)
        }
      } catch (err) {
        console.warn("MatchDetail load warning:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadData()

    // Real-time WebSocket STOMP listener for this match
    const unsubscribe = subscribeToBadmintonLiveScores((updatedMatch) => {
      if (!isMounted || !updatedMatch) return
      if (String(updatedMatch.id) === String(matchId)) {
        setMatch(updatedMatch)
        fetchBadmintonMatchEvents(matchId).then((evts) => {
          if (isMounted && Array.isArray(evts)) {
            setEvents(evts)
          }
        })
      }
    }, matchId)

    // Polling fallback every 3s
    const pollInterval = setInterval(loadData, 3000)

    return () => {
      isMounted = false
      if (unsubscribe) unsubscribe()
      clearInterval(pollInterval)
    }
  }, [matchId])

  const p1Name = match.player1 || match.teamA?.name || "Player 1"
  const p2Name = match.player2 || match.teamB?.name || "Player 2"
  const s1 = match.score1 ?? match.teamA?.score ?? 0
  const s2 = match.score2 ?? match.teamB?.score ?? 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        to="/matches"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#07F080] hover:underline mb-8"
      >
        ← BACK TO MATCH SCHEDULE
      </Link>

      <div className="border border-white/10 bg-[#111313] p-6 sm:p-10 rounded-xl shadow-2xl">
        {/* Match Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-widest text-white uppercase">
              {match.sportLabel || match.sport || "BADMINTON"}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-xs tracking-widest text-gray-400">
              {match.category || "Singles"}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-xs font-mono text-[#DFFF00]">
              {match.court || "Court 01"}
            </span>
          </div>

          <Badge variant={match.status === "LIVE" ? "live" : "upcoming"}>
            {match.status}
          </Badge>
        </div>

        {/* Scoreboard Display */}
        <div className="my-8">
          <ScoreDisplay
            player1={p1Name}
            player2={p2Name}
            score1={s1}
            score2={s2}
            sets={match.court}
          />
        </div>

        {/* Real-Time Badminton Court Visual (Singles/Doubles positions) */}
        <div className="my-8 border border-white/10 rounded-lg overflow-hidden bg-black/40 p-4 sm:p-6">
          <BadmintonCourtVisual match={match} courtName={match.court || "Badminton Court 01"} />
        </div>

        {/* Match Statistics & Event Log (User-facing: LOG, STATS, MATCH; FAULTS excluded) */}
        <div className="my-8">
          <MatchControlInfoPanel
            match={{
              ...match,
              sport: "badminton",
              sportLabel: "Badminton",
              teamA: match.teamA || {
                name: p1Name,
                score: s1,
                setsWon: match.setsWon1 ?? match.teamA?.setsWon ?? 0,
              },
              teamB: match.teamB || {
                name: p2Name,
                score: s2,
                setsWon: match.setsWon2 ?? match.teamB?.setsWon ?? 0,
              },
              periodLabel: match.periodLabel || `SET ${match.currentSet || 1}`,
              tournament: match.tournament || match.tournamentName || "GSV Championship 2026",
              stage: match.stage || "Tournament Stage",
              venue: match.court || match.venue || "Badminton Court",
              status: match.status,
            }}
            events={events}
            isUserFacing={true}
            initialTab="STATS"
          />
        </div>

        {/* Match Meta Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8 text-xs">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase">COURT / VENUE</p>
            <p className="mt-1 font-bold text-white font-mono">{match.court || match.venue || "Court 01"}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase">SCHEDULE TIME</p>
            <p className="mt-1 font-bold text-[#07F080] font-mono">{match.scheduledTime || match.time || "IN PROGRESS"}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500 uppercase">TOURNAMENT</p>
            <p className="mt-1 font-bold text-gray-300">{match.tournament || match.tournamentName || "GSV Inter-Collegiate Cup"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/sports/badminton" variant="primary">
            Watch in Badminton Arena →
          </Button>
          <Button to="/matches" variant="outline">
            All Fixtures
          </Button>
        </div>
      </div>
    </div>
  )
}
