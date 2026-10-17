/**
 * TournamentHighlights Section
 * Displays tournament road to the finals and brackets teaser.
 */
import { Link } from "react-router-dom"
import { Trophy } from "lucide-react"
import { featuredHighlights } from "../data/home.data"

export default function TournamentHighlights() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
              03 / CHAMPIONSHIP PATH
            </p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white">
              TOURNAMENT
              <span className="block text-[#07F080]">BRACKETS.</span>
            </h2>
          </div>

          <Link
            to="/tournaments"
            className="flex items-center gap-2 border border-[#07F080]/40 bg-[#07F080]/10 px-6 py-3.5 text-[10px] font-black tracking-widest text-[#07F080] transition hover:bg-[#07F080] hover:text-black"
          >
            <Trophy size={16} />
            VIEW ALL BRACKETS →
          </Link>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredHighlights.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-[#111313] p-7 transition hover:border-[#07F080]/50"
            >
              <div className="flex items-center justify-between text-[10px] font-bold tracking-widest">
                <span className="text-[#07F080]">{item.sport}</span>
                <span className="text-gray-400">{item.status}</span>
              </div>

              <h4 className="mt-5 text-xl font-black uppercase text-white leading-tight">
                {item.title}
              </h4>

              <p className="mt-3 text-xs text-gray-400">
                {item.detail}
              </p>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  to={item.to}
                  className="text-[10px] font-bold tracking-widest text-[#07F080] hover:underline"
                >
                  FOLLOW ACTION →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
