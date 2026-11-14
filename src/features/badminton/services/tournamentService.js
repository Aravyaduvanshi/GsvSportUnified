/**
 * Tournament Bracket Service
 * Manages official tournament brackets (Quarterfinals -> Semifinals -> Final)
 * and automatically advances winning players to the next round upon match conclusion.
 */



/**
 * Get active tournaments list (Database is single source of truth)
 */
export function getActiveTournaments() {
  return []
}

export function saveActiveTournaments(list) {
  // Authoritative tournaments are saved to MongoDB via Spring Boot
}

/**
 * Load the current tournament bracket (Database is single source of truth)
 */
export function getTournamentBracket() {
  return []
}

/**
 * Save updated tournament bracket
 */
export function saveTournamentBracket(bracket) {
  // Authoritative brackets are built from MongoDB tournament and matches
}

function getRoundTitle(matchesCount) {
  if (matchesCount === 1) return "FINAL"
  if (matchesCount === 2) return "SEMIFINALS"
  if (matchesCount === 4) return "QUARTERFINALS"
  if (matchesCount === 8) return "ROUND OF 16"
  if (matchesCount === 16) return "ROUND OF 32"
  if (matchesCount === 32) return "ROUND OF 64"
  return `ROUND OF ${matchesCount * 2}`
}

function getRoundPrefix(matchesCount) {
  if (matchesCount === 1) return "fn"
  if (matchesCount === 2) return "sf"
  if (matchesCount === 4) return "qf"
  if (matchesCount === 8) return "r16_"
  if (matchesCount === 16) return "r32_"
  if (matchesCount === 32) return "r64_"
  return `r${matchesCount * 2}_`
}

/**
 * Create a new tournament bracket for ANY power of 2 (2, 4, 8, 16, 32, 64)
 * with Round 1 fixtures and automatic winner progression links across rounds!
 */
export function createTournament(user, {
  title = "GSV Badminton Championship 2026",
  category = "Men's Singles",
  bracketSize = 8,
  players = [],
}) {
  let size = typeof bracketSize === "number" ? bracketSize : parseInt(String(bracketSize).replace(/[^0-9]/g, ""), 10)
  if (isNaN(size) || size < 2) size = 8

  // Round up to nearest power of 2
  let power = 1
  while (power < size) power *= 2
  size = Math.min(power, 64)

  const defaultSeeds = [
    "Arav Kumar", "Rahul Sharma", "Dev Mehta", "Tushar Roy",
    "Karan Singh", "Vikram Sen", "Rohit Verma", "Sameer Patel",
    "Aditya Joshi", "Manish Paul", "Naveen Raj", "Siddharth Das",
    "Yash Mittal", "Pranav Nair", "Harsh Vardhan", "Deepak Gupta",
    "Amitabh Sen", "Chirag Shetty", "Lakshya Sen", "Srikanth Kidambi",
    "Satwiksairaj Rankireddy", "HS Prannoy", "Priyanshu Rajawat", "Kiran George",
    "Sai Praneeth", "Sourabh Verma", "Subhankar Dey", "Kartikey Gulshan",
    "Mithun Manjunath", "Alap Mishra", "Meiraba Luwang", "Ayush Shetty"
  ]

  const playerList = []
  for (let i = 0; i < size; i++) {
    playerList.push(players[i]?.trim() || defaultSeeds[i] || `Contender #${i + 1}`)
  }

  const timestamp = Date.now()
  const roundCount = Math.round(Math.log2(size))
  const rounds = []

  // Generate bracket hierarchy for all rounds
  for (let r = 0; r < roundCount; r++) {
    const matchesInRound = size / Math.pow(2, r + 1)
    const roundTitle = getRoundTitle(matchesInRound)
    const roundPrefix = getRoundPrefix(matchesInRound)

    const matches = []
    for (let m = 0; m < matchesInRound; m++) {
      const matchId = `tour-${timestamp}-${roundPrefix}${m + 1}`
      const isRound1 = r === 0

      // Link to next round
      let nextMatchId = null
      let nextSlot = null
      if (r < roundCount - 1) {
        const nextRoundMatchesCount = matchesInRound / 2
        const nextRoundPrefix = getRoundPrefix(nextRoundMatchesCount)
        const parentMatchIdx = Math.floor(m / 2) + 1
        nextMatchId = `tour-${timestamp}-${nextRoundPrefix}${parentMatchIdx}`
        nextSlot = m % 2 === 0 ? "player1" : "player2"
      }

      const p1 = isRound1 ? playerList[2 * m] : "TBD"
      const p2 = isRound1 ? playerList[2 * m + 1] : "TBD"
      const courtNum = (m % 4) + 1
      const courtName = `Badminton Court 0${courtNum}`
      const stageName = matchesInRound === 1 ? "Championship Final" : `${roundTitle.charAt(0) + roundTitle.slice(1).toLowerCase()} ${m + 1}`

      matches.push({
        id: matchId,
        court: courtName,
        player1: p1,
        player2: p2,
        score1: null,
        score2: null,
        winner: null,
        nextMatchId,
        nextSlot,
        stage: stageName,
        tournamentId: `tour-${timestamp}`,
        tournamentName: title,
        roundIndex: r,
        roundTitle,
      })
    }
    rounds.push({ title: roundTitle, matches })
  }

  // Create Round 1 fixtures in match control store
  const round1Matches = rounds[0].matches
  round1Matches.forEach((m, idx) => {
    try {
      createMatch(user, {
        id: m.id,
        sport: "badminton",
        category,
        court: m.court,
        player1: m.player1,
        player2: m.player2,
        tournament: title,
        stage: m.stage,
        status: idx === 0 ? "LIVE" : "UPCOMING",
        scheduledTime: `Round 1 · ${m.court}`,
      })
    } catch (e) {
      console.warn("Match create notice:", e.message)
    }
  })

  // Track active tournament in tournaments store
  const tournamentRecord = {
    id: `tour-${timestamp}`,
    title,
    category,
    size,
    roundsCount: roundCount,
    createdAt: new Date().toISOString(),
    status: "ONGOING",
    currentRound: rounds[0].title,
  }

  const existingTournaments = getActiveTournaments()
  saveActiveTournaments([tournamentRecord, ...existingTournaments.filter((t) => t.id !== tournamentRecord.id)])

  saveTournamentBracket(rounds)
  return rounds
}


