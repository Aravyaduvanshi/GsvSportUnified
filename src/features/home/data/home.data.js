/**
 * Home page data definitions
 * Central platform statistics and championship highlights across Badminton, Cricket, and Basketball.
 */
export const platformStats = [
  { value: "03", label: "ACTIVE CHAMPIONSHIPS" },
  { value: "160+", label: "STUDENT ATHLETES" },
  { value: "03", label: "BROADCAST HUBS" },
  { value: "LIVE", label: "MULTI-SPORT ACTION", isLive: true },
]

export const featuredHighlights = [
  {
    id: "hl-1",
    sport: "BADMINTON",
    sportId: "badminton",
    title: "Men's Singles Championship Semifinals",
    detail: "Arav Kumar vs Karan Singh · Court 01",
    status: "LIVE NOW",
    accent: "#DFFF00",
    to: "/sports/badminton",
  },
  {
    id: "hl-2",
    sport: "CRICKET",
    sportId: "cricket",
    title: "GSV Inter-Department T20 Super 4",
    detail: "CS Warriors vs Mechanical Titans · Main Oval",
    status: "LIVE SCORECARD",
    accent: "#07F080",
    to: "/sports/cricket",
  },
  {
    id: "hl-3",
    sport: "BASKETBALL",
    sportId: "basketball",
    title: "GSV Hoops Classic Semifinals",
    detail: "Hostel 3 Ballers vs Civil Slammers · North Court 1",
    status: "LIVE 3RD QTR",
    accent: "#F97316",
    to: "/sports/basketball",
  },
]
