
import { RotateCcw, Trophy, Volleyball } from "lucide-react"

export default function ThrowballCourtControl({
  match,
  onScore,
  onUndo,
  isPending = false,
}) {
  const teamA = match.teamA
  const teamB = match.teamB
  const scoreA = teamA.score ?? 0
  const scoreB = teamB.score ?? 0
  const setsA = teamA.setsWon ?? 0
  const setsB = teamB.setsWon ?? 0
  const completed = match.status === "COMPLETED"

  const awardPoint = (side) => {
    if (isPending || completed) return

    onScore({
      side,
      actionType: "POINT",
      actionDetail: "Throwball Point",
    })
  }

  const PlayerMarker = ({ x, y, name, shortName, color }) => (
    <g transform={`translate(${x} ${y})`}>
      <circle
        r="19"
        fill={color}
        fillOpacity="0.17"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle r="15" fill={color} fillOpacity="0.12" />
      <text
        y="-1"
        textAnchor="middle"
        fill={color}
        fontSize="8"
        fontWeight="800"
      >
        {shortName}
      </text>
      <text
        y="9"
        textAnchor="middle"
        fill="white"
        fontSize="6"
        opacity="0.8"
      >
        PLAYER
      </text>
      <rect
        x="-43"
        y="25"
        width="86"
        height="16"
        rx="3"
        fill="#172235"
        fillOpacity="0.95"
      />
      <text
        y="36"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="600"
      >
        {name || shortName}
      </text>
    </g>
  )

  return (
    <section className="rounded-xl border border-white/10 bg-[#101b2e] p-4 sm:p-5">
      {/* Match heading */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
            <Volleyball size={19} />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-[0.15em] text-white">
              THROWBALL COURT
            </h2>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">
              {match.tournament || "GSV Throwball"} · SET {match.currentSet || 1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 font-mono text-[9px] font-bold tracking-wider text-emerald-400">
            {completed ? "COMPLETED" : "● LIVE"}
          </span>
          <span className="rounded-md border border-cyan-400/20 px-3 py-2 font-mono text-[9px] font-bold tracking-wider text-cyan-400">
            BEST OF {match.bestOfSets || 3}
          </span>
        </div>
      </div>

      {/* Court illustration */}
      <div className="relative overflow-hidden rounded-lg border border-[#e6b879]/30 bg-[#bd8745] shadow-inner">
        <svg
          viewBox="0 0 760 340"
          role="img"
          aria-label="Throwball court showing both team halves and player positions"
          className="block h-auto w-full"
        >
          <defs>
            <pattern
              id="throwball-court-texture"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M12 0H0V12"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.035"
              />
            </pattern>
          </defs>

          <rect width="760" height="340" fill="#bd8745" />
          <rect
            width="760"
            height="340"
            fill="url(#throwball-court-texture)"
          />

          {/* Outer court boundary */}
          <rect
            x="38"
            y="22"
            width="684"
            height="280"
            fill="none"
            stroke="#fff4df"
            strokeWidth="2"
          />

          {/* Team halves */}
          <rect
            x="38"
            y="22"
            width="342"
            height="280"
            fill="#ffae00"
            fillOpacity="0.08"
          />
          <rect
            x="380"
            y="22"
            width="342"
            height="280"
            fill="#35c5f4"
            fillOpacity="0.08"
          />

          {/* Center line */}
          <line
            x1="380"
            y1="22"
            x2="380"
            y2="302"
            stroke="#fff4df"
            strokeWidth="2.5"
          />

          {/* Attack / positioning guides */}
          <line
            x1="38"
            y1="92"
            x2="722"
            y2="92"
            stroke="#fff4df"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
          <line
            x1="38"
            y1="232"
            x2="722"
            y2="232"
            stroke="#fff4df"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />

          {/* Court labels */}
          <text
            x="55"
            y="43"
            fill="#fff4df"
            fontSize="10"
            fontWeight="800"
            letterSpacing="2"
          >
            TEAM A
          </text>
          <text
            x="705"
            y="43"
            fill="#fff4df"
            fontSize="10"
            fontWeight="800"
            letterSpacing="2"
            textAnchor="end"
          >
            TEAM B
          </text>

          {/* Illustrative player positions */}
          <PlayerMarker
            x={205}
            y={155}
            name={teamA.name}
            shortName={teamA.shortName || "A"}
            color={teamA.color || "#ffae00"}
          />
          <PlayerMarker
            x={555}
            y={155}
            name={teamB.name}
            shortName={teamB.shortName || "B"}
            color={teamB.color || "#35c5f4"}
          />

          <text
            x="380"
            y="326"
            fill="#fff4df"
            fontSize="9"
            letterSpacing="1.5"
            textAnchor="middle"
          >
            THROWBALL COURT · SET {match.currentSet || 1}
          </text>
        </svg>
      </div>

      {/* Current score strip */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#0b1424] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">{teamA.name}</p>
            <p className="mt-1 font-mono text-[9px] text-slate-500">
              {setsA} SETS WON
            </p>
          </div>
          <span className="ml-2 text-2xl font-black" style={{ color: teamA.color || "#ffae00" }}>
            {scoreA}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-md border border-white/10 bg-[#0b1424] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">{teamB.name}</p>
            <p className="mt-1 font-mono text-[9px] text-slate-500">
              {setsB} SETS WON
            </p>
          </div>
          <span className="ml-2 text-2xl font-black" style={{ color: teamB.color || "#35c5f4" }}>
            {scoreB}
          </span>
        </div>
      </div>

      {/* Point controls */}
      <div className="mb-3 mt-5">
        <p className="mb-3 font-mono text-[9px] font-bold tracking-[0.18em] text-slate-500">
          AWARD POINT · SELECT THE TEAM
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isPending || completed}
            onClick={() => awardPoint("A")}
            className="flex min-h-14 items-center justify-between rounded-md border-2 px-5 py-4 text-sm font-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: teamA.color || "#ffae00",
              color: "#07111f",
              borderColor: teamA.color || "#ffae00",
            }}
          >
            <span>+1 {teamA.name}</span>
            <span className="text-xl">+</span>
          </button>

          <button
            type="button"
            disabled={isPending || completed}
            onClick={() => awardPoint("B")}
            className="flex min-h-14 items-center justify-between rounded-md border-2 px-5 py-4 text-sm font-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: teamB.color || "#35c5f4",
              color: "#07111f",
              borderColor: teamB.color || "#35c5f4",
            }}
          >
            <span>+1 {teamB.name}</span>
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          disabled={!onUndo || isPending}
          onClick={onUndo}
          className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-transparent px-3 py-3 text-xs font-bold text-slate-400 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={14} />
          UNDO ACTION
        </button>

        <div className="flex items-center justify-center gap-2 rounded-md border border-white/10 bg-[#0b1424] px-3 py-3 font-mono text-[10px] text-slate-400">
          <Trophy size={14} className="text-amber-400" />
          SET {match.currentSet || 1} · {scoreA}–{scoreB}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-md border border-white/[0.07] bg-[#0b1424] px-4 py-3">
        <span className="font-mono text-[9px] tracking-wider text-slate-500">
          SET TARGET
        </span>
        <span className="font-mono text-xs font-bold text-white">
          {match.pointsTarget || 25} POINTS · WIN BY {match.winningMargin || 2}
        </span>
      </div>
    </section>
  )
}