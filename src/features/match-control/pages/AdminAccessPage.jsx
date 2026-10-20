

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  MOCK_ADMIN_ACCOUNTS,
  setCurrentAdminUser,
} from "../services/adminAuthService"

export default function AdminAccessPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState("")
  const [error, setError] = useState("")

  const handleAccess = () => {
    if (!selectedId) {
      setError("Select a demo account to continue.")
      return
    }

    const user = setCurrentAdminUser(selectedId)

    if (!user) {
      setError("Unable to select this account.")
      return
    }

    const destination =
      user.role === "super_admin" ? "/admin" : "/sport-admin"

    navigate(destination, { replace: true })
  }

  return (
    <main className="min-h-screen bg-[#080D18] px-5 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-[#07F080]">
            GSV SPORTS / ADMIN ACCESS
          </p>

          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            YOUR WORKSPACE.
            <br />
            <span className="text-[#07F080]">YOUR RESPONSIBILITY.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
            Select a demonstration account to preview the workspace
            associated with its role. This screen uses local mock
            authentication and does not verify a real identity.
          </p>
        </header>

        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Select an account
          </h2>

          <span className="border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-300">
            DEMO MODE
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_ADMIN_ACCOUNTS.map((user) => {
            const isSuperAdmin = user.role === "super_admin"
            const selected = selectedId === user.id

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setSelectedId(user.id)
                  setError("")
                }}
                aria-pressed={selected}
                className={`group min-h-52 border p-5 text-left transition duration-200 ${
                  selected
                    ? "border-[#07F080] bg-[#07F080]/10"
                    : "border-white/10 bg-[#111827] hover:border-white/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid h-12 w-12 place-items-center border text-sm font-black ${
                      isSuperAdmin
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                        : "border-sky-400/40 bg-sky-400/10 text-sky-300"
                    }`}
                  >
                    {user.avatar}
                  </div>

                  <span
                    className={`border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${
                      isSuperAdmin
                        ? "border-amber-400/30 text-amber-300"
                        : "border-sky-400/30 text-sky-300"
                    }`}
                  >
                    {isSuperAdmin ? "Super admin" : "Sport admin"}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold">
                  {user.name}
                </h3>

                <p className="mt-1 break-all text-xs text-gray-400">
                  {user.email}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500">
                    {user.primarySport}
                  </span>

                  <span
                    className={
                      selected
                        ? "text-xs font-bold text-[#07F080]"
                        : "text-xs text-gray-400"
                    }
                  >
                    {selected ? "SELECTED ✓" : "SELECT →"}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <p role="alert" className="mt-5 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-left text-xs font-bold tracking-wider text-gray-400 transition hover:text-white"
          >
            ← RETURN TO PUBLIC WEBSITE
          </button>

          <button
            type="button"
            onClick={handleAccess}
            className="bg-[#07F080] px-7 py-4 text-xs font-black tracking-widest text-black transition hover:bg-[#66FFA8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ENTER WORKSPACE →
          </button>
        </div>

        <p className="mt-8 text-[11px] leading-6 text-gray-500">
          Frontend demonstration only. Account selection is not
          authentication, and localStorage does not provide a security
          boundary. Do not use this flow to protect real administrative
          operations.
        </p>
      </div>
    </main>
  )
}
