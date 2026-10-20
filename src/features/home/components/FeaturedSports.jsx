/**
 * FeaturedSports Section
 * Prominently showcases the three core sports: Badminton, Cricket, and Basketball.
 */
import { Link } from "react-router-dom"
import { getHeadlineSports, getComingSoonSports } from "../../sports/data/sports.data"

export default function FeaturedSports() {
  const headlineSports = getHeadlineSports()
  const otherSports = getComingSoonSports()

  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-10 lg:px-16 bg-[#080909]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
              01 / PRIMARY CHAMPIONSHIPS
            </p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
              SELECT YOUR <span className="text-[#07F080]">ARENA.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              Explore live collegiate sports action across our three active tournament disciplines with dedicated real-time scorecards, fixtures, and standings.
            </p>
            <Link
              to="/sports"
              className="text-[10px] font-black tracking-widest text-[#07F080] hover:text-[#07F080]/70 flex items-center gap-1.5"
            >
              BROWSE ALL CAMPUS DISCIPLINES ({headlineSports.length + otherSports.length}) →
            </Link>
          </div>
        </div>

        {/* Three Prominent Headline Sport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {headlineSports.map((sport) => {
            const isBadminton = sport.id === "badminton"
            const isCricket = sport.id === "cricket"
            const isBasketball = sport.id === "basketball"

            const accent = isBadminton
              ? "#DFFF00"
              : isCricket
              ? "#07F080"
              : "#F97316"

            const badgeText = isBadminton
              ? "BADMINTON ARENA · LIVE"
              : isCricket
              ? "CRICKET ARENA · LIVE"
              : "BASKETBALL ARENA · LIVE"

            return (
              <div
                key={sport.id}
                className="group relative flex flex-col justify-between border border-white/15 bg-[#111313] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  borderTopWidth: "4px",
                  borderTopColor: accent,
                }}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 font-bold tracking-widest uppercase text-[9px] px-2.5 py-1 border"
                      style={{
                        borderColor: `${accent}40`,
                        backgroundColor: `${accent}15`,
                        color: accent,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      {badgeText}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-gray-400">
                      {sport.season}
                    </span>
                  </div>

                  {/* Sport Title */}
                  <h3 className="mt-8 text-3xl font-black uppercase text-white tracking-tight group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{sport.name}</span>
                    <span
                      className="text-2xl transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      {isBadminton ? "🏸" : isCricket ? "🏏" : isBasketball ? "🏀" : "🏅"}
                    </span>
                  </h3>

                  <p
                    className="mt-2 text-xs font-mono font-bold tracking-wider"
                    style={{ color: accent }}
                  >
                    {sport.courts}
                  </p>

                  <p className="mt-4 text-xs leading-6 text-gray-300">
                    {sport.description}
                  </p>

                  {/* Tagline */}
                  <p className="mt-4 text-[11px] italic text-gray-400 border-l-2 pl-3 border-white/10">
                    "{sport.tagline}"
                  </p>
                </div>

                {/* Footer CTA */}
                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400">
                    ACTIVE HUB
                  </span>

                  <Link
                    to={sport.path}
                    className="inline-flex items-center gap-2 text-xs font-black tracking-widest transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: accent }}
                  >
                    ENTER ARENA <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Other sports banner */}
        <div className="mt-12 border border-white/10 bg-[#0E1010] p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs font-mono">
              UPCOMING ATHLETICS DISCIPLINES:
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-300">
              {otherSports.map((s) => (
                <span
                  key={s.id}
                  className="border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-mono text-gray-400"
                >
                  {s.name} ({s.season})
                </span>
              ))}
            </div>
          </div>

          <Link
            to="/sports"
            className="text-[10px] font-bold tracking-widest text-[#07F080] hover:underline shrink-0"
          >
            VIEW COMPLETE DIRECTORY →
          </Link>
        </div>
      </div>
    </section>
  )
}
