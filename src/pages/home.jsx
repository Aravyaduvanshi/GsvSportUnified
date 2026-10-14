
import Hero from "../components/organisms/hero"
import Marquee from "../components/organisms/marquee"
import LiveMatch from "../features/live/components/liveMatch"
import PlayerGrid from "../features/players/components/playerGrid"
import Brackets from "../features/tournaments/components/brackets"
import Schedule from "../features/schedule/components/schedule"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080909] text-[#F3F4EF]">
      <Hero />
      <Marquee />
      <LiveMatch />
      <Schedule />
      <PlayerGrid />
      <Brackets />

    </main>
  )
}