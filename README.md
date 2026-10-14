
#THIS IS BADMINTON FRONTEND REPO OF GATISHAKTI VISWAVIDHYALAYA

PROJECT OVERVIEW
Building a premium, responsive college badminton tournament website using React + Vite project, Tailwind CSS, and atomic & feature-based folder structure.

CURRENT ARCHITECTURE
- React with JSX
- Vite
- Tailwind CSS v4 via @tailwindcss/vite
- lucide-react for icons
- Shared atomic components under src/components/
- Feature modules under src/features/
- Page composition under src/pages/
- Reuse existing files and import paths; do not create duplicate components.

CURRENT SECTIONS
1. Navbar: responsive desktop/mobile navigation, anchor links, sticky/compact scroll state, accessible controls.
2. Hero: cinematic badminton background, dark gradient overlays, headline and CTAs.
3. Marquee: tournament-themed strip with reduced-motion support.
4. Live matches: reusable cards, players, court, score and status; mark demo scores clearly.
5. Players: reusable cards, separate data, responsive grid and player images.
6. Tournament brackets: reusable rounds/cards, horizontal scrolling on mobile, distinguish winners and incomplete matches.
7. Schedule: responsive fixtures, filters for All/Live/Upcoming/Completed, separate data.
8. Footer: branding, useful links and back-to-top action.

DESIGN SYSTEM
- Near-black background: #080909
- Neon-lime accent: #DFFF00
- Premium dark sports-editorial style
- High contrast, restrained borders, consistent spacing and responsive layouts.

VERSION 2: GSAP ANIMATIONS
- will be adding GSAP and use ScrollTrigger for scroll-driven effects.
- Install JavaScript dependencies with npm; record them in package.json.
- Clean up GSAP contexts and ScrollTriggers on unmount.
- Respect prefers-reduced-motion.
- Prefer transform/opacity animations and avoid unnecessary layout shifts.
- Keep mobile scrolling, navigation and touch interactions usable.

PLANNED GSAP EFFECTS
- Navbar: compact scroll state and subtle entrance.
- Hero: staggered headline reveal, CTA/text entrance, subtle image parallax.
- Marquee: optional continuous horizontal movement; simplify for reduced motion.
- Sections: subtle fade-up/staggered reveals for player cards, match cards, schedule rows and brackets.
- Bracket: optional sequential round reveal without breaking horizontal scrolling.
- Avoid excessive pinning or animation that blocks access to content.

VERSION 2: LIVE BADMINTON COURT ANIMATION
Goal: a top-down animated badminton court that illustrates match activity. Do not present a demo as real tracking.

Visual requirements:
- Accurate court proportions and clear boundary, centre, service and singles/doubles lines.
- Net and two player markers.
- Shuttlecock marker with a short motion trail.
- Optional rally path and subtle court glow.
- Responsive scaling without distorting court geometry.
- A legend and accessible textual status.

Animation requirements:
- Animate player markers and shuttlecock along controlled paths.
- Use GSAP timelines for choreographed demo rallies.
- Play, pause and replay controls; optional speed control.
- Pause when off-screen where practical.
- Respect reduced-motion settings.
- Keeping animation smooth; avoid unnecessary React re-renders.
- Using SVG or CSS for the court and animate marker transforms with GSAP.
- Suggested component: src/features/live/components/LiveCourt.jsx
- Suggested demo sequence data: src/features/live/data/rallyData.js

LIVE DATA INTEGRATION
- Clearly label demo rallies and scores.
- Real-time scores need a trusted backend/API or authorized data source.
- Real player/shuttle tracking needs tracking data or computer-vision input; GSAP alone does not provide real tracking.
- Keep an adapter layer so demo sequences can later be replaced with timestamped tracking events.
- Add loading, unavailable and connection-error states if a live feed is integrated.
- Never invent real scores, player positions or match status.

ACCESSIBILITY AND QUALITY
- Semantic HTML, meaningful alt text, keyboard-accessible controls and visible focus states.
- Sufficient contrast; do not rely on color alone for status.
- Respect prefers-reduced-motion.
- No console errors or missing imports.
- Verify anchor targets, mobile menu, filters and court controls.
- Ensure `npm run build` succeeds.

IMPLEMENTATION ORDER
1. Stabilize the existing navbar, hero, marquee, live matches, players, brackets, schedule and footer.
2. Verify responsive layout, imports, data shapes and production build.
3. Install GSAP.
4. Add scoped hero and section animations.
5. Build the SVG/CSS top-down animated court.
6. Add play/pause/replay and reduced-motion behavior.
7. Connect authorized live data if available.
8. Optimize and test desktop/mobile behavior.

DEPENDENCIES
For this React/Vite project, install packages with npm and keep them in package.json.
Planned animation dependency:
  npm install gsap

Use GSAP's ScrollTrigger plugin from the installed gsap package. Add other packages only when needed.

NOTE
This file documents project requirements. It is not a Python pip requirements file.