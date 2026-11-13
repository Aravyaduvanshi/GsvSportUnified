import { useState, useEffect } from "react"
import { Clock, Flame, Activity, ChevronDown, ChevronUp } from "lucide-react"
import {
  fetchLiveBadmintonMatches,
  fetchBadmintonSchedule,
  fetchBadmintonMatchEvents,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
} from "../services/badmintonApiService"
import BadmintonCourtVisual from "./BadmintonCourtVisual"
import MatchControlInfoPanel from "../../match-control/components/MatchControlInfoPanel"

const COURTS = [
  { id: 1, label: "COURT 01", fullName: "Badminton Court 01" },
  { id: 2, label: "COURT 02", fullName: "Badminton Court 02" },
  { id: 3, label: "COURT 03", fullName: "Badminton Court 03" },
  { id: 4, label: "COURT 04", fullName: "Badminton Court 04" },
]

const normalizeMatchKey = (id) => String(id ?? "").replace(/^badminton-/, "")

function deduplicateMatches(list) {
  if (!Array.isArray(list)) return []
  const map = new Map()
  for (const item of list) {
    if (!item) continue
    const key = normalizeMatchKey(item.id)
    if (!map.has(key) || String(item.id).startsWith("badminton-")) {
      map.set(key, item)
    }
  }
  return Array.from(map.values())
}

function getMatchForCourt(courtNum, list) {
  if (!Array.isArray(list) || list.length === 0) return null

  // 1. Direct match by court string
  const exact = list.find((m) => {
    const courtStr = String(m.court || m.venue || "").toLowerCase()
    return (
      courtStr.includes(`0${courtNum}`) ||
      courtStr.includes(`court ${courtNum}`) ||
      courtStr.includes(`court${courtNum}`) ||
      courtStr.endsWith(`${courtNum}`)
    )
  })
  if (exact) return exact

  // 2. Unassigned fallback by list index
  const unassigned = list.filter((m) => {
    const courtStr = String(m.court || m.venue || "").toLowerCase()
    return !courtStr.match(/court\s*0?[1-4]/)
  })
  return unassigned[courtNum - 1] || null
}

