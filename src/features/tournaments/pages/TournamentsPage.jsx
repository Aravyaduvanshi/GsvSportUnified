/**
 * TournamentsPage
 * Route: /tournaments
 * Lists tournament brackets across sports.
 */
import { Trophy } from "lucide-react"
import BadmintonBracketColumn from "../../badminton/components/BadmintonBracketColumn"
import badmintonBracket from "../../badminton/data/bracket"
import Button from "../../../components/atoms/Button"
import Badge from "../../../components/atoms/Badge"

export default function TournamentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
          KNOCKOUT CENTRAL
        </p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
          CAMPUS <span className="text-[#DFFF00]">TOURNAMENTS</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
          Championship brackets, elimination ladders, and stage progression. Currently featuring the GSV Badminton Championship tournament bracket.
        </p>
      </div>

      {/* Featured Tournament Bracket Card */}
      <div className="border border-white/10 bg-[#111313] p-8 md:p-12 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <Trophy size={20} className="text-[#DFFF00]" />
            <div>
              <h2 className="text-xl font-black uppercase text-white">
                GSV BADMINTON CHAMPIONSHIP 2026
              </h2>
              <p className="text-[10px] tracking-widest text-gray-400">
                MEN'S SINGLES · KNOCKOUT STAGE
              </p>
            </div>
          </div>

          <Badge variant="live">LIVE ROUND: SEMIFINALS</Badge>
        </div>

        {/* Bracket Viewer */}
        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-[760px] gap-6">
            {badmintonBracket.map((round) => (
              <BadmintonBracketColumn key={round.title} round={round} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <span className="text-[10px] tracking-widest text-gray-500">
            SCROLL HORIZONTALLY TO VIEW ALL BRACKET ROUNDS →
          </span>
          <Button to="/sports/badminton#brackets" variant="primary" size="sm">
            Open in Badminton Arena →
          </Button>
        </div>
      </div>

      {/* Other Upcoming Tournaments */}
      <div className="border-t border-white/10 pt-12">
        <h3 className="text-xl font-black uppercase text-white mb-6">
          UPCOMING TOURNAMENTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-white/10 bg-[#0C0E0D] p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-400">CRICKET</span>
              <Badge variant="default">SPRING 2026</Badge>
            </div>
            <h4 className="mt-3 text-lg font-bold text-white">Inter-Department T20 Cup</h4>
            <p className="mt-2 text-xs text-gray-400">Group stages + Knockout semifinals & finals</p>
          </div>

          <div className="border border-white/10 bg-[#0C0E0D] p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-orange-400">VOLLEYBALL</span>
              <Badge variant="default">SPRING 2026</Badge>
            </div>
            <h4 className="mt-3 text-lg font-bold text-white">Campus Spikers Super League</h4>
            <p className="mt-2 text-xs text-gray-400">Double elimination tournament ladder</p>
          </div>
        </div>
      </div>
    </div>
  )
}
