/**
 * Central Platform Hero Section
 * Adheres to the established high-contrast dark athletic design language.
 */
import heroBg from "../../../assets/images/badminton-hero.png"
import Button from "../../../components/atoms/Button"
import { platformStats } from "../data/home.data"

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[720px] h-[92svh] items-center overflow-hidden bg-[#0A0A0A] px-6 sm:px-10 lg:px-[8vw]">
      {/* Background image & gradient overlays */}
      <img
        src={heroBg}
        alt="Collegiate sports championship"
        fetchPriority="high"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-40 mix-blend-luminosity"
      />

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />

      {/* Main hero typography & CTAs */}
      <div className="w-full max-w-4xl py-10">
        <p className="flex mb-3 mt-10 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-gray-300 sm:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
          GATI SHAKTI VISHWAVIDYALAYA ATHLETICS
        </p>

        <h1 className="mt-7 text-[clamp(3.5rem,8.5vw,7.5rem)] font-black uppercase leading-[0.90] tracking-[-0.08em] text-white">
          college
          <span className="mt-2 block text-[#06F779]">
            sports
          </span>
          <span className="mt-2 block text-[#FBFAF5]">
            unified.
          </span>
        </h1>

        <p className="mt-7 max-w-lg text-sm leading-7 text-gray-300 sm:text-base">
          
        </p>

        {/* Action Buttons */}
        <div className="mt-15 flex flex-wrap items-center gap-4">
          <Button to="/sports" variant="primary">
            EXPLORE SPORTS <span aria-hidden="true">→</span>
          </Button>

          <Button to="/sports/badminton" variant="outline">
            ENTER BADMINTON LIVE <span aria-hidden="true">●</span>
          </Button>

          <Button to="/matches" variant="secondary">
            FIXTURES SCHEDULE
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-10 flex flex-wrap gap-8 border-t border-white/20 pt-6 sm:gap-12 md:justify-between">
          {platformStats.map((stat, idx) => (
            <div key={idx}>
              <p className={`text-2xl font-black ${stat.isLive ? "text-[#07F080]" : "text-white"}`}>
                {stat.value}
              </p>
              <p className="mt-1 text-[9px] tracking-widest text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Side Badge */}
      <div className="absolute bottom-14 right-[5vw] hidden border-l border-[#07F080] pl-4 md:hidden lg:block">
        <p className="text-[10px] font-bold tracking-widest text-[#07F080]">
          SEASON 2026-27
        </p>
        <p className="mt-1 text-2xl font-black text-white">
          CHAMPIONSHIP HUB
        </p>
      </div>
    </section>
  )
}
