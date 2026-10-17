/**
 * LoadingState Shared Component
 */
export default function LoadingState({ message = "Loading sports data..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-10 w-10 border-2 border-[#DFFF00] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xs font-bold tracking-widest uppercase text-gray-400">
        {message}
      </p>
    </div>
  )
}
