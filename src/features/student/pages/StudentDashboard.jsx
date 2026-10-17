/**
 * Student Dashboard Page (Frontend Boundary)
 * Route: /student
 */
import { Link } from "react-router-dom"
import Button from "../../../components/atoms/Button"
import Badge from "../../../components/atoms/Badge"
import badmintonMatches from "../../badminton/data/matches"
import badmintonSchedule from "../../badminton/data/schedule"

export default function StudentDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-10 lg:px-16">
      {/* Welcome Banner */}
      <div className="border border-white/10 bg-[#111313] p-8 md:p-12 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <Badge variant="live">STUDENT HUB ACTIVE</Badge>
          <span className="text-xs text-gray-400 font-mono">CAMPUS ID VERIFIED · DEMO MODE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          WELCOME TO <span className="text-[#DFFF00]">STUDENT SPORTS</span>
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm text-gray-400 leading-relaxed">
          Follow your department athletes, track campus match schedules, review knockout tournament progression, and explore sports open for participation.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button to="/matches" variant="primary" size="sm">
            View Match Schedule
          </Button>
          <Button to="/sports/badminton" variant="outline" size="sm">
            Watch Live Badminton
          </Button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-white/10 bg-[#0C0E0D] p-6">
          <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">MY SPORTS FEED</p>
          <h3 className="mt-3 text-lg font-bold text-white">Live Badminton</h3>
          <p className="mt-2 text-xs text-gray-400">
            {badmintonMatches[0]?.player1} vs {badmintonMatches[0]?.player2} · {badmintonMatches[0]?.court}
          </p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/sports/badminton" className="text-[10px] font-bold text-[#DFFF00] hover:underline">
              Enter Court Feed →
            </Link>
          </div>
        </div>

        <div className="border border-white/10 bg-[#0C0E0D] p-6">
          <p className="text-[10px] font-bold tracking-widest text-blue-400">NEXT FIXTURE</p>
          <h3 className="mt-3 text-lg font-bold text-white">{badmintonSchedule[1]?.category}</h3>
          <p className="mt-2 text-xs text-gray-400">
            {badmintonSchedule[1]?.player1} vs {badmintonSchedule[1]?.player2} · {badmintonSchedule[1]?.time}
          </p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/matches" className="text-[10px] font-bold text-blue-400 hover:underline">
              Full Schedule →
            </Link>
          </div>
        </div>

        <div className="border border-white/10 bg-[#0C0E0D] p-6">
          <p className="text-[10px] font-bold tracking-widest text-purple-400">ATHLETICS DIRECTORY</p>
          <h3 className="mt-3 text-lg font-bold text-white">7 Campus Sports</h3>
          <p className="mt-2 text-xs text-gray-400">
            Cricket, Volleyball, Kabaddi, Table Tennis, Throwball & Basketball
          </p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/sports" className="text-[10px] font-bold text-purple-400 hover:underline">
              Browse Directory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
