/**
 * TournamentDetailPage
 * Route: /tournaments/:tournamentId
 */
import { useParams, Link } from "react-router-dom"
import BadmintonBracketColumn from "../../badminton/components/BadmintonBracketColumn"
import badmintonBracket from "../../badminton/data/bracket"
import Button from "../../../components/atoms/Button"
import Badge from "../../../components/atoms/Badge"

export default function TournamentDetailPage() {
  const { tournamentId } = useParams()

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
            <Badge variant="live">ACTIVE KNOCKOUT</Badge>
            <h1 className="mt-3 text-3xl md:text-5xl font-black uppercase text-white">
              TOURNAMENT #{tournamentId}
            </h1>
          </div>
          <Button to="/sports/badminton" variant="outline">
            Badminton Center
          </Button>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-[760px] gap-6">
            {badmintonBracket.map((round) => (
              <BadmintonBracketColumn key={round.title} round={round} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
