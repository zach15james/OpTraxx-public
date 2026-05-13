# OpTraxx

the stack was react + vite + tailwind + firebase

A task-management web app for supervisor/employee teams. Supervisors build forms, assign tasks, and review submissions; employees see their tasks, fill out the attached forms (optionally by voice), and submit. Overdue tasks auto-escalate via a scheduled Cloud Function.

Built as a university group project.

## Stack
- react, vite, tailwind
- firebase
## Features

- Role-based auth (supervisor / employee) with route-level gating
- Live dashboards, task list, team view, and analytics — all backed by real-time Firestore `onSnapshot` subscriptions
- Form builder with 8 field types, reorderable fields, required toggles, and 4 prebuilt templates
- Task → form completion loop: assigning a task with an attached form lets the employee complete it in one flow, which also marks the task done
- Voice-assisted form fill: speak a sentence, get fields auto-populated (Chrome/Edge/Safari)
- Escalation workflow: hourly Cloud Function flips overdue tasks; supervisors can reassign, override, nudge, or annotate
- CSV export of tasks and submissions

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env` with `VITE_FIREBASE_*` keys pointing at a Firebase project with Auth, Firestore, and (optionally) Functions enabled. See `firestore.rules` for the security model.

```bash
npm run build     # production build to dist/
npm run lint      # eslint
```

## Project layout

- `src/pages/` — route components
- `src/layouts/` — public and authenticated layouts
- `src/context/AuthContext.jsx` — single source of truth for user + role, live-synced via `onSnapshot`
- `src/hooks/` — Firestore data layer (one hook per page)
- `src/components/ui/` — shadcn primitives
- `src/lib/firebase.js` — Firebase client setup
- `functions/index.js` — `escalateOverdueTasks` scheduled function
- `firestore.rules` — security rules

## My contributions

Most of my code lives in `src/zach_contributions/`:

- **Form builder** (integrated + standalone sandbox variants) — `SupervisorFormsPage`, `EmployeeFormsPage`, submissions review with CSV/JSON export
- **VoiceFill** — `voiceFill.js` (pure-JS transcript-to-fields extractor with heuristics for yes/no, ratings, numbers, single/multi select, dates), `useVoiceFill.js` (Web Speech hook), `VoiceFillPanel.jsx` (UI)
- **Firestore migration** of the forms store from localStorage to Firestore
- **Task ↔ form completion loop** wiring across `AssignTask`, `TaskList`, and the employee fill page

Outside that folder, I also did a QA cleanup pass that wired up several previously-mock pages (Profile, Team, Escalations, Analytics) to real Firestore data, fixed an `AuthContext` role-sync bug, and tightened the Firestore rules.
