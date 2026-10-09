
export default function Marquee() {
  const items = [
    "FAST",
    "FOCUSED",
    "FEARLESS",
    "GAME ON",
  ]
  {/*bhaiya add if you want to add more items in the marquee, just add them to the items array above.*/}
  
  return (
    <div className="overflow-hidden border-y border-[#DFFF00]/20 bg-[#DFFF00] py-5 text-[#080909]">
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-xs font-black tracking-widest sm:gap-x-10 sm:text-sm">
        {items.map((item, index) => (
          <span key={item} className="flex items-center gap-6 sm:gap-10">
            {item}
            {index !== items.length - 1 && (
              <span aria-hidden="true">✳</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
