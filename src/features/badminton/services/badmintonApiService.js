/**
 * Badminton API & Live Sync Service
 * Connects the React Frontend to the Kotlin Spring Boot Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"

/**
 * Helper to retrieve current active demo admin token or ID
 */
function getAdminAuthHeaders() {
  const headers = {
    "Content-Type": "application/json",
  }

  try {
    const rawUser = localStorage.getItem("gsv_current_admin_user")
    if (rawUser) {
      const user = JSON.parse(rawUser)
      // Send demo identification header supported by backend
      headers["X-Admin-Id"] = user.id || "admin-arav"
    } else {
      headers["X-Admin-Id"] = "admin-arav"
    }

    const token = localStorage.getItem("gsv_admin_jwt_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  } catch (err) {
    console.warn("Could not read auth token from localStorage", err)
  }

  return headers
}

// ==========================================
// PUBLIC SPECTATOR APIS
// ==========================================

/**
 * Fetch all currently LIVE badminton matches
 */
export async function fetchLiveBadmintonMatches() {
  try {
    const response = await fetch(`${API_BASE_URL}/badminton/matches/live`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || []
  } catch (err) {
    console.error("Failed to fetch live badminton matches from backend:", err)
    return null
  }
}

/**
 * Fetch all PREVIOUS / COMPLETED badminton matches with full set history
 */
export async function fetchPreviousBadmintonMatches() {
  try {
    const response = await fetch(`${API_BASE_URL}/badminton/matches/previous`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || []
  } catch (err) {
    console.error("Failed to fetch previous badminton matches from backend:", err)
    return null
  }
}

/**
 * Fetch schedule fixtures with optional filter (ALL, LIVE, UPCOMING, COMPLETED)
 */
export async function fetchBadmintonSchedule(filter = "ALL") {
  try {
    const response = await fetch(`${API_BASE_URL}/badminton/matches/schedule?filter=${encodeURIComponent(filter)}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || []
  } catch (err) {
    console.error("Failed to fetch badminton schedule from backend:", err)
    return null
  }
}

/**
 * Fetch single match details
 */
export async function fetchBadmintonMatchById(matchId) {
  try {
    const response = await fetch(`${API_BASE_URL}/badminton/matches/${matchId}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || null
  } catch (err) {
    console.error(`Failed to fetch match ${matchId}:`, err)
    return null
  }
}

// ==========================================
// ADMIN / SCOREKEEPER APIS
// ==========================================

/**
 * Award rally point to Team A or Team B
 */
export async function scorePointOnBackend(matchId, { side, actionDetail = "Rally Point" }) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/score`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({
      side,
      actionDetail,
      type: "POINT",
    }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to score point on server")
  }
  return json.data
}

/**
 * Compensating undo on server
 */
export async function undoPointOnBackend(matchId) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/undo`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to undo action on server")
  }
  return json.data
}

/**
 * Record a fault on server
 */
export async function recordFaultOnBackend(matchId, { side, type, notes }) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/fault`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ side, type, notes }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to record fault on server")
  }
  return json.data
}

/**
 * Update match status (e.g. start match to LIVE, complete match)
 */
export async function updateMatchStatusOnBackend(matchId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/status`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ status }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to update status on server")
  }
  return json.data
}

/**
 * Reset match scores to 0-0 on server
 */
export async function resetMatchOnBackend(matchId) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/reset`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to reset match on server")
  }
  return json.data
}

/**
 * Switch server and serving service box on server
 */
export async function switchServerOnBackend(matchId, { side, court } = {}) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/server`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ side, court }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to switch server on server")
  }
  return json.data
}


// ==========================================
// REAL-TIME WEBSOCKET (STOMP) SUBSCRIPTION
// ==========================================

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8080/ws"

/**
 * Real-Time WebSocket STOMP Subscriber for Badminton Scores
 * Subscribes directly to /topic/badminton/live or /topic/badminton/matches/{matchId}
 * Automatically falls back and reconnects.
 * Returns unsubscribe cleanup function.
 */
export function subscribeToBadmintonLiveScores(onMatchUpdate, matchId = null) {
  let socket = null
  let isClosedManually = false
  let reconnectTimer = null

  const topic = matchId
    ? `/topic/badminton/matches/${matchId}`
    : `/topic/badminton/live`

  function connect() {
    if (isClosedManually) return

    try {
      socket = new WebSocket(WS_BASE_URL)

      socket.onopen = () => {
        // Send STOMP 1.2 CONNECT frame
        const connectFrame = "CONNECT\naccept-version:1.2,1.1,1.0\nheart-beat:10000,10000\n\n\0"
        socket.send(connectFrame)
      }

      socket.onmessage = (event) => {
        const text = typeof event.data === "string" ? event.data : ""
        if (text.startsWith("CONNECTED")) {
          // Subscribe to topic
          const subFrame = `SUBSCRIBE\nid:sub-${Date.now()}\ndestination:${topic}\nack:auto\n\n\0`
          socket.send(subFrame)
        } else if (text.startsWith("MESSAGE")) {
          // Parse STOMP message body
          const bodyIndex = text.indexOf("\n\n")
          if (bodyIndex !== -1) {
            let body = text.substring(bodyIndex + 2)
            if (body.endsWith("\0")) {
              body = body.slice(0, -1)
            }
            try {
              const matchData = JSON.parse(body.trim())
              if (matchData && onMatchUpdate) {
                onMatchUpdate(matchData)
              }
            } catch (err) {
              console.warn("Failed to parse STOMP message payload:", err)
            }
          }
        }
      }

      socket.onerror = () => {
        // Handled in onclose
      }

      socket.onclose = () => {
        if (!isClosedManually) {
          reconnectTimer = setTimeout(connect, 4000)
        }
      }
    } catch (e) {
      if (!isClosedManually) {
        reconnectTimer = setTimeout(connect, 4000)
      }
    }
  }

  connect()

  return function unsubscribe() {
    isClosedManually = true
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      socket.close()
    }
  }
}
