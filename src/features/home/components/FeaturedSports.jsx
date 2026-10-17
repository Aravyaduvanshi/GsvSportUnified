/**
 * FeaturedSports Section
 * Renders the responsive grid of sport cards from the sports registry.
 */
import { Link } from "react-router-dom"
import SportGrid from "../../../components/organisms/SportGrid"
import { sports } from "../../sports/data/sports.data"

export default function FeaturedSports() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
              01 / SPORTS ROSTER
            </p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white">
              SELECT YOUR
              <span className="block text-[#07F080]">ARENA.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              Explore ongoing collegiate tournament action. Badminton is live with realtime scoring, brackets, and fixtures. Additional sport portals are preparing for kickoff.
            </p>
            <Link
              to="/sports"
              className="text-[10px] font-black tracking-widest text-[#07F080] hover:text-[#07F080]/70"
            >
              BROWSE ALL 7 DISCIPLINES →
            </Link>
          </div>
        </div>

        <SportGrid sports={sports} />
      </div>
    </section>
  )
}
