
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  ShieldCheck,
  Radio,
  Search,
  Trophy,
  Volleyball,
  CircleDot,
  Activity,
} from "lucide-react"

import { getCurrentAdminUser } from "../services/adminAuthService"
import { getAssignedMatches } from "../services/matchControlService"

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
      className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] font-bold tracking-widest ${
        styles[status] || styles.UPCOMING
      }`}
    >
      {status === "LIVE" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
      )}
      {status}
    </span>
  )
}

function MatchCard({ match }) {
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

          <StatusBadge status={match.status} />
        </div>

        <div className="my-5 border-y border-white/10 py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {match.teamA.name}
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                TEAM A
              </p>
            </div>

            <p
              className="shrink-0 text-2xl font-black tabular-nums"
              style={{ color: sport.color }}
            >
              {formatScore(match, match.teamA)}
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
                {match.teamB.name}
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                TEAM B
              </p>
            </div>

            <p className="shrink-0 text-2xl font-black tabular-nums text-[#35C5F4]">
              {formatScore(match, match.teamB)}
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

export default function AssignedMatchesDashboard() {
  const currentUser = getCurrentAdminUser()
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sportFilter, setSportFilter] = useState("ALL")
  const [search, setSearch] = useState("")

  const allAssignedMatches = useMemo(
    () => getAssignedMatches(currentUser),
    [currentUser.id]
  )

  const filteredMatches = useMemo(() => {
    return allAssignedMatches.filter((match) => {
      const matchesStatus =
        statusFilter === "ALL" || match.status === statusFilter

      const matchesSport =
        sportFilter === "ALL" || match.sport === sportFilter

      const query = search.trim().toLowerCase()

      const matchesSearch =
        !query ||
        [
          match.teamA?.name,
          match.teamB?.name,
          match.tournament,
          match.stage,
          match.venue,
          match.court,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))

      return matchesStatus && matchesSport && matchesSearch
    })
  }, [allAssignedMatches, statusFilter, sportFilter, search])

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

  return (
    <main className="min-h-screen bg-[#080D18] text-[#F4F6FA]">
      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          PUBLIC WEBSITE
        </Link>

        <section className="mt-8 border border-white/10 bg-[#101722]">
          <div className="flex flex-col justify-between gap-6 p-6 sm:p-9 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.22em] text-[#07F080]">
                <ShieldCheck size={15} />
                AUTHORIZED WORKSPACE
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                YOUR MATCHES<span className="text-[#07F080]">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Welcome, {currentUser.name}. Your assigned fixtures,
                match status, and scoring controls are collected here.
              </p>
            </div>

            <div className="min-w-0 border-l-2 border-[#07F080] pl-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-500">
                SIGNED-IN DEMO IDENTITY
              </p>
              <p className="mt-2 break-all text-sm font-bold">
                {currentUser.email}
              </p>
              <p className="mt-1 text-xs text-[#07F080]">
                {isSuperAdmin
                  ? "Super admin · All sports"
                  : `${currentUser.primarySport} scorekeeper`}
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

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500">
                MATCH OPERATIONS / 01
              </p>
              <h2 className="mt-2 text-xl font-black sm:text-2xl">
                Assigned fixtures
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
                placeholder="Search teams, tournaments or venues..."
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
                    className={`border px-3 py-2 text-[10px] font-bold tracking-widest transition ${
                      statusFilter === status
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
                    className={`border px-3 py-2 text-[10px] font-bold tracking-wider transition ${
                      sportFilter === sport
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
          </div>

          {filteredMatches.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="mt-6 border border-dashed border-white/15 px-6 py-16 text-center">
              <Clock3
                size={28}
                className="mx-auto text-gray-600"
              />
              <h3 className="mt-4 text-sm font-bold">
                NO MATCHES FOUND
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-gray-500">
                No assigned fixtures match these filters. Try another
                sport, status, or search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("ALL")
                  setSportFilter("ALL")
                  setSearch("")
                }}
                className="mt-5 text-xs font-bold text-[#07F080] hover:underline"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </section>

        <footer className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[10px] text-gray-600 sm:flex-row">
          <span>GSV ATHLETICS · MATCH OPERATIONS</span>
          <span>DEMO MODE · LOCAL BROWSER STORAGE</span>
        </footer>
      </div>
    </main>
  )
}
