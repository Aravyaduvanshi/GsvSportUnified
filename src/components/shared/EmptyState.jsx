/**
 * EmptyState Shared Component
 */
import Button from "../atoms/Button"

export default function EmptyState({
  title = "No Matches Found",
  description = "There are currently no active fixtures scheduled in this section.",
  actionText = "Explore All Sports",
  actionTo = "/sports",
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-white/10 bg-[#111313] p-12 text-center">
      <div className="grid h-12 w-12 place-items-center border border-white/20 text-gray-500 mb-4 font-mono">
        ∅
      </div>
      <h3 className="text-xl font-black uppercase text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-xs leading-6 text-gray-400">
        {description}
      </p>
      {actionText && actionTo && (
        <div className="mt-6">
          <Button to={actionTo} variant="outline" size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  )
}
