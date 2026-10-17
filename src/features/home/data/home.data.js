/**
 * Home page data definitions
 */
export const platformStats = [
  { value: "07", label: "INTERCOLLEGIATE SPORTS" },
  { value: "120+", label: "STUDENT ATHLETES" },
  { value: "04", label: "ACTIVE TOURNAMENTS" },
  { value: "LIVE", label: "BADMINTON CHAMPIONSHIP", isLive: true },
]

export const featuredHighlights = [
  {
    id: "hl-1",
    sport: "BADMINTON",
    title: "Men's Singles Championship Semifinals",
    detail: "Arav Kumar vs Karan Singh · Court 01",
    status: "LIVE NOW",
    to: "/sports/badminton",
  },
  {
    id: "hl-2",
    sport: "CRICKET",
    title: "Inter-Department T20 Cup Opening Fixture",
    detail: "Mechanical vs Computer Science · Main Oval",
    status: "UPCOMING",
    to: "/sports/cricket",
  },
  {
    id: "hl-3",
    sport: "VOLLEYBALL",
    title: "Campus Spikers Super League",
    detail: "Hostel 1 vs Hostel 4 · Court A",
    status: "COMING SOON",
    to: "/sports/volleyball",
  },
]
