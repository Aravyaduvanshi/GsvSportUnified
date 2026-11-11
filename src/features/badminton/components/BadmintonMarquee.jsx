
export default function Marquee() {
  const items = [
    "FAST",
    "FOCUSED",
    "FEARLESS",
    "GAME ON",
  ]
  const repeatedItems = [...items, ...items, ...items] // Seamless looping items
  return (
    <section
      aria-label="Championship spirit"
      className="overflow-hidden border-y border-[#DFFF00]/20 bg-[#DFFF00] py-5 text-[#080909]"
    >
      <div className="marquee-track flex w-max items-center motion-reduce:animate-none">
        {repeatedItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-6 px-6 text-xs font-black tracking-widest sm:gap-10 sm:px-10 sm:text-sm"
          >
            {item}
            <span aria-hidden="true">✳</span>
          </span>
        ))}
      </div>
    </section>
  )
}
