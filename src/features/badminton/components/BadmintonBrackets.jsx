import { useState, useEffect, useCallback } from "react"
import { Trophy } from "lucide-react"
import { buildBracketFromMatches } from "../services/tournamentService"
import {
  fetchTournaments,
  fetchBadmintonSchedule,
  subscribeToTournaments,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
  subscribeToStompTopic,
} from "../services/badmintonApiService"
import BracketColumn from "./BadmintonBracketColumn"

export default function Brackets() {
  const [tournaments, setTournaments] = useState([])
  const [matches, setMatches] = useState([])
  const [bracket, setBracket] = useState([])
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

      if (validTournaments.length > 0) {
        const built = buildBracketFromMatches(validTournaments[0], validMatches)
        setBracket(built)
      } else {
        setBracket([])
      }
    } catch (e) {
      console.warn("Failed to load tournaments/brackets:", e)
      setBracket([])
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

  const activeTournament = tournaments[0] || null
  const tournamentTitle = activeTournament?.tournamentName || bracket[0]?.matches?.[0]?.tournamentName || "GSV BADMINTON CHAMPIONSHIP"
  const categoryLabel = (activeTournament?.category?.name || activeTournament?.category || "Men's Singles").toString().replace(/_/g, " ")

  return (
    <section
      id="brackets"
      className="border-t border-white/10 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
              03 / THE ROAD TO GLORY
            </p>

            <h2 className="mt-5 text-5xl font-black uppercase sm:text-7xl">
              WIN OR
              <span className="block text-[#DFFF00]">GO HOME.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-gray-400">
            Every round brings the contenders one step
            closer to the championship.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3 border-y border-white/10 py-4">
          <Trophy size={17} className="text-[#DFFF00]" />

          <span className="text-[10px] font-bold tracking-widest text-white uppercase">
            {categoryLabel}
          </span>

          <span className="ml-auto text-[9px] tracking-widest text-gray-500 font-mono">
            {tournamentTitle}
          </span>
        </div>

        {bracket.length > 0 ? (
          <>
            <div className="overflow-x-auto pb-6">
              <div className="flex min-w-[800px] gap-6">
                {bracket.map((round) => (
                  <BracketColumn
                    key={round.title}
                    round={round}
                  />
                ))}
              </div>
            </div>

            <p className="mt-2 text-[10px] tracking-widest text-gray-500">
              SCROLL HORIZONTALLY TO EXPLORE ALL ROUNDS →
            </p>
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
    </section>
  )
}
