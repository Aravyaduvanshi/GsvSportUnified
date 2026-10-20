/*
 Basketball Formatting Utilities
 */

export function formatGameScore(homeScore, awayScore) {
  if (homeScore === undefined || homeScore === null) return "—"
  if (awayScore === undefined || awayScore === null) return `${homeScore}`
  return `${homeScore} - ${awayScore}`
}

export function formatPeriod(period, clock) {
  if (!period) return "Scheduled"
  if (period === "FINAL") return "Final"
  if (period === "HALFTIME") return "Halftime"
  if (clock) return `${period} · ${clock}`
  return period
}

export function calculateWinPercentage(wins, losses) {
  const total = wins + losses
  if (total === 0) return ".000"
  const pct = wins / total
  return pct.toFixed(3).replace(/^0/, "")
}

export function formatPointDifferential(scored, allowed) {
  const diff = scored - allowed
  if (diff > 0) return `+${diff}`
  return `${diff}`
}
