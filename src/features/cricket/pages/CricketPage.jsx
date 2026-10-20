/**
 * CricketPage - Dedicated Cricket Experience
 * Unified collegiate cricket hub with scorecard, fixtures, standings, and team rosters.
 */
import CricketNavbar from "../components/CricketNavbar"
import CricketHero from "../components/CricketHero"
import CricketScoreboard from "../components/CricketScoreboard"
import CricketSchedule from "../components/CricketSchedule"
import CricketStandings from "../components/CricketStandings"
import CricketTeams from "../components/CricketTeams"
import CricketPlayerCard from "../components/CricketPlayerCard"
import Footer from "../../../components/organisms/Footer"

export default function CricketPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <CricketNavbar />
      <main className="w-full">
        <CricketHero />
        <CricketScoreboard />
        <CricketSchedule />
        <CricketStandings />
        <CricketTeams />
        <CricketPlayerCard />
      </main>
      <Footer />
    </div>
  )
}
