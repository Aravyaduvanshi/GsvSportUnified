import { useState, useEffect } from "react"
import initialMatches from "../data/matches"
import { fetchLiveBadmintonMatches, subscribeToBadmintonLiveScores } from "../services/badmintonApiService"
import BadmintonCourtVisual from "./BadmintonCourtVisual"

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

export default function LiveMatch() {
  const [matchList, setMatchList] = useState(() => deduplicateMatches(initialMatches))
  const [selectedId, setSelectedId] = useState(initialMatches[0]?.id)
  const [isLiveConnected, setIsLiveConnected] = useState(false)

  // Fetch live matches from Kotlin backend on mount + real-time WebSocket stream
  useEffect(() => {
    let isMounted = true

    async function loadLiveMatches() {
      const data = await fetchLiveBadmintonMatches()
      if (isMounted && Array.isArray(data) && data.length > 0) {
        const deduped = deduplicateMatches(data)
        setMatchList(deduped)
        setIsLiveConnected(true)
        // Keep selected match ID valid
        setSelectedId((current) => {
          const currentKey = normalizeMatchKey(current)
          const matched = deduped.find((m) => normalizeMatchKey(m.id) === currentKey)
          return matched ? matched.id : deduped[0].id
        })
      }
    }

    loadLiveMatches()

    // 1. Real-time WebSocket connection to /topic/badminton/live
    const unsubscribeWs = subscribeToBadmintonLiveScores((updatedMatch) => {
      if (!isMounted || !updatedMatch) return
      setIsLiveConnected(true)
      setMatchList((prev) => {
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

    // 2. Fallback polling every 3 seconds
    const interval = setInterval(loadLiveMatches, 3000)

    return () => {
      isMounted = false
      unsubscribeWs()
      clearInterval(interval)
    }
  }, [])

  const selectedMatch = matchList.find(
    (match) => normalizeMatchKey(match.id) === normalizeMatchKey(selectedId)
  ) || matchList[0]

  if (!selectedMatch) {
    return null
  }

  return (
    <section
      id="live"
      className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-32"
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
          01 / LIVE ACTION
        </p>
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono tracking-widest ${isLiveConnected ? "text-emerald-400" : "text-amber-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isLiveConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {isLiveConnected ? "LIVE WEBSOCKET SYNC ACTIVE" : "LOCAL DEMO MODE"}
        </span>
      </div>

      <div className="mb-12 mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-7xl">
          POINT BY
          <span className="block text-[#DFFF00]">POINT.</span>
        </h2>

        <p className="max-w-xs text-sm leading-6 text-gray-400">
          Follow real-time rallies, scores and game decisions from
          your college badminton championship courts.
        </p>
      </div>

      {/* Selected match */}
      <div className="border border-white/10 bg-[#111313]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5">
          <span className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#DFFF00]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFFF00]" />
            {selectedMatch.status}
          </span>

          <span className="text-[10px] tracking-widest text-gray-400">
            {selectedMatch.category} · {selectedMatch.court} {selectedMatch.periodLabel ? `· ${selectedMatch.periodLabel}` : ""}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-12 sm:gap-8 sm:px-10 md:px-16">
          <div>
            <p className="mb-3 text-[9px] tracking-widest text-[#FFAE00]">
              {selectedMatch.teamA?.shortName || "PLAYER 1"}
            </p>
            <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
              {selectedMatch.player1 || selectedMatch.teamA?.name}
            </h3>
            {selectedMatch.teamA?.setsWon !== undefined && (
              <p className="mt-1 text-[10px] font-mono text-gray-400">
                Sets Won: <span className="font-bold text-white">{selectedMatch.teamA.setsWon}</span>
              </p>
            )}
          </div>

          <div className="text-center">
            <p className="text-[9px] tracking-widest text-gray-500">
              SCORE
            </p>
            <p className="my-3 whitespace-nowrap text-3xl font-black text-[#DFFF00] sm:text-5xl tabular-nums">
              {selectedMatch.score1 ?? selectedMatch.teamA?.score ?? 0}
              <span className="px-2 text-gray-600">:</span>
              {selectedMatch.score2 ?? selectedMatch.teamB?.score ?? 0}
            </p>
            {selectedMatch.setHistory && selectedMatch.setHistory.length > 0 && (
              <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-mono text-gray-400">
                {selectedMatch.setHistory.map((s) => (
                  <span key={s.set} className="border border-white/10 bg-white/5 px-2 py-0.5 rounded">
                    S{s.set}: {s.scoreA}–{s.scoreB}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="mb-3 text-[9px] tracking-widest text-[#35C5F4]">
              {selectedMatch.teamB?.shortName || "PLAYER 2"}
            </p>
            <h3 className="break-words text-xl font-black uppercase sm:text-3xl">
              {selectedMatch.player2 || selectedMatch.teamB?.name}
            </h3>
            {selectedMatch.teamB?.setsWon !== undefined && (
              <p className="mt-1 text-[10px] font-mono text-gray-400">
                Sets Won: <span className="font-bold text-white">{selectedMatch.teamB.setsWon}</span>
              </p>
            )}
          </div>
        </div>

        {/* Real-Time Badminton Court Display (Live Server, Service Box & Trajectory) */}
        <div className="border-t border-white/10 p-4 sm:p-6 bg-black/30">
          <BadmintonCourtVisual match={selectedMatch} />
        </div>

        {/* Match Completed Banner */}
        {selectedMatch.status === "COMPLETED" && (
          <div className="border-t border-[#DFFF00]/30 bg-[#DFFF00]/10 px-6 py-4 text-center">
            <span className="text-xs sm:text-sm font-black tracking-widest text-[#DFFF00] uppercase flex items-center justify-center gap-2">
              <span>🏆</span>
              <span>MATCH COMPLETE · WINNER: {selectedMatch.winner || (selectedMatch.teamA?.setsWon > selectedMatch.teamB?.setsWon ? selectedMatch.player1 || selectedMatch.teamA?.name : selectedMatch.player2 || selectedMatch.teamB?.name)}</span>
            </span>
          </div>
        )}
      </div>

      {/* Match selector (3 live matches across courts) */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matchList.map((match) => {
          const isSelected = selectedId === match.id
          const p1 = match.player1 || match.teamA?.name
          const p2 = match.player2 || match.teamB?.name
          const sc1 = match.score1 ?? match.teamA?.score ?? "—"
          const sc2 = match.score2 ?? match.teamB?.score ?? "—"

          return (
            <button
              key={match.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelectedId(match.id)}
              className={`border p-5 text-left transition hover:border-[#DFFF00]/60 ${
                isSelected
                  ? "border-[#DFFF00] bg-[#DFFF00]/5"
                  : "border-white/10 bg-[#111313]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold tracking-widest text-gray-400">
                  {match.category}
                </span>

                <span className="text-[9px] font-bold text-[#DFFF00]">
                  {match.status}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="space-y-3">
                  <p className="text-sm font-semibold">
                    {p1}
                  </p>
                  <p className="text-sm font-semibold">
                    {p2}
                  </p>
                </div>

                <div className="space-y-3 text-right font-black text-[#DFFF00]">
                  <p>{sc1}</p>
                  <p>{sc2}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-[9px] tracking-widest text-gray-500">
                <span>{match.court}</span>
                {match.periodLabel && <span className="text-gray-400 font-mono">{match.periodLabel}</span>}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
