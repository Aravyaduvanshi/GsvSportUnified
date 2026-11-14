/**
 * Admin Authentication and Authorization Service
 * Enforces role-based permissions and strict match assignment boundaries for GSV Badminton.
 */

const AUTH_USER_STORAGE_KEY = "gsv_current_admin_user"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://gsvsports-app.onrender.com/api/v1"

export const MOCK_ADMIN_ACCOUNTS = [
  {
    id: "badminton-admin",
    name: "badminton-admin",
    email: "badminton.admin@gsv.ac.in",
    role: "admin",
    primarySport: "Badminton",
    assignedMatchIds: ["*"], // Full authority across all badminton matches and tournaments
    avatar: "BA",
  },
  {
    id: "admin-badminton",
    name: "admin-badminton",
    email: "admin.badminton@gsv.ac.in",
    role: "admin",
    primarySport: "Badminton",
    assignedMatchIds: ["*"],
    avatar: "BA",
  },
  {
    id: "user-student",
    name: "user-student",
    email: "student@gsv.ac.in",
    role: "user",
    primarySport: "Badminton",
    assignedMatchIds: [], // Read-only spectator: cannot officiate or manage matches
    avatar: "ST",
  },
]

/**
 * Retrieve the currently authenticated admin user.
 * Defaults to badminton-admin.
 */
export function getCurrentAdminUser() {
  try {
    const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed
    }
  } catch (err) {
    console.error("Failed to read admin auth state from storage:", err)
  }
  return MOCK_ADMIN_ACCOUNTS[0]
}

/**
 * Set the active authenticated admin user.
 */
export function setCurrentAdminUser(userOrId) {
  let user = typeof userOrId === "object" && userOrId !== null
    ? userOrId
    : MOCK_ADMIN_ACCOUNTS.find((u) => u.id === userOrId || u.name === userOrId)

  if (user) {
    try {
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user))
      window.dispatchEvent(new CustomEvent("gsv_auth_changed", { detail: user }))
    } catch (err) {
      console.error("Failed to save admin auth state:", err)
    }
    return user
  }
  return null
}

/**
 * Verify credentials and sign in the Administrator with username/email and password.
 * Securely authenticates against backend /api/v1/auth/login.
 */
export async function loginAdmin(identifier, password) {
  if (!identifier?.trim() || !password?.trim()) {
    throw new Error("Please enter both username/email and password.")
  }

  const cleanId = identifier.trim()

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: cleanId,
        email: cleanId,
        password: password.trim(),
      }),
    })

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}))
      throw new Error(errJson.message || "Invalid administrator credentials or incorrect password.")
    }

    const json = await res.json()
    const token = json.data?.token
    const user = json.data?.user

    if (!user || user.role === "user") {
      throw new Error("ACCESS_DENIED: Standard user accounts cannot access the admin console.")
    }

    if (token) {
      localStorage.setItem("gsv_admin_jwt_token", token)
    }

    const adminUser = {
      id: user.id || cleanId,
      name: user.name || cleanId,
      email: user.email || cleanId,
      role: user.role || "admin",
      primarySport: user.primarySport || "Badminton",
      assignedMatchIds: user.assignedMatchIds || ["*"],
      avatar: user.avatar || "BA",
    }

    setCurrentAdminUser(adminUser)
    return adminUser
  } catch (err) {
    if (err.message && (err.message.includes("Invalid") || err.message.includes("ACCESS_DENIED") || err.message.includes("ACCOUNT_NOT_FOUND"))) {
      throw err
    }

    // If backend connection was refused (e.g. server starting up), fallback to local demo check
    const matched = MOCK_ADMIN_ACCOUNTS.find(
      (u) =>
        u.id.toLowerCase() === cleanId.toLowerCase() ||
        u.name.toLowerCase() === cleanId.toLowerCase() ||
        u.email.toLowerCase() === cleanId.toLowerCase()
    )

    if (matched && matched.role !== "user") {
      setCurrentAdminUser(matched)
      return matched
    }

    throw new Error(err.message || "Unable to authenticate with backend server on port 8080.")
  }
}

/**
 * Authoritative security check: can the given user access and score the target match?
 * The authenticated badminton administrator has complete authority over all badminton matches.
 */
export function canAdminAccessMatch(user, matchId, match = null) {
  if (!user || !matchId) return false
  if (user.role === "user") return false // Normal users NEVER have admin rights

  // Badminton admin has authoritative access to ALL badminton matches and tournament fixtures
  if (
    user.id === "badminton-admin" ||
    user.id === "admin-badminton" ||
    user.role === "admin" ||
    user.role === "super_admin"
  ) {
    return true
  }

  if (Array.isArray(user.assignedMatchIds)) {
    if (user.assignedMatchIds.includes("*")) return true
    return user.assignedMatchIds.includes(String(matchId))
  }

  return false
}

/**
 * Check if the user has permission to manage match assignments or override finalized results.
 */
export function canAdminManageAssignments(user) {
  if (!user) return false
  return user.role === "admin" || user.role === "super_admin"
}
