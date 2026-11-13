/**
 * MatchControlPage Component
 * Route: /admin/matches/:matchId/control
 * Directly implements the Assigned Admin Match Control Panel inspired by the reference screenshot.
 * Enforces strict server-side authorization boundaries, sport-specific scorekeeping,
 * persistent event logs, and compensating undo.
 */
import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { ShieldAlert, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Plus } from "lucide-react"
import { getCurrentAdminUser, setCurrentAdminUser, canAdminAccessMatch } from "../services/adminAuthService"
import {
  getAuthorizedMatch,
  applyScoringEvent,
  undoLastScoringEvent,
  updateMatchStatus,
  recordMatchFault,
  getAssignedMatches,
  resetMatchToZero,
  switchServerInMatch,
  saveStoredMatches,
} from "../services/matchControlService"
import {
  fetchBadmintonMatchById,
  fetchBadmintonMatchEvents,
  fetchBadmintonSchedule,
  subscribeToBadmintonLiveScores,
  scorePointOnBackend,
  undoPointOnBackend,
  recordFaultOnBackend,
  updateMatchStatusOnBackend,
  resetMatchOnBackend,
  switchServerOnBackend,
} from "../../badminton/services/badmintonApiService"
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

  const isBadmintonMatch = !matchData?.sport || matchData.sport.toLowerCase() === "badminton"

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

  // Load authoritative match data with authorization check and automatic retry
  const loadMatch = useCallback(async (retryCount = 0) => {
    try {
      setErrorState(null)

      // 1. Authoritative backend fetch first
      try {
        const backendMatch = await fetchBadmintonMatchById(matchId)
        if (backendMatch) {
          if (!canAdminAccessMatch(currentUser, matchId, backendMatch)) {
            throw new Error(`FORBIDDEN: User "${currentUser.name}" is not authorized to manage this match.`)
          }
          setMatchData(backendMatch)
          try {
            saveStoredMatches([backendMatch])
          } catch (_) {}
          const evtLog = await fetchBadmintonMatchEvents(matchId)
          setEvents(evtLog || [])
          return
        }
      } catch (backendErr) {
        if (backendErr.message && backendErr.message.startsWith("FORBIDDEN")) {
          throw backendErr
        }
        console.warn("Backend fetch failed, checking fallbacks:", backendErr)
      }

      // 2. Try schedule lookup if single match lookup was empty
      try {
        const allSched = await fetchBadmintonSchedule("ALL")
        if (Array.isArray(allSched)) {
          const found = allSched.find(
            (m) =>
              String(m.id) === String(matchId) ||
              m.id === `badminton-${matchId}` ||
              (m.id.startsWith("badminton-") && m.id.replace("badminton-", "") === String(matchId))
          )
          if (found) {
            if (!canAdminAccessMatch(currentUser, matchId, found)) {
              throw new Error(`FORBIDDEN: User "${currentUser.name}" is not authorized to manage this match.`)
            }
            setMatchData(found)
            try {
              saveStoredMatches([found])
            } catch (_) {}
            const evtLog = await fetchBadmintonMatchEvents(matchId)
            setEvents(evtLog || [])
            return
          }
        }
      } catch (schedErr) {
        if (schedErr.message && schedErr.message.startsWith("FORBIDDEN")) {
          throw schedErr
        }
      }

      // 3. Fallback to local authoritative store
      try {
        const { match, events: evtLog } = getAuthorizedMatch(currentUser, matchId)
        if (match) {
          setMatchData(match)
          setEvents(evtLog || [])
          return
        }
      } catch (_) {}

      // Retry up to 2 times with a 600ms delay in case backend is initializing
      if (retryCount < 2) {
        await new Promise((r) => setTimeout(r, 600))
        return loadMatch(retryCount + 1)
      }

      throw new Error(`NOT_FOUND: Match with ID "${matchId}" not found.`)
    } catch (err) {
      console.error("Authorization or loading error:", err)
      setErrorState(err.message || "Failed to load match.")
    }
  }, [currentUser, matchId])

  useEffect(() => {
    loadMatch()
  }, [loadMatch])

  // Real-time synchronization across browser windows via WebSockets
  useEffect(() => {
    const unsubscribe = subscribeToBadmintonLiveScores((updatedMatch) => {
      if (updatedMatch && String(updatedMatch.id) === String(matchId)) {
        setMatchData(updatedMatch)
        fetchBadmintonMatchEvents(matchId).then((evts) => {
          if (Array.isArray(evts)) setEvents(evts)
        })
      }
    }, matchId)

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [matchId])

 
  


const handleRecordFault = async (faultData) => {
  if (isPending) return false
  setIsPending(true)

  try {
    if (isBadmintonMatch) {
      const res = await recordFaultOnBackend(matchId, faultData)
      if (res && res.match) {
        setMatchData(res.match)
        setEvents(res.events || [])
        setFeedbackMsg({
          type: "success",
          text: "Fault recorded successfully on server.",
        })
        return true
      }
    }

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
      text: err.message || "Failed to record fault on server.",
    })
    return false
  } finally {
    setIsPending(false)
  }
}

  // Handle score events
  const handleScoringAction = async (actionPayload) => {
    try {
      setIsPending(true)

      if (isBadmintonMatch) {
        const res = await scorePointOnBackend(matchId, {
          side: actionPayload.side,
          actionDetail: actionPayload.actionDetail || actionPayload.type || "Rally Point",
        })
        if (res && res.match) {
          setMatchData(res.match)
          setEvents(res.events || [])
          setFeedbackMsg({
            type: "success",
            text: `Score updated: ${actionPayload.actionDetail || "Point awarded"}`,
          })
          setTimeout(() => setFeedbackMsg(null), 2500)
          return
        }
      }

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
        text: err.message || "Failed to update score on server.",
      })
      setTimeout(() => setFeedbackMsg(null), 4000)
    } finally {
      setIsPending(false)
    }
  }

  // Handle compensating undo
  const handleUndo = async () => {
    try {
      setIsPending(true)

      if (isBadmintonMatch) {
        const res = await undoPointOnBackend(matchId)
        if (res && res.match) {
          setMatchData(res.match)
          setEvents(res.events || [])
          setFeedbackMsg({
            type: "success",
            text: "Action successfully undone and compensated on server.",
          })
          setTimeout(() => setFeedbackMsg(null), 2500)
          return
        }
      }

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
  const handleCompleteMatch = async () => {
    try {
      setIsPending(true)

      if (isBadmintonMatch) {
        const res = await updateMatchStatusOnBackend(matchId, "COMPLETED")
        if (res && res.match) {
          setMatchData(res.match)
          setEvents(res.events || [])
          setFeedbackMsg({
            type: "success",
            text: "Match finalized and locked on server.",
          })
          return
        }
      }

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
        text: err.message || "Failed to complete match on server.",
      })
    } finally {
      setIsPending(false)
    }
  }

  // Handle resetting match scores back to 0-0
  const handleResetMatch = async () => {
    try {
      setIsPending(true)

      if (isBadmintonMatch) {
        const res = await resetMatchOnBackend(matchId)
        if (res && res.match) {
          setMatchData(res.match)
          setEvents(res.events || [])
          setFeedbackMsg({
            type: "success",
            text: "Match scores reset to 0-0 on server.",
          })
          setTimeout(() => setFeedbackMsg(null), 3000)
          return
        }
      }

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
  const handleSwitchServer = async (side, court) => {
    try {
      setIsPending(true)

      if (isBadmintonMatch) {
        const res = await switchServerOnBackend(matchId, { side, court })
        if (res && res.match) {
          setMatchData(res.match)
          setEvents(res.events || [])
          setFeedbackMsg({
            type: "success",
            text: `Service switched to Team ${res.match.servingSide} (${res.match.servingCourt} Box)`,
          })
          setTimeout(() => setFeedbackMsg(null), 2500)
          return
        }
      }

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
        text: err.message || "Failed to switch server on server.",
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
            User <span className="text-white font-bold">{currentUser.name}</span> is not authorized to manage match ID: <span className="text-rose-400 font-bold">{matchId}</span>.
          </p>

          <p className="mt-3 text-gray-400 text-xs font-mono">
            Only the authenticated Badminton Administrator can officiate this match.
          </p>

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

  // Error or Not Found state
  if (errorState) {
    return (
      <div className="min-h-screen bg-[#080D18] text-[#F4F6FA] flex flex-col items-center justify-center p-6">
        <div className="border border-white/10 bg-[#0F1A2D] p-8 sm:p-10 rounded-lg max-w-lg w-full text-center shadow-2xl">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto text-amber-400 mb-4">
            <AlertCircle size={32} />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            MATCH NOT FOUND
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-[#8491A7] font-mono leading-relaxed">
            Match ID <span className="text-amber-400 font-bold">{matchId}</span> could not be found. It may have been completed, deleted, or yet to be created.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => loadMatch(0)}
              className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded text-xs font-mono font-bold transition cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>RETRY LOAD</span>
            </button>
            <Link
              to="/sport-admin"
              className="inline-flex items-center justify-center gap-2 border border-[#07F080] bg-[#07F080] hover:bg-[#07F080]/90 text-black px-5 py-2.5 rounded text-xs font-mono font-bold"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO MATCH OPERATIONS</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
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
            {isBadmintonMatch && (
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
