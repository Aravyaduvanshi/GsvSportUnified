/**
 * Admin Authentication and Authorization Service
 * Enforces role-based permissions and strict match assignment boundaries.
 */

const AUTH_USER_STORAGE_KEY = "gsv_current_admin_user"

export const MOCK_ADMIN_ACCOUNTS = [


{
  id: "admin-throwball",
  name: "SANJU",
  email: "sanju.admin@gsv.ac.in",
  role: "assigned_admin",
  primarySport: "Throwball",
  assignedMatchIds: ["throwball-m1"],
  avatar: "SJ",
},

  {
    id: "admin-arav",
    name: "Arav Kumar",
    email: "arav.badminton@gsv.ac.in",
    role: "assigned_admin",
    primarySport: "Badminton",
    assignedMatchIds: ["badminton-1"],
    avatar: "AK",
  },
  {
    id: "admin-vikram",
    name: "Vikram Sengupta",
    email: "vikram.cricket@gsv.ac.in",
    role: "assigned_admin",
    primarySport: "Cricket",
    assignedMatchIds: ["cricket-m1"],
    avatar: "VS",
  },
  {
    id: "admin-tariq",
    name: "Tariq Al-Mansoor",
    email: "tariq.hoops@gsv.ac.in",
    role: "assigned_admin",
    primarySport: "Basketball",
    assignedMatchIds: ["bb-game-1"],
    avatar: "TM",
  },
  {
    id: "admin-super",
    name: "Prof. S. K. Raman",
    email: "athletics.dean@gsv.ac.in",
    role: "super_admin",
    primarySport: "All Sports",
    assignedMatchIds: ["*"], // Wildcard: Super admin can access and manage all matches
    avatar: "SR",
  },
  {
    id: "admin-unassigned",
    name: "Trainee Scorekeeper",
    email: "trainee@gsv.ac.in",
    role: "assigned_admin",
    primarySport: "General",
    assignedMatchIds: [], // Zero matches assigned: used to verify 403 Forbidden enforcement
    avatar: "TS",
  },
]

/**
 * Retrieve the currently authenticated admin user.
 * Defaults to Arav Kumar (Badminton Admin) if unset.
 */
export function getCurrentAdminUser() {
  try {
    const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Ensure data stays aligned with mock accounts definition
      const matched = MOCK_ADMIN_ACCOUNTS.find((u) => u.id === parsed.id)
      if (matched) return matched
    }
  } catch (err) {
    console.error("Failed to read admin auth state from storage:", err)
  }
  return MOCK_ADMIN_ACCOUNTS[0]
}

/**
 * Switch the active authenticated admin user (for authorization and security testing).
 */
export function setCurrentAdminUser(userId) {
  const user = MOCK_ADMIN_ACCOUNTS.find((u) => u.id === userId)
  if (user) {
    try {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
    } catch (err) {
      console.error("Failed to save admin auth state:", err)
    }
    return user
  }
  return null
}

/**
 * Authoritative security check: can the given user access and score the target match?
 * Server-side simulation: returns false if not authorized.
 */
export function canAdminAccessMatch(user, matchId) {
  if (!user || !matchId) return false
  if (user.role === "super_admin") return true
  if (Array.isArray(user.assignedMatchIds)) {
    return user.assignedMatchIds.includes(matchId) || user.assignedMatchIds.includes("*")
  }
  return false
}

/**
 * Check if the user has permission to manage match assignments or override finalized results.
 */
export function canAdminManageAssignments(user) {
  if (!user) return false
  return user.role === "super_admin"
}
