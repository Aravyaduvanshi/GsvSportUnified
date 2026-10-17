

import { Trophy } from "lucide-react"
import bracket from "../data/bracket"
import BracketColumn from "./BadmintonBracketColumn"

export default function Brackets() {
  return (
    <section
      id="brackets"
      className="border-t border-white/10 px-5 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
              03 / THE ROAD TO GLORY
            </p>

            <h2 className="mt-5 text-5xl font-black uppercase sm:text-7xl">
              WIN OR
              <span className="block text-[#DFFF00]">GO HOME.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-gray-400">
            Every round brings the contenders one step
            closer to the championship.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-3 border-y border-white/10 py-4">
          <Trophy size={17} className="text-[#DFFF00]" />

          <span className="text-[10px] font-bold tracking-widest text-white">
            MEN'S SINGLES
          </span>

          <span className="ml-auto text-[9px] tracking-widest text-gray-500">
            TOURNAMENT BRACKET
          </span>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="flex min-w-[800px] gap-6">
            {bracket.map((round) => (
              <BracketColumn
                key={round.title}
                round={round}
              />
            ))}
          </div>
        </div>

        <p className="mt-2 text-[10px] tracking-widest text-gray-500">
          SCROLL HORIZONTALLY TO EXPLORE ALL ROUNDS →
        </p>
      </div>
    </section>
  )
}
