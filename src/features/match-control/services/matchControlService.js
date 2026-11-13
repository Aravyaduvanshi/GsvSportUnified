/**
 * Match Control Service
 * Handles match state persistence, authoritative authorization checks,
 * sport-specific score rules, persistent event logging, and compensating undo.
 */


import { canAdminAccessMatch } from "./adminAuthService"
import {
  scorePointOnBackend,
  undoPointOnBackend,
  recordFaultOnBackend,
  updateMatchStatusOnBackend,
  resetMatchOnBackend,
  switchServerOnBackend,
  createMatchOnBackend,
  deleteMatchOnBackend,
  correctScoreOnBackend,
} from "../../badminton/services/badmintonApiService"

// Local cache storage keys for instant responsiveness and resilience
const MATCHES_STORAGE_KEY = "gsv_admin_matches_store_v6"
const EVENTS_STORAGE_KEY = "gsv_match_events_store_v6"

/**
 * Initialize / Read cached matches
 */
export function loadStoredMatches() {
  try {
    const raw = localStorage.getItem(MATCHES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error("Failed to load matches from storage:", err)
  }
  return []
}

export function saveStoredMatches(matches) {
  try {
    if (!Array.isArray(matches)) return
    const existing = loadStoredMatches()
    const map = new Map()
    for (const m of existing) {
      if (m && m.id) map.set(String(m.id), m)
    }
    for (const m of matches) {
      if (m && m.id) {
        if (m.status === "DELETED") {
          map.delete(String(m.id))
        } else {
          map.set(String(m.id), m)
        }
      }
    }
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(Array.from(map.values())))
  } catch (err) {
    console.error("Failed to save matches to storage:", err)
  }
}

export function removeStoredMatch(matchId) {
  try {
    const existing = loadStoredMatches()
    const filtered = existing.filter(m => m && String(m.id) !== String(matchId) && String(m.id) !== `badminton-${matchId}`)
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(filtered))
  } catch (_) {}
}

/**
 * Load / Save Event Log
 */
function loadStoredEvents(matchId) {
  try {
    const raw = localStorage.getItem(`${EVENTS_STORAGE_KEY}_${matchId}`)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.error("Failed to load events for match:", matchId, err)
  }
  // Seed initial event if empty
  const initialEvent = [
    {
      id: `evt-init-${matchId}`,
      matchId,
      timestamp: new Date().toISOString(),
      formattedTime: "Match Active",
      adminName: "System",
      actionType: "MATCH_INIT",
      description: "Match active in scoring console.",
      prevScore: null,
      newScore: "Live State",
      isReversed: false,
    },
  ]
  return initialEvent
}

function saveStoredEvents(matchId, events) {
  try {
    localStorage.setItem(`${EVENTS_STORAGE_KEY}_${matchId}`, JSON.stringify(events))
  } catch (err) {
    console.error("Failed to save events for match:", matchId, err)
  }
}

/**
 * Get matches assigned to the authenticated admin.
 * Enforces assignment boundaries: only returns matches user has rights to.
 */
export function getAssignedMatches(user, filters = {}) {
  if (!user) return []

  const matches = loadStoredMatches()

  // Authorization filter: Super admin sees all, Assigned admin only sees their assigned matches
  const authorized = matches.filter((m) => canAdminAccessMatch(user, m.id))

  // Apply optional UI filters
  return authorized.filter((m) => {
    const matchesStatus =
      !filters.status || filters.status === "ALL" || m.status === filters.status
    const matchesSport =
      !filters.sport || filters.sport === "ALL" || m.sport === filters.sport.toLowerCase()
    return matchesStatus && matchesSport
  })
}

function findMatchIndex(matches, matchId) {
  return matches.findIndex(
    (m) =>
      m.id === matchId ||
      m.id === `badminton-${matchId}` ||
      (m.id.startsWith("badminton-") && m.id.replace("badminton-", "") === matchId)
  )
}

/**
 * Retrieve a single match with strict server-side authorization check.
 */
export function getAuthorizedMatch(user, matchId) {
  if (!user) {
    throw new Error("UNAUTHENTICATED: Please log in as an administrator.")
  }

  if (!canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not assigned to manage this match.")
  }

  const matches = loadStoredMatches()
  const found = matches.find(
    (m) =>
      m.id === matchId ||
      m.id === `badminton-${matchId}` ||
      (m.id.startsWith("badminton-") && m.id.replace("badminton-", "") === matchId)
  )

  if (!found) {
    throw new Error("NOT_FOUND: The requested match does not exist.")
  }

  const events = loadStoredEvents(matchId)
  return { match: found, events }
}

