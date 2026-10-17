/**
 * SportDetailPage
 * Route: /sports/:sportId
 * Dynamic fallback router for individual sports.
 */
import { useParams } from "react-router-dom"
import { getSportById } from "../data/sports.data"
import BadmintonPage from "../../badminton/pages/BadmintonPage"
import Button from "../../../components/atoms/Button"
import Badge from "../../../components/atoms/Badge"

export default function SportDetailPage() {
  const { sportId } = useParams()
  const sport = getSportById(sportId)

  if (!sport) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs font-bold tracking-widest text-[#DFFF00]">UNKNOWN SPORT</p>
        <h1 className="mt-3 text-4xl font-black text-white">SPORT NOT FOUND</h1>
        <p className="mt-4 text-sm text-gray-400">The sport '{sportId}' is not registered in the college platform.</p>
        <div className="mt-8">
          <Button to="/sports">View All Sports</Button>
        </div>
      </div>
    )
  }

  // Badminton has its own dedicated feature page
  if (sport.id === "badminton") {
    return <BadmintonPage />
  }

  // Placeholder for upcoming sports
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="border border-white/10 bg-[#111313] p-10 md:p-16">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Badge variant="default">COMING SOON</Badge>
          <span className="text-xs tracking-widest text-gray-400">{sport.season}</span>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">COLLEGIATE PORTAL</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white">{sport.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-300">{sport.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-white/10 pt-8">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">VENUE / COURT</p>
            <p className="mt-1 text-sm font-bold text-white">{sport.courts}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">TAGLINE</p>
            <p className="mt-1 text-sm font-bold text-[#DFFF00]">{sport.tagline}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">LIVE ENGINE</p>
            <p className="mt-1 text-sm font-bold text-gray-400">Scheduled for Launch</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button to="/sports" variant="outline">
            ← Back to Sports
          </Button>
          <Button to="/sports/badminton" variant="primary">
            Visit Live Badminton →
          </Button>
        </div>
      </div>
    </div>
  )
}
