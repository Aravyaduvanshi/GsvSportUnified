import { useState, useEffect, useCallback } from "react"
import { fetchTournaments, subscribeToTournaments, subscribeToStompTopic } from "../services/badmintonApiService"
import PlayerCard from "./BadmintonPlayerCard"
import defaultPlayers from "../data/players"

export default function PlayerGrid() {
  const [activePlayers, setActivePlayers] = useState(defaultPlayers)

  const loadPlayers = useCallback(async () => {
    try {
      const tourList = await fetchTournaments()
      if (Array.isArray(tourList) && tourList.length > 0) {
        const activeTour = tourList[0]
        const participants = activeTour.participants || []
        if (participants.length > 0) {
          const mapped = participants.map((p, idx) => ({
            id: p.id || `seed-${idx + 1}`,
            name: p.name,
            rank: `#${p.seed || idx + 1} Seed`,
            role: "Singles Contender",
            stats: { winRate: "88%", matches: 12, smashSpeed: "380 km/h" },
            image: defaultPlayers[idx % defaultPlayers.length]?.image || defaultPlayers[0].image,
          }))
          setActivePlayers(mapped)
          return
        }
      }
      setActivePlayers(defaultPlayers)
    } catch (e) {
      setActivePlayers(defaultPlayers)
    }
  }, [])

  useEffect(() => {
    loadPlayers()

    const unsubTourn = subscribeToTournaments(() => loadPlayers())
    const unsubDel = subscribeToStompTopic("/topic/tournaments/deleted", () => loadPlayers())
    const interval = setInterval(loadPlayers, 4000)

    return () => {
      unsubTourn()
      unsubDel()
      clearInterval(interval)
    }
  }, [loadPlayers])

  return (
    <section
      id="players"
      className="mx-auto max-w-7xl border-t border-white/10 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
            02 / THE ATHLETES
          </p>

          <h2 className="mt-5 text-5xl font-black uppercase sm:text-7xl">
            BUILT TO
            <span className="block text-[#DFFF00]">COMPETE.</span>
          </h2>
        </div>

        <p className="max-w-xs text-sm leading-6 text-gray-400">
          Official championship contenders and seeded varsity players.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activePlayers.map((player, index) => (
          <PlayerCard
            key={player.id || index}
            player={player}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
