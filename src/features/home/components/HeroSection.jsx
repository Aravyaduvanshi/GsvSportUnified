/**
 * Central Platform Hero Section
 * Cinematic broadcast hero introducing the collegiate sports platform
 * with direct entry points to Badminton, Cricket, and Basketball.
 */
import { Link } from "react-router-dom"
import heroBg from "../../../assets/images/badminton-hero.png"
import Button from "../../../components/atoms/Button"
import { platformStats } from "../data/home.data"

export default function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[760px] h-[94svh] items-center overflow-hidden bg-[#0A0A0A] px-6 sm:px-10 lg:px-[8vw]">
      {/* Background image & gradient overlays */}
      <img
        src={heroBg}
        alt="Collegiate sports championship"
        fetchPriority="high"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-30 mix-blend-luminosity"
      />

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-[#0A0A0A]/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />

      {/* Main hero typography & CTAs */}
      <div className="w-full max-w-4xl py-10">
        <p className="flex mb-3 mt-6 items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-gray-300 sm:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#07F080]" />
          GATI SHAKTI VISHWAVIDYALAYA ATHLETICS
        </p>
         
        <h1 className="mt-5 text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-[0.98] tracking-[-0.09em] text-white">
          COLLEGE
          <span className="mt-2 block text-[#07F080]">
            SPORTS
          </span>
          <span className="mt-2 block text-white">
            UNIFIED.
          </span>
        </h1>

        

        {/* Three Headline Sport Badges in Hero */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/sports/badminton"
            className="group flex items-center gap-2 border border-[#DFFF00]/40 bg-[#DFFF00]/10 px-3.5 py-2 text-[10px] font-black tracking-widest text-[#DFFF00] transition hover:bg-[#DFFF00] hover:text-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#DFFF00] group-hover:bg-black" />
            BADMINTON ARENA →
          </Link>

          <Link
            to="/sports/cricket"
            className="group flex items-center gap-2 border border-[#07F080]/40 bg-[#07F080]/10 px-3.5 py-2 text-[10px] font-black tracking-widest text-[#07F080] transition hover:bg-[#07F080] hover:text-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#07F080] group-hover:bg-black" />
            CRICKET CHAMPIONSHIP →
          </Link>

          <Link
            to="/sports/basketball"
            className="group flex items-center gap-2 border border-[#F97316]/40 bg-[#F97316]/10 px-3.5 py-2 text-[10px] font-black tracking-widest text-[#F97316] transition hover:bg-[#F97316] hover:text-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#F97316] group-hover:bg-black" />
            BASKETBALL HOOPS →
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button to="/sports" variant="primary">
            EXPLORE ALL SPORTS <span aria-hidden="true">→</span>
          </Button>

          <Button to="/matches" variant="outline">
            FIXTURES SCHEDULE
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-12 flex flex-wrap gap-8 border-t border-white/20 pt-6 sm:gap-12 md:justify-between">
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
