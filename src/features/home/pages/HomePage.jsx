/**
 * Central Platform Landing Page
 * Root route ('/') entry point for all sports.
 */
import HeroSection from "../components/HeroSection"
import FeaturedSports from "../components/FeaturedSports"
import FeaturedMatches from "../components/FeaturedMatches"
import TournamentHighlights from "../components/TournamentHighlights"

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturedSports />
      <FeaturedMatches />
      <TournamentHighlights />
    </div>
  )
}
