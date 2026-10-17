/**
 * NotFound Shared Page Component
 * Clean 404 page adhering to the dark sports aesthetic.
 */
import Button from "../atoms/Button"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center border border-[#DFFF00] text-2xl font-black text-[#DFFF00] mb-6">
        404
      </div>
      <p className="text-[10px] font-bold tracking-[0.25em] text-[#DFFF00]">
        OUT OF BOUNDS
      </p>
      <h1 className="mt-3 text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
        PAGE NOT FOUND
      </h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
        The play you called does not exist. Check the URL or return to the central sports hub.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Button to="/" variant="primary">
          Back to Home
        </Button>
        <Button to="/sports" variant="outline">
          Explore Sports
        </Button>
      </div>
    </div>
  )
}
