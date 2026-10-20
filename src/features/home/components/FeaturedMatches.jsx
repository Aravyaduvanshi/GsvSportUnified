/**
 * FeaturedMatches Section
 * Highlights active live action, upcoming fixtures, and results across Badminton, Cricket, and Basketball.
 */
import { useState } from "react"
import { Link } from "react-router-dom"
import MatchCard from "../../../components/molecules/MatchCard"
import badmintonMatches from "../../badminton/data/matches"
import { cricketMatches } from "../../cricket/data/cricketMatches"
import { basketballGames } from "../../basketball/data/basketballGames"

const sportFilters = ["ALL SPORTS", "BADMINTON", "CRICKET", "BASKETBALL"]

export default function FeaturedMatches() {
  const [selectedSport, setSelectedSport] = useState("ALL SPORTS")

  // Normalized unified matches list
  const unifiedMatches = [
    // Badminton matches
    ...badmintonMatches.map((m) => ({
      id: `badminton-${m.id}`,
      sport: "Badminton",
      category: m.category,
      court: m.court,
      status: m.status,
      player1: m.player1,
      player2: m.player2,
      score1: m.score1,
      score2: m.score2,
      link: "/sports/badminton#live",
      accent: "#DFFF00",
    })),

    // Cricket matches
    ...cricketMatches.slice(0, 3).map((m) => ({
      id: m.id,
      sport: "Cricket",
      category: `${m.format} · ${m.stage}`,
      court: m.venue.split(",")[0],
      status: m.status,
      player1: m.team1.shortName,
      player2: m.team2.shortName,
      score1: m.team1.runs !== null ? `${m.team1.runs}/${m.team1.wickets}` : "—",
      score2: m.team2.runs !== null ? `${m.team2.runs}/${m.team2.wickets}` : "—",
      time: m.time,
      link: "/sports/cricket#live",
      accent: "#07F080",
    })),

    // Basketball games
    ...basketballGames.slice(0, 3).map((g) => ({
      id: g.id,
      sport: "Basketball",
      category: `5v5 · ${g.period}`,
      court: g.court.split("·")[0].trim(),
      status: g.status,
      player1: g.homeTeam.shortName,
      player2: g.awayTeam.shortName,
      score1: g.homeTeam.score !== null ? g.homeTeam.score : "—",
      score2: g.awayTeam.score !== null ? g.awayTeam.score : "—",
      time: g.time,
      link: "/sports/basketball#live",
      accent: "#F97316",
    })),
  ]

  const filteredMatches = unifiedMatches.filter((m) => {
    if (selectedSport === "ALL SPORTS") return true
    return m.sport.toUpperCase() === selectedSport
  })

  return (
    <section className="border-t border-white/10 bg-[#0B0D0D] px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
              02 / MULTI-SPORT ACTION
            </p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
              MATCHDAY <span className="text-[#07F080]">CENTRAL.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/matches"
              className="border border-white/20 px-5 py-3 text-[10px] font-bold tracking-widest text-white transition hover:border-[#07F080] hover:text-[#07F080]"
            >
              FULL FIXTURE CALENDAR →
            </Link>
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {sportFilters.map((sport) => (
            <button
              key={sport}
              type="button"
              onClick={() => setSelectedSport(sport)}
              className={`border px-4 py-2 text-[9px] font-bold tracking-widest uppercase transition cursor-pointer ${
                selectedSport === sport
                  ? "border-[#07F080] bg-[#07F080] text-[#080909]"
                  : "border-white/10 text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Unified Matches Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  )
}
