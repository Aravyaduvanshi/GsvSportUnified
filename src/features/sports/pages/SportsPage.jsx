/**
 * Sports Directory Page
 * Route: /sports
 * Lists all registered college sports.
 */
import { useState } from "react"
import SportGrid from "../../../components/organisms/SportGrid"
import { sports, getAvailableSports, getComingSoonSports } from "../data/sports.data"

export default function SportsPage() {
  const [filter, setFilter] = useState("all") // 'all' | 'available' | 'coming-soon'

  const availableCount = getAvailableSports().length
  const comingSoonCount = getComingSoonSports().length

  const filteredSports = sports.filter((s) => {
    if (filter === "available") return s.status === "available"
    if (filter === "coming-soon") return s.status === "coming-soon"
    return true
  })

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
          INTERCOLLEGIATE ATHLETICS
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
          ALL SPORTS <span className="text-[#07F080]">DIRECTORY</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Official catalog of sports hosted by Gati Shakti Vishwavidyalaya. Select any sport to view its dedicated tournament center, match fixtures, rules, player profiles, and live score feeds.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-6">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`border px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition cursor-pointer ${
            filter === "all"
              ? "border-[#07F080] bg-[#07F080] text-[#080909]"
              : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          ALL SPORTS ({sports.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("available")}
          className={`border px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition cursor-pointer ${
            filter === "available"
              ? "border-[#07F080] bg-[#07F080] text-[#080909]"
              : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          ACTIVE HUBS ({availableCount})
        </button>

        <button
          type="button"
          onClick={() => setFilter("coming-soon")}
          className={`border px-5 py-3 text-[10px] font-bold tracking-widest uppercase transition cursor-pointer ${
            filter === "coming-soon"
              ? "border-[#07F080] bg-[#07F080] text-[#080909]"
              : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
          }`}
        >
          COMING SOON ({comingSoonCount})
        </button>
      </div>

      {/* Sport Grid */}
      <SportGrid sports={filteredSports} />
    </div>
  )
}
