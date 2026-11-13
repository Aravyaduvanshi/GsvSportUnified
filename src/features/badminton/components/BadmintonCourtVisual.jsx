import React from "react"
import { RefreshCw } from "lucide-react"

/**
 * BadmintonCourtVisual Component
 * Renders the official BWF badminton court with warm wooden flooring matching reference visuals.
 * Displays real-time serving player (SRV), receiving player (DEF/RCV), active service box
 * according to BWF rules (Even score = Right court, Odd score = Left court), diagonal serve
 * trajectory with shuttlecock, live scores on court, and optional admin server switcher.
 */
export default function BadmintonCourtVisual({
  match,
  courtName = "Badminton Court 01",
  interactive = false,
  onSwitchServer = null,
  className = "",
}) {
  if (!match || match.isYetToBePlayed) {
    const label = (match?.court || courtName || "Badminton Court 01").toUpperCase()
    return (
      <div className={`flex flex-col w-full ${className}`}>
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[280px] sm:min-h-[360px] bg-gradient-to-b from-[#B67E3F] via-[#BD8246] to-[#A86F33] rounded-xl border-2 border-[#8E5E2A] overflow-hidden shadow-2xl select-none">
          {/* Subtle wood plank texture overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 36px)",
            }}
          />

          {/* BWF Court Line Markings SVG */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="netGlowEmpty" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.88" />
            <line x1="12%" y1="5%" x2="12%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="88%" y1="5%" x2="88%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="5%" y1="12%" x2="95%" y2="12%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="5%" y1="88%" x2="95%" y2="88%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="5%" y1="36%" x2="95%" y2="36%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="5%" y1="64%" x2="95%" y2="64%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="50%" y1="5%" x2="50%" y2="36%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="50%" y1="64%" x2="50%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="url(#netGlowEmpty)" strokeWidth="3" strokeDasharray="10 7" strokeOpacity="0.95" />
          </svg>

          {/* Centered Status Badge */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center rounded-xl border border-white/20 bg-black/65 backdrop-blur-md px-6 py-4 shadow-2xl text-center">
              <span className="text-2xl mb-1">🏸</span>
              <p className="text-xs sm:text-sm font-black tracking-widest text-[#DFFF00] uppercase">
                {label} · YET TO BE PLAYED
              </p>
              <p className="mt-1 text-[10px] text-gray-300 font-mono">
                Court ready for next match fixture
              </p>
            </div>
          </div>

          <div className="absolute bottom-2 left-3 text-[9px] font-mono tracking-widest text-black/60 uppercase">
            {label} · READY
          </div>
        </div>
      </div>
    )
  }

  // Resolve teams & player info safely
  const teamA = match.teamA || {
    name: match.player1 || "Player A",
    shortName: (match.player1 || "PL-A").slice(0, 5).toUpperCase(),
    score: match.score1 ?? 0,
    setsWon: match.setsWon1 ?? 0,
  }

  const teamB = match.teamB || {
    name: match.player2 || "Player B",
    shortName: (match.player2 || "PL-B").slice(0, 5).toUpperCase(),
    score: match.score2 ?? 0,
    setsWon: match.setsWon2 ?? 0,
  }

  const servingSide = match.servingSide || "A"
  const isServerA = servingSide === "A"
  const serverTeam = isServerA ? teamA : teamB
  const receiverTeam = isServerA ? teamB : teamA

  const serverScore = Number(serverTeam.score || 0)
  const isScoreEven = serverScore % 2 === 0

  // BWF Service Court Rule:
  // When server's score is 0 or even: serve from the RIGHT service court.
  // When server's score is odd: serve from the LEFT service court.
  // match.servingCourt overrides if explicitly set by admin.
  const servingCourt = match.servingCourt || (isScoreEven ? "RIGHT" : "LEFT")
  const isRightCourt = servingCourt === "RIGHT"

  // Positioning coordinates on court (percentages)
  // Bottom half = Team A, Top half = Team B
  // Team A (bottom): Right service court is viewer's bottom-right; Left service court is viewer's bottom-left.
  // Team B (top): Facing the net, Team B's Right court is viewer's top-left; Left court is viewer's top-right.
  let serverPos, receiverPos, serveBoxRect, receiveBoxRect

  if (isServerA) {
    if (isRightCourt) {
      // Team A serving from Right (bottom-right) diagonally to Team B's Right (top-left)
      serverPos = { x: 69, y: 77 }
      receiverPos = { x: 31, y: 23 }
      serveBoxRect = { x: "50%", y: "64%", width: "38%", height: "24%", name: "Right Service Box (Even)" }
      receiveBoxRect = { x: "12%", y: "12%", width: "38%", height: "24%", name: "Receiver Box (Right)" }
    } else {
      // Team A serving from Left (bottom-left) diagonally to Team B's Left (top-right)
      serverPos = { x: 31, y: 77 }
      receiverPos = { x: 69, y: 23 }
      serveBoxRect = { x: "12%", y: "64%", width: "38%", height: "24%", name: "Left Service Box (Odd)" }
      receiveBoxRect = { x: "50%", y: "12%", width: "38%", height: "24%", name: "Receiver Box (Left)" }
    }
  } else {
    // Team B serving
    if (isRightCourt) {
      // Team B serving from Right (top-left) diagonally to Team A's Right (bottom-right)
      serverPos = { x: 31, y: 23 }
      receiverPos = { x: 69, y: 77 }
      serveBoxRect = { x: "12%", y: "12%", width: "38%", height: "24%", name: "Right Service Box (Even)" }
      receiveBoxRect = { x: "50%", y: "64%", width: "38%", height: "24%", name: "Receiver Box (Right)" }
    } else {
      // Team B serving from Left (top-right) diagonally to Team A's Left (bottom-left)
      serverPos = { x: 69, y: 23 }
      receiverPos = { x: 31, y: 77 }
      serveBoxRect = { x: "50%", y: "12%", width: "38%", height: "24%", name: "Left Service Box (Odd)" }
      receiveBoxRect = { x: "12%", y: "64%", width: "38%", height: "24%", name: "Receiver Box (Left)" }
    }
  }

  // Trajectory midpoint for shuttlecock in flight
  const midX = (serverPos.x + receiverPos.x) / 2
  const midY = (serverPos.y + receiverPos.y) / 2

  const courtLabel = (match.court || "Badminton Court 01").toUpperCase()
  const setLabel = match.periodLabel || `SET ${match.currentSet || 1}`

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {/* Court Canvas Container */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[300px] sm:min-h-[380px] bg-gradient-to-b from-[#B67E3F] via-[#BD8246] to-[#A86F33] rounded-xl border-2 border-[#8E5E2A] overflow-hidden shadow-2xl select-none">
        
        {/* Subtle wood plank texture overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 36px)",
          }}
        />

        {/* Highlighted Active Service Box (Gold Glow) */}
        <div
          className="absolute z-0 transition-all duration-700 ease-in-out rounded border-2 border-amber-300/90 bg-amber-400/20 shadow-[inset_0_0_20px_rgba(251,191,36,0.35)] flex items-center justify-center pointer-events-none"
          style={{
            left: serveBoxRect.x,
            top: serveBoxRect.y,
            width: serveBoxRect.width,
            height: serveBoxRect.height,
          }}
        >
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/50 text-[9px] font-mono font-bold tracking-wider text-amber-200 uppercase">
            ⚡ {servingCourt} SERVE ({serverScore} PTS · {isScoreEven ? "EVEN" : "ODD"})
          </span>
        </div>

        {/* Highlighted Active Receiver Box (Cyan Glow) */}
        <div
          className="absolute z-0 transition-all duration-700 ease-in-out rounded border border-cyan-300/70 bg-cyan-400/15 shadow-[inset_0_0_16px_rgba(34,211,238,0.25)] flex items-center justify-center pointer-events-none"
          style={{
            left: receiveBoxRect.x,
            top: receiveBoxRect.y,
            width: receiveBoxRect.width,
            height: receiveBoxRect.height,
          }}
        >
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/50 text-[9px] font-mono font-bold tracking-wider text-cyan-200 uppercase">
            TARGET BOX
          </span>
        </div>

        {/* BWF Court Line Markings SVG */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="netGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Outer Boundary (Doubles boundary: 5% inset) */}
          <rect x="5%" y="5%" width="90%" height="90%" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.88" />

          {/* Singles sidelines (12% and 88%) */}
          <line x1="12%" y1="5%" x2="12%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
          <line x1="88%" y1="5%" x2="88%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />

          {/* Doubles Long Service Lines (12% top and 88% bottom) */}
          <line x1="5%" y1="12%" x2="95%" y2="12%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="5%" y1="88%" x2="95%" y2="88%" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Short Service Lines (36% top and 64% bottom) */}
          <line x1="5%" y1="36%" x2="95%" y2="36%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
          <line x1="5%" y1="64%" x2="95%" y2="64%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />

          {/* Center Service Line (Top half: 5% to 36%) */}
          <line x1="50%" y1="5%" x2="50%" y2="36%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />

          {/* Center Service Line (Bottom half: 64% to 95%) */}
          <line x1="50%" y1="64%" x2="50%" y2="95%" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />

          {/* Net Line (Center: 50% with official dashed line) */}
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="url(#netGlow)" strokeWidth="3" strokeDasharray="10 7" strokeOpacity="0.95" />

          {/* Diagonal Serve Trajectory Line */}
          <line
            x1={`${serverPos.x}%`}
            y1={`${serverPos.y}%`}
            x2={`${receiverPos.x}%`}
            y2={`${receiverPos.y}%`}
            stroke="#DFFF00"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeOpacity="0.75"
          />
        </svg>

        {/* Shuttlecock Badge on Trajectory */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out pointer-events-none"
          style={{ left: `${midX}%`, top: `${midY}%` }}
        >
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm border border-[#DFFF00]/60 rounded-full px-2 py-0.5 shadow-lg">
            <span className="text-xs">🏸</span>
            <span className="text-[9px] font-mono font-black text-[#DFFF00] tracking-wider">SERVE</span>
          </div>
        </div>

        {/* TEAM B PLAYER TOKEN (Top Half) */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            left: `${isServerA ? receiverPos.x : serverPos.x}%`,
            top: `${isServerA ? receiverPos.y : serverPos.y}%`,
          }}
        >
          {/* Circular Player Badge */}
          <div
            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 flex flex-col items-center justify-center backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-105 ${
              !isServerA
                ? "border-[#FFAE00] bg-[#FFAE00] text-black shadow-[0_0_20px_rgba(255,174,0,0.6)]"
                : "border-white/90 bg-white/20 text-white shadow-lg"
            }`}
          >
            <span className={`text-[10px] sm:text-xs font-black tracking-wider uppercase leading-none ${!isServerA ? "text-black" : "text-white"}`}>
              {teamB.shortName || "DEF"}
            </span>
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 tracking-wider uppercase ${!isServerA ? "text-black/80 font-black" : "text-white/80"}`}>
              {!isServerA ? "SRV" : "DEF"}
            </span>

            {/* Shuttlecock Serve indicator pill */}
            {!isServerA && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-400 border border-white text-[10px] flex items-center justify-center shadow">
                🏸
              </span>
            )}
          </div>

          {/* Player Name Pill */}
          <div className="mt-1.5 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 shadow-md">
            <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide whitespace-nowrap">
              {teamB.name}
            </span>
          </div>

          {/* Current Set Score Pill */}
          <div className="mt-1 px-2 py-0.2 rounded bg-black/40 text-[9px] font-mono text-cyan-200">
            {teamB.score} pts
          </div>
        </div>

        {/* TEAM A PLAYER TOKEN (Bottom Half) */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex flex-col items-center"
          style={{
            left: `${isServerA ? serverPos.x : receiverPos.x}%`,
            top: `${isServerA ? serverPos.y : receiverPos.y}%`,
          }}
        >
          {/* Circular Player Badge */}
          <div
            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 flex flex-col items-center justify-center backdrop-blur-md shadow-xl transition-transform duration-300 hover:scale-105 ${
              isServerA
                ? "border-[#FFAE00] bg-[#FFAE00] text-black shadow-[0_0_20px_rgba(255,174,0,0.6)]"
                : "border-white/90 bg-white/20 text-white shadow-lg"
            }`}
          >
            <span className={`text-[10px] sm:text-xs font-black tracking-wider uppercase leading-none ${isServerA ? "text-black" : "text-white"}`}>
              {teamA.shortName || "SRV"}
            </span>
            <span className={`text-[8px] sm:text-[9px] font-bold mt-0.5 tracking-wider uppercase ${isServerA ? "text-black/80 font-black" : "text-white/80"}`}>
              {isServerA ? "SRV" : "DEF"}
            </span>

            {/* Shuttlecock Serve indicator pill */}
            {isServerA && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-amber-400 border border-white text-[10px] flex items-center justify-center shadow">
                🏸
              </span>
            )}
          </div>

          {/* Player Name Pill */}
          <div className="mt-1.5 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 shadow-md">
            <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide whitespace-nowrap">
              {teamA.name}
            </span>
          </div>

          {/* Current Set Score Pill */}
          <div className="mt-1 px-2 py-0.2 rounded bg-black/40 text-[9px] font-mono text-amber-200">
            {teamA.score} pts
          </div>
        </div>

        {/* Bottom Left Court & Set Tag (Matches screenshot exact placement & style) */}
        <div className="absolute bottom-2.5 left-3 sm:bottom-3 sm:left-4 z-10 text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-white/70 uppercase drop-shadow">
          {courtLabel} · {setLabel}
        </div>

        {/* Top Right Live Net Indicator */}
        <div className="absolute top-2.5 right-3 sm:top-3 sm:right-4 z-10 hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded text-[9px] font-mono text-white/80 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#DFFF00] animate-pulse" />
          <span>BWF 21-PT RALLY RULE</span>
        </div>
      </div>

      {/* Official BWF Serve Context Strip (Directly informs the spectator & official) */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/40 border border-white/10 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-base">🏸</span>
          <span className="font-mono text-gray-300 text-[11px]">
            <strong className="text-[#FFAE00] uppercase font-bold">{serverTeam.name}</strong> SERVING FROM{" "}
            <span className="text-white font-bold underline decoration-amber-400 underline-offset-2">
              {servingCourt} SERVICE COURT
            </span>{" "}
            <span className="text-gray-400">({serverScore} pts · {isScoreEven ? "Even" : "Odd"} Rule)</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gray-400">
            Target Receiver: <strong className="text-cyan-300">{receiverTeam.name}</strong>
          </span>

          {/* Admin manual server switch toggle buttons (only when interactive is true) */}
          {interactive && typeof onSwitchServer === "function" && (
            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => onSwitchServer(isServerA ? "B" : "A")}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-[#FFAE00]/60 bg-[#FFAE00]/10 hover:bg-[#FFAE00]/20 text-[#FFAE00] text-[10px] font-bold font-mono transition cursor-pointer"
                title="Switch which player is serving"
              >
                <RefreshCw size={11} />
                <span>SWITCH SERVER</span>
              </button>

              <button
                type="button"
                onClick={() => onSwitchServer(servingSide, isRightCourt ? "LEFT" : "RIGHT")}
                className="px-2 py-1 rounded border border-white/20 bg-white/5 hover:bg-white/15 text-white text-[10px] font-mono transition cursor-pointer"
                title="Manually switch between Right and Left court box"
              >
                BOX: {isRightCourt ? "L" : "R"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

