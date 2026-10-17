/**
 * MatchDetailPage
 * Route: /matches/:matchId
 */
import { useParams, Link } from "react-router-dom"
import badmintonMatches from "../../badminton/data/matches"
import badmintonSchedule from "../../badminton/data/schedule"
import ScoreDisplay from "../../../components/molecules/ScoreDisplay"
import Badge from "../../../components/atoms/Badge"
import Button from "../../../components/atoms/Button"

export default function MatchDetailPage() {
  const { matchId } = useParams()

  const allMatches = [
    ...badmintonMatches.map((m) => ({ ...m, sport: "Badminton" })),
    ...badmintonSchedule.map((s) => ({ ...s, sport: "Badminton" })),
  ]

  const match = allMatches.find((m) => String(m.id) === String(matchId)) || allMatches[0]

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        to="/matches"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#07F080] hover:underline mb-8"
      >
        ← BACK TO MATCH SCHEDULE
      </Link>

      <div className="border border-white/10 bg-[#111313] p-8 md:p-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-widest text-white">
              {match.sport.toUpperCase()}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-xs tracking-widest text-gray-400">
              {match.category}
            </span>
          </div>

          <Badge variant={match.status === "LIVE" ? "live" : "upcoming"}>
            {match.status}
          </Badge>
        </div>

        <div className="my-10">
          <ScoreDisplay
            player1={match.player1}
            player2={match.player2}
            score1={match.score1 ?? "—"}
            score2={match.score2 ?? "—"}
            sets={match.court}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8 text-xs">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">COURT / VENUE</p>
            <p className="mt-1 font-bold text-white">{match.court}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">SCHEDULE TIME</p>
            <p className="mt-1 font-bold text-[#07F080]">{match.time || "IN PROGRESS"}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">TOURNAMENT</p>
            <p className="mt-1 font-bold text-gray-300">GSV Inter-Collegiate Cup</p>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
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