/**
 * Automatic Progression:
 * When any match is completed, advances the winner to the linked match in the next round!
 */
export function advanceTournamentWinner(completedMatch) {
  if (!completedMatch || !completedMatch.winner) return

  const bracket = getTournamentBracket()
  let hasUpdated = false

  for (let r = 0; r < bracket.length; r++) {
    const round = bracket[r]
    for (let m = 0; m < round.matches.length; m++) {
      const match = round.matches[m]

      // Match completed in bracket by ID or player names
      const matchIdEquals = match.id === completedMatch.id
      const playersMatch =
        (match.player1 === completedMatch.teamA?.name || match.player1 === completedMatch.player1) &&
        (match.player2 === completedMatch.teamB?.name || match.player2 === completedMatch.player2)

      if (matchIdEquals || playersMatch) {
        // Record winner and scores
        match.score1 = completedMatch.score1 ?? completedMatch.teamA?.score ?? 21
        match.score2 = completedMatch.score2 ?? completedMatch.teamB?.score ?? 18
        match.winner = completedMatch.winner
        hasUpdated = true

        // Advance winner to next round match
        if (match.nextMatchId && r + 1 < bracket.length) {
          const nextRound = bracket[r + 1]
          const nextMatch = nextRound.matches.find((nm) => nm.id === match.nextMatchId)

          if (nextMatch) {
            if (match.nextSlot === "player1" || nextMatch.player1 === "TBD") {
              nextMatch.player1 = completedMatch.winner
            } else {
              nextMatch.player2 = completedMatch.winner
            }

            // If both players are now decided, schedule match
            if (nextMatch.player1 !== "TBD" && nextMatch.player2 !== "TBD") {
              nextMatch.scheduled = true
            }
            hasUpdated = true
          }
        }
      }
    }
  }

  if (hasUpdated) {
    saveTournamentBracket(bracket)
  }
}

// Global listener for automatic winner advancement across app
if (typeof window !== "undefined") {
  window.addEventListener("gsv_match_completed", (e) => {
    if (e.detail) {
      advanceTournamentWinner(e.detail)
    }
  })
}

/**
 * Constructs bracket columns from backend tournament entity and match collection.
 * Authoritatively builds the visual bracket from the database tournament.
 */