/**
 * Apply a scoring event to a match.
 * Validates match state, updates score, appends to event log, and persists atomically.
 */



function validateScoringAction(match, actionData) {
  if (!actionData || typeof actionData !== "object") {
    throw new Error("INVALID_ACTION: A scoring action is required.")
  }

  if (match.sport === "badminton") {
    if (!["A", "B"].includes(actionData.side)) {
      throw new Error("INVALID_SIDE: Select Team A or Team B.")
    }
    return
  }

  if (match.sport === "cricket") {
    if (!["RUNS", "WICKET", "EXTRA"].includes(actionData.actionType)) {
      throw new Error("INVALID_ACTION: Unsupported cricket action.")
    }

    if (actionData.actionType === "RUNS") {
      const runs = Number(actionData.runs)
      if (!Number.isInteger(runs) || runs < 0) {
        throw new Error("INVALID_RUNS: Runs must be a non-negative integer.")
      }
    }

    if (actionData.actionType === "EXTRA") {
      const extraRuns = Number(actionData.extraRuns)
      if (!Number.isInteger(extraRuns) || extraRuns < 1) {
        throw new Error("INVALID_EXTRA: Extra runs must be a positive integer.")
      }

      if (!["Wide", "No-Ball"].includes(actionData.extraType)) {
        throw new Error("INVALID_EXTRA: Select Wide or No-Ball.")
      }
    }
    return
  }

  if (match.sport === "basketball") {
    if (!["A", "B"].includes(actionData.side)) {
      throw new Error("INVALID_SIDE: Select Team A or Team B.")
    }

    const points = Number(actionData.points)
    if (![1, 2, 3].includes(points)) {
      throw new Error("INVALID_POINTS: Basketball scoring must be 1, 2, or 3 points.")
    }
    return
  }


  if (match.sport === "throwball") {
    if (!["A", "B"].includes(actionData.side)) {
      throw new Error("INVALID_SIDE: Select Team A or Team B.")
    }

    if (actionData.actionType !== "POINT") {
      throw new Error("INVALID_ACTION: Unsupported throwball action.")
    }

    return
  }


  throw new Error("UNSUPPORTED_SPORT: This match sport is not supported.")
}


/**
 * fault recording for a match.
 
 */

