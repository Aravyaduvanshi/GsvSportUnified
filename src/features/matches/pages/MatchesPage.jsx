/**
 * MatchesPage
 * Route: /matches
 * Displays campus match fixtures, schedules, and filters across Badminton, Cricket, and Basketball.
 * Backend-connected and synchronized in real-time across multiple browsers via WebSockets & authoritative polling.
 */
import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import MatchCard from "../../../components/molecules/MatchCard"
import {
  fetchBadmintonSchedule,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
} from "../../badminton/services/badmintonApiService"
import { cricketMatches } from "../../cricket/data/cricketMatches"
import { basketballGames } from "../../basketball/data/basketballGames"

const statusFilters = ["ALL STATUS", "LIVE", "UPCOMING", "COMPLETED"]
const sportFilters = ["ALL SPORTS", "BADMINTON", "CRICKET", "BASKETBALL"]

export default function MatchesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL STATUS")
  const [sportFilter, setSportFilter] = useState("ALL SPORTS")
  const [backendBadmintonMatches, setBackendBadmintonMatches] = useState([])

  const loadMatches = useCallback(async () => {
    try {
      const data = await fetchBadmintonSchedule("ALL")
      if (Array.isArray(data)) {
        setBackendBadmintonMatches(data)
      }
    } catch (e) {
      console.warn("Failed to fetch matches for schedule:", e)
    }
  }, [])

  useEffect(() => {
    loadMatches()

    const unsubLive = subscribeToBadmintonLiveScores((match) => {
      if (!match?.id) return
      setBackendBadmintonMatches((prev) => {
        if (match.status === "DELETED") {
          return prev.filter((m) => m.id !== match.id && m.id !== match.matchId)
        }
        const idx = prev.findIndex((m) => m.id === match.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = match
          return next
        }
        return [match, ...prev]
      })
    })

    const unsubDel = subscribeToMatchDeletion(({ matchId }) => {
      if (matchId) {
        setBackendBadmintonMatches((prev) => prev.filter((m) => m.id !== matchId))
      } else {
        loadMatches()
      }
    })

    const unsubUpdates = subscribeToMatchUpdates((match) => {
      if (!match?.id) return
      setBackendBadmintonMatches((prev) => {
        if (match.status === "DELETED") {
          return prev.filter((m) => m.id !== match.id && m.id !== match.matchId)
        }
        const idx = prev.findIndex((m) => m.id === match.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = match
          return next
        }
        return [match, ...prev]
      })
    })

    const unsubSched = subscribeToScheduleUpdates((match) => {
      if (!match?.id) return
      setBackendBadmintonMatches((prev) => {
        if (match.status === "DELETED") {
          return prev.filter((m) => m.id !== match.id && m.id !== match.matchId)
        }
        const idx = prev.findIndex((m) => m.id === match.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = match
          return next
        }
        return [match, ...prev]
      })
    })

    const interval = setInterval(loadMatches, 4000)

    return () => {
      unsubLive()
      unsubDel()
      unsubUpdates()
      unsubSched()
      clearInterval(interval)
    }
  }, [loadMatches])

  // Combine live matches & scheduled matches across Badminton (from DB), Cricket, and Basketball
  const allMatches = useMemo(() => {
    const badmintonList = backendBadmintonMatches.map((m) => {
      const p1 = m.teamA?.name || m.player1 || "Player 1"
      const p2 = m.teamB?.name || m.player2 || "Player 2"
      const s1 = m.status === "UPCOMING" ? "—" : (m.teamA?.score ?? m.score1 ?? 0)
      const s2 = m.status === "UPCOMING" ? "—" : (m.teamB?.score ?? m.score2 ?? 0)
      return {
        id: m.id,
        sport: "Badminton",
        category: m.category || "Men's Singles",
        court: m.court || m.venue || "Badminton Court 01",
        status: m.status || "UPCOMING",
        player1: p1,
        player2: p2,
        score1: s1,
        score2: s2,
        time: m.scheduledTime || m.time || "Scheduled Match",
        link: m.status === "LIVE" ? "/sports/badminton#live" : "/sports/badminton#schedule",
      }
    })

    return [
      ...badmintonList,
      // Cricket
      ...cricketMatches.map((c) => ({
        id: `cricket-${c.id}`,
        sport: "Cricket",
        category: `${c.format} · ${c.stage}`,
        court: c.venue.split(",")[0],
        status: c.status,
        player1: c.team1.shortName,
        player2: c.team2.shortName,
        score1: c.team1.runs !== null && c.team1.runs !== undefined ? `${c.team1.runs}/${c.team1.wickets}` : "—",
        score2: c.team2.runs !== null && c.team2.runs !== undefined ? `${c.team2.runs}/${c.team2.wickets}` : "—",
        time: `${c.date} ${c.time || ""}`,
        link: "/sports/cricket#live",
      })),

      // Basketball
      ...basketballGames.map((b) => ({
        id: `basketball-${b.id}`,
        sport: "Basketball",
        category: `5v5 · ${b.period}`,
        court: b.court.split("·")[0].trim(),
        status: b.status === "FINAL" ? "COMPLETED" : b.status,
        player1: b.homeTeam.shortName,
        player2: b.awayTeam.shortName,
        score1: b.homeTeam.score !== null ? b.homeTeam.score : "—",
        score2: b.awayTeam.score !== null ? b.awayTeam.score : "—",
        time: `${b.date} ${b.time || ""}`,
        link: "/sports/basketball#live",
      })),
    ]
  }, [backendBadmintonMatches])

  const filteredMatches = allMatches.filter((match) => {
    const matchesStatus =
      activeFilter === "ALL STATUS" || match.status.toUpperCase() === activeFilter.toUpperCase()
    const matchesSport =
      sportFilter === "ALL SPORTS" || match.sport.toUpperCase() === sportFilter.toUpperCase()
    return matchesStatus && matchesSport
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
          CENTRAL FIXTURES & RESULTS
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
          CAMPUS MATCH <span className="text-[#07F080]">SCHEDULE</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Unified collegiate fixture schedule across Badminton, Cricket, and Basketball. Follow active courts, upcoming tournament encounters, and final results.
        </p>
      </div>

      {/* Sport Selector Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {sportFilters.map((sport) => (
          <button
            key={sport}
            type="button"
            onClick={() => setSportFilter(sport)}
            className={`border px-4 py-2.5 text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${
              sportFilter === sport
                ? "border-[#07F080] bg-[#07F080] text-[#080909]"
                : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Status Filters Row */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`border px-3.5 py-2 text-[8px] font-mono tracking-widest uppercase transition cursor-pointer ${
                activeFilter === filter
                  ? "border-white/40 bg-white/15 text-white font-bold"
                  : "border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-[10px] font-mono text-gray-400">
          SHOWING {filteredMatches.length} FIXTURES
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((m) => (
            <Link key={m.id} to={m.link} className="block group">
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
      ) : (
        <div className="border border-white/10 bg-[#111313] p-12 text-center">
          <p className="text-sm font-bold text-gray-400">
            No fixtures found matching the selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter("ALL STATUS")
              setSportFilter("ALL SPORTS")
            }}
            className="mt-4 border border-[#07F080] px-4 py-2 text-[10px] font-bold tracking-widest text-[#07F080]"
          >
            RESET ALL FILTERS
          </button>
        </div>
      )}
    </div>
  )
}
