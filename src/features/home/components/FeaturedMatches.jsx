/**
 * FeaturedMatches Section
 * Highlights active and upcoming matches across campus sports.
 */
import { Link } from "react-router-dom"
import MatchCard from "../../../components/molecules/MatchCard"
import badmintonMatches from "../../badminton/data/matches"
import badmintonSchedule from "../../badminton/data/schedule"

export default function FeaturedMatches() {
  return (
    <section className="border-t border-white/10 bg-[#0B0D0D] px-5 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#07F080]">
              02 / LIVE & UPCOMING
            </p>
            <h2 className="mt-4 text-4xl sm:text-6xl font-black uppercase text-white">
              MATCHDAY
              <span className="block text-[#07F080]">CENTRAL.</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/matches"
              className="border border-white/20 px-5 py-3 text-[10px] font-bold tracking-widest text-white transition hover:border-[#07F080] hover:text-[#07F080]"
            >
              FULL FIXTURE CALENDAR →
            </Link>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badmintonMatches.map((m) => (
            <MatchCard
              key={m.id}
              sport="Badminton"
              category={m.category}
              court={m.court}
              status={m.status}
              player1={m.player1}
              player2={m.player2}
              score1={m.score1}
              score2={m.score2}
            />
          ))}

          {badmintonSchedule.slice(0, 1).map((s) => (
            <MatchCard
              key={`sched-${s.id}`}
              sport="Badminton"
              category={s.category}
              court={s.court}
              status={s.status}
              player1={s.player1}
              player2={s.player2}
              score1="—"
              score2="—"
              time={s.time}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
