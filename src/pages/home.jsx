
import Hero from "../components/organisms/hero"
import Marquee from "../components/organisms/marquee"
import LiveMatch from "../features/live/components/liveMatch"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080909] text-[#F3F4EF]">
      <Hero />

      <Marquee />

      <LiveMatch />

      <section
        id="schedule"
        className="border-t border-white/10 px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
            NEXT UP
          </p>

          <h2 className="mt-5 text-4xl font-black uppercase sm:text-6xl">
            Match schedule.
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-6 text-gray-400">
            Fixtures and court assignments for upcoming
            college badminton matches will appear here.
          </p>
        </div>
      </section>

      <section
        id="players"
        className="border-t border-white/10 px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase">
            Meet the players.
          </h2>
        </div>
      </section>

      <section
        id="brackets"
        className="border-t border-white/10 px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-black uppercase">
            Tournament brackets.
          </h2>
        </div>
      </section>
    </main>
  )
}
