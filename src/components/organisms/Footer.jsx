/**
 * Global Platform Footer Organism
 */
import { Link } from "react-router-dom"
import { sports } from "../../features/sports/data/sports.data"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t border-white/10 bg-[#060707] text-gray-400">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 rotate-45 place-items-center border border-[#07F080]">
                <span className="-rotate-45 text-sm font-black text-[#07F080]">S</span>
              </div>
              <p className="text-base font-black tracking-widest text-white">
                GSV<span className="text-[#07F080]">.</span>SPORTS
              </p>
            </div>
            <p className="text-xs leading-6 text-gray-400">
              The official centralized collegiate athletics portal. Tracking fixtures, live scores, and champions across campus sports.
            </p>
          </div>

          {/* Sports Links */}
          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white uppercase mb-4">
              SPORTS DIRECTORY
            </h4>
            <ul className="space-y-2.5 text-xs">
              {sports.slice(0, 5).map((sport) => (
                <li key={sport.id}>
                  <Link
                    to={sport.path}
                    className="hover:text-[#07F080] transition-colors flex items-center justify-between"
                  >
                    <span>{sport.name}</span>
                    {sport.status === "available" && (
                      <span className="text-[9px] text-[#07F080] font-bold">● LIVE</span>
                    )}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/sports" className="text-[#07F080] hover:underline text-xs font-bold pt-1 block">
                  View all sports →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black tracking-widest text-white uppercase mb-4">
              PLATFORM PORTAL
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/matches" className="hover:text-white transition-colors">
                  Match Schedule
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="hover:text-white transition-colors">
                  Tournament Brackets
                </Link>
              </li>
              <li>
                <Link to="/student" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Super Admin
                </Link>
              </li>
              <li>
                <Link to="/sport-admin" className="hover:text-white transition-colors">
                  Sport Scorekeeper
                </Link>
              </li>
            </ul>
          </div>

          {/* Status & Back to Top */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black tracking-widest text-white uppercase mb-4">
              STATUS
            </h4>
            <div className="border border-white/10 bg-white/5 p-4 text-xs space-y-2">
              <p className="flex items-center gap-2 text-white font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Inter-Collegiate Season 2026
              </p>
              <p className="text-[10px] text-gray-500">
                Frontend architecture: Hybrid Feature + Atomic Design
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="w-full border border-white/20 py-3 text-[10px] font-bold tracking-widest text-white transition hover:border-[#07F080] hover:text-[#07F080] cursor-pointer"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-[10px] text-gray-500">
          <p>© 2026 Gati Shakti Vishwavidyalaya. All sports rights reserved.</p>
          <p className="tracking-widest">BUILT FOR ATHLETES · BUILT WITH LOVE</p>
        </div>
      </div>
    </footer>
  )
}
