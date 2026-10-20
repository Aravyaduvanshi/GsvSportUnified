/**
 * Cricket Data Formatting Utilities
 */

export function formatScore(runs, wickets, isAllOut = false) {
  if (runs === undefined || runs === null || runs === "—") return "—"
  if (wickets === undefined || wickets === null) return `${runs}`
  if (isAllOut || wickets >= 10) return `${runs} (All Out)`
  return `${runs}/${wickets}`
}

export function formatOvers(overs) {
  if (overs === undefined || overs === null || overs === "—") return "—"
  return `${overs} ov`
}

export function calculateRunRate(runs, overs) {
  const o = parseFloat(overs)
  if (!o || o <= 0) return "0.00"
  // If overs is in cricket format e.g. 16.4 (16 overs + 4 balls = 16 + 4/6 = 16.666)
  const fullOvers = Math.floor(o)
  const balls = Math.round((o - fullOvers) * 10)
  const totalOvers = fullOvers + balls / 6
  if (totalOvers <= 0) return "0.00"
  return (runs / totalOvers).toFixed(2)
}

export function calculateRequiredRunRate(target, currentRuns, ballsRemaining) {
  if (!target || ballsRemaining <= 0) return null
  const runsNeeded = target - currentRuns
  if (runsNeeded <= 0) return "0.00"
  const oversRemaining = ballsRemaining / 6
  return (runsNeeded / oversRemaining).toFixed(2)
}

export function getResultBadgeVariant(status) {
  switch (status) {
    case "LIVE":
      return "live"
    case "COMPLETED":
      return "completed"
    case "UPCOMING":
      return "upcoming"
    default:
      return "default"
  }
}
