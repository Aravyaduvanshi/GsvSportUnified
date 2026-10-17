/**
 * SportCard Molecule
 * Displays a sport card with status, description, and link to its sport page.
 */
import { Link } from "react-router-dom"
import Badge from "../atoms/Badge"

export default function SportCard({ sport }) {
  const isAvailable = sport.status === "available"

  return (
    <div
      className={`group relative flex flex-col justify-between border bg-[#111313] p-7 transition-all duration-300 ${
        isAvailable
          ? "border-white/15 hover:border-[#07F080]/70 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(07F080,0.08)]"
          : "border-white/5 opacity-80 hover:opacity-100 hover:border-white/20 hover:-translate-y-0.5"
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <Badge variant={isAvailable ? "live" : "default"}>
            {isAvailable ? "LIVE CHAMPIONSHIP" : "COMING SOON"}
          </Badge>
          <span className="text-[10px] tracking-widest text-gray-500 font-mono">
            {sport.season || "2026-27"}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-6 text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#07F080] transition-colors">
          {sport.name}
        </h3>

        <p className="mt-2 text-xs font-semibold tracking-wider text-gray-400">
          {sport.courts}
        </p>

        {/* Description */}
        <p className="mt-4 text-xs leading-6 text-gray-400 line-clamp-3">
          {sport.description}
        </p>
      </div>

      {/* Footer / CTA */}
      <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-widest text-gray-500">
          {isAvailable ? "ACTIVE HUB" : "IN DEVELOPMENT"}
        </span>

        {isAvailable ? (
          <Link
            to={sport.path}
            className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-[#DFFF00] transition-transform duration-300 group-hover:translate-x-1"
          >
            ENTER SPORT <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link
            to={sport.path}
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-400 transition-colors hover:text-white"
          >
            PREVIEW <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  )
}
