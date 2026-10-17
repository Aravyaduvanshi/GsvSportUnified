
import BadmintonNavbar from "../components/BadmintonNavbar"
import Hero from "../components/BadmintonHero"
import Marquee from "../components/BadmintonMarquee"
import LiveMatch from "../components/BadmintonLiveMatch"
import PlayerGrid from "../components/BadmintonPlayerGrid"
import Brackets from "../components/BadmintonBrackets"
import Schedule from "../components/BadmintonSchedule"

export function Home() {
  return (
    <>
      <BadmintonNavbar />
      <main className="min-h-screen overflow-hidden bg-[#080909] text-[#F3F4EF]">
        <Hero />
        <Marquee />
        <LiveMatch />
        <Schedule />
        <PlayerGrid />
        <Brackets />
      </main>
    </>
  )
}

export default Home