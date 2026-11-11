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
} from "../../badminton/services/badmintonApiService"

const MATCHES_STORAGE_KEY = "gsv_admin_matches_store_v4"
const EVENTS_STORAGE_KEY = "gsv_match_events_store_v4"

// Default initial matches seed

const INITIAL_MATCHES_SEED = [


  {
    id: "throwball-m1",
    sport: "throwball",
    sportLabel: "Throwball",
    tournament: "GSV Inter-Department Throwball Cup 2026",
    stage: "Women's / Open · Match 01",
    court: "Throwball Court 01",
    status: "LIVE",
    assignedAdminId: "admin-throwball",
    assignedAdminName: "Throwball Admin",
    version: 1,

    teamA: {
      id: "throwball-team-a",
      name: "Rajdhani Eagles",
      shortName: "EAGLES",
      color: "#FFAE00",
      score: 0,
      setsWon: 0,
      players: [],
    },

    teamB: {
      id: "throwball-team-b",
      name: "Duronto Bulls",
      shortName: "BULLS",
      color: "#35C5F4",
      score: 0,
      setsWon: 0,
      players: [],
    },

    periodLabel: "SET 1",
    currentSet: 1,
    setHistory: [],
    pointsTarget: 25,
    winningMargin: 2,
    bestOfSets: 3,

    stats: {
      teamA: { serviceErrors: 0, faults: 0 },
      teamB: { serviceErrors: 0, faults: 0 },
    },

    faults: [],
    scheduledTime: "11:00 AM Today",
    venue: "Throwball Court 01",
  },


  {
    id: "badminton-1",
    sport: "badminton",
    sportLabel: "Badminton",
    tournament: "GSV Open Badminton Championship 2026",
    stage: "Men's Singles · Semifinals",
    court: "Badminton Court 01",
    status: "LIVE",
    servingSide: "A",
    servingCourt: "RIGHT",
    assignedAdminId: "admin-arav",
    assignedAdminName: "Arav Kumar",
    version: 1,
    teamA: {
      id: "player-arav",
      name: "Arav Kumar",
      shortName: "ARAV",
      color: "#FFAE00",
      score: 0,
      setsWon: 0,
      players: ["Arav Kumar"],
    },
    teamB: {
      id: "player-rahul",
      name: "Rahul Sharma",
      shortName: "RAHUL",
      color: "#35C5F4",
      score: 0,
      setsWon: 0,
      players: ["Rahul Sharma"],
    },
    periodLabel: "SET 1",
    currentSet: 1,
    setHistory: [],
    stats: {
      teamA: { kills: 0, aces: 0, blocks: 0, errors: 0 },
      teamB: { kills: 0, aces: 0, blocks: 0, errors: 0 },
    },
    faults: [],
    scheduledTime: "09:00 AM Today",
    venue: "Indoor Sports Complex · Court 1",
  },
  {
    id: "badminton-2",
    sport: "badminton",
    sportLabel: "Badminton",
    tournament: "GSV Open Badminton Championship 2026",
    stage: "Women's Singles · Semifinals",
    court: "Badminton Court 02",
    status: "LIVE",
    servingSide: "A",
    servingCourt: "RIGHT",
    assignedAdminId: "admin-arav",
    assignedAdminName: "Arav Kumar",
    version: 1,
    teamA: {
      id: "player-isha",
      name: "Isha Mehta",
      shortName: "ISHA",
      color: "#FFAE00",
      score: 0,
      setsWon: 0,
      players: ["Isha Mehta"],
    },
    teamB: {
      id: "player-naina",
      name: "Naina Rao",
      shortName: "NAINA",
      color: "#35C5F4",
      score: 0,
      setsWon: 0,
      players: ["Naina Rao"],
    },
    periodLabel: "SET 1",
    currentSet: 1,
    setHistory: [],
    stats: {
      teamA: { kills: 0, aces: 0, blocks: 0, errors: 0 },
      teamB: { kills: 0, aces: 0, blocks: 0, errors: 0 },
    },
    faults: [],
    scheduledTime: "09:30 AM Today",
    venue: "Indoor Sports Complex · Court 2",
  },
  {
    id: "badminton-3",
    sport: "badminton",
    sportLabel: "Badminton",
    tournament: "GSV Open Badminton Championship 2026",
    stage: "Men's Doubles · Semifinals",
    court: "Badminton Court 03",
    status: "LIVE",
    servingSide: "A",
    servingCourt: "RIGHT",
    assignedAdminId: "admin-arav",
    assignedAdminName: "Arav Kumar",
    version: 1,
    teamA: {
      id: "team-rohan-dev",
      name: "Rohan / Dev",
      shortName: "ROH/DEV",
      color: "#FFAE00",
      score: 0,
      setsWon: 0,
      players: ["Rohan Gupta", "Dev Malhotra"],
    },
    teamB: {
      id: "team-karan-vihaan",
      name: "Karan / Vihaan",
      shortName: "KAR/VIH",
      color: "#35C5F4",
      score: 0,
      setsWon: 0,
      players: ["Karan Patel", "Vihaan Joshi"],
    },
    periodLabel: "SET 1",
    currentSet: 1,
    setHistory: [],
    stats: {
      teamA: { kills: 0, aces: 0, blocks: 0, errors: 0 },
      teamB: { kills: 0, aces: 0, blocks: 0, errors: 0 },
    },
    faults: [],
    scheduledTime: "10:00 AM Today",
    venue: "Indoor Sports Complex · Court 3",
  },
  {
    id: "cricket-m1",
    sport: "cricket",
    sportLabel: "Cricket",
    tournament: "GSV Inter-Department T20 Trophy",
    stage: "Super 4 · Match 01",
    court: "Main Oval Ground, Pitch 1",
    status: "LIVE",
    assignedAdminId: "admin-vikram",
    assignedAdminName: "Vikram Sengupta",
    version: 1,
    teamA: {
      id: "csw",
      name: "Computer Science Warriors",
      shortName: "CSW",
      color: "#FFAE00",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      isBatting: true,
    },
    teamB: {
      id: "mec",
      name: "Mechanical Titans",
      shortName: "MEC",
      color: "#35C5F4",
      runs: 0,
      wickets: 0,
      overs: "0.0",
      isBatting: false,
    },
    periodLabel: "INNINGS 1",
    target: null,
    runsNeeded: null,
    ballsRemaining: 120,
    currentOverBalls: [],
    striker: "",
    nonStriker: "",
    bowler: "",
    stats: {
      teamA: { extras: 0, boundaries: 0, runRate: "0.00" },
      teamB: { extras: 0, boundaries: 0, runRate: "0.00" },
    },
    faults: [],
    scheduledTime: "02:30 PM Today",
    venue: "Main Oval Ground, Pitch 1",
  },
  {
    id: "bb-game-1",
    sport: "basketball",
    sportLabel: "Basketball",
    tournament: "GSV Hoops Classic 2026-27",
    stage: "Championship Semifinal A",
    court: "North Hardcourt Complex · Court 1",
    status: "LIVE",
    assignedAdminId: "admin-tariq",
    assignedAdminName: "Tariq Al-Mansoor",
    version: 1,
    teamA: {
      id: "h3-ballers",
      name: "Hostel 3 Ballers",
      shortName: "H3B",
      color: "#FFAE00",
      score: 0,
      fouls: 0,
      timeouts: 0,
      quarters: [0, 0, 0, 0],
    },
    teamB: {
      id: "civ-dunkers",
      name: "Civil Slammers",
      shortName: "CSL",
      color: "#35C5F4",
      score: 0,
      fouls: 0,
      timeouts: 0,
      quarters: [0, 0, 0, 0],
    },
    periodLabel: "Q1",
    clock: "10:00",
    stats: {
      teamA: { threePointers: 0, fieldGoals: 0, freeThrows: 0 },
      teamB: { threePointers: 0, fieldGoals: 0, freeThrows: 0 },
    },
    faults: [],
    scheduledTime: "06:30 PM Today",
    venue: "North Hardcourt Complex · Court 1",
  },
]

/**
 * Initialize / Read persistent matches
 */

function loadStoredMatches() {
  try {
    const raw = localStorage.getItem(MATCHES_STORAGE_KEY)

    if (raw) {
      const storedMatches = JSON.parse(raw)

      if (!Array.isArray(storedMatches)) {
        throw new Error("Invalid stored matches format.")
      }

      // Add newly introduced demo matches without resetting existing scores.
      const storedIds = new Set(storedMatches.map((match) => match.id))
      const missingMatches = INITIAL_MATCHES_SEED.filter(
        (match) => !storedIds.has(match.id)
      )

      if (missingMatches.length > 0) {
        const migratedMatches = [...storedMatches, ...missingMatches]
        saveStoredMatches(migratedMatches)
        return migratedMatches
      }

      return storedMatches
    }
  } catch (err) {
    console.error("Failed to load matches store:", err)
  }

  saveStoredMatches(INITIAL_MATCHES_SEED)
  return INITIAL_MATCHES_SEED
}


function saveStoredMatches(matches) {
  try {
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches))
  } catch (err) {
    console.error("Failed to save matches store:", err)
  }
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

    // Award one rally point to the selected player.
    if (actionData.side === "A") {
      match.teamA = {
        ...match.teamA,
        score: match.teamA.score + 1,
      }
      description = `Point to ${match.teamA.name} (${actionData.actionDetail || "Rally Point"})`

      if (match.stats?.teamA) {
        match.stats.teamA.kills = (match.stats.teamA.kills || 0) + 1
      }
    } else if (actionData.side === "B") {
      match.teamB = {
        ...match.teamB,
        score: match.teamB.score + 1,
      }
      description = `Point to ${match.teamB.name} (${actionData.actionDetail || "Rally Point"})`

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
      description += ` — Set ${match.currentSet} won by ${winner.name}!`

      // Best of 3: first player to win 2 sets wins the match.
      if (winner.setsWon >= 2) {
        match.status = "COMPLETED"
        match.winner = winner.name
        match.periodLabel = "MATCH COMPLETED"
        description += ` Match won by ${winner.name}!`
      } else {
        // Start the next set only when the match is not over.
        match.currentSet += 1
        match.periodLabel = `SET ${match.currentSet}`
        match.teamA.score = 0
        match.teamB.score = 0
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
