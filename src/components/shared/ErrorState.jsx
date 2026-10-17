/**
 * ErrorState Shared Component
 */
import Button from "../atoms/Button"

export default function ErrorState({
  title = "Something Went Wrong",
  message = "Failed to load the requested athletic records. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-red-500/20 bg-red-950/10 p-12 text-center">
      <div className="grid h-12 w-12 place-items-center border border-red-500 text-red-400 mb-4 font-mono font-bold">
        !
      </div>
      <h3 className="text-xl font-black uppercase text-red-200 tracking-tight">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-xs leading-6 text-gray-400">
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
