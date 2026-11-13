/**
 * MatchControlInfoPanel Component
  * Right workspace for match control and scorekeeping.
 * Tabs: LOG | STATS | FAULTS | MATCH
 */
import { useState } from "react"
import { CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react"



function getTeamStats(match, side, events = []) {
  if (!match) return []
  const team = side === "A" 
    ? (match.teamA || { name: match.player1 || "PLAYER 1", score: match.score1 ?? 0, setsWon: match.setsWon1 ?? 0 })
    : (match.teamB || { name: match.player2 || "PLAYER 2", score: match.score2 ?? 0, setsWon: match.setsWon2 ?? 0 })
  const stats = match.stats?.[side === "A" ? "teamA" : "teamB"] || {}
  const teamName = (team?.name || (side === "A" ? match.player1 : match.player2) || "").toLowerCase()

  let computedAces = stats.aces
  let computedErrors = stats.errors

  if (computedAces === undefined && Array.isArray(events)) {
    computedAces = events.filter((e) => {
      const desc = (e.description || "").toLowerCase()
      const type = (e.actionType || "").toLowerCase()
      return (desc.includes("ace") || type.includes("ace")) && (desc.includes(teamName) || e.scoringTeam === side)
    }).length
  }

  if (computedErrors === undefined && Array.isArray(events)) {
    computedErrors = events.filter((e) => {
      const desc = (e.description || "").toLowerCase()
      const type = (e.actionType || "").toLowerCase()
      return (desc.includes("error") || type.includes("error")) && (desc.includes(teamName) || e.scoringTeam === side)
    }).length
  }

  const value = (item) => item ?? 0

  if (match.sport === "badminton" || !match.sport) {
    return [
      { label: "CURRENT POINTS", value: team?.score ?? (side === "A" ? match.score1 : match.score2) ?? 0 },
      { label: "SETS WON", value: team?.setsWon ?? (side === "A" ? match.setsWon1 : match.setsWon2) ?? 0 },
      { label: "ACES", value: value(computedAces) },
      { label: "ERRORS", value: value(computedErrors) },
    ]
  }

  if (match.sport === "cricket") {
    return [
      { label: "RUNS", value: value(team?.runs ?? 0) },
      { label: "WICKETS", value: value(team?.wickets ?? 0) },
      { label: "OVERS", value: value(team?.overs ?? 0) },
      { label: "EXTRAS", value: value(stats.extras ?? 0) },
      { label: "BOUNDARIES", value: value(stats.boundaries ?? 0) },
      { label: "RUN RATE", value: value(stats.runRate ?? "0.0") },
    ]
  }

  if (match.sport === "basketball") {
    return [
      { label: "POINTS", value: value(team?.score ?? 0) },
      { label: "FOULS", value: value(team?.fouls ?? 0) },
      { label: "TIMEOUTS", value: value(team?.timeouts ?? 0) },
      { label: "3-POINTERS", value: value(stats.threePointers ?? 0) },
      { label: "FIELD GOALS", value: value(stats.fieldGoals ?? 0) },
      { label: "FREE THROWS", value: value(stats.freeThrows ?? 0) },
    ]
  }

  if (match.sport === "throwball") {
    return [
      { label: "CURRENT POINTS", value: value(team?.score ?? 0) },
      { label: "SETS WON", value: value(team?.setsWon ?? 0) },
      { label: "SERVICE ERRORS", value: value(stats.serviceErrors ?? 0) },
      { label: "FAULTS", value: value(stats.faults ?? 0) },
    ]
  }

  return []
}

function TeamStatsSection({ match, side, events = [] }) {
  const team = side === "A" 
    ? (match.teamA || { name: match.player1 || "PLAYER 1" })
    : (match.teamB || { name: match.player2 || "PLAYER 2" })
  const teamName = team?.name || (side === "A" ? match.player1 : match.player2) || (side === "A" ? "PLAYER 1" : "PLAYER 2")
  const accent = side === "A" ? "#FFAE00" : "#35C5F4"
  const stats = getTeamStats(match, side, events)

  return (
    <section>
      <p
        className="mb-3 text-xs font-black uppercase tracking-wider"
        style={{ color: accent }}
      >
        {teamName}
      </p>

      <div className="overflow-hidden rounded border border-[#25334B] bg-[#17243A]/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-[#25334B] bg-black/20 text-[10px] uppercase text-[#8491A7]">
            <tr>
              <th className="px-3 py-2.5">STATISTIC</th>
              <th className="px-3 py-2.5 text-right">VALUE</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#25334B]/60 text-gray-200">
            {stats.map((item) => (
              <tr key={item.label} className="hover:bg-white/5">
                <td className="px-3 py-2.5">{item.label}</td>
                <td
                  className="px-3 py-2.5 text-right font-bold"
                  style={{ color: accent }}
                >
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


export default function MatchControlInfoPanel({
  match,
  events = [],
  currentUser,
  onRecordFault,
  onCompleteMatch,
  isPending = false,
  isUserFacing = false,
  initialTab = "STATS",
}) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [showFaultForm, setShowFaultForm] = useState(false)
const [faultSide, setFaultSide] = useState("A")
const [faultType, setFaultType] = useState("")
const [faultNotes, setFaultNotes] = useState("")

const faultOptions =
  match.sport === "badminton"
    ? ["Service Fault", "Net Touch", "Foot Fault", "Racket Fault", "Other"]
    : match.sport === "basketball"
    ? ["Personal Foul", "Shooting Foul", "Technical Foul", "Offensive Foul", "Other"]
    : match.sport === "throwball"
  ? ["Net Fault", "Service Fault", "Foot Fault", "Unsporting Conduct", "Other"]

    : ["Obstruction", "Unsporting Conduct", "Other Incident"]
    
    
  const isCricket = match.sport === "cricket"
  const isBasketball = match.sport === "basketball"

  const faultsTabLabel = isCricket ? "WICKETS" : isBasketball ? "FOULS" : "FAULTS"
  
  // Public user facing views exclude the FAULTS tab (faults is admin-only)
  const availableTabs = isUserFacing
    ? ["LOG", "STATS", "MATCH"]
    : ["LOG", "STATS", faultsTabLabel, "MATCH"]

  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.timestamp || 0).getTime()
    const timeB = new Date(b.timestamp || 0).getTime()
    return timeB - timeA
  })

  return (
    <div className="flex flex-col h-full border border-[#25334B] bg-[#0F1A2D] rounded-lg overflow-hidden shadow-xl">
      {/* Tab Navigation Header (Matches reference screenshot's tabs) */}
      <div className="flex items-center border-b border-[#25334B] bg-[#080D18] px-2 text-xs font-mono font-bold">
        {availableTabs.map((tab) => {
          const isActive =
            (tab === faultsTabLabel && activeTab === "FAULTS") || activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab === faultsTabLabel ? "FAULTS" : tab)}
              className={`flex-1 py-3 text-center uppercase tracking-wider transition cursor-pointer relative ${
                isActive
                  ? "text-[#FFAE00] font-black"
                  : "text-[#8491A7] hover:text-white"
              }`}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 inset-x-2 h-0.5 bg-[#FFAE00]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto max-h-[560px]">
        {/* --- TAB 1: STATS --- */}
        
{activeTab === "STATS" && (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-white">
          Match Statistics
        </p>
        <p className="mt-1 text-[10px] font-mono text-[#8491A7]">
          {match.sportLabel || match.sport} · {match.periodLabel || "MATCH"}
        </p>
      </div>

      <span className="border border-[#25334B] bg-[#17243A] px-2 py-1 text-[9px] font-mono uppercase text-[#8491A7]">
        Live Data
      </span>
    </div>

    <TeamStatsSection match={match} side="A" events={events} />
    <TeamStatsSection match={match} side="B" events={events} />

    {match.sport === "badminton" &&
      Array.isArray(match.setHistory) &&
      match.setHistory.length > 0 && (
        <section className="border-t border-[#25334B] pt-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#8491A7]">
            Completed Sets
          </p>

          <div className="space-y-2">
            {match.setHistory.map((set) => (
              <div
                key={set.set}
                className="flex items-center justify-between border border-[#25334B] bg-[#17243A]/60 px-3 py-2 text-xs font-mono"
              >
                <span className="text-gray-300">SET {set.set}</span>
                <span className="font-bold text-white">
                  {set.scoreA} – {set.scoreB}
                </span>
                <span className="text-[#07F080]">
                  {set.winner}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
  </div>
)}


        {/* --- TAB 2: LOG (Authoritative Chronological Event History) --- */}
        
{activeTab === "LOG" && (
  <div className="space-y-4">
    {/* Log header */}
    <div className="flex items-center justify-between gap-3 border-b border-[#25334B] pb-3">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-white">
          Event History
        </p>
        <p className="mt-1 text-[10px] font-mono text-[#8491A7]">
          {sortedEvents.length} recorded events
        </p>
      </div>

      <span className="border border-[#25334B] bg-[#17243A] px-2 py-1 text-[9px] font-mono uppercase text-[#8491A7]">
        {match.status}
      </span>
    </div>

    {/* Empty state */}
    {sortedEvents.length === 0 ? (
      <div className="border border-dashed border-[#25334B] py-10 text-center">
        <p className="text-sm font-bold text-gray-300">
          No events yet
        </p>
        <p className="mt-2 text-xs text-[#8491A7]">
          Scoring actions and match updates will appear here.
        </p>
      </div>
    ) : (
      <div className="space-y-3">
        {sortedEvents.map((evt) => {
          const isUndo = evt.actionType === "UNDO"
          const isReversed = Boolean(evt.isReversed)

          const timestamp = evt.timestamp
            ? new Date(evt.timestamp)
            : null

          const timeLabel =
            timestamp && !Number.isNaN(timestamp.getTime())
              ? timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : evt.formattedTime || "Time unavailable"

          const dateLabel =
            timestamp && !Number.isNaN(timestamp.getTime())
              ? timestamp.toLocaleDateString()
              : ""

          const scoreBefore =
            evt.prevScore && typeof evt.prevScore === "object"
              ? `${evt.prevScore.teamA ?? "—"} – ${evt.prevScore.teamB ?? "—"}`
              : null

          const scoreAfter =
            evt.newScore && typeof evt.newScore === "object"
              ? `${evt.newScore.teamA ?? "—"} – ${evt.newScore.teamB ?? "—"}`
              : null

          return (
            <article
              key={evt.id}
              className={`rounded border p-3 ${
                isReversed
                  ? "border-rose-900/60 bg-rose-950/20"
                  : isUndo
                  ? "border-amber-500/40 bg-amber-950/20"
                  : "border-[#25334B] bg-[#17243A]/70"
              }`}
            >
              {/* Time and action type */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-[10px] text-[#8491A7]">
                  <span>{timeLabel}</span>
                  {dateLabel && <span> · {dateLabel}</span>}
                </div>

                <span
                  className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                    isReversed
                      ? "border-rose-500/30 text-rose-300"
                      : isUndo
                      ? "border-amber-500/30 text-amber-300"
                      : "border-[#35C5F4]/30 text-[#35C5F4]"
                  }`}
                >
                  {isReversed
                    ? "Reversed"
                    : isUndo
                    ? "Undo"
                    : String(evt.actionType || "Event").replaceAll("_", " ")}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm font-semibold leading-relaxed text-white">
                {String(evt.description || "Match event recorded").replace(/\(Error\)/gi, "(Opponent Error)")}
              </p>

              {/* Admin attribution */}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8491A7]">
                <ShieldCheck size={12} />
                <span>Recorded by {evt.adminName || "Unknown admin"}</span>
              </div>

              {/* Score transition */}
              {(scoreBefore || scoreAfter) && (
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#25334B] pt-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#8491A7]">
                      Before
                    </p>
                    <p className="mt-1 font-mono text-xs text-gray-300">
                      {scoreBefore || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#8491A7]">
                      After
                    </p>
                    <p className="mt-1 font-mono text-xs font-bold text-white">
                      {scoreAfter || "—"}
                    </p>
                  </div>
                </div>
              )}

              {/* Reversal explanation */}
              {isReversed && (
                <div className="mt-3 border-t border-rose-900/40 pt-2 text-[10px] text-rose-300">
                  This action was undone. It remains in the history for
                  traceability.
                </div>
              )}
            </article>
          )
        })}
      </div>
    )}
  </div>
)}


        {/* --- TAB 3: FAULTS / WICKETS / FOULS --- */}
        
{activeTab === "FAULTS" && (
  <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-white">
          {match.sport === "badminton"
            ? "Badminton Faults"
            : match.sport === "basketball"
            ? "Basketball Fouls"
            : "Cricket Incidents"}
        </p>
        <p className="mt-1 text-[10px] text-[#8491A7]">
          {currentUser?.name || "Match Admin"} · {match.teamA.name} vs {match.teamB.name}
        </p>
      </div>

      <button
        type="button"
        disabled={isPending || match.status === "COMPLETED"}
        onClick={() => {
          setFaultType(faultOptions[0])
          setFaultSide("A")
          setFaultNotes("")
          setShowFaultForm((value) => !value)
        }}
        className="border border-[#35C5F4]/40 bg-[#35C5F4]/10 px-3 py-2 text-[10px] font-bold tracking-wider text-[#35C5F4] transition hover:bg-[#35C5F4]/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {showFaultForm ? "CANCEL" : "+ RECORD FAULT"}
      </button>
    </div>

    {showFaultForm && (
      <form
        className="space-y-4 rounded border border-[#25334B] bg-[#0F1A2D] p-4"
        
onSubmit={(event) => {
  event.preventDefault()

  const saved = onRecordFault({
    side: faultSide,
    type: faultType,
    notes: faultNotes,
  })

  if (saved) {
    setShowFaultForm(false)
    setFaultNotes("")
  }
}}

      >
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#8491A7]">
            Team committing the fault
          </label>
          <select
            value={faultSide}
            onChange={(event) => setFaultSide(event.target.value)}
            className="w-full border border-[#25334B] bg-[#17243A] p-3 text-sm text-white"
          >
            <option value="A">{match.teamA.name}</option>
            <option value="B">{match.teamB.name}</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#8491A7]">
            Fault type
          </label>
          <select
            required
            value={faultType}
            onChange={(event) => setFaultType(event.target.value)}
            className="w-full border border-[#25334B] bg-[#17243A] p-3 text-sm text-white"
          >
            {faultOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#8491A7]">
            Notes (optional)
          </label>
          <textarea
            value={faultNotes}
            onChange={(event) => setFaultNotes(event.target.value)}
            maxLength={300}
            rows={2}
            placeholder="Add context for this incident..."
            className="w-full resize-y border border-[#25334B] bg-[#17243A] p-3 text-sm text-white placeholder:text-[#8491A7]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || match.status === "COMPLETED"}
          className="w-full bg-[#35C5F4] px-4 py-3 text-xs font-black tracking-widest text-[#0B1423] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "SAVING..." : "SAVE FAULT"}
        </button>
      </form>
    )}

    {(!match.faults || match.faults.length === 0) ? (
      <p className="py-8 text-center text-xs text-gray-400">
        No faults or penalty events recorded in this match.
      </p>
    ) : (
      <div className="space-y-2">
        {[...match.faults].reverse().map((fault) => (
          <div
            key={fault.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#25334B] bg-[#17243A] p-3 text-xs"
          >
            <div className="min-w-0">
              <span className="block text-[9px] font-bold text-[#FFAE00]">
                {fault.team}
              </span>
              <span className="font-semibold text-white">
                {fault.type}
              </span>
              {fault.notes && (
                <p className="mt-1 break-words text-[10px] text-gray-400">
                  {fault.notes}
                </p>
              )}
              {fault.adminName && (
                <p className="mt-1 text-[10px] text-[#8491A7]">
                  Recorded by {fault.adminName}
                </p>
              )}
            </div>
            <span className="text-[10px] text-[#8491A7]">
              {fault.time || "Recorded"}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        {/* --- TAB 4: MATCH METADATA & ACTIONS --- */}
        {activeTab === "MATCH" && (
          <div className="space-y-5 text-xs font-mono">
            <div className="border border-[#25334B] bg-[#17243A] p-4 rounded space-y-3">
              <div>
                <span className="text-[9px] text-[#8491A7] uppercase block">TOURNAMENT</span>
                <span className="text-sm font-bold text-white">{match.tournament}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#25334B]">
                <div>
                  <span className="text-[9px] text-[#8491A7] uppercase block">VENUE</span>
                  <span className="text-white">{match.venue || match.court}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8491A7] uppercase block">STAGE</span>
                  <span className="text-white">{match.stage}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#25334B] flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#8491A7] uppercase block">ASSIGNED SCOREKEEPER</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    {match.assignedAdminName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[#8491A7] uppercase block">STATUS</span>
                  <span className="text-[#FFAE00] font-bold">{match.status}</span>
                </div>
              </div>
            </div>

            {/* Complete Match Action Button or User Rules */}
            {isUserFacing ? (
              <div className="border border-white/10 bg-[#080D18] p-4 rounded text-center">
                <span className="text-[10px] text-[#8491A7] uppercase block mb-1">
                  OFFICIAL SCORING RULE
                </span>
                <span className="text-xs font-bold text-[#DFFF00]">
                  BWF Standard 21-Point Rally Point System
                </span>
                <p className="mt-2 text-[10px] text-gray-400">
                  Points are awarded on every rally. The side winning the rally adds a point to their score and serves the next point. Matches are played Best of 3 sets to 21 points.
                </p>
              </div>
            ) : (
              <div className="border border-white/10 bg-[#080D18] p-4 rounded text-center">
                <p className="text-[11px] text-[#8491A7] mb-3">
                  When play concludes, finalizing the match will lock live score modifications and update public fixtures.
                </p>

                {match.status === "COMPLETED" ? (
                  <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 rounded text-emerald-300 font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={16} />
                    <span>MATCH COMPLETED & FINALIZED</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setShowConfirmModal(true)}
                    className="w-full border border-rose-500/50 bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 py-3 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    FINALIZE & COMPLETE MATCH
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Finalizing Match */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-[#25334B] bg-[#0F1A2D] p-6 max-w-md w-full rounded-lg shadow-2xl text-left">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle size={24} />
              <h4 className="text-base font-black text-white uppercase">Confirm Match Completion</h4>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-mono">
              Are you sure you want to finalize <span className="text-white font-bold">{match.teamA.name}</span> vs{" "}
              <span className="text-white font-bold">{match.teamB.name}</span>? Once completed, ordinary score inputs will be locked.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="border border-[#25334B] px-4 py-2 text-xs font-mono text-[#8491A7] hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  onCompleteMatch()
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 text-xs font-mono uppercase tracking-wider"
              >
                CONFIRM & COMPLETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
