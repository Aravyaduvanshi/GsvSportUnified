/*
 * BasketballPage - Dedicated Basketball Experience
 * Unified collegiate basketball hub with scoreboard, game schedules, conference standings, team rosters, and playoff bracket.
 */
import BasketballNavbar from "../components/BasketballNavbar"
import BasketballHero from "../components/BasketballHero"
import BasketballScoreboard from "../components/BasketballScoreboard"
import BasketballSchedule from "../components/BasketballSchedule"
import BasketballStandings from "../components/BasketballStandings"
import BasketballTeams from "../components/BasketballTeams"
import BasketballPlayerCard from "../components/BasketballPlayerCard"
import BasketballBracket from "../components/BasketballBracket"
import Footer from "../../../components/organisms/Footer"

export default function BasketballPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      <BasketballNavbar />
      <main className="w-full">
        <BasketballHero />
        <BasketballScoreboard />
        <BasketballSchedule />
        <BasketballStandings />
        <BasketballTeams />
        <BasketballPlayerCard />
        <BasketballBracket />
      </main>
      <Footer />
    </div>
  )
}
