
import heroImage from "../../../assets/images/badminton-hero.png"

export default function Hero() {
  return (
    <section
      id="home"
      className=" relative isolate flex min-h-[720px] h-[100svh]  items-center overflow-hidden bg-[#080909] px-6 pt-24 sm:px-10 lg:min-h-svh lg:px-[10vw]"
    >
      {/* Background image */}
      
      <img
        src={heroImage}
        alt="Badminton player on court"
        fetchPriority="high"
        className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
      />

      {/* Image overlays */}

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#080909] via-[#080909]/75 to-[#080909]/10" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080909] via-transparent to-[#080909]/30" />

      {/* Main content */}

      <div className="w-full max-w-4xl py-16">
        <p className="flex items-center gap-3 text-[10px] font-bold tracking-[0.25em] text-gray-300 sm:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#DFFF00]" />
          GSV BADMINTON CHAMPIONSHIP
        </p>

        <h1 className="mt-9 text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-[0.85] tracking-[-0.065em] text-white">
          THE COURT
          <span className="mt-3 block text-[#DFFF00]">
            IS LIVE.
          </span>
        </h1>

        <p className="mt-8 max-w-md text-sm leading-7 text-gray-300 sm:text-base">
          Every smash. Every rally. Every point.
          Follow your college badminton championship
          and stay connected to the action.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#live"
            className="inline-flex items-center gap-3 bg-[#DFFF00] px-6 py-4 text-[10px] font-black tracking-widest text-[#070707] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_#DFFF0030]"
          >
            EXPLORE LIVE SCORES
            <span aria-hidden="true">↗</span>
          </a>

          <a
            href="#schedule"
            className="border border-white/25 px-6 py-4 text-[10px] font-bold tracking-widest text-white transition hover:border-[#DFFF00] hover:text-[#DFFF00]"
          >
            VIEW SCHEDULE
          </a>
        </div>

        <div className="mt-14 flex gap-8 border-t border-white/20 pt-6 sm:gap-12">
          <div>
            <p className="text-2xl font-black text-white">01</p>
            <p className="mt-1 text-[10px] tracking-widest text-gray-400">
              LIVE SCORES
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-white">02</p>
            <p className="mt-1 text-[10px] tracking-widest text-gray-400">
              FIXTURES
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-white">03</p>
            <p className="mt-1 text-[10px] tracking-widest text-gray-400">
              RANKINGS
            </p>
          </div>
        </div>
      </div>

      {/* Court indicator */}
      <div className="absolute bottom-12 right-[7vw] hidden border-l border-[#DFFF00] pl-4 md:block">
        <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">
          GSV · BADMINTON
        </p>
        <p className="mt-2 text-2xl font-black text-white">
          GAME ON.
        </p>
      </div>
    </section>
  )
}