export function recordMatchFault(user, matchId, faultData) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to record faults.")
  
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)

  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = JSON.parse(JSON.stringify(matches[matchIndex]))

  if (match.status === "COMPLETED") {
    throw new Error("MATCH_COMPLETED: Fault recording is locked.")
  }

  if (!["A", "B"].includes(faultData?.side)) {
    throw new Error("INVALID_SIDE: Select a team.")
  }

  if (!faultData?.type?.trim()) {
    throw new Error("INVALID_FAULT: Select a fault type.")
  }

  const team = faultData.side === "A" ? match.teamA : match.teamB
  const now = new Date()

  const fault = {
    id: `fault-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    team: team.name,
    side: faultData.side,
    type: faultData.type.trim(),
    notes: faultData.notes?.trim() || "",
    adminId: user.id,
    adminName: user.name,
    timestamp: now.toISOString(),
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    set: match.currentSet ?? null,
    over: match.teamA.isBatting
      ? match.teamA.overs
      : match.teamB.overs,
  }

  match.faults = [...(match.faults || []), fault]
  match.version = (match.version || 1) + 1

  matches[matchIndex] = match
  saveStoredMatches(matches)

  const events = loadStoredEvents(matchId)

  events.unshift({
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    matchId,
    timestamp: now.toISOString(),
    formattedTime: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    adminId: user.id,
    adminName: user.name,
    actionType: "FAULT_RECORDED",
    description: `${fault.type} recorded for ${team.name}${fault.notes ? `: ${fault.notes}` : ""}`,
    prevScore: null,
    newScore: null,
    payload: fault,
    isReversed: false,
  })

  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    recordFaultOnBackend(matchId, faultData).catch((err) => {
      console.warn("Backend sync notice (recordFault):", err.message)
    })
  }

  return { match, events }
}

export function applyScoringEvent(user, matchId, actionData) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to score this match.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = { ...matches[matchIndex] }

  // Save the complete match state before this scoring action.
// This includes scores, sets, overs, wickets, stats, and event-related data.
 const previousMatchState = JSON.parse(JSON.stringify(match))

  if (match.status === "COMPLETED") {
    throw new Error("MATCH_COMPLETED: Match is concluded. Ordinary scoring is locked.")
  }

  validateScoringAction(match, actionData)

  const prevScore = {
    teamA: match.sport === "cricket" ? `${match.teamA.runs}/${match.teamA.wickets}` : match.teamA.score,
    teamB: match.sport === "cricket" ? `${match.teamB.runs}/${match.teamB.wickets}` : match.teamB.score,
  }

  let description = ""
  let deltaType = actionData.type || "POINT"

  
  // 1. Badminton Scoring Logic
  if (match.sport === "badminton") {
    // Do not allow scoring after the match has been decided.
    if (match.teamA.setsWon >= 2 || match.teamB.setsWon >= 2) {
      throw new Error("MATCH_COMPLETED: A player has already won the match.")
    }

    const rawDetail = actionData.actionDetail === "Error" ? "Opponent Error" : (actionData.actionDetail || "Rally Point")

    // Award one rally point to the selected player.
    if (actionData.side === "A") {
      match.teamA = {
        ...match.teamA,
        score: match.teamA.score + 1,
      }
      match.score1 = match.teamA.score
      description = `Point to ${match.teamA.name} (${rawDetail})`

      if (match.stats?.teamA) {
        match.stats.teamA.kills = (match.stats.teamA.kills || 0) + 1
      }
    } else if (actionData.side === "B") {
      match.teamB = {
        ...match.teamB,
        score: match.teamB.score + 1,
      }
      match.score2 = match.teamB.score
      description = `Point to ${match.teamB.name} (${rawDetail})`

      if (match.stats?.teamB) {
        match.stats.teamB.kills = (match.stats.teamB.kills || 0) + 1
      }
    } else {
      throw new Error("INVALID_SIDE: Select Team A or Team B.")
    }

    // Update serving side and service court (Even score: Right Box, Odd score: Left Box)
    match.servingSide = actionData.side
    const serverScore = actionData.side === "A" ? match.teamA.score : match.teamB.score
    match.servingCourt = serverScore % 2 === 0 ? "RIGHT" : "LEFT"

    const sA = match.teamA.score
    const sB = match.teamB.score

    // A set is won at 21 with a 2-point lead, or at 30 points.
    let setWinner = null

    if ((sA >= 21 && sA - sB >= 2) || sA === 30) {
      setWinner = "A"
    } else if ((sB >= 21 && sB - sA >= 2) || sB === 30) {
      setWinner = "B"
    }

    if (setWinner) {
      const winner = setWinner === "A" ? match.teamA : match.teamB

      // Save the completed set's final score before resetting.
      match.setHistory = [
        ...(match.setHistory || []),
        {
          set: match.currentSet,
          scoreA: sA,
          scoreB: sB,
          winner: winner.name,
        },
      ]

      winner.setsWon += 1
      match.setsWon1 = match.teamA.setsWon
      match.setsWon2 = match.teamB.setsWon
      description += ` — Set ${match.currentSet} won by ${winner.name}!`

      // Best of 3: first player to win 2 sets wins the match.
      if (winner.setsWon >= 2) {
        match.status = "COMPLETED"
        match.winner = winner.name
        match.periodLabel = "MATCH COMPLETED"
        description += ` Match won by ${winner.name}!`
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("gsv_match_completed", { detail: match }))
        }
      } else {
        // Start the next set only when the match is not over.
        match.currentSet += 1
        match.periodLabel = `SET ${match.currentSet}`
        match.teamA.score = 0
        match.teamB.score = 0
        match.score1 = 0
        match.score2 = 0
        match.servingSide = setWinner
        match.servingCourt = "RIGHT"
      }
    }
  }


  // 2. Cricket Scoring Logic
  else if (match.sport === "cricket") {
    const battingTeam = match.teamB.isBatting ? "teamB" : "teamA"
    const currentBatting = match[battingTeam]

    if (actionData.actionType === "RUNS") {
      const runsScored = parseInt(actionData.runs, 10) || 0
      currentBatting.runs += runsScored
      description = `${runsScored} run${runsScored !== 1 ? "s" : ""} scored off delivery`
      if (runsScored === 4 || runsScored === 6) {
        description += ` (Boundary!)`
      }
      match.currentOverBalls = [...(match.currentOverBalls || []), `${runsScored}`].slice(-6)
      if (match.runsNeeded) {
        match.runsNeeded = Math.max(0, match.runsNeeded - runsScored)
        match.ballsRemaining = Math.max(0, match.ballsRemaining - 1)
      }
    } else if (actionData.actionType === "WICKET") {
      currentBatting.wickets += 1
      description = `WICKET! ${actionData.dismissal || "Batter dismissed"}`
      match.currentOverBalls = [...(match.currentOverBalls || []), "W"].slice(-6)
      if (match.ballsRemaining) {
        match.ballsRemaining = Math.max(0, match.ballsRemaining - 1)
      }
      match.faults.push({
        id: `w-${Date.now()}`,
        team: currentBatting.name,
        type: `Wicket (${actionData.dismissal || "Bowled"})`,
        over: currentBatting.overs,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      })
    } else if (actionData.actionType === "EXTRA") {
      const extraRuns = parseInt(actionData.extraRuns, 10) || 1
      currentBatting.runs += extraRuns
      description = `Extra: ${actionData.extraType} (+${extraRuns} run)`
      match.currentOverBalls = [...(match.currentOverBalls || []), actionData.extraType === "Wide" ? "Wd" : "Nb"].slice(-6)
      if (match.runsNeeded) {
        match.runsNeeded = Math.max(0, match.runsNeeded - extraRuns)
      }
    }
  }

  // 3. Basketball Scoring Logic
  else if (match.sport === "basketball") {
    const points = parseInt(actionData.points, 10) || 1
    if (actionData.side === "A") {
      match.teamA = { ...match.teamA, score: match.teamA.score + points }
      description = `+${points} PTS (${actionData.pointType || "Field Goal"}) for ${match.teamA.name}`
    } else {
      match.teamB = { ...match.teamB, score: match.teamB.score + points }
      description = `+${points} PTS (${actionData.pointType || "Field Goal"}) for ${match.teamB.name}`
    }
  }


if (match.sport === "throwball") {
  if (match.teamA.setsWon >= 2 || match.teamB.setsWon >= 2) {
    throw new Error("MATCH_COMPLETED: This throwball match is over.")
  }

  const side = actionData.side
  const scoringTeam = side === "A" ? match.teamA : match.teamB
  const otherTeam = side === "A" ? match.teamB : match.teamA

  scoringTeam.score = (scoringTeam.score || 0) + 1

  description = `Point to ${scoringTeam.name} (Throwball Point)`

  const target = match.pointsTarget || 25
  const margin = match.winningMargin || 2

  const setWon =
    scoringTeam.score >= target &&
    scoringTeam.score - otherTeam.score >= margin

  if (setWon) {
    const finishedScoreA = match.teamA.score
    const finishedScoreB = match.teamB.score

    match.setHistory = [
      ...(match.setHistory || []),
      {
        set: match.currentSet || 1,
        scoreA: finishedScoreA,
        scoreB: finishedScoreB,
        winner: scoringTeam.name,
      },
    ]

    scoringTeam.setsWon = (scoringTeam.setsWon || 0) + 1

    description += ` — Set ${match.currentSet || 1} won by ${scoringTeam.name}!`

    if (scoringTeam.setsWon >= 2) {
      match.status = "COMPLETED"
      match.winner = scoringTeam.name
      match.periodLabel = "MATCH COMPLETED"
      description += ` Match won by ${scoringTeam.name}!`
    } else {
      match.currentSet = (match.currentSet || 1) + 1
      match.periodLabel = `SET ${match.currentSet}`
      match.teamA.score = 0
      match.teamB.score = 0
    }
  }
}


  const newScore = {
    teamA: match.sport === "cricket" ? `${match.teamA.runs}/${match.teamA.wickets}` : match.teamA.score,
    teamB: match.sport === "cricket" ? `${match.teamB.runs}/${match.teamB.wickets}` : match.teamB.score,
  }

  match.version = (match.version || 1) + 1
  matches[matchIndex] = match
  saveStoredMatches(matches)

  // Append authoritative event to audit log
  const newEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: deltaType,
    description,
    prevScore,
    newScore,
    payload: actionData,
    isReversed: false,
    prevState: previousMatchState,
  }

  const events = loadStoredEvents(matchId)
  events.unshift(newEvent)
  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    scorePointOnBackend(matchId, actionData).catch((err) => {
      console.warn("Backend sync notice (scorePoint):", err.message)
    })
  }

  return { match, events }
}

/**
 * Undo the most recent accepted scoring action.
 * Restores previous score state and records a compensating reversal event.
 */
export function undoLastScoringEvent(user, matchId) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to modify this match.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  let match = { ...matches[matchIndex] }

  const events = loadStoredEvents(matchId)
  const targetEvent = events.find((e) => !e.isReversed && e.actionType !== "MATCH_INIT" && e.actionType !== "UNDO")

  if (!targetEvent || !targetEvent.prevScore) {
    throw new Error("NO_ACTION_TO_UNDO: No reversible scoring actions available in current session.")
  }

  // Restore scores

  // Restore the complete previous match state when available.
// Older events may not have a snapshot, so keep a compatibility fallback.
if (targetEvent.prevState) {
  const currentVersion = match.version || 1

  match = JSON.parse(JSON.stringify(targetEvent.prevState))

  // Keep the version increasing even when state is restored.
  match.version = currentVersion + 1
} else {
  // Backward compatibility for scoring events created before snapshots.
  if (match.sport === "badminton" || match.sport === "basketball") {
    match.teamA = {
      ...match.teamA,
      score: Number(targetEvent.prevScore.teamA),
    }

    match.teamB = {
      ...match.teamB,
      score: Number(targetEvent.prevScore.teamB),
    }
  } else if (match.sport === "cricket") {
    const [runsA, wktsA] = `${targetEvent.prevScore.teamA}`
      .split("/")
      .map(Number)

    const [runsB, wktsB] = `${targetEvent.prevScore.teamB}`
      .split("/")
      .map(Number)

    match.teamA = {
      ...match.teamA,
      runs: runsA,
      wickets: wktsA,
    }

    match.teamB = {
      ...match.teamB,
      runs: runsB,
      wickets: wktsB,
    }
  }

  match.version = (match.version || 1) + 1
}

  // Mark event as reversed
  targetEvent.isReversed = true

  // Record compensating audit event
  const undoEvent = {
    id: `evt-undo-${Date.now()}`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "UNDO",
    description: `Compensating Reversal: Undid "${targetEvent.description}"`,
    prevScore: targetEvent.newScore,
    newScore: targetEvent.prevScore,
    reversalTargetId: targetEvent.id,
    isReversed: false,
  }

  
  matches[matchIndex] = match
  saveStoredMatches(matches)

  events.unshift(undoEvent)
  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    undoPointOnBackend(matchId).catch((err) => {
      console.warn("Backend sync notice (undo):", err.message)
    })
  }

  return { match, events }
}

/**
 * Update match lifecycle status (e.g. COMPLETED or READY).
 */
export function updateMatchStatus(user, matchId, newStatus) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to update match status.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = { ...matches[matchIndex] }
  match.status = newStatus
  if (newStatus === "COMPLETED") {
    if (!match.winner) {
      match.winner = (match.teamA.score > match.teamB.score ? match.teamA.name : match.teamB.name)
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("gsv_match_completed", { detail: match }))
    }
  }
  match.version = (match.version || 1) + 1

  matches[matchIndex] = match
  saveStoredMatches(matches)

  const events = loadStoredEvents(matchId)
  events.unshift({
    id: `evt-status-${Date.now()}`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "STATUS_CHANGE",
    description: `Match status updated to ${newStatus} by ${user.name}`,
    prevScore: null,
    newScore: newStatus,
    isReversed: false,
  })
  saveStoredEvents(matchId, events)

  return { match, events }
}

/**
 * Assign a court to an upcoming match, set status to LIVE, and prepare it for scoring.
 * Enforces court collision validation.
 */
export function assignCourtAndStartMatch(user, matchId, courtName) {
  if (!user) throw new Error("UNAUTHENTICATED: Please log in as an administrator.")

  const matches = loadStoredMatches()

  // Validate court occupancy
  const ongoing = matches.find(
    (m) =>
      m.id !== matchId &&
      m.status === "LIVE" &&
      m.court &&
      m.court.trim().toLowerCase() === courtName.trim().toLowerCase()
  )
  if (ongoing) {
    throw new Error(
      `COURT_BUSY: ${courtName} currently has an ongoing LIVE match (${ongoing.teamA?.name || ongoing.player1} vs ${ongoing.teamB?.name || ongoing.player2}). Please complete it first or choose a free court.`
    )
  }

  const matchIndex = findMatchIndex(matches, matchId)
  let match
  if (matchIndex === -1) {
    // If not in matches store yet (e.g. from bracket), create and add it:
    match = {
      id: matchId,
      sport: "badminton",
      sportLabel: "Badminton",
      tournament: "GSV Badminton Championship 2026",
      stage: "Tournament Match",
      category: "Men's Singles",
      court: courtName,
      venue: courtName,
      status: "LIVE",
      assignedAdminId: user.id,
      assignedAdminName: user.name,
      version: 1,
      teamA: {
        id: `${matchId}-team-a`,
        name: "Player 1",
        shortName: "P1",
        color: "#FFAE00",
        score: 0,
        setsWon: 0,
        players: ["Player 1"],
      },
      teamB: {
        id: `${matchId}-team-b`,
        name: "Player 2",
        shortName: "P2",
        color: "#35C5F4",
        score: 0,
        setsWon: 0,
        players: ["Player 2"],
      },
      player1: "Player 1",
      player2: "Player 2",
      score1: 0,
      score2: 0,
      periodLabel: "SET 1",
      currentSet: 1,
      setHistory: [],
      servingSide: "A",
      servingCourt: "RIGHT",
      stats: { teamA: { kills: 0 }, teamB: { kills: 0 } },
      faults: [],
    }
    matches.unshift(match)
  } else {
    match = { ...matches[matchIndex] }
    match.court = courtName
    match.venue = courtName
    match.status = "LIVE"
    match.version = (match.version || 1) + 1
    matches[matchIndex] = match
  }
  saveStoredMatches(matches)

  // Append audit event
  const events = loadStoredEvents(matchId)
  events.unshift({
    id: `evt-court-${Date.now()}`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "COURT_ASSIGNED",
    description: `Assigned to ${courtName} and started LIVE by ${user.name}`,
    prevScore: null,
    newScore: "LIVE",
    isReversed: false,
  })
  saveStoredEvents(matchId, events)

  return match
}

/**
 * Reset match scores to 0-0 (for restarts / fresh match officiation).
 */
export function resetMatchToZero(user, matchId) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to reset this match.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = { ...matches[matchIndex] }
  match.status = "LIVE"
  match.currentSet = 1
  match.periodLabel = "SET 1"
  match.winner = null
  match.servingSide = "A"
  match.servingCourt = "RIGHT"
  match.teamA = {
    ...match.teamA,
    score: 0,
    setsWon: 0,
  }
  match.teamB = {
    ...match.teamB,
    score: 0,
    setsWon: 0,
  }
  match.score1 = 0
  match.score2 = 0
  match.setsWon1 = 0
  match.setsWon2 = 0
  match.setHistory = []
  if (match.stats?.teamA) {
    match.stats.teamA = { kills: 0, aces: 0, blocks: 0, errors: 0 }
  }
  if (match.stats?.teamB) {
    match.stats.teamB = { kills: 0, aces: 0, blocks: 0, errors: 0 }
  }
  match.version = (match.version || 1) + 1

  matches[matchIndex] = match
  saveStoredMatches(matches)

  const resetEvent = {
    id: `evt-${Date.now()}-reset`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "RESET",
    description: `Match reset to 0-0 by ${user.name}`,
    prevScore: { teamA: 0, teamB: 0 },
    newScore: { teamA: 0, teamB: 0 },
    payload: {},
    isReversed: false,
  }

  const events = [resetEvent]
  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    resetMatchOnBackend(matchId).catch((err) => {
      console.warn("Backend sync notice (resetMatch):", err.message)
    })
  }

  return { match, events }
}

/**
 * Switch server and serving service box (Even score: Right Box, Odd score: Left Box).
 */
export function switchServerInMatch(user, matchId, { side, court } = {}) {
  if (!user || !canAdminAccessMatch(user, matchId)) {
    throw new Error("FORBIDDEN: You are not authorized to switch server.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = { ...matches[matchIndex] }
  const newSide = side || (match.servingSide === "A" ? "B" : "A")
  match.servingSide = newSide
  const serverScore = newSide === "A" ? match.teamA.score : match.teamB.score
  match.servingCourt = court || (serverScore % 2 === 0 ? "RIGHT" : "LEFT")
  match.version = (match.version || 1) + 1

  matches[matchIndex] = match
  saveStoredMatches(matches)

  const serverTeam = newSide === "A" ? match.teamA : match.teamB
  const srvEvent = {
    id: `evt-${Date.now()}-srv`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "SERVER_CHANGE",
    description: `Service switched to ${serverTeam.name} (${match.servingCourt} Service Box)`,
    prevScore: null,
    newScore: match.servingCourt,
    isReversed: false,
  }

  const events = loadStoredEvents(matchId)
  events.unshift(srvEvent)
  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    switchServerOnBackend(matchId, { side: newSide, court: match.servingCourt }).catch((err) => {
      console.warn("Backend sync notice (switchServer):", err.message)
    })
  }

  return { match, events }
}

/**
 * Create a new match dynamically (Admin only)
 */
export function createMatch(user, matchData) {
  if (!user || user.role === "user") {
    throw new Error("FORBIDDEN: Standard users cannot create matches.")
  }

  const matches = loadStoredMatches()
  const rawSport = (matchData.sport || "badminton").toLowerCase()
  const targetCourt = matchData.court || "Badminton Court 01"
  const targetStatus = matchData.status || "LIVE"

  // Check if court already has an ongoing LIVE match
  if (targetStatus === "LIVE") {
    const ongoingOnCourt = matches.find(
      (m) =>
        m.status === "LIVE" &&
        m.court &&
        m.court.trim().toLowerCase() === targetCourt.trim().toLowerCase()
    )
    if (ongoingOnCourt) {
      throw new Error(
        `COURT_BUSY: ${targetCourt} currently has an ongoing LIVE match (${ongoingOnCourt.teamA?.name} vs ${ongoingOnCourt.teamB?.name}). Please complete the current match or select another court.`
      )
    }
  }

  const newId = matchData.id || `${rawSport}-${Date.now()}`

  const player1 = matchData.player1 || matchData.teamA?.name || "Player 1"
  const player2 = matchData.player2 || matchData.teamB?.name || "Player 2"
  const partner1 = matchData.partner1 || null
  const partner2 = matchData.partner2 || null
  const isDoubles = Boolean(partner1 && partner2)

  const teamAName = isDoubles ? `${player1} / ${partner1}` : player1
  const teamBName = isDoubles ? `${player2} / ${partner2}` : player2

  const newMatch = {
    id: newId,
    sport: rawSport,
    sportLabel: rawSport.charAt(0).toUpperCase() + rawSport.slice(1),
    tournament: matchData.tournament || "GSV Badminton Championship 2026",
    stage: matchData.stage || "Quarter Final",
    category: matchData.category || (isDoubles ? "Men's Doubles" : "Men's Singles"),
    court: matchData.court || "Badminton Court 01",
    venue: matchData.venue || matchData.court || "Badminton Court 01",
    status: matchData.status || "LIVE",
    assignedAdminId: user.id,
    assignedAdminName: user.name,
    version: 1,
    teamA: {
      id: `${newId}-team-a`,
      name: teamAName,
      shortName: player1.slice(0, 5).toUpperCase(),
      color: "#FFAE00",
      score: 0,
      setsWon: 0,
      players: isDoubles ? [player1, partner1] : [player1],
    },
    teamB: {
      id: `${newId}-team-b`,
      name: teamBName,
      shortName: player2.slice(0, 5).toUpperCase(),
      color: "#35C5F4",
      score: 0,
      setsWon: 0,
      players: isDoubles ? [player2, partner2] : [player2],
    },
    player1,
    player2,
    score1: 0,
    score2: 0,
    setsWon1: 0,
    setsWon2: 0,
    periodLabel: "SET 1",
    currentSet: 1,
    setHistory: [],
    servingSide: "A",
    servingCourt: "RIGHT",
    isDoubles,
    doublesState: isDoubles
      ? {
          teamARightPlayer: player1,
          teamALeftPlayer: partner1,
          teamBRightPlayer: player2,
          teamBLeftPlayer: partner2,
          currentServerPlayer: player1,
          currentReceiverPlayer: player2,
        }
      : null,
    stats: {
      teamA: { kills: 0, aces: 0, errors: 0 },
      teamB: { kills: 0, aces: 0, errors: 0 },
    },
    faults: [],
    scheduledTime: matchData.scheduledTime || "Now · Live Court",
  }

  const updatedMatches = [newMatch, ...matches]
  saveStoredMatches(updatedMatches)

  // Initialize event log
  const initialEvent = [
    {
      id: `evt-init-${newId}`,
      matchId: newId,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      adminName: user.name,
      adminId: user.id,
      actionType: "MATCH_INIT",
      description: `Match created by ${user.name}: ${teamAName} vs ${teamBName} (${newMatch.category} on ${newMatch.court})`,
      prevScore: null,
      newScore: "0 - 0",
      isReversed: false,
    },
  ]
  saveStoredEvents(newId, initialEvent)

  // Async backend sync if badminton
  if (rawSport === "badminton") {
    createMatchOnBackend({
      id: newId,
      player1,
      player2,
      partner1,
      partner2,
      category: newMatch.category,
      court: newMatch.court,
      tournament: newMatch.tournament,
      stage: newMatch.stage,
      status: newMatch.status,
    }).catch((err) => {
      console.warn("Backend sync notice (createMatch):", err.message)
    })
  }

  return newMatch
}

/**
 * Delete a match (Admin only)
 */
export function deleteMatch(user, matchId) {
  if (!user || user.role === "user") {
    throw new Error("FORBIDDEN: Standard users cannot delete matches.")
  }

  const matches = loadStoredMatches()
  const match = matches.find((m) => m.id === matchId)
  if (match && !canAdminAccessMatch(user, matchId, match)) {
    throw new Error("FORBIDDEN: You are not assigned to manage this match.")
  }

  removeStoredMatch(matchId)

  try {
    localStorage.removeItem(`${EVENTS_STORAGE_KEY}_${matchId}`)
  } catch (e) {}

  deleteMatchOnBackend(matchId).catch((err) => {
    console.warn("Backend sync notice (deleteMatch):", err.message)
  })

  return true
}

/**
 * Authoritative score correction with mandatory reason
 */
export function correctMatchScore(user, matchId, { scoreA, scoreB, servingSide, servingCourt, reason }) {
  if (!user || user.role === "user") {
    throw new Error("FORBIDDEN: Standard users cannot correct scores.")
  }

  if (!reason || !reason.trim()) {
    throw new Error("REASON_REQUIRED: A valid audit explanation is mandatory for score corrections.")
  }

  const matches = loadStoredMatches()
  const matchIndex = findMatchIndex(matches, matchId)
  if (matchIndex === -1) {
    throw new Error("NOT_FOUND: Match not found.")
  }

  const match = { ...matches[matchIndex] }
  const prevScore = {
    teamA: match.teamA?.score ?? 0,
    teamB: match.teamB?.score ?? 0,
  }

  match.teamA = { ...match.teamA, score: Number(scoreA) }
  match.teamB = { ...match.teamB, score: Number(scoreB) }
  match.score1 = Number(scoreA)
  match.score2 = Number(scoreB)

  if (servingSide) match.servingSide = servingSide
  if (servingCourt) match.servingCourt = servingCourt

  match.version = (match.version || 1) + 1
  matches[matchIndex] = match
  saveStoredMatches(matches)

  const events = loadStoredEvents(matchId)
  events.unshift({
    id: `evt-corr-${Date.now()}`,
    matchId,
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    adminId: user.id,
    adminName: user.name,
    actionType: "SCORE_CORRECTION",
    description: `Administrative Score Correction: ${scoreA} - ${scoreB}. Reason: ${reason}`,
    prevScore,
    newScore: { teamA: Number(scoreA), teamB: Number(scoreB) },
    isReversed: false,
  })
  saveStoredEvents(matchId, events)

  if (match.sport === "badminton") {
    correctScoreOnBackend(matchId, { scoreA, scoreB, servingSide, servingCourt, reason }).catch((err) => {
      console.warn("Backend sync notice (correctScore):", err.message)
    })
  }

  return { match, events }
}