export function buildBracketFromMatches(tournament, allMatches = []) {
  if (!tournament) return []
  const tourId = tournament.id
  const tourCatNormalized = (tournament.category?.name || tournament.category || "")
    .toString()
    .toUpperCase()
    .replace(/[\s_']/g, "")

  // Strictly isolate matches that belong to this specific tournament
  const tourMatches = (allMatches || []).filter((m) => {
    // 1. Strict tournamentId match
    if (m.tournamentId && m.tournamentId === tourId) return true
    // 2. Strict ID prefix match (e.g. tour-173158...-r1-m1)
    if (m.id && typeof m.id === "string" && m.id.startsWith(tourId)) return true

    // 3. Match by tournament name ONLY if category also matches
    if (m.tournament && m.tournament.trim().toLowerCase() === tournament.tournamentName.trim().toLowerCase()) {
      if (tourCatNormalized && m.category) {
        const matchCatNormalized = m.category.toString().toUpperCase().replace(/[\s_']/g, "")
        return matchCatNormalized === tourCatNormalized
      }
    }
    return false
  })

  const participants = Array.isArray(tournament.participants) ? tournament.participants : []
  const count = participants.length >= 2 ? participants.length : 8
  const totalRounds =
    tournament.totalRounds || Math.max(1, Math.round(Math.log2(count)))

  const rounds = []

  for (let r = 1; r <= totalRounds; r++) {
    const matchesInRound = Math.max(1, count / Math.pow(2, r))
    const roundTitle = getRoundTitle(matchesInRound)

    // Find matches matching this round strictly from this tournament's matches
    const roundMatches = tourMatches.filter((m) => {
      if (m.id && m.id.startsWith(tourId) && m.id.includes(`-r${r}-`)) return true
      if (m.stage && m.stage.toUpperCase() === roundTitle.toUpperCase()) return true
      return false
    })

    const builtRoundMatches = []

    for (let m = 0; m < matchesInRound; m++) {
      const matchId = `${tournament.id}-r${r}-m${m + 1}`
      // Look strictly for THIS tournament's match
      const existingMatch =
        tourMatches.find((rm) => rm.id === matchId) ||
        roundMatches.find((rm) => rm.id === matchId) ||
        roundMatches[m]

      if (existingMatch) {
        builtRoundMatches.push({
          id: existingMatch.id,
          tournamentId: tournament.id,
          court: existingMatch.court || `Badminton Court 0${(m % 4) + 1}`,
          player1: existingMatch.teamA?.name || existingMatch.player1 || "TBD",
          player2: existingMatch.teamB?.name || existingMatch.player2 || "TBD",
          score1: existingMatch.scoreA ?? existingMatch.score1 ?? (existingMatch.teamA?.score ?? 0),
          score2: existingMatch.scoreB ?? existingMatch.score2 ?? (existingMatch.teamB?.score ?? 0),
          winner: existingMatch.winner || null,
          status: existingMatch.status || (r === 1 && m === 0 ? "LIVE" : "UPCOMING"),
          stage: existingMatch.stage || roundTitle,
          tournamentName: existingMatch.tournament || tournament.tournamentName,
        })
      } else if (r === 1 && participants.length >= (m + 1) * 2) {
        const p1 = participants[m * 2]
        const p2 = participants[m * 2 + 1]
        builtRoundMatches.push({
          id: matchId,
          tournamentId: tournament.id,
          court: `Badminton Court 0${(m % 4) + 1}`,
          player1: p1?.name || p1?.player1Name || `Seed ${m * 2 + 1}`,
          player2: p2?.name || p2?.player1Name || `Seed ${m * 2 + 2}`,
          score1: 0,
          score2: 0,
          winner: null,
          status: m === 0 ? "LIVE" : "UPCOMING",
          stage: roundTitle,
          tournamentName: tournament.tournamentName,
        })
      } else {
        builtRoundMatches.push({
          id: matchId,
          tournamentId: tournament.id,
          court: `Badminton Court 0${(m % 4) + 1}`,
          player1: "TBD",
          player2: "TBD",
          score1: 0,
          score2: 0,
          winner: null,
          status: "UPCOMING",
          stage: roundTitle,
          tournamentName: tournament.tournamentName,
        })
      }
    }

    rounds.push({
      title: roundTitle.toUpperCase(),
      matches: builtRoundMatches,
    })
  }

  return rounds
}