export default function LiveMatch() {
  const [matchList, setMatchList] = useState([])
  const [selectedCourt, setSelectedCourt] = useState(1)
  const [isLiveConnected, setIsLiveConnected] = useState(false)

  // Fetch live matches from Kotlin backend on mount + real-time WebSocket stream
  useEffect(() => {
    let isMounted = true

    async function loadLiveMatches() {
      try {
        const [liveData, allData] = await Promise.all([
          fetchLiveBadmintonMatches(),
          fetchBadmintonSchedule("ALL"),
        ])
        if (!isMounted) return

        const liveList = Array.isArray(liveData) ? liveData : []
        const schedList = Array.isArray(allData) ? allData : []

        // Merge: prioritize live matches, include all matches on courts
        const combined = [...liveList]
        for (const m of schedList) {
          if (!combined.some((item) => normalizeMatchKey(item.id) === normalizeMatchKey(m.id))) {
            combined.push(m)
          }
        }

        const deduped = deduplicateMatches(combined)
        setMatchList(deduped)
        setIsLiveConnected(true)
      } catch (e) {
        console.warn("Failed to load court matches:", e)
      }
    }

    loadLiveMatches()

    // Real-time WebSocket connection to /topic/badminton/live
    const unsubscribeWs = subscribeToBadmintonLiveScores((updatedMatch) => {
      if (!isMounted || !updatedMatch) return
      setIsLiveConnected(true)
      setMatchList((prev) => {
        if (updatedMatch.status === "DELETED") {
          return prev.filter((m) => normalizeMatchKey(m.id) !== normalizeMatchKey(updatedMatch.id || updatedMatch.matchId))
        }
        const updateKey = normalizeMatchKey(updatedMatch.id)
        const index = prev.findIndex((m) => normalizeMatchKey(m.id) === updateKey)
        let next
        if (index !== -1) {
          next = [...prev]
          next[index] = updatedMatch
        } else {
          next = [updatedMatch, ...prev]
        }
        return deduplicateMatches(next)
      })

      // If this match is LIVE, automatically navigate to its court panel!
      if (updatedMatch.status === "LIVE" && updatedMatch.court) {
        const courtMatch = String(updatedMatch.court).match(/0?([1-4])/)
        if (courtMatch && courtMatch[1]) {
          setSelectedCourt(parseInt(courtMatch[1], 10))
        }
      }
    })

    const unsubscribeDel = subscribeToMatchDeletion(({ matchId }) => {
      if (!isMounted || !matchId) return
      setMatchList((prev) => prev.filter((m) => normalizeMatchKey(m.id) !== normalizeMatchKey(matchId)))
    })

    const unsubscribeMatchUpdates = subscribeToMatchUpdates((updatedMatch) => {
      if (!isMounted || !updatedMatch) return
      setMatchList((prev) => {
        if (updatedMatch.status === "DELETED") {
          return prev.filter((m) => normalizeMatchKey(m.id) !== normalizeMatchKey(updatedMatch.id || updatedMatch.matchId))
        }
        const updateKey = normalizeMatchKey(updatedMatch.id)
        const index = prev.findIndex((m) => normalizeMatchKey(m.id) === updateKey)
        let next
        if (index !== -1) {
          next = [...prev]
          next[index] = updatedMatch
        } else {
          next = [updatedMatch, ...prev]
        }
        return deduplicateMatches(next)
      })
    })

    const unsubscribeSched = subscribeToScheduleUpdates((updatedMatch) => {
      if (!isMounted || !updatedMatch) return
      setMatchList((prev) => {
        if (updatedMatch.status === "DELETED") {
          return prev.filter((m) => normalizeMatchKey(m.id) !== normalizeMatchKey(updatedMatch.id || updatedMatch.matchId))
        }
        const updateKey = normalizeMatchKey(updatedMatch.id)
        const index = prev.findIndex((m) => normalizeMatchKey(m.id) === updateKey)
        let next
        if (index !== -1) {
          next = [...prev]
          next[index] = updatedMatch
        } else {
          next = [updatedMatch, ...prev]
        }
        return deduplicateMatches(next)
      })
    })

    // Polling fallback every 3 seconds
    const interval = setInterval(loadLiveMatches, 3000)

    // Listen to direct court navigation events
    const handleDirectNav = (e) => {
      if (e.detail?.courtId) {
        setSelectedCourt(e.detail.courtId)
      }
    }
    window.addEventListener("gsv_navigate_court", handleDirectNav)

    return () => {
      isMounted = false
      unsubscribeWs()
      unsubscribeDel()
      unsubscribeMatchUpdates()
      unsubscribeSched()
      clearInterval(interval)
      window.removeEventListener("gsv_navigate_court", handleDirectNav)
    }
  }, [])

  // Auto-select court with active match
  useEffect(() => {
    if (matchList.length > 0) {
      // Prioritize court with a LIVE match
      const liveCourt = COURTS.find((c) => {
        const m = getMatchForCourt(c.id, matchList)
        return m && m.status === "LIVE"
      })

      if (liveCourt) {
        const currentMatch = getMatchForCourt(selectedCourt, matchList)
        if (!currentMatch || currentMatch.status !== "LIVE") {
          setSelectedCourt(liveCourt.id)
        }
      } else {
        const anyCourt = COURTS.find((c) => getMatchForCourt(c.id, matchList))
        if (anyCourt && !getMatchForCourt(selectedCourt, matchList)) {
          setSelectedCourt(anyCourt.id)
        }
      }
    }
  }, [matchList])

  const activeCourtObj = COURTS.find((c) => c.id === selectedCourt) || COURTS[0]
  const currentMatch = getMatchForCourt(selectedCourt, matchList)

  // Spectator Match Event Logs & Timeline
  const [matchEvents, setMatchEvents] = useState([])

  useEffect(() => {
    let isMounted = true
    async function loadEvents() {
      if (!currentMatch?.id) {
        setMatchEvents([])
        return
      }
      try {
        const evts = await fetchBadmintonMatchEvents(currentMatch.id)
        if (isMounted && Array.isArray(evts)) {
          setMatchEvents(evts)
        }
      } catch (err) {
        console.warn("Could not load spectator events:", err)
      }
    }

    loadEvents()
    const evtInterval = setInterval(loadEvents, 2500)
    return () => {
      isMounted = false
      clearInterval(evtInterval)
    }
  }, [currentMatch?.id, currentMatch?.version, currentMatch?.score1, currentMatch?.score2])

  return (
    <section
      id="live"
      className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32"
    >
      {/* Top Section Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
          01 / LIVE ACTION · 4 COURT ARENA
        </p>
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest ${isLiveConnected ? "text-emerald-400" : "text-amber-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isLiveConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {isLiveConnected ? "LIVE WEBSOCKET SYNC ACTIVE" : "COURT ENGINE ONLINE"}
        </span>
      </div>

      <div className="mb-10 mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl">
            POINT BY
            <span className="block text-[#DFFF00]">POINT.</span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
            Real-time multi-court coverage. Select any of the 4 court panels below to stream live rallies, serving positions, and match decisions.
          </p>
        </div>
      </div>

      {/* 4 COURT PANELS SELECTOR (CLICKABLE) */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        {COURTS.map((court) => {
          const match = getMatchForCourt(court.id, matchList)
          const isSelected = selectedCourt === court.id
          const hasLiveMatch = match && match.status === "LIVE"
          const hasCompletedMatch = match && match.status === "COMPLETED"

          return (
            <button
              key={court.id}
              type="button"
              onClick={() => setSelectedCourt(court.id)}
              className={`relative flex flex-col p-4 text-left transition border rounded-xl cursor-pointer select-none ${
                isSelected
                  ? "border-[#DFFF00] bg-[#161A16] shadow-[0_0_24px_rgba(223,255,0,0.18)] ring-1 ring-[#DFFF00]/50"
                  : "border-white/10 bg-[#101313] hover:border-white/30 hover:bg-[#141818]"
              }`}
            >
              {/* Court Header & Status Pill */}
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-black tracking-wider uppercase ${isSelected ? "text-[#DFFF00]" : "text-white"}`}>
                  {court.label}
                </span>

                {hasLiveMatch ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                ) : hasCompletedMatch ? (
                  <span className="inline-flex items-center gap-1 rounded bg-white/10 border border-white/20 px-2 py-0.5 text-[9px] font-mono text-gray-300">
                    FINISHED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 text-[9px] font-mono text-amber-300">
                    YET TO BE PLAYED
                  </span>
                )}
              </div>

              {/* Match Summary or Waiting Info */}
              {match ? (
                <div className="mt-3">
                  <p className="truncate text-xs font-bold text-white">
                    {match.teamA?.name || match.player1}
                    <span className="mx-1 text-gray-500 font-normal">vs</span>
                    {match.teamB?.name || match.player2}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-mono">
                      {match.category || "Badminton"}
                    </span>
                    <span className="text-xs font-mono font-black text-[#DFFF00]">
                      {match.score1 ?? match.teamA?.score ?? 0} : {match.score2 ?? match.teamB?.score ?? 0}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-[11px] text-gray-400 font-mono">
                    No active match
                  </p>
                  <p className="mt-1 text-[9px] text-gray-600 font-mono">
                    Click to inspect court
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* SELECTED COURT VIEW CONTAINER */}
      <div className="border border-white/10 bg-[#111313] rounded-xl overflow-hidden shadow-2xl">
        {currentMatch ? (
          /* ACTIVE MATCH ON THIS COURT */
          <div>
            {/* Match Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 bg-black/40">
              <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#DFFF00]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFFF00]" />
                {currentMatch.status} · {activeCourtObj.label}
              </span>

              <span className="text-[10px] tracking-widest text-gray-400 font-mono">
                {currentMatch.category || "Badminton Match"} · {currentMatch.periodLabel || `SET ${currentMatch.currentSet || 1}`}
              </span>
            </div>

            {/* Scoreboard Strip */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-10 sm:gap-8 sm:px-10 md:px-16">
              <div>
                <p className="mb-2 text-[9px] tracking-widest font-mono text-[#FFAE00]">
                  {currentMatch.teamA?.shortName || "PLAYER 1"}
                </p>
                <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
                  {currentMatch.player1 || currentMatch.teamA?.name}
                </h3>
                {currentMatch.teamA?.setsWon !== undefined && (
                  <p className="mt-1 text-[10px] font-mono text-gray-400">
                    Sets Won: <span className="font-bold text-white">{currentMatch.teamA.setsWon}</span>
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-[9px] tracking-widest text-gray-500 font-mono">
                  SCORE
                </p>
                <p className="my-2 whitespace-nowrap text-3xl font-black text-[#DFFF00] sm:text-5xl tabular-nums">
                  {currentMatch.score1 ?? currentMatch.teamA?.score ?? 0}
                  <span className="px-2 text-gray-600">:</span>
                  {currentMatch.score2 ?? currentMatch.teamB?.score ?? 0}
                </p>
                {currentMatch.setHistory && currentMatch.setHistory.length > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400">
                    {currentMatch.setHistory.map((s) => (
                      <span key={s.set} className="border border-white/10 bg-white/5 px-2 py-0.5 rounded">
                        S{s.set}: {s.scoreA}–{s.scoreB}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="mb-2 text-[9px] tracking-widest font-mono text-[#35C5F4]">
                  {currentMatch.teamB?.shortName || "PLAYER 2"}
                </p>
                <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
                  {currentMatch.player2 || currentMatch.teamB?.name}
                </h3>
                {currentMatch.teamB?.setsWon !== undefined && (
                  <p className="mt-1 text-[10px] font-mono text-gray-400">
                    Sets Won: <span className="font-bold text-white">{currentMatch.teamB.setsWon}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Real-Time Badminton Court Display */}
            <div className="border-t border-white/10 p-4 sm:p-6 bg-black/30">
              <BadmintonCourtVisual match={currentMatch} courtName={activeCourtObj.fullName} />
            </div>

            {/* Spectator Match Info & Statistics Panel (Tabs: LOG | STATS | MATCH - FAULTS excluded for normal users) */}
            <div className="border-t border-white/10 p-3 sm:p-5 bg-[#090E17]">
              <MatchControlInfoPanel
                match={{
                  ...currentMatch,
                  sport: "badminton",
                  sportLabel: "Badminton",
                  teamA: currentMatch.teamA || {
                    name: currentMatch.player1 || "Player 1",
                    score: currentMatch.score1 ?? currentMatch.teamA?.score ?? 0,
                    setsWon: currentMatch.teamA?.setsWon ?? currentMatch.setsWon1 ?? 0,
                  },
                  teamB: currentMatch.teamB || {
                    name: currentMatch.player2 || "Player 2",
                    score: currentMatch.score2 ?? currentMatch.teamB?.score ?? 0,
                    setsWon: currentMatch.teamB?.setsWon ?? currentMatch.setsWon2 ?? 0,
                  },
                  periodLabel: currentMatch.periodLabel || `SET ${currentMatch.currentSet || 1}`,
                  tournament: currentMatch.tournament || currentMatch.tournamentName || "GSV Varsity Championship",
                  stage: currentMatch.stage || "Varsity Court Stage",
                  venue: currentMatch.court || activeCourtObj.fullName,
                  status: currentMatch.status,
                }}
                events={matchEvents}
                isUserFacing={true}
                initialTab="STATS"
              />
            </div>

            {/* Match Completed Banner */}
            {currentMatch.status === "COMPLETED" && (
              <div className="border-t border-[#DFFF00]/30 bg-[#DFFF00]/10 px-6 py-4 text-center">
                <span className="text-xs sm:text-sm font-black tracking-widest text-[#DFFF00] uppercase flex items-center justify-center gap-2">
                  <span>🏆</span>
                  <span>
                    MATCH COMPLETE · WINNER: {currentMatch.winner || (currentMatch.teamA?.setsWon > currentMatch.teamB?.setsWon ? currentMatch.player1 || currentMatch.teamA?.name : currentMatch.player2 || currentMatch.teamB?.name)}
                  </span>
                </span>
              </div>
            )}
          </div>
        ) : (
          /* NO MATCH PLAYING ON THIS COURT (YET TO BE PLAYED) */
          <div>
            {/* Header for Empty Court */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 bg-black/40">
              <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-amber-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                {activeCourtObj.label} · YET TO BE PLAYED
              </span>

              <span className="text-[10px] tracking-widest text-gray-500 font-mono">
                COURT AVAILABLE · WAITING FOR FIXTURE
              </span>
            </div>

            {/* Wooden Court Visual with Centered Badge */}
            <div className="p-4 sm:p-6 bg-black/30">
              <BadmintonCourtVisual match={null} courtName={activeCourtObj.fullName} />
            </div>

            {/* Informational Sub-panel */}
            <div className="border-t border-white/10 p-6 text-center bg-black/20">
              <p className="text-xs text-gray-400 font-mono">
                No match is currently active on <span className="text-white font-bold">{activeCourtObj.fullName}</span>.
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                You can select other court panels above to view games on Court 01, Court 02, Court 03, or Court 04.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
