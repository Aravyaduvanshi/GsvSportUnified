/**
 * PublicLayout
 * Standard public layout wrapping pages with the unified platform navbar and footer.
 */
import { Outlet } from "react-router-dom"
import Navbar from "../components/organisms/Navbar"
import Footer from "../components/organisms/Footer"

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080909] text-[#F3F4EF]">
      <Navbar />
      <main className="flex-1 pt-[76px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
