# GSV Sports Platform — Frontend Architecture

Centralized collegiate athletics portal for **Gati Shakti Vishwavidyalaya (GSV)**. Initially built as a specialized college badminton tournament platform, this repository is architected to scale into a unified portal spanning all campus sports: **Badminton**, **Cricket**, **Volleyball**, **Table Tennis**, **Kabaddi**, **Throwball**, **Basketball**, and future disciplines.

---

## 1. Technology Stack

- **Framework**: React 19 + JSX
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Routing**: React Router v7 (`createBrowserRouter`)
- **Icons**: `lucide-react`
- **Architecture**: Hybrid Feature-Based Architecture + Atomic Design

---

## 2. Design System Tokens

- **Background**: `#080909` (near-black collegiate stadium dark)
- **Primary Accent**: `#DFFF00` (high-voltage neon lime)
- **Secondary Surfaces**: `#111313`, `#0C0E0D`
- **Card Borders**: `border-white/10`, hover `border-[#DFFF00]/60`
- **Typography**: Clean, high-impact athletic styling with tracking and monospace accents

---

## 3. Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation
Clone the repository and install dependencies:

```bash
npm install
```

### Development Server
Run Vite in development mode:

```bash
npm run dev
```

### Production Build
Compile and bundle the production assets:

```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 4. Main Routes

| URL Route | Experience | Description |
| :--- | :--- | :--- |
| `/` | **Central Landing Page** | Global hero, sport selection grid, live/upcoming match highlights |
| `/sports` | **Sports Directory** | Catalog of all 7 collegiate sports with status filtering |
| `/sports/badminton` | **Badminton Championship** | **100% Preserved original experience**: Hero, Marquee, LiveMatch, Schedule, PlayerGrid, Brackets, and anchor navigation |
| `/sports/cricket` | **Cricket Arena** | Inter-departmental T20 championship arena |
| `/sports/volleyball` | **Volleyball Super Cup** | Set scores and tournament information |
| `/sports/table-tennis` | **Table Tennis Open** | Singles & doubles clash schedule |
| `/sports/kabaddi` | **Kabaddi Championship** | Raid timer & tackle points portal |
| `/sports/throwball` | **Throwball Tournament** | Women's inter-hostel tournament |
| `/sports/basketball` | **Basketball Classic** | 5v5 league standings and quarter scores |
| `/matches` | **Match Calendar** | All fixtures, status filters (Live/Upcoming/Completed) |
| `/matches/:matchId` | **Match Details** | Stadium scoreboard and player head-to-head |
| `/tournaments` | **Tournament Center** | Knockout trees and bracket ladders |
| `/student` | **Student Portal** | Student athlete schedule and bookmarks |
| `/admin` | **Super Admin Console** | Tournament creation and admin assignment stub |
| `/sport-admin` | **Sport Scorekeeper** | Court-side live score input stub |

---

## 5. Folder Architecture

```text
sports-platform/
├── public/                 # Static assets (favicons, SVG icons)
├── src/
│   ├── app/                # App bootstrap, router.jsx, providers.jsx, App.jsx
│   ├── assets/             # Bundled images, icons, and fonts
│   │   └── images/         # Badminton hero image, player cards, highlights
│   ├── components/         # Atomic Design reusable components
│   │   ├── atoms/          # Button, Badge, Icon, LiveDot
│   │   ├── molecules/      # SportCard, MatchCard, ScoreDisplay
│   │   ├── organisms/      # Navbar, Footer, SportGrid
│   │   └── shared/         # LoadingState, EmptyState, ErrorState, NotFound
│   ├── layouts/            # PublicLayout, StudentLayout, SuperAdminLayout, SportAdminLayout
│   ├── features/           # Feature-based business domains
│   │   ├── home/           # HomePage and landing sections
│   │   ├── sports/         # Central sports registry (sports.data.js) & directory
│   │   ├── badminton/      # Original badminton experience (100% preserved)
│   │   ├── cricket/        # Cricket arena
│   │   ├── volleyball/     # Volleyball arena
│   │   ├── table-tennis/   # Table tennis arena
│   │   ├── kabaddi/        # Kabaddi arena
│   │   ├── throwball/      # Throwball arena
│   │   ├── basketball/     # Basketball arena
│   │   ├── matches/        # Fixture list and match details
│   │   ├── tournaments/    # Brackets and tournaments
│   │   ├── student/        # Student dashboard stub
│   │   ├── super-admin/    # Super admin console stub
│   │   └── sport-admin/    # Sport scorekeeper stub
│   ├── styles/             # Global styling (globals.css)
│   └── main.jsx            # Application entry point
├── docs/                   # Developer documentation
│   ├── PROJECT_STRUCTURE.md
│   ├── ROUTING_GUIDE.md
│   ├── COMPONENT_GUIDE.md
│   └── ADDING_A_NEW_SPORT.md
├── .env.example
├── package.json
└── vite.config.js
```

---

## 6. Developer Documentation

Comprehensive documentation has been prepared to guide new engineers:
- [Project Structure Guide](file:///docs/PROJECT_STRUCTURE.md): Component rules, layer boundaries, and circular import prevention.
- [Routing Guide](file:///docs/ROUTING_GUIDE.md): Layout binding, route table, and how to add routes.
- [Component Guide](file:///docs/COMPONENT_GUIDE.md): Atomic design implementation with code examples.
- [Adding a New Sport](file:///docs/ADDING_A_NEW_SPORT.md): 7-step guide to integrate any new campus sport.

---

## 7. Version 2 Roadmap (GSAP & Visual Upgrade)

This restructuring is the structural foundation for upcoming visual enhancements:
- GSAP and ScrollTrigger animations (staggered headline reveals, card entrances).
- Animated top-down SVG badminton court.
- WebSocket / SSE live scoring integration with backend APIs.
- Real-time tournament bracket updates.



## 8.FREEING LOCAL STORAGE OF THE BROWSER

  ```BASH 
  Object.keys(localStorage)
  .filter(
    (key) =>
      key === "gsv_admin_matches_store" ||
      key.startsWith("gsv_match_events_store_")
  )
  .forEach((key) => localStorage.removeItem(key));

location.reload();
```


## 9. LOCAL STORAGE HAS BEEN USED FOR TEMPORARY STORAGE OF THE MATCH DATA AND SCORING 