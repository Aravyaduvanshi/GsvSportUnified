import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Search,
  Trophy,
  CircleDot,
  Activity,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Play,
} from "lucide-react"

import { getCurrentAdminUser } from "../services/adminAuthService"
import {
  getAssignedMatches,
  createMatch,
  deleteMatch,
  assignCourtAndStartMatch,
  saveStoredMatches,
} from "../services/matchControlService"
import {
  createTournament,
  getTournamentBracket,
  saveTournamentBracket,
  getActiveTournaments,
  buildBracketFromMatches,
} from "../../badminton/services/tournamentService"
import {
  fetchCourts,
  assignCourtOnBackend,
  fetchTournaments,
  createTournamentOnBackend,
  deleteTournamentOnBackend,
  fetchBadmintonSchedule,
  createMatchOnBackend,
  deleteMatchOnBackend,
  updateMatchStatusOnBackend,
  subscribeToCourts,
  subscribeToTournaments,
  subscribeToBadmintonLiveScores,
  subscribeToMatchDeletion,
  subscribeToMatchUpdates,
  subscribeToScheduleUpdates,
  subscribeToStompTopic,
} from "../../badminton/services/badmintonApiService"

const STATUS_FILTERS = ["ALL", "LIVE", "UPCOMING", "COMPLETED"]
const SPORT_FILTERS = ["ALL", "badminton", "throwball", "cricket", "basketball"]

const SPORT_META = {
  badminton: { label: "BADMINTON", icon: "🏸", color: "#DFFF00" },
  throwball: { label: "THROWBALL", icon: "🏐", color: "#FFAE00" },
  cricket: { label: "CRICKET", icon: "🏏", color: "#07F080" },
  basketball: { label: "BASKETBALL", icon: "🏀", color: "#FFAE00" },
}

function formatScore(match, team) {
  if (match.sport === "cricket") {
    return `${team.runs ?? 0}/${team.wickets ?? 0}`
  }
  return team.score ?? 0
}

function StatusBadge({ status }) {
  const styles = {
    LIVE: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    UPCOMING: "border-sky-400/30 bg-sky-400/10 text-sky-300",
    COMPLETED: "border-white/10 bg-white/5 text-gray-400",
  }

  return (
    <span
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold tracking-widest ${styles[status] || styles.UPCOMING
        }`}
    >
      {status === "LIVE" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      )}
      {status}
    </span>
  )
}

function MatchCard({ match, onDelete }) {
  const sport = SPORT_META[match.sport] || {
    label: match.sportLabel || "SPORT",
    icon: "🏆",
    color: "#35C5F4",
  }

  const isLive = match.status === "LIVE"

  return (
    <article className="group relative flex flex-col overflow-hidden border border-white/10 bg-[#101722] transition duration-200 hover:border-white/25">
      <div
        className="h-1 w-full"
        style={{ backgroundColor: sport.color }}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-black tracking-[0.18em]"
              style={{ color: sport.color }}
            >
              {sport.icon} {sport.label}
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-400">
              {match.tournament}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={match.status} />
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(match.id)}
                title="Delete match"
                className="p-1 text-gray-500 transition hover:text-rose-400"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="my-5 border-y border-white/10 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {match.teamA?.name || match.player1}
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                TEAM A
              </p>
            </div>

            <p
              className="shrink-0 text-2xl font-black tabular-nums"
              style={{ color: sport.color }}
            >
              {formatScore(match, match.teamA || { score: match.score1 || 0 })}
            </p>
          </div>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-600">
              VS
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {match.teamB?.name || match.player2}
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                TEAM B
              </p>
            </div>

            <p className="shrink-0 text-2xl font-black tabular-nums text-[#35C5F4]">
              {formatScore(match, match.teamB || { score: match.score2 || 0 })}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Trophy size={14} />
            <span>{match.stage || "Competition match"}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={14} />
            <span>{match.scheduledTime || "Schedule not available"}</span>
          </div>

          <div className="flex items-center gap-2">
            <CircleDot size={14} />
            <span className="truncate">
              {match.venue || match.court || "Venue not assigned"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex-1" />

        <Link
          to={`/sport-admin/matches/${match.id}/control`}
          className="mt-5 flex items-center justify-between border border-white/15 bg-white/[0.03] px-4 py-3 text-xs font-black tracking-wider text-white transition hover:border-[#07F080] hover:bg-[#07F080] hover:text-black"
        >
          <span>
            {isLive ? "OPEN MATCH CONTROL" : "VIEW MATCH"}
          </span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  )
}

function CreateMatchModal({ isOpen, onClose, onCreated, currentUser, existingMatches = [], backendCourts = [] }) {
  const [sport, setSport] = useState("badminton")
  const [category, setCategory] = useState("Men's Singles")
  const [court, setCourt] = useState("Badminton Court 01")
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const [partner1, setPartner1] = useState("")
  const [partner2, setPartner2] = useState("")
  const [tournament, setTournament] = useState("GSV Badminton Championship 2026")
  const [stage, setStage] = useState("Quarter Final")
  const [status, setStatus] = useState("LIVE")
  const [error, setError] = useState(null)

  const isDoubles = category.includes("Doubles")

  const COURTS_OPTIONS = [
    "Badminton Court 01",
    "Badminton Court 02",
    "Badminton Court 03",
    "Badminton Court 04",
  ]

  const liveOccupiedCourts = useMemo(() => {
    const map = new Map()
    for (const c of backendCourts || []) {
      if (c.status === "OCCUPIED" && c.currentMatchId) {
        map.set((c.name || c.id).toLowerCase(), c)
      }
    }
    // Also include any in-memory live matches
    for (const m of existingMatches || []) {
      if (m.status === "LIVE" && m.court) {
        const key = m.court.trim().toLowerCase()
        if (!map.has(key)) {
          map.set(key, { name: m.court, currentMatchTitle: `${m.teamA?.name || m.player1} vs ${m.teamB?.name || m.player2}` })
        }
      }
    }
    return map
  }, [backendCourts, existingMatches])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!player1.trim() || !player2.trim()) {
      setError("Please specify both Player 1 and Player 2 names.")
      return
    }

    if (isDoubles && (!partner1.trim() || !partner2.trim())) {
      setError("Doubles category requires both partners to be specified.")
      return
    }

    const courtKey = court.trim().toLowerCase()
    if (status === "LIVE" && liveOccupiedCourts.has(courtKey)) {
      const busyCourt = liveOccupiedCourts.get(courtKey)
      setError(
        `Court Collision: ${court} currently has an ongoing LIVE match (${busyCourt?.currentMatchTitle || "In Progress"}). Please complete the ongoing match or select another court.`
      )
      return
    }

    try {
      let createdMatch = null
      if (sport === "badminton") {
        createdMatch = await createMatchOnBackend({
          sport,
          category,
          court,
          player1: player1.trim(),
          player2: player2.trim(),
          player1Partner: isDoubles ? partner1.trim() : null,
          player2Partner: isDoubles ? partner2.trim() : null,
          partner1: isDoubles ? partner1.trim() : null,
          partner2: isDoubles ? partner2.trim() : null,
          tournament: tournament.trim() || "GSV Championship 2026",
          stage: stage.trim() || "Regular Match",
          status,
          startAsLive: status === "LIVE",
          scheduledTime: "Live Now · Officiated Court",
        })
        if (createdMatch) {
          try {
            saveStoredMatches([createdMatch])
          } catch (_) {}
        }
      } else {
        createdMatch = createMatch(currentUser, {
          sport,
          category,
          court,
          player1: player1.trim(),
          player2: player2.trim(),
          partner1: isDoubles ? partner1.trim() : null,
          partner2: isDoubles ? partner2.trim() : null,
          tournament: tournament.trim() || "GSV Championship 2026",
          stage: stage.trim() || "Regular Match",
          status,
          scheduledTime: "Live Now · Officiated Court",
        })
      }

      onCreated(createdMatch)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create match on server.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl border border-white/20 bg-[#0F172A] p-6 shadow-2xl rounded-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏸</span>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              Create New Match
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              >
                <option value="badminton">Badminton</option>
                <option value="cricket">Cricket</option>
                <option value="throwball">Throwball</option>
                <option value="basketball">Basketball</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              >
                <option value="Men's Singles">Men's Singles</option>
                <option value="Women's Singles">Women's Singles</option>
                <option value="Men's Doubles">Men's Doubles</option>
                <option value="Women's Doubles">Women's Doubles</option>
                <option value="Mixed Doubles">Mixed Doubles</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Court / Venue
              </label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              >
                {COURTS_OPTIONS.map((cName) => {
                  const isBusy = liveOccupiedCourts.has(cName.toLowerCase())
                  return (
                    <option
                      key={cName}
                      value={cName}
                      className={isBusy ? "text-amber-400 font-bold" : "text-white"}
                    >
                      {cName} {isBusy ? "— ⚠️ (BUSY: Match in Progress)" : "— ✅ (FREE)"}
                    </option>
                  )
                })}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              >
                <option value="LIVE">LIVE (Start at 0-0)</option>
                <option value="UPCOMING">UPCOMING</option>
              </select>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#FFAE00]">
              Team A Players
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                placeholder="Player 1 Name (e.g. Arav Kumar)"
                className="w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
                required
              />
              {isDoubles && (
                <input
                  type="text"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="Partner 1 Name"
                  className="w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
                  required
                />
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#35C5F4]">
              Team B Players
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                placeholder="Player 2 Name (e.g. Rahul Sharma)"
                className="w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
                required
              />
              {isDoubles && (
                <input
                  type="text"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="Partner 2 Name"
                  className="w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
                  required
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Tournament
              </label>
              <input
                type="text"
                value={tournament}
                onChange={(e) => setTournament(e.target.value)}
                placeholder="GSV Badminton Championship 2026"
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Stage
              </label>
              <input
                type="text"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                placeholder="Quarter Final"
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#07F080]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="border border-[#07F080] bg-[#07F080] px-5 py-2 text-xs font-black tracking-wider text-black transition hover:bg-[#07F080]/90"
            >
              CREATE MATCH (0 - 0)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CATEGORY_DEFAULT_PLAYERS = {
  "Men's Singles": [
    "Arav Kumar", "Rahul Sharma", "Dev Mehta", "Tushar Roy",
    "Karan Singh", "Vikram Sen", "Rohit Verma", "Sameer Patel",
    "Aditya Joshi", "Manish Paul", "Naveen Raj", "Siddharth Das",
    "Yash Mittal", "Pranav Nair", "Harsh Vardhan", "Deepak Gupta"
  ],
  "Women's Singles": [
    "P.V. Sindhu", "Saina Nehwal", "Ashmita Chaliha", "Anupama Upadhyaya",
    "Aakarshi Kashyap", "Malvika Bansod", "Tanvi Sharma", "Unnati Hooda",
    "Ira Sharma", "Tara Shah", "Tasnim Mir", "Aditi Bhatt",
    "Shruti Mundada", "Riya Mookerjee", "Gayatri Gopichand", "Rituparna Das"
  ],
  "Men's Doubles": [
    "Satwiksairaj / Chirag", "Arjun / Dhruv", "Krishna / Vishnu", "Hariharan / Ruban",
    "Shyam / Sanjai", "Achuthanan / Sreejith", "Rohan / Alap", "Pruthvi / Suraj"
  ],
  "Women's Doubles": [
    "Treesa / Gayatri", "Ashwini / Tanisha", "Priya / Shruti", "Simran / Ritika",
    "Palak / Arul", "Kavya / Khushi", "Radhika / Shikha", "Pooja / Sanjana"
  ],
  "Mixed Doubles": [
    "Rohan / Sikki", "Dhruv / Tanisha", "Sumeeth / Ashwini", "Sathish / Aadya",
    "Bokka / Maneesha", "Dingku / Priya", "Tarun / Arathi", "Venkat / Juhi"
  ],
}

function CreateTournamentModal({ isOpen, onClose, onCreated, currentUser }) {
  const [title, setTitle] = useState("GSV Badminton Championship 2026 - Men's Singles")
  const [category, setCategory] = useState("Men's Singles")
  const [bracketSize, setBracketSize] = useState(8)
  const [players, setPlayers] = useState(CATEGORY_DEFAULT_PLAYERS["Men's Singles"])
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleCategoryChange = (newCat) => {
    setCategory(newCat)
    if (CATEGORY_DEFAULT_PLAYERS[newCat]) {
      setPlayers(CATEGORY_DEFAULT_PLAYERS[newCat])
    }
    // Update default title if it follows standard template
    if (!title || title.startsWith("GSV Badminton Championship 2026")) {
      setTitle(`GSV Badminton Championship 2026 - ${newCat}`)
    }
  }

  const POWER_OF_TWO_OPTIONS = [
    { size: 2, label: "2 Teams", sub: "Final (1 match)" },
    { size: 4, label: "4 Teams", sub: "Semifinals ➔ Final (3 matches)" },
    { size: 8, label: "8 Teams", sub: "Quarterfinals ➔ SF ➔ Final (7 matches)" },
    { size: 16, label: "16 Teams", sub: "Round of 16 ➔ QF ➔ SF ➔ Final (15 matches)" },
    { size: 32, label: "32 Teams", sub: "Round of 32 ➔ R16 ➔ QF ➔ Final (31 matches)" },
  ]

  const count = Number(bracketSize) || 8

  const handlePlayerChange = (index, value) => {
    setPlayers((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const relevantPlayers = players.slice(0, count)

    if (relevantPlayers.some((p) => !p || !p.trim())) {
      setError(`Please enter names for all ${count} contenders.`)
      return
    }

    try {
      const createdTournament = await createTournamentOnBackend({
        tournamentName: title.trim() || "GSV Badminton Championship 2026",
        category: category.toUpperCase().replace(/ /g, "_").replace(/'/g, ""),
        sportType: "BADMINTON",
        participants: relevantPlayers.map((p, idx) => ({
          name: p.trim(),
          seed: idx + 1,
          player1Name: p.trim(),
        })),
      })

      try {
        localStorage.removeItem("gsv_tournament_bracket_store_v2")
      } catch (_) {}

      onCreated(createdTournament)
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create tournament bracket on server.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl border border-white/20 bg-[#0F172A] p-6 shadow-2xl rounded-lg my-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[#DFFF00]" />
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              Create Tournament Bracket (Power of 2)
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Tournament Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="GSV Badminton Championship 2026"
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#DFFF00]"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="mt-1 w-full border border-white/10 bg-[#1E293B] px-3 py-2 text-xs text-white outline-none focus:border-[#DFFF00]"
              >
                <option value="Men's Singles">Men's Singles</option>
                <option value="Women's Singles">Women's Singles</option>
                <option value="Men's Doubles">Men's Doubles</option>
                <option value="Women's Doubles">Women's Doubles</option>
                <option value="Mixed Doubles">Mixed Doubles</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Bracket Format (Any Power of 2)
            </label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POWER_OF_TWO_OPTIONS.map((opt) => (
                <button
                  key={opt.size}
                  type="button"
                  onClick={() => setBracketSize(opt.size)}
                  className={`border p-2 text-xs font-bold text-left transition cursor-pointer rounded ${count === opt.size
                    ? "border-[#DFFF00] bg-[#DFFF00]/15 text-white"
                    : "border-white/10 bg-[#1E293B] text-gray-400 hover:border-white/20"
                    }`}
                >
                  <div className={`font-black ${count === opt.size ? "text-[#DFFF00]" : "text-white"}`}>
                    {opt.label}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#DFFF00]">
              Round 1 Contenders ({count} Seeds)
            </p>
            <p className="text-[10px] text-gray-400 mb-3">
              Round 1 matches will be scheduled automatically on the courts. Winners will advance dynamically round by round!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-7 text-[10px] font-mono text-[#DFFF00] font-bold">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={players[idx] || ""}
                    onChange={(e) => handlePlayerChange(idx, e.target.value)}
                    placeholder={`Player ${idx + 1} Name`}
                    className="w-full border border-white/10 bg-[#1E293B] px-3 py-1.5 text-xs text-white outline-none focus:border-[#DFFF00]"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="border border-[#DFFF00] bg-[#DFFF00] px-5 py-2 text-xs font-black tracking-wider text-black transition hover:bg-[#DFFF00]/90 cursor-pointer"
            >
              LAUNCH TOURNAMENT BRACKET
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default function AssignedMatchesDashboard() {
  const currentUser = useMemo(() => getCurrentAdminUser(), [])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const urlSport = searchParams.get("sport")
  const initialSport = urlSport || (currentUser.primarySport && currentUser.primarySport !== "All Sports" ? currentUser.primarySport.toLowerCase() : "ALL")

  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sportFilter, setSportFilter] = useState(initialSport)
  const [tournamentFilter, setTournamentFilter] = useState("ALL")
  const [selectedTournamentId, setSelectedTournamentId] = useState(null)
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)
  const [selectedCourtsForMatches, setSelectedCourtsForMatches] = useState({})

  const [backendCourts, setBackendCourts] = useState([])
  const [backendTournaments, setBackendTournaments] = useState([])
  const [backendMatches, setBackendMatches] = useState([])

  const loadDashboardData = useCallback(async () => {
    try {
      const [courtList, tourList, schedList] = await Promise.all([
        fetchCourts(),
        fetchTournaments(),
        fetchBadmintonSchedule("ALL"),
      ])
      if (Array.isArray(courtList)) setBackendCourts(courtList)
      if (Array.isArray(tourList)) setBackendTournaments(tourList)
      if (Array.isArray(schedList)) {
        setBackendMatches(schedList)
      }
    } catch (err) {
      console.warn("Error fetching dashboard data:", err)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()

    const unsubCourts = subscribeToCourts((updatedCourts) => {
      if (Array.isArray(updatedCourts)) setBackendCourts(updatedCourts)
    })

    const unsubTourn = subscribeToTournaments((updatedTourn) => {
      if (Array.isArray(updatedTourn)) setBackendTournaments(updatedTourn)
      else loadDashboardData()
    })

    const unsubTournDel = subscribeToStompTopic("/topic/tournaments/deleted", () => {
      loadDashboardData()
    })

    const unsubLive = subscribeToBadmintonLiveScores((updatedMatch) => {
      if (!updatedMatch?.id) return
      setBackendMatches((prev) => {
        if (updatedMatch.status === "DELETED") {
          return prev.filter((m) => m.id !== updatedMatch.id && m.id !== updatedMatch.matchId)
        }
        const idx = prev.findIndex((m) => m.id === updatedMatch.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = updatedMatch
          return next
        }
        return [updatedMatch, ...prev]
      })
    })

    const unsubDel = subscribeToMatchDeletion(({ matchId }) => {
      if (!matchId) return
      setBackendMatches((prev) => prev.filter((m) => m.id !== matchId))
    })

    const unsubMatches = subscribeToMatchUpdates((newOrUpdated) => {
      if (!newOrUpdated?.id) return
      setBackendMatches((prev) => {
        if (newOrUpdated.status === "DELETED") {
          return prev.filter((m) => m.id !== newOrUpdated.id && m.id !== newOrUpdated.matchId)
        }
        const idx = prev.findIndex((m) => m.id === newOrUpdated.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = newOrUpdated
          return next
        }
        return [newOrUpdated, ...prev]
      })
    })

    const unsubSchedule = subscribeToScheduleUpdates((newOrUpdated) => {
      if (!newOrUpdated?.id) return
      setBackendMatches((prev) => {
        if (newOrUpdated.status === "DELETED") {
          return prev.filter((m) => m.id !== newOrUpdated.id && m.id !== newOrUpdated.matchId)
        }
        const idx = prev.findIndex((m) => m.id === newOrUpdated.id)
        if (idx !== -1) {
          const next = [...prev]
          next[idx] = newOrUpdated
          return next
        }
        return [newOrUpdated, ...prev]
      })
    })

    const interval = setInterval(loadDashboardData, 4000)

    return () => {
      unsubCourts()
      unsubTourn()
      unsubTournDel()
      unsubLive()
      unsubDel()
      unsubMatches()
      unsubSchedule()
      clearInterval(interval)
    }
  }, [loadDashboardData])

  const allAssignedMatches = useMemo(() => {
    if (backendMatches && Array.isArray(backendMatches)) {
      return backendMatches
    }
    return []
  }, [backendMatches])

  const activeTournament = useMemo(() => {
    if (!backendTournaments || backendTournaments.length === 0) return null
    return (
      backendTournaments.find((t) => t.id === selectedTournamentId) ||
      backendTournaments[0]
    )
  }, [backendTournaments, selectedTournamentId])

  const currentBracket = useMemo(() => {
    if (activeTournament) {
      return buildBracketFromMatches(activeTournament, allAssignedMatches)
    }
    return []
  }, [activeTournament, allAssignedMatches])

  const liveOccupiedCourtsMap = useMemo(() => {
    const map = new Map()
    for (const c of backendCourts || []) {
      if (c.status === "OCCUPIED" && c.currentMatchId) {
        map.set((c.name || c.id).toLowerCase(), c)
      }
    }
    for (const m of allAssignedMatches || []) {
      if (m.status === "LIVE" && m.court) {
        const key = m.court.trim().toLowerCase()
        if (!map.has(key)) {
          map.set(key, { name: m.court, currentMatchTitle: `${m.teamA?.name || m.player1} vs ${m.teamB?.name || m.player2}` })
        }
      }
    }
    return map
  }, [backendCourts, allAssignedMatches])

  const COURTS_LIST = [
    "Badminton Court 01",
    "Badminton Court 02",
    "Badminton Court 03",
    "Badminton Court 04",
  ]

  const handleStartTournamentMatch = async (tMatch) => {
    const chosenCourt =
      selectedCourtsForMatches[tMatch.id] ||
      tMatch.court ||
      "Badminton Court 01"

    const courtKey = chosenCourt.trim().toLowerCase()
    if (liveOccupiedCourtsMap.has(courtKey)) {
      const busy = liveOccupiedCourtsMap.get(courtKey)
      if (busy.currentMatchId && busy.currentMatchId !== tMatch.id) {
        alert(
          `Court Collision: ${chosenCourt} currently has an ongoing LIVE match (${busy.currentMatchTitle || busy.currentMatchId}). Please complete the match or choose a free court.`
        )
        return
      }
    }

    try {
      try {
        await assignCourtOnBackend(tMatch.id, chosenCourt)
        await updateMatchStatusOnBackend(tMatch.id, "LIVE")
      } catch (backendErr) {
        console.warn("Backend court assign note:", backendErr.message)
      }

      const existing = allAssignedMatches.find((m) => m.id === tMatch.id)
      if (!existing) {
        createMatch(currentUser, {
          id: tMatch.id,
          sport: "badminton",
          category: tMatch.category || "Men's Singles",
          court: chosenCourt,
          player1: tMatch.player1,
          player2: tMatch.player2,
          tournament: tMatch.tournamentName || "GSV Badminton Championship 2026",
          stage: tMatch.stage || "Tournament Fixture",
          status: "LIVE",
          scheduledTime: `Live Court · ${chosenCourt}`,
        })
      } else {
        assignCourtAndStartMatch(currentUser, tMatch.id, chosenCourt)
      }

      setAlertMsg(`Match started LIVE on ${chosenCourt}! Entering Match Control...`)
      setTimeout(() => {
        navigate(`/sport-admin/matches/${tMatch.id}/control`)
      }, 500)
    } catch (err) {
      alert(err.message || "Failed to start match on court.")
    }
  }

  const filteredMatches = useMemo(() => {
    return allAssignedMatches.filter((match) => {
      const matchStatus = (match.status || "").toUpperCase()
      const matchesStatus =
        statusFilter === "ALL" || matchStatus === statusFilter.toUpperCase()

      const matchSport = (match.sport || "badminton").toLowerCase()
      const matchesSport =
        sportFilter === "ALL" || matchSport === sportFilter.toLowerCase()

      const matchesTournament = (() => {
        if (tournamentFilter === "ALL") return true
        if (match.tournamentId && match.tournamentId === tournamentFilter) return true
        if (match.id && typeof match.id === "string" && match.id.startsWith(tournamentFilter)) return true
        const selectedTour = backendTournaments.find((t) => t.id === tournamentFilter)
        if (selectedTour && match.tournament && match.tournament.trim().toLowerCase() === selectedTour.tournamentName.trim().toLowerCase()) {
          const matchCat = (match.category || "").toString().toUpperCase().replace(/[\s_']/g, "")
          const tourCat = (selectedTour.category?.name || selectedTour.category || "").toString().toUpperCase().replace(/[\s_']/g, "")
          return !tourCat || matchCat === tourCat
        }
        return false
      })()

      const query = search.trim().toLowerCase()

      const matchesSearch =
        !query ||
        [
          match.teamA?.name,
          match.teamB?.name,
          match.player1,
          match.player2,
          match.tournament,
          match.stage,
          match.venue,
          match.court,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))

      return matchesStatus && matchesSport && matchesTournament && matchesSearch
    })
  }, [allAssignedMatches, statusFilter, sportFilter, tournamentFilter, search])

  const liveCount = allAssignedMatches.filter(
    (match) => match.status === "LIVE"
  ).length

  const upcomingCount = allAssignedMatches.filter(
    (match) => match.status === "UPCOMING"
  ).length

  const completedCount = allAssignedMatches.filter(
    (match) => match.status === "COMPLETED"
  ).length

  const isSuperAdmin = currentUser.role === "super_admin"

  const handleMatchCreated = (created) => {
    if (created && created.id) {
      try {
        saveStoredMatches([created])
      } catch (_) {}
      setBackendMatches((prev) => {
        const filtered = prev.filter((m) => m.id !== created.id)
        return [created, ...filtered]
      })
    }
    loadDashboardData()
    setAlertMsg(`Match "${created?.teamA?.name || created?.player1} vs ${created?.teamB?.name || created?.player2}" created at 0-0!`)
    setTimeout(() => setAlertMsg(null), 3500)
  }

  const handleTournamentCreated = (created) => {
    if (created?.id) {
      setSelectedTournamentId(created.id)
      setTournamentFilter(created.id)
    }
    loadDashboardData()
    setAlertMsg(`Tournament "${created?.tournamentName || 'Bracket'}" created! Round 1 matches are now scheduled on courts.`)
    setTimeout(() => setAlertMsg(null), 4000)
  }

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        try {
          await deleteMatchOnBackend(matchId)
        } catch (backendErr) {
          console.warn("Backend delete notice:", backendErr.message)
        }
        deleteMatch(currentUser, matchId)
        setBackendMatches((prev) => prev.filter((m) => m.id !== matchId))
        setAlertMsg("Match deleted successfully.")
        setTimeout(() => setAlertMsg(null), 3000)
      } catch (err) {
        setBackendMatches((prev) => prev.filter((m) => m.id !== matchId))
        setAlertMsg("Match removed.")
        setTimeout(() => setAlertMsg(null), 3000)
      }
    }
  }

  const handleDeleteTournament = async (tournamentId) => {
    if (!tournamentId) {
      alert("No tournament selected to delete.")
      return
    }
    if (window.confirm("Are you sure you want to delete this tournament and cascade delete all its fixtures?")) {
      try {
        try {
          await deleteTournamentOnBackend(tournamentId)
        } catch (backendErr) {
          console.warn("Backend delete notice:", backendErr.message)
        }
        setBackendTournaments((prev) => {
          const updated = prev.filter((t) => t.id !== tournamentId)
          if (selectedTournamentId === tournamentId) {
            setSelectedTournamentId(updated[0]?.id || null)
          }
          return updated
        })
        setBackendMatches((prev) => prev.filter((m) => m.tournamentId !== tournamentId && !m.id.startsWith(tournamentId)))
        if (tournamentFilter === tournamentId) {
          setTournamentFilter("ALL")
        }
        try {
          localStorage.removeItem("gsv_tournament_bracket_store_v2")
          localStorage.removeItem("gsv_active_tournaments_v2")
          const raw = localStorage.getItem("gsv_admin_matches_store_v6")
          if (raw) {
            const parsed = JSON.parse(raw)
            const cleaned = parsed.filter((m) => m.tournamentId !== tournamentId && !m.id.startsWith(tournamentId))
            localStorage.setItem("gsv_admin_matches_store_v6", JSON.stringify(cleaned))
          }
        } catch (_) {}
        await loadDashboardData()
        setAlertMsg("Tournament and all fixtures deleted successfully.")
        setTimeout(() => setAlertMsg(null), 3000)
      } catch (err) {
        alert(err.message || "Failed to delete tournament.")
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#080D18] text-[#F4F6FA]">
      <CreateMatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleMatchCreated}
        currentUser={currentUser}
        existingMatches={allAssignedMatches}
        backendCourts={backendCourts}
      />

      <CreateTournamentModal
        isOpen={isTournamentModalOpen}
        onClose={() => setIsTournamentModalOpen(false)}
        onCreated={handleTournamentCreated}
        currentUser={currentUser}
      />

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            PUBLIC WEBSITE
          </Link>

          <div className="flex items-center gap-3">
            {backendTournaments.length > 0 ? (
              <button
                type="button"
                onClick={() => handleDeleteTournament(backendTournaments[0].id)}
                className="flex items-center gap-2 border border-rose-500 bg-rose-600/30 px-3.5 py-2 text-xs font-black tracking-wider text-rose-200 transition hover:bg-rose-600 hover:text-white cursor-pointer shadow-lg"
                title={`Delete active tournament: ${backendTournaments[0].tournamentName}`}
              >
                <Trash2 size={15} />
                DELETE TOURNAMENT
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const anyTourMatch = backendMatches.find((m) => m.tournamentId || (m.id && m.id.startsWith("tour-")))
                  if (anyTourMatch) {
                    const tourId = anyTourMatch.tournamentId || anyTourMatch.id.split("-").slice(0, 2).join("-")
                    handleDeleteTournament(tourId)
                  } else {
                    alert("No active tournaments to delete. Create a tournament first!")
                  }
                }}
                className="flex items-center gap-2 border border-rose-500/40 bg-rose-950/20 px-3.5 py-2 text-xs font-bold tracking-wider text-rose-400/80 transition hover:bg-rose-600 hover:text-white cursor-pointer"
                title="Delete any lingering tournament matches"
              >
                <Trash2 size={15} />
                DELETE TOURNAMENT
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsTournamentModalOpen(true)}
              className="flex items-center gap-2 border border-[#DFFF00] bg-[#DFFF00]/10 px-4 py-2 text-xs font-black tracking-wider text-[#DFFF00] transition hover:bg-[#DFFF00] hover:text-black cursor-pointer"
            >
              <Trophy size={15} />
              CREATE TOURNAMENT
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 border border-[#07F080] bg-[#07F080] px-4 py-2 text-xs font-black tracking-wider text-black transition hover:bg-[#07F080]/90"
            >
              <Plus size={16} />
              CREATE NEW MATCH
            </button>
          </div>
        </div>

        {alertMsg && (
          <div className="mt-4 flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs font-mono font-bold text-emerald-300">
            <CheckCircle2 size={16} />
            <span>{alertMsg}</span>
          </div>
        )}

        <section className="mt-8 border border-white/10 bg-[#101722]">
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-9 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-[#07F080]">
                <ShieldCheck size={15} />
                AUTHORIZED WORKSPACE
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                MATCH OPERATIONS<span className="text-[#07F080]">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Welcome, {currentUser.name}. Zero mock matches are preloaded — create matches dynamically,
                officiate points from 0-0, and manage live court scoreboards.
              </p>
            </div>

            <div className="min-w-0 border-l-2 border-[#07F080] pl-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-500">
                SIGNED-IN ADMIN ACCOUNT
              </p>
              <p className="mt-2 break-all text-sm font-bold">
                {currentUser.name} ({currentUser.email})
              </p>
              <p className="mt-1 text-xs text-[#07F080]">
                {isSuperAdmin
                  ? "Super Admin · All Sports"
                  : `${currentUser.primarySport} Administrator`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
            {[
              { label: "TOTAL MATCHES", value: allAssignedMatches.length },
              { label: "LIVE NOW", value: liveCount },
              { label: "UPCOMING", value: upcomingCount },
              { label: "COMPLETED", value: completedCount },
            ].map((item) => (
              <div
                key={item.label}
                className="border-b border-r border-white/10 p-5 last:border-r-0 md:border-b-0"
              >
                <p className="text-[9px] font-bold tracking-widest text-gray-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ONGOING TOURNAMENT BRACKET & COURT ASSIGNMENTS */}
        {currentBracket && currentBracket.length > 0 ? (
          <section className="mt-10 border border-white/10 bg-[#0F172A] p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#DFFF00]">
                  <Trophy size={15} />
                  ACTIVE TOURNAMENT BRACKET & COURT DISPATCH
                </div>
                <h2 className="mt-1 text-xl font-black uppercase text-white">
                  {activeTournament?.tournamentName || currentBracket[0]?.matches[0]?.tournamentName || "GSV Badminton Championship 2026"}
                </h2>
                {activeTournament?.category && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#DFFF00] bg-[#DFFF00]/10 px-2 py-0.5 rounded border border-[#DFFF00]/30">
                      {activeTournament.category.toString().replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Format: Knockout ({activeTournament.participants?.length || 8} Contenders)
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  Assign open courts to upcoming tournament fixtures and begin live scorekeeping. Winners advance dynamically across rounds.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeTournament && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTournament(activeTournament.id)}
                    className="flex items-center gap-2 border border-rose-500 bg-rose-600/25 px-4 py-2 text-xs font-black tracking-wider text-rose-300 hover:bg-rose-600 hover:text-white transition cursor-pointer shadow-lg"
                    title={`Delete ${activeTournament.tournamentName} and all its fixtures`}
                  >
                    <Trash2 size={14} />
                    DELETE TOURNAMENT
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsTournamentModalOpen(true)}
                  className="flex items-center gap-2 border border-[#DFFF00] bg-[#DFFF00]/10 px-3 py-1.5 text-xs font-bold text-[#DFFF00] hover:bg-[#DFFF00] hover:text-black transition cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  NEW TOURNAMENT
                </button>
              </div>
            </div>

            {backendTournaments.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2.5 items-center border border-white/10 bg-black/40 p-3 rounded">
                <span className="text-[10px] font-mono text-[#DFFF00] uppercase font-bold tracking-wider mr-1">
                  Active Tournaments ({backendTournaments.length}):
                </span>
                {backendTournaments.map((tour) => {
                  const isSelected = activeTournament?.id === tour.id
                  const catLabel = (tour.category?.name || tour.category || "").toString().replace(/_/g, " ")
                  return (
                    <div
                      key={tour.id}
                      onClick={() => {
                        setSelectedTournamentId(tour.id)
                        setTournamentFilter(tour.id)
                      }}
                      className={`flex items-center gap-2 border px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer select-none ${
                        isSelected
                          ? "border-[#DFFF00] bg-[#DFFF00] text-black shadow-lg shadow-[#DFFF00]/20"
                          : "border-white/10 bg-[#1E293B] text-gray-300 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <Trophy size={13} className={isSelected ? "text-black" : "text-[#DFFF00]"} />
                      <span>{tour.tournamentName}</span>
                      {catLabel && (
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                            isSelected ? "bg-black/20 text-black font-black" : "bg-white/10 text-gray-400"
                          }`}
                        >
                          {catLabel}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteTournament(tour.id)
                        }}
                        className={`ml-1 p-0.5 transition cursor-pointer ${
                          isSelected ? "text-black/80 hover:text-rose-950" : "text-rose-400 hover:text-rose-200"
                        }`}
                        title={`Delete ${tour.tournamentName}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="mt-6 space-y-6">
              {currentBracket.map((round) => (
                <div key={round.title} className="border border-white/5 bg-black/30 p-4 rounded">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                    <span className="text-xs font-black tracking-widest text-[#DFFF00] uppercase font-mono">
                      {round.title} ({round.matches.length} {round.matches.length === 1 ? "Match" : "Matches"})
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      Round Format: Single Elimination
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {round.matches.map((m) => {
                      const isComplete = Boolean(m.winner)
                      const isBothKnown = m.player1 !== "TBD" && m.player2 !== "TBD"
                      const existingMatch = allAssignedMatches.find((am) => am.id === m.id)
                      const isLive = existingMatch?.status === "LIVE"
                      const assignedCourt = selectedCourtsForMatches[m.id] || m.court || "Badminton Court 01"

                      return (
                        <div
                          key={m.id}
                          className={`border p-3.5 rounded flex flex-col justify-between gap-3 text-xs font-mono transition ${isComplete
                            ? "border-emerald-500/20 bg-emerald-950/10 text-gray-300"
                            : isLive
                              ? "border-[#DFFF00]/50 bg-[#DFFF00]/5 text-white"
                              : "border-white/10 bg-[#162032] text-gray-200"
                            }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
                              <span className="font-bold">{m.stage || round.title}</span>
                              {isComplete ? (
                                <span className="text-emerald-400 font-bold">COMPLETED</span>
                              ) : isLive ? (
                                <span className="text-[#DFFF00] font-black flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#DFFF00] animate-pulse" />
                                  LIVE NOW
                                </span>
                              ) : (
                                <span className="text-sky-400">UPCOMING</span>
                              )}
                            </div>

                            <div className="space-y-1.5 font-sans">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold ${m.winner === m.player1 ? "text-[#DFFF00]" : "text-white"}`}>
                                  {m.player1}
                                </span>
                                <span className="font-mono font-black text-sm">
                                  {m.score1 ?? existingMatch?.teamA?.score ?? "—"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`font-bold ${m.winner === m.player2 ? "text-[#DFFF00]" : "text-white"}`}>
                                  {m.player2}
                                </span>
                                <span className="font-mono font-black text-sm">
                                  {m.score2 ?? existingMatch?.teamB?.score ?? "—"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-white/10 pt-2.5 mt-1">
                            {isComplete ? (
                              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                                <span>🏆</span>
                                <span>Winner: {m.winner}</span>
                              </div>
                            ) : !isBothKnown ? (
                              <div className="text-[10px] text-gray-500 italic">
                                Waiting for contenders from previous round...
                              </div>
                            ) : isLive ? (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] text-gray-400 font-mono truncate">
                                  {existingMatch?.court || m.court}
                                </span>
                                <Link
                                  to={`/sport-admin/matches/${m.id}/control`}
                                  className="border border-[#DFFF00] bg-[#DFFF00] px-2.5 py-1 text-[10px] font-black text-black hover:bg-[#DFFF00]/90 transition"
                                >
                                  OFFICIATE SCORE →
                                </Link>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[9px] text-gray-400 uppercase tracking-wider mb-1">
                                    Assign Court:
                                  </label>
                                  <select
                                    value={assignedCourt}
                                    onChange={(e) =>
                                      setSelectedCourtsForMatches((prev) => ({
                                        ...prev,
                                        [m.id]: e.target.value,
                                      }))
                                    }
                                    className="w-full border border-white/10 bg-[#0B101B] px-2 py-1 text-[10px] text-white outline-none focus:border-[#DFFF00]"
                                  >
                                    {COURTS_LIST.map((cName) => {
                                      const isBusy = liveOccupiedCourtsMap.has(cName.toLowerCase())
                                      return (
                                        <option
                                          key={cName}
                                          value={cName}
                                          className={isBusy ? "text-amber-400 font-bold" : "text-white"}
                                        >
                                          {cName} {isBusy ? "— ⚠️ (BUSY)" : "— ✅ (FREE)"}
                                        </option>
                                      )
                                    })}
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleStartTournamentMatch(m)}
                                  className="w-full flex items-center justify-center gap-1.5 border border-[#07F080] bg-[#07F080]/15 py-1.5 text-[10px] font-black text-[#07F080] hover:bg-[#07F080] hover:text-black transition cursor-pointer"
                                >
                                  <Play size={11} />
                                  ASSIGN & START MATCH (LIVE)
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10 border border-dashed border-white/10 bg-[#0F172A]/40 p-8 rounded-lg text-center">
            <Trophy size={36} className="mx-auto text-gray-600 mb-3" />
            <h2 className="text-base font-bold uppercase text-white tracking-wider">
              No Active Tournaments
            </h2>
            <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
              Zero tournament brackets are currently active in the database. Click "CREATE TOURNAMENT" above to launch an official knockout championship (powers of 2: 2, 4, 8, 16, 32, 64).
            </p>
            <button
              type="button"
              onClick={() => setIsTournamentModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 border border-[#DFFF00] bg-[#DFFF00]/10 px-4 py-2 text-xs font-black tracking-wider text-[#DFFF00] hover:bg-[#DFFF00] hover:text-black transition cursor-pointer"
            >
              <Plus size={15} />
              CREATE TOURNAMENT BRACKET
            </button>
          </section>
        )}

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500">
                MATCH OPERATIONS / 01
              </p>
              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                Scheduled & Live Fixtures
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Activity size={15} />
              <span>
                {filteredMatches.length} of {allAssignedMatches.length} matches
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-4">
            <div className="relative max-w-lg">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search teams, players, tournaments or venues..."
                aria-label="Search assigned matches"
                className="w-full border border-white/10 bg-[#101722] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#07F080]"
              />
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`border px-3 py-2 text-[10px] font-bold tracking-widest transition ${statusFilter === status
                      ? "border-[#07F080] bg-[#07F080] text-black"
                      : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {SPORT_FILTERS.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => setSportFilter(sport)}
                    className={`border px-3 py-2 text-[10px] font-bold tracking-wider transition ${sportFilter === sport
                      ? "border-[#35C5F4] bg-[#35C5F4]/10 text-[#35C5F4]"
                      : "border-white/10 text-gray-500 hover:text-white"
                      }`}
                  >
                    {sport === "ALL"
                      ? "ALL SPORTS"
                      : SPORT_META[sport].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament Fixtures Filter Bar */}
            {backendTournaments.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mr-1">
                  Tournament Fixtures:
                </span>
                <button
                  type="button"
                  onClick={() => setTournamentFilter("ALL")}
                  className={`border px-3 py-1.5 text-[10px] font-bold tracking-wider transition cursor-pointer rounded ${
                    tournamentFilter === "ALL"
                      ? "border-[#DFFF00] bg-[#DFFF00] text-black"
                      : "border-white/10 bg-[#162032] text-gray-400 hover:text-white"
                  }`}
                >
                  ALL TOURNAMENTS ({allAssignedMatches.length})
                </button>
                {backendTournaments.map((tour) => {
                  const isSelected = tournamentFilter === tour.id
                  const tourCat = (tour.category?.name || tour.category || "").toString().toUpperCase().replace(/[\s_']/g, "")
                  const tourMatchesCount = allAssignedMatches.filter((m) => {
                    if (m.tournamentId && m.tournamentId === tour.id) return true
                    if (m.id && typeof m.id === "string" && m.id.startsWith(tour.id)) return true
                    if (m.tournament && m.tournament.trim().toLowerCase() === tour.tournamentName.trim().toLowerCase()) {
                      const matchCat = (m.category || "").toString().toUpperCase().replace(/[\s_']/g, "")
                      if (tourCat && matchCat && tourCat === matchCat) return true
                    }
                    return false
                  }).length
                  const catLabel = (tour.category?.name || tour.category || "").toString().replace(/_/g, " ")

                  return (
                    <button
                      key={tour.id}
                      type="button"
                      onClick={() => setTournamentFilter(tour.id)}
                      className={`flex items-center gap-1.5 border px-3 py-1.5 text-[10px] font-bold tracking-wider transition cursor-pointer rounded ${
                        isSelected
                          ? "border-[#DFFF00] bg-[#DFFF00] text-black"
                          : "border-white/10 bg-[#162032] text-gray-300 hover:text-white"
                      }`}
                    >
                      <Trophy size={11} className={isSelected ? "text-black" : "text-[#DFFF00]"} />
                      <span>{tour.tournamentName}</span>
                      {catLabel && (
                        <span
                          className={`text-[8px] uppercase px-1 py-0.2 rounded font-mono ${
                            isSelected ? "bg-black/20 text-black font-black" : "bg-white/10 text-gray-400"
                          }`}
                        >
                          {catLabel}
                        </span>
                      )}
                      <span className="opacity-80 font-mono">({tourMatchesCount})</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {filteredMatches.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onDelete={handleDeleteMatch}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-white/15 px-6 py-16 text-center">
              <Clock3
                size={32}
                className="mx-auto text-gray-600"
              />
              <h3 className="mt-4 text-base font-bold text-white uppercase tracking-wider">
                NO MATCHES FOUND
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-400">
                Zero placeholder matches are loaded. Click the button below to create your first match starting at 0-0.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 border border-[#07F080] bg-[#07F080] px-5 py-2.5 text-xs font-black tracking-wider text-black transition hover:bg-[#07F080]/90"
                >
                  <Plus size={16} />
                  CREATE FIRST MATCH
                </button>
                {(statusFilter !== "ALL" || sportFilter !== "ALL" || search) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("ALL")
                      setSportFilter("ALL")
                      setSearch("")
                    }}
                    className="border border-white/10 px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-white"
                  >
                    RESET FILTERS
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] text-gray-600 sm:flex-row">
          <span>GSV ATHLETICS · MATCH OPERATIONS</span>
          <span>ADMIN PORTAL · MONGODB ATLAS CONNECTED</span>
        </footer>
      </div>
    </main>
  )
}
