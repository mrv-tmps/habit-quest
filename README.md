# Habit Quest

Habit Quest turns your daily routines into a gamified quest log. Create a pixel-art hero, complete daily quests tied to real habits, gain XP, and level up. Built for quick mobile check-ins with optional guest mode for trying the experience before creating an account.

## Highlights
- **Quest-based dashboard** – Complete curated stats like Focus, Wellness, and Growth with cooldown logic so habits can only be logged once per day.
- **Leveling + XP feedback** – Instant animations and toasts celebrate streaks, level-ups, and missed cooldowns.
- **Guided onboarding** – Choose an avatar, name, and starter quests through a multi-step flow that stores progress in Supabase.
- **Guest mode** – Try the experience instantly; upgrade to a full account anytime without losing context.
- **Responsive UI** – Tailwind + shadcn components provide a polished, mobile-first interface that still looks great on larger screens.
- **Supabase backend** – Auth, profile data, and habit logs are persisted via Supabase (locally or in the cloud).

## Tech Stack
- React 18 + Vite + TypeScript
- Tailwind CSS & shadcn/ui component primitives
- Supabase (Postgres, Auth, Row Level Security)
- TanStack Query, React Hook Form, Zod, Sonner toasts

## Prerequisites
- Node.js 18+ and npm
- Supabase CLI (required for local database/auth) – [installation guide](https://supabase.com/docs/guides/cli)

## Local Setup
```bash
git clone <repo-url>
cd habit-quest
npm install

# optional: start local Supabase stack
supabase start

# copy env vars
cp .env.example .env.local
```

### Environment variables
Define the following in `.env.local` (Vite will read variables prefixed with `VITE_`):
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```
When running `supabase start`, the CLI prints local values you can drop in here.

### Run the app
```bash
npm run dev
```
The dev server defaults to `http://localhost:5173`. Supabase CLI exposes the studio at `http://localhost:54323` by default.

## Project Structure
- `src/pages` – Auth, Onboarding, Dashboard, History, Settings, and supporting routes
- `src/components` – UI library wrappers, Stat cards, Character card, banners, and toasts
- `src/hooks` – Habit tracker logic, Supabase-backed user data, responsive helpers
- `src/contexts/AuthContext.tsx` – Supabase auth session management + guest support
- `supabase/` – CLI configuration and SQL migrations that provision the schema used by Habit Quest

## Supabase Migrations
To capture schema changes:
```bash
# after editing the local DB (via SQL or studio)
supabase db diff --file migrations/<timestamp>_<name>.sql
```
Apply migrations in another environment with:
```bash
supabase db push
```

### Feedback requests table
- The `supabase/migrations/20251129121500_add_feedback_requests.sql` migration provisions a `feedback_requests` table that stores feature ideas, bug reports, and other suggestions directly from the in-app form.
- Make sure this migration has been pushed (`supabase db push`) before deploying environments that should capture user feedback.
- Feedback entries are inserted from the Settings screen; unauthenticated submissions are allowed but you can tighten the policy if you only want authenticated players to create rows.

## Useful Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Run Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint across the repo |

## Deployment Tips
- Configure the Supabase project credentials as environment variables wherever you host (Vercel/Netlify/etc).
- For best Lighthouse scores, deploy the optimized build (`npm run build`) and serve the `dist/` directory.
- If you change the Supabase schema, run migrations before deploying the new frontend so the API stays in sync.

## Roadmap Ideas
- Streak badges + reminders
- Social leaderboards for friends or teams
- Advanced analytics on habit history

Have feedback or ideas? Open an issue or drop a PR—adventure is better together. 🗡️
