/**
 * App Router Configuration
 * Centralized route definitions using React Router.
 */
import { createBrowserRouter } from "react-router-dom"

// Layouts
import PublicLayout from "../layouts/PublicLayout"
import StudentLayout from "../layouts/StudentLayout"
import SuperAdminLayout from "../layouts/SuperAdminLayout"
import SportAdminLayout from "../layouts/SportAdminLayout"

// Pages
import HomePage from "../features/home/pages/HomePage"
import SportsPage from "../features/sports/pages/SportsPage"
import SportDetailPage from "../features/sports/pages/SportDetailPage"

// Sport Pages
import BadmintonPage from "../features/badminton/pages/BadmintonPage"
import CricketPage from "../features/cricket/pages/CricketPage"
import VolleyballPage from "../features/volleyball/pages/VolleyballPage"
import TableTennisPage from "../features/table-tennis/pages/TableTennisPage"
import KabaddiPage from "../features/kabaddi/pages/KabaddiPage"
import ThrowballPage from "../features/throwball/pages/ThrowballPage"
import BasketballPage from "../features/basketball/pages/BasketballPage"

// Matches & Tournaments
import MatchesPage from "../features/matches/pages/MatchesPage"
import MatchDetailPage from "../features/matches/pages/MatchDetailPage"
import TournamentsPage from "../features/tournaments/pages/TournamentsPage"
import TournamentDetailPage from "../features/tournaments/pages/TournamentDetailPage"

// Dashboards
import StudentDashboard from "../features/student/pages/StudentDashboard"
import SuperAdminDashboard from "../features/super-admin/pages/SuperAdminDashboard"
import SportAdminDashboard from "../features/sport-admin/pages/SportAdminDashboard"
import AdminAccessPage from "../features/match-control/pages/AdminAccessPage"

import AssignedMatchesDashboard from "../features/match-control/pages/AssignedMatchesDashboard"
import MatchControlPage from "../features/match-control/pages/MatchControlPage"

// Shared
import NotFound from "../components/shared/NotFound"

export const router = createBrowserRouter([
  // Public Portal Routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "sports",
        element: <SportsPage />,
      },
      {
        path: "sports/volleyball",
        element: <VolleyballPage />,
      },
      {
        path: "sports/table-tennis",
        element: <TableTennisPage />,
      },
      {
        path: "sports/kabaddi",
        element: <KabaddiPage />,
      },
      {
        path: "sports/throwball",
        element: <ThrowballPage />,
      },
      {
        path: "sports/:sportId",
        element: <SportDetailPage />,
      },
      {
        path: "matches",
        element: <MatchesPage />,
      },
      {
        path: "matches/:matchId",
        element: <MatchDetailPage />,
      },
      {
        path: "tournaments",
        element: <TournamentsPage />,
      },
      {
        path: "tournaments/:tournamentId",
        element: <TournamentDetailPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // Dedicated Badminton Experience (Preserves original navbar, full-screen layout, and hash scrolling)
  {
    path: "/sports/badminton",
    element: <BadmintonPage />,
  },
  {
    path: "/badminton",
    element: <BadmintonPage />,
  },

  // Dedicated Cricket Experience
  {
    path: "/sports/cricket",
    element: <CricketPage />,
  },
  {
    path: "/cricket",
    element: <CricketPage />,
  },

  // Dedicated Basketball Experience
  {
    path: "/sports/basketball",
    element: <BasketballPage />,
  },
  {
    path: "/basketball",
    element: <BasketballPage />,
  },
// Admin Access Page (for match control and admin login)
  {
  path: "/admin-access",
  element: <AdminAccessPage />,
},

  // Student Interface
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
    ],
  },

  // Super Admin Interface
  {
    path: "/admin",
    element: <SuperAdminLayout />,
    children: [
      {
        index: true,
        element: <SuperAdminDashboard />,
      },
    ],
  },

  // Sport Admin Interface
{
  path: "/sport-admin",
  element: <SportAdminLayout />,
  children: [
    {
      index: true,
      element: <AssignedMatchesDashboard />,
    },
    {
      path: "matches/:matchId/control",
      element: <MatchControlPage />,
    },
  ],
},
])

export default router
