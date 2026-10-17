/**
 * Volleyball Page (Placeholder)
 * Route: /sports/volleyball
 */
import Badge from "../../../components/atoms/Badge"
import Button from "../../../components/atoms/Button"

export default function VolleyballPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
      <div className="border border-white/10 bg-[#111313] p-8 md:p-14">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Badge variant="upcoming">VOLLEYBALL ARENA · COMING SOON</Badge>
          <span className="text-xs font-mono text-gray-400">COURTS A & B</span>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-bold tracking-[0.25em] text-orange-400">GSV SPIKERS LEAGUE</p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black uppercase text-white">
            VOLLEYBALL <span className="text-orange-400">SUPER CUP</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-gray-300">
            Get ready for explosive rallies, blocks, and spikes. The volleyball portal will feature live set-by-set point trackers, rotation sheets, team standings, and match highlights.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">FORMAT</p>
            <p className="mt-1 text-sm font-bold text-white">Best of 3 Sets</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">SEASON</p>
            <p className="mt-1 text-sm font-bold text-orange-400">Winter 2026</p>
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-gray-500">COURTS</p>
            <p className="mt-1 text-sm font-bold text-gray-400">Floodlit Outdoor Courts</p>
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
