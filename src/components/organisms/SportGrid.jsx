/**
 * SportGrid Organism
 * Renders the responsive collection of sport cards dynamically from the sports registry.
 */
import SportCard from "../molecules/SportCard"
import { sports as defaultSports } from "../../features/sports/data/sports.data"

export default function SportGrid({ sports = defaultSports, title, subtitle }) {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          {title && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
                CAMPUS ATHLETICS
              </p>
              <h2 className="mt-3 text-3xl md:text-5xl font-black uppercase text-white">
                {title}
              </h2>
            </div>
          )}
          {subtitle && (
            <p className="max-w-md text-xs sm:text-sm text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sports.map((sport) => (
          <SportCard key={sport.id} sport={sport} />
        ))}
      </div>
    </div>
  )
}
