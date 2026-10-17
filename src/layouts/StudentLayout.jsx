/**
 * StudentLayout
 * Clean layout for student sports directory, schedules, and bookmarks.
 */
import { Outlet, Link } from "react-router-dom"
import Navbar from "../components/organisms/Navbar"
import Footer from "../components/organisms/Footer"

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080909] text-[#F3F4EF]">
      <Navbar />
      <div className="border-b border-white/10 bg-[#0C0E0D] pt-[76px]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest text-[#DFFF00]">
              STUDENT PORTAL
            </span>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-semibold text-gray-300">
              Campus Sports Access
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest text-gray-400">
            <Link to="/student" className="hover:text-white transition-colors">DASHBOARD</Link>
            <Link to="/matches" className="hover:text-white transition-colors">FIXTURES</Link>
            <Link to="/tournaments" className="hover:text-white transition-colors">BRACKETS</Link>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
