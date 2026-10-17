/**
 * Super Admin Dashboard (Frontend Boundary)
 * Route: /admin
 * Reserved for tournament creation, match scheduling, and assigning sport admins.
 */
import Badge from "../../../components/atoms/Badge"
import Button from "../../../components/atoms/Button"

export default function SuperAdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Banner */}
      <div className="border border-amber-400/20 bg-amber-950/10 p-8 md:p-12 mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-400/20 pb-4 mb-6">
          <Badge variant="warning">FRONTEND ARCHITECTURE STUB</Badge>
          <span className="text-xs text-amber-300 font-mono">ROLE: SUPER ADMINISTRATOR</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          SUPER ADMIN <span className="text-amber-400">CONTROL CENTER</span>
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm text-gray-300 leading-relaxed">
          This reserved feature interface is structured for future backend integration. It will enable university athletic heads to create new sport tournaments, schedule campus matches, and designate sport-level scorekeepers.
        </p>
      </div>

      {/* Planned Feature Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1 */}
        <div className="border border-white/10 bg-[#111313] p-7">
          <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">MODULE 01</p>
          <h3 className="mt-3 text-xl font-black uppercase text-white">Create Tournament</h3>
          <p className="mt-2 text-xs leading-6 text-gray-400">
            Form workflows for defining tournament format (single/double elimination, round robin), participating branches, and court allocations.
          </p>
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="inline-block border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-gray-500">
              AWAITING API INTEGRATION
            </span>
          </div>
        </div>

        {/* Module 2 */}
        <div className="border border-white/10 bg-[#111313] p-7">
          <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">MODULE 02</p>
          <h3 className="mt-3 text-xl font-black uppercase text-white">Match Scheduling</h3>
          <p className="mt-2 text-xs leading-6 text-gray-400">
            Date/time slot picker, court referee assignments, and automatic calendar generation for student viewing.
          </p>
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="inline-block border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-gray-500">
              AWAITING API INTEGRATION
            </span>
          </div>
        </div>

        {/* Module 3 */}
        <div className="border border-white/10 bg-[#111313] p-7">
          <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">MODULE 03</p>
          <h3 className="mt-3 text-xl font-black uppercase text-white">Sport Admin Roles</h3>
          <p className="mt-2 text-xs leading-6 text-gray-400">
            Assign student officials and referees to specific sports (e.g. Badminton Court Official, Cricket Umpire).
          </p>
          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="inline-block border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-gray-500">
              AWAITING API INTEGRATION
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Button to="/" variant="outline" size="sm">
          ← Return to Public Site
        </Button>
        <Button to="/sport-admin" variant="secondary" size="sm">
          View Sport Admin Screen →
        </Button>
      </div>
    </div>
  )
}
