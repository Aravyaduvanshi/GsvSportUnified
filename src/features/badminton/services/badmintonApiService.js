/**
 * Badminton API & Live Sync Service
 * Connects the React Frontend to the Kotlin Spring Boot Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://gsvsports-app.onrender.com/api/v1"

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
      headers["X-Admin-Id"] = user.id || "admin-badminton"
    } else {
      headers["X-Admin-Id"] = "admin-badminton"
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

/**
 * Fetch match rally/event logs for public spectators
 */
export async function fetchBadmintonMatchEvents(matchId) {
  if (!matchId) return []
  try {
    const response = await fetch(`${API_BASE_URL}/badminton/matches/${matchId}/events`)
    if (response.ok) {
      const json = await response.json()
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data
      }
    }
  } catch (err) {
    // Network or server down, fallback to client storage
  }

  try {
    const raw = localStorage.getItem(`gsv_match_events_store_v6_${matchId}`)
    if (raw) return JSON.parse(raw)
  } catch (e) {}

  return []
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

/**
 * Create a new match on backend (Admin only)
 */
export async function createMatchOnBackend(matchData) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(matchData),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to create match on server")
  }
  return json.data
}

/**
 * Delete a match on backend (Admin only)
 */
export async function deleteMatchOnBackend(matchId) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to delete match on server")
  }
  return json.data
}

/**
 * Correct score with mandatory audit reason (Admin only)
 */
export async function correctScoreOnBackend(matchId, { scoreA, scoreB, servingSide, servingCourt, reason }) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/correct-score`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ scoreA, scoreB, servingSide, servingCourt, reason }),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to correct score on server")
  }
  return json.data
}

// ==========================================
// COURTS & TOURNAMENTS APIS
// ==========================================

/**
 * Fetch all 4 courts and their current occupancy status from backend
 */
export async function fetchCourts() {
  try {
    const response = await fetch(`${API_BASE_URL}/courts`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || []
  } catch (err) {
    console.error("Failed to fetch courts from backend:", err)
    return []
  }
}

/**
 * Assign a match to a court on backend
 */
export async function assignCourtOnBackend(matchId, court) {
  const response = await fetch(`${API_BASE_URL}/admin/badminton/matches/${matchId}/assign-court`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify({ court }),
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to assign court on server")
  }
  return json.data
}

/**
 * Fetch all tournaments from backend
 */
export async function fetchTournaments() {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || []
  } catch (err) {
    console.error("Failed to fetch tournaments from backend:", err)
    return []
  }
}

/**
 * Fetch a tournament by ID
 */
export async function fetchTournamentById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tournaments/${id}`)
    if (!response.ok) throw new Error(`HTTP error ${response.status}`)
    const json = await response.json()
    return json.data || null
  } catch (err) {
    console.error(`Failed to fetch tournament ${id}:`, err)
    return null
  }
}

/**
 * Create a new tournament on backend (Admin only)
 */
export async function createTournamentOnBackend(req) {
  const response = await fetch(`${API_BASE_URL}/admin/tournaments`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(req),
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to create tournament on server")
  }
  return json.data
}

/**
 * Delete a tournament on backend (Admin only)
 */
