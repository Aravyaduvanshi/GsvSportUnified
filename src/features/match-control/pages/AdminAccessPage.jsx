import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ShieldCheck, Lock, User, ArrowLeft, KeyRound, AlertCircle, Eye, EyeOff } from "lucide-react"
import { loginAdmin } from "../services/adminAuthService"

export default function AdminAccessPage() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await loginAdmin(identifier.trim(), password)

      // Determine redirection based on sport admin role
      const sportParam = user.primarySport ? user.primarySport.toLowerCase() : "badminton"
      const destination =
        user.role === "super_admin"
          ? "/sport-admin"
          : `/sport-admin?sport=${sportParam}`

      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || "Invalid administrator credentials.")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080D18] flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 text-white select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-gray-500 hover:text-white transition mb-6"
        >
          <ArrowLeft size={14} />
          RETURN TO PUBLIC WEBSITE
        </Link>

        <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-[#07F080] uppercase">
          <ShieldCheck size={16} />
          GSV SPORTS · OFFICIALS ONLY
        </div>

        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl uppercase">
          ADMIN SIGN IN<span className="text-[#07F080]">.</span>
        </h2>
        <p className="mt-2 text-xs text-gray-400">
          Enter your username and password to access your assigned sport control console.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border border-white/10 bg-[#0F172A] p-6 sm:p-8 rounded-lg shadow-2xl">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 font-mono">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Admin Username or Email
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter admin username or email"
                  autoComplete="username"
                  className="w-full border border-white/10 bg-[#1E293B] pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-[#07F080] font-mono transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-white/10 bg-[#1E293B] pl-9 pr-10 py-2.5 text-xs text-white outline-none focus:border-[#07F080] font-mono transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 border border-[#07F080] bg-[#07F080] px-4 py-3 text-xs font-black tracking-widest text-black transition hover:bg-[#07F080]/90 disabled:opacity-50 cursor-pointer uppercase"
            >
              <KeyRound size={15} />
              {isLoading ? "VERIFYING CREDENTIALS..." : "SIGN IN & ENTER WORKSPACE →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
