
export default function ScheduleRow({ match }) {
  const statusStyles = {
    LIVE: "text-[#DFFF00] border-[#DFFF00]/30 bg-[#DFFF00]/5",
    UPCOMING: "text-blue-300 border-blue-300/20 bg-blue-300/5",
    COMPLETED: "text-gray-500 border-white/10 bg-white/5",
  }

  return (
    <article className="grid gap-4 border-b border-white/10 px-5 py-6 transition hover:bg-white/[0.02] md:grid-cols-[100px_1fr_1.5fr_120px] md:items-center md:px-6">

      {/* Time and date */}
      <div>
        <p className="text-lg font-black text-white">
          {match.time}
        </p>
        <p className="mt-1 text-[10px] font-bold tracking-widest text-gray-500">
          {match.date}
        </p>
      </div>

      {/* Match category */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-[#DFFF00]">
          {match.category}
        </p>
        {match.tournament && (
          <p className="text-[9px] text-gray-400 font-mono truncate max-w-[160px]" title={match.tournament}>
            {match.tournament}
          </p>
        )}
        <p className="mt-1 text-[10px] tracking-widest text-gray-500">
          {match.court}
        </p>
      </div>

      {/* Players */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <p className="break-words text-sm font-semibold text-gray-200">
          {match.player1}
        </p>

        <span className="text-[10px] font-bold text-gray-600">
          VS
        </span>

        <p className="break-words text-right text-sm font-semibold text-gray-200">
          {match.player2}
        </p>
      </div>

      {/* Status */}
      <div className="md:text-right">
        <span
          className={`inline-flex border px-3 py-2 text-[9px] font-black tracking-widest ${
            statusStyles[match.status] ?? statusStyles.UPCOMING
          }`}
        >
          {match.status}
        </span>
      </div>
    </article>
  )
}