export async function deleteTournamentOnBackend(tournamentId) {
  const response = await fetch(`${API_BASE_URL}/admin/tournaments/${tournamentId}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  })
  const json = await response.json()
  if (!response.ok) {
    throw new Error(json.message || "Failed to delete tournament on server")
  }
  return json.data
}

// ==========================================
// PURGE LEGACY LOCALSTORAGE ON STARTUP
// (Database is single source of truth)
// ==========================================

export function purgeLegacyLocalStorage() {
  try {
    localStorage.removeItem("gsv_admin_matches_store_v6")
    localStorage.removeItem("gsv_tournament_bracket_store_v2")
    localStorage.removeItem("gsv_active_tournaments_v2")
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && (k.startsWith("gsv_match_events_store_v6") || k.startsWith("gsv_tournament_"))) {
        toRemove.push(k)
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k))
  } catch (_) {}
}

// Optional manual purge utility if needed
// purgeLegacyLocalStorage() is not auto-executed to avoid clearing active match caches

// ==========================================
// REAL-TIME WEBSOCKET (STOMP) MULTIPLEXED MANAGER
// ==========================================

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "wss://gsvsports-app.onrender.com/ws"

class StompClientManager {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.isConnecting = false
    this.reconnectTimer = null
    this.pingInterval = null
    this.subscriptions = new Map() // subId -> { topic, callback }
    this.subIdCounter = 1
  }

  ensureConnected() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return
    }

    try {
      this.isConnecting = true
      this.socket = new WebSocket(WS_BASE_URL)

      this.socket.onopen = () => {
        // Send STOMP 1.2 CONNECT frame with 0,0 heartbeat to prevent session drop
        const connectFrame = "CONNECT\naccept-version:1.2,1.1,1.0\nheart-beat:0,0\n\n\0"
        this.socket.send(connectFrame)

        // Set up periodic client keepalive ping
        if (this.pingInterval) clearInterval(this.pingInterval)
        this.pingInterval = setInterval(() => {
          if (this.socket && this.socket.readyState === WebSocket.OPEN && this.isConnected) {
            try {
              this.socket.send("\n")
            } catch (_) {}
          }
        }, 15000)
      }

      this.socket.onmessage = (event) => {
        const raw = typeof event.data === "string" ? event.data : ""
        if (!raw || raw === "\n" || raw === "\r\n") return

        // STOMP frames are terminated by NULL character (\0).
        // A single WebSocket message may contain multiple STOMP frames.
        const frames = raw.split("\0")
        for (const frame of frames) {
          const text = frame.trimStart()
          if (!text) continue

          if (text.startsWith("CONNECTED")) {
            this.isConnected = true
            this.isConnecting = false
            // Resubscribe all active topics
            for (const [subId, { topic }] of this.subscriptions.entries()) {
              this.sendSubscribe(subId, topic)
            }
          } else if (text.startsWith("MESSAGE")) {
            // Parse STOMP headers and body
            const headerEndMatch = text.match(/\r?\n\r?\n/)
            if (headerEndMatch) {
              const headerPart = text.substring(0, headerEndMatch.index)
              const bodyStartIndex = headerEndMatch.index + headerEndMatch[0].length
              const body = text.substring(bodyStartIndex).trim()

              // Extract destination header
              const destMatch = headerPart.match(/destination:([^\r\n]+)/)
              const dest = destMatch ? destMatch[1].trim() : ""

              if (!dest || !body) continue

              try {
                const data = JSON.parse(body)
                // Dispatch to all matching subscriptions
                for (const { topic, callback } of this.subscriptions.values()) {
                  if (topic === dest || (topic.endsWith("/*") && dest.startsWith(topic.slice(0, -2)))) {
                    try {
                      callback(data)
                    } catch (cbErr) {
                      console.error("Error in STOMP subscriber callback:", cbErr)
                    }
                  }
                }
              } catch (jsonErr) {
                console.warn("STOMP JSON parse error:", jsonErr.message)
              }
            }
          }
        }
      }

      this.socket.onerror = () => {
        // Handled in onclose
      }

      this.socket.onclose = () => {
        this.isConnected = false
        this.isConnecting = false
        if (this.pingInterval) {
          clearInterval(this.pingInterval)
          this.pingInterval = null
        }
        if (this.subscriptions.size > 0 && !this.reconnectTimer) {
          this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            this.ensureConnected()
          }, 2000)
        }
      }
    } catch (e) {
      this.isConnecting = false
      if (this.subscriptions.size > 0 && !this.reconnectTimer) {
        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null
          this.ensureConnected()
        }, 2000)
      }
    }
  }

  sendSubscribe(subId, topic) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN && this.isConnected) {
      const frame = `SUBSCRIBE\nid:${subId}\ndestination:${topic}\nack:auto\n\n\0`
      this.socket.send(frame)
    }
  }

  subscribe(topic, callback) {
    const subId = `sub-${this.subIdCounter++}`
    this.subscriptions.set(subId, { topic, callback })

    this.ensureConnected()
    if (this.isConnected) {
      this.sendSubscribe(subId, topic)
    }

    return () => {
      this.subscriptions.delete(subId)
      if (this.socket && this.socket.readyState === WebSocket.OPEN && this.isConnected) {
        try {
          this.socket.send(`UNSUBSCRIBE\nid:${subId}\n\n\0`)
        } catch (e) {}
      }
    }
  }
}

const stompManager = new StompClientManager()

export function subscribeToStompTopic(topic, onMessage) {
  return stompManager.subscribe(topic, onMessage)
}

export function subscribeToBadmintonLiveScores(onMatchUpdate, matchId = null) {
  const topic = matchId ? `/topic/badminton/matches/${matchId}` : `/topic/badminton/live`
  return stompManager.subscribe(topic, onMatchUpdate)
}

export function subscribeToCourts(onCourtsUpdate) {
  return stompManager.subscribe("/topic/courts", onCourtsUpdate)
}

export function subscribeToTournaments(onTournUpdate) {
  return stompManager.subscribe("/topic/tournaments", onTournUpdate)
}

export function subscribeToMatchDeletion(onDeleted) {
  return stompManager.subscribe("/topic/badminton/matches/deleted", onDeleted)
}

export function subscribeToMatchUpdates(onMatchUpdate) {
  return stompManager.subscribe("/topic/badminton/matches", onMatchUpdate)
}

export function subscribeToScheduleUpdates(onScheduleUpdate) {
  return stompManager.subscribe("/topic/badminton/schedule", onScheduleUpdate)
}
