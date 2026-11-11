/**
 * MatchControlPage Component
 * Route: /admin/matches/:matchId/control
 * Directly implements the Assigned Admin Match Control Panel inspired by the reference screenshot.
 * Enforces strict server-side authorization boundaries, sport-specific scorekeeping,
 * persistent event logs, and compensating undo.
 */
import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import { getCurrentAdminUser, setCurrentAdminUser } from "../services/adminAuthService"
import {
  getAuthorizedMatch,
  applyScoringEvent,
  undoLastScoringEvent,
  updateMatchStatus,
  recordMatchFault,
  getAssignedMatches,
  resetMatchToZero,
  switchServerInMatch,
} from "../services/matchControlService"
import ThrowballCourtControl from "../components/ThrowballCourtControl"

import MatchControlHeader from "../components/MatchControlHeader"
import MatchScoreboardStrip from "../components/MatchScoreboardStrip"
import BadmintonCourtControl from "../components/BadmintonCourtControl"
import CricketPitchControl from "../components/CricketPitchControl"
import BasketballCourtControl from "../components/BasketballCourtControl"
import MatchControlInfoPanel from "../components/MatchControlInfoPanel"

export default function MatchControlPage() {
  const { matchId } = useParams()
  const [currentUser, setCurrentUser] = useState(getCurrentAdminUser())
  const [matchData, setMatchData] = useState(null)
  const [events, setEvents] = useState([])
  const [errorState, setErrorState] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState(null)
  const [isPending, setIsPending] = useState(false)

  // Switch scorekeeper account and re-evaluate authorization
  const handleSwitchUser = (userId) => {
    const user = setCurrentAdminUser(userId)
    if (user) {
      setCurrentUser(user)
      setErrorState(null)
      try {
        const { match, events: evtLog } = getAuthorizedMatch(user, matchId)
        setMatchData(match)
        setEvents(evtLog)
        setFeedbackMsg({
          type: "success",
          text: `Switched scorekeeper account to ${user.name}.`,
        })
        setTimeout(() => setFeedbackMsg(null), 3000)
      } catch (err) {
        setErrorState(err.message || "Failed to load match.")
      }
    }
  }

  // Load authoritative match data with authorization check
  const loadMatch = useCallback(() => {
    try {
      setErrorState(null)
      const { match, events: evtLog } = getAuthorizedMatch(currentUser, matchId)
      setMatchData(match)
      setEvents(evtLog)
    } catch (err) {
      console.error("Authorization or loading error:", err)
      setErrorState(err.message || "Failed to load match.")
    }
  }, [currentUser, matchId])

  useEffect(() => {
    loadMatch()
  }, [loadMatch])

 
  


const handleRecordFault = (faultData) => {
  if (isPending) return false

  setIsPending(true)

  try {
    const { match, events: updatedEvents } = recordMatchFault(
      currentUser,
      matchId,
      faultData
    )

    setMatchData(match)
    setEvents(updatedEvents)
    setFeedbackMsg({
      type: "success",
      text: "Fault recorded successfully.",
    })

    return true
  } catch (err) {
    setFeedbackMsg({
      type: "error",
      text: err.message || "Failed to record fault.",
    })

    return false
  } finally {
    setIsPending(false)
  }
}

  // Handle score events
  const handleScoringAction = (actionPayload) => {
    try {
      setIsPending(true)
      const { match, events: updatedEvents } = applyScoringEvent(
        currentUser,
        matchId,
        actionPayload
      )
      setMatchData(match)
      setEvents(updatedEvents)
      setFeedbackMsg({
        type: "success",
        text: `Score updated: ${actionPayload.actionDetail || actionPayload.type || "Action applied"}`,
      })
      setTimeout(() => setFeedbackMsg(null), 2500)
    } catch (err) {
      console.error("Score update rejected:", err)
      setFeedbackMsg({
        type: "error",
        text: err.message || "Failed to update score.",
      })
      setTimeout(() => setFeedbackMsg(null), 4000)
    } finally {
      setIsPending(false)
    }
  }

  // Handle compensating undo
  const handleUndo = () => {
    try {
      setIsPending(true)
      const { match, events: updatedEvents } = undoLastScoringEvent(
        currentUser,
        matchId
      )
      setMatchData(match)
      setEvents(updatedEvents)
      setFeedbackMsg({
        type: "success",
        text: "Action successfully undone and compensated.",
      })
      setTimeout(() => setFeedbackMsg(null), 2500)
    } catch (err) {
      console.error("Undo rejected:", err)
      setFeedbackMsg({
        type: "error",
        text: err.message || "No action to undo.",
      })
      setTimeout(() => setFeedbackMsg(null), 3000)
    } finally {
      setIsPending(false)
    }
  }

  // Finalize / Complete match
  const handleCompleteMatch = () => {
    try {
      setIsPending(true)
      const { match, events: updatedEvents } = updateMatchStatus(
        currentUser,
        matchId,
        "COMPLETED"
      )
      setMatchData(match)
      setEvents(updatedEvents)
      setFeedbackMsg({
        type: "success",
        text: "Match finalized and locked.",
      })
    } catch (err) {
      console.error("Failed to complete match:", err)
      setFeedbackMsg({
        type: "error",
        text: err.message || "Failed to complete match.",
      })
    } finally {
      setIsPending(false)
    }
  }

  // Handle resetting match scores back to 0-0
  const handleResetMatch = () => {
    try {
      setIsPending(true)
      const { match, events: updatedEvents } = resetMatchToZero(
        currentUser,
        matchId
      )
      setMatchData(match)
      setEvents(updatedEvents)
      setFeedbackMsg({
        type: "success",
        text: "Match scores reset to 0-0.",
      })
      setTimeout(() => setFeedbackMsg(null), 3000)
    } catch (err) {
      console.error("Failed to reset match:", err)
      setFeedbackMsg({
        type: "error",
        text: err.message || "Failed to reset match.",
      })
      setTimeout(() => setFeedbackMsg(null), 3000)
    } finally {
      setIsPending(false)
    }
  }

  // Handle switching server and service court box
  const handleSwitchServer = (side, court) => {
    try {
      setIsPending(true)
      const { match, events: updatedEvents } = switchServerInMatch(
        currentUser,
        matchId,
        { side, court }
      )
      setMatchData(match)
      setEvents(updatedEvents)
      setFeedbackMsg({
        type: "success",
        text: `Service switched to ${side === "A" ? match.teamA.name : match.teamB.name} (${match.servingCourt} Box)`,
      })
      setTimeout(() => setFeedbackMsg(null), 2500)
    } catch (err) {
      console.error("Failed to switch server:", err)
      setFeedbackMsg({
        type: "error",
        text: err.message || "Failed to switch server.",
      })
      setTimeout(() => setFeedbackMsg(null), 3000)
    } finally {
      setIsPending(false)
    }
  }

  // --- 403 ACCESS DENIED STATE (Strict Security Boundary) ---
  if (errorState && errorState.startsWith("FORBIDDEN")) {
    return (
      <div className="min-h-screen bg-[#080D18] text-[#F4F6FA] flex flex-col items-center justify-center p-6">
        <div className="border border-rose-500/40 bg-[#0F1A2D] p-8 sm:p-10 rounded-lg max-w-lg w-full text-center shadow-2xl">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-rose-950/40 border border-rose-500/50 mx-auto text-rose-400 mb-4">
            <ShieldAlert size={32} />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            403 · ACCESS FORBIDDEN
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#8491A7] font-mono leading-relaxed">
            User <span className="text-white font-bold">{currentUser.name}</span> is not assigned to manage match ID: <span className="text-rose-400 font-bold">{matchId}</span>.
          </p>

          <div className="mt-6 p-4 rounded bg-[#17243A] border border-[#25334B] text-xs font-mono text-left">
            <p className="text-[#FFAE00] font-bold mb-1">Authorization Enforcement:</p>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Scorekeepers can only operate matches explicitly delegated to them. Switch to the assigned scorekeeper or Super Admin to unlock this match:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSwitchUser("admin-arav")}
                className="border border-[#FFAE00]/60 bg-[#FFAE00]/10 text-[#FFAE00] px-2.5 py-1 rounded text-[10px] font-bold"
              >
                Switch to Arav (Badminton)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchUser("admin-vikram")}
                className="border border-[#07F080]/60 bg-[#07F080]/10 text-[#07F080] px-2.5 py-1 rounded text-[10px] font-bold"
              >
                Switch to Vikram (Cricket)
              </button>
              <button
                type="button"
                onClick={() => handleSwitchUser("admin-super")}
                className="border border-white/40 bg-white/10 text-white px-2.5 py-1 rounded text-[10px] font-bold"
              >
                Switch to Super Admin
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              to="/sport-admin"
              className="inline-flex items-center gap-2 border border-[#25334B] bg-[#17243A] hover:bg-white/10 text-white px-5 py-2.5 rounded text-xs font-mono font-bold"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO ASSIGNED MATCHES</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading or not found state
  if (!matchData) {
    return (
      <div className="min-h-screen bg-[#080D18] text-[#F4F6FA] flex flex-col items-center justify-center p-6">
        <div className="text-center font-mono">
          <RefreshCw size={28} className="animate-spin text-[#FFAE00] mx-auto mb-3" />
          <p className="text-sm">Loading match control center...</p>
        </div>
      </div>
    )
  }

  const assignedMatches = getAssignedMatches(currentUser)

  return (
    <div className="min-h-screen bg-[#080D18] text-[#F4F6FA] flex flex-col font-sans select-none">
      {/* 1. Charcoal Top Header (Directly inspired by reference screenshot) */}
      <MatchControlHeader
        currentUser={currentUser}
        match={matchData}
        assignedMatches={assignedMatches}
        onResetMatch={handleResetMatch}
      />

      {/* 2. Scoreboard Strip (Team A in amber, VS in center, Team B in cyan) */}
      <MatchScoreboardStrip match={matchData} />

      {/* Floating feedback alert */}
      {feedbackMsg && (
        <div className="fixed top-20 right-6 z-50">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded shadow-2xl border text-xs font-mono font-bold ${
              feedbackMsg.type === "success"
                ? "border-emerald-500 bg-emerald-950 text-emerald-200"
                : "border-rose-500 bg-rose-950 text-rose-200"
            }`}
          >
            <CheckCircle2 size={16} />
            <span>{feedbackMsg.text}</span>
          </div>
        </div>
      )}

      {/* 3. Main Workspace: 2-Column Split Layout directly matching screenshot */}
     <main className="flex-1 mx-auto max-w-[1680px] w-full min-w-0 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Court diagram, Action type selector, Primary Score Buttons */}
          <div className="min-w-0 lg:col-span-7 bg-[#0F1A2D] border border-[#25334B] rounded-lg p-3 sm:p-5 lg:p-6 shadow-xl">
            {matchData.sport === "badminton" && (
              <BadmintonCourtControl
                match={matchData}
                onScorePoint={handleScoringAction}
                onUndo={handleUndo}
                onSwitchServer={handleSwitchServer}
                isPending={isPending}
              />
            )}

            {matchData.sport === "cricket" && (
              <CricketPitchControl
                match={matchData}
                onScoringAction={handleScoringAction}
                onUndo={handleUndo}
                isPending={isPending}
              />
            )}

           {matchData.sport === "throwball" && (
  <ThrowballCourtControl
    match={matchData}
    onScore={handleScoringAction}
    onUndo={handleUndo}
    isPending={isPending}
  />
)}

            {matchData.sport === "basketball" && (
              <BasketballCourtControl
                match={matchData}
                onScoringAction={handleScoringAction}
                onUndo={handleUndo}
                isPending={isPending}
              />
            )}
          </div>

          {/* Right Column (5 cols): Tabbed Information Panel (LOG | STATS | FAULTS | MATCH) */}
          <div className="lg:col-span-5 h-full">
            <MatchControlInfoPanel
  match={matchData}
  events={events}
  currentUser={currentUser}
  onRecordFault={handleRecordFault}
  onCompleteMatch={handleCompleteMatch}
  isPending={isPending}
/>
          </div>
        </div>
      </main>

      {/* Bottom status bar */}
      <footer className="border-t border-[#25334B] bg-[#080D18] py-2 px-6 text-center text-[10px] font-mono text-[#8491A7] flex items-center justify-between">
        <span>GSV Match Engine · Revision v{matchData.version || 1}</span>
        <span>Court-Side Official: {currentUser.name} ({currentUser.role})</span>
      </footer>
    </div>
  )
}
