/**
 * Throwball Page (Placeholder)
 * Route: /sports/throwball
 */
import Badge from "../../../components/atoms/Badge"
import Button from "../../../components/atoms/Button"

export default function ThrowballPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      <div className="border border-white/10 bg-[#111313] p-8 md:p-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Badge variant="upcoming">THROWBALL ARENA · COMING SOON</Badge>
          <span className="text-xs font-mono text-gray-400">THROWBALL COURT 1</span>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold tracking-[0.25em] text-emerald-400">GSV WOMEN'S THROWBALL</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white">
            THROWBALL <span className="text-emerald-400">CHAMPIONSHIP</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-gray-300">
            Speed, quick catches, and team communication. The throwball tournament portal will track set scores, serve violations, team leaderboards, and MVP recognitions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">FORMAT</p>
            <p className="mt-1 text-sm font-bold text-white">Inter-Hostel Tournament</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">LINEUP</p>
            <p className="mt-1 text-sm font-bold text-emerald-400">7 Active Players per Team</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">LAUNCH</p>
            <p className="mt-1 text-sm font-bold text-gray-400">Spring 2027</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button to="/sports" variant="outline">Browse All Sports</Button>
          <Button to="/sports/badminton" variant="primary">Visit Active Badminton Hub →</Button>
        </div>
      </div>
    </div>
  )
}
