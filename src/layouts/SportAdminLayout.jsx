/**
 * SportAdminLayout
 * Dedicated dashboard shell for sport-specific scorekeeping.
 */
import { Outlet, Link } from "react-router-dom"

export default function SportAdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080909] text-[#F3F4EF]">
      {/* Sport Admin Header */}
      <header className="border-b border-white/10 bg-[#0C0E0D]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-7 w-7 rotate-45 place-items-center border border-[#DFFF00]">
                <span className="-rotate-45 text-xs font-black text-[#DFFF00]">S</span>
              </div>
              <span className="text-xs font-black tracking-widest text-white">
                GSV<span className="text-[#DFFF00]">.</span>OFFICIAL
              </span>
            </Link>
            <span className="border-l border-white/10 pl-4 text-[10px] font-bold tracking-widest text-[#DFFF00]">
              SPORT SCOREKEEPER
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/sports/badminton"
              className="text-[10px] font-bold tracking-widest text-[#DFFF00] hover:underline"
            >
              BADMINTON COURT ↗
            </Link>
            <Link
              to="/"
              className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-white"
            >
              EXIT
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-[10px] text-gray-500">
        Sport Admin Interface · Live Scorekeeper Boundary Stub
      </footer>
    </div>
  )
}
