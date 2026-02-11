# Ash Creek Career OS

Mobile-first MVP command center for a filmmaker balancing documentary + narrative work with ADHD-friendly focus constraints.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Vercel-ready environment config

## Features
- `/login`: Supabase auth (magic link + email/password)
- `/today`: Today’s 3 Moves (Ship/Network/Create), sprint timer, end-of-day check-out
- `/slate`: Active project slate with next actions and archive flow
- `/weekly`: Weekly targets + deliverable + outreach targets + assign tasks
- `/people`: Lightweight CRM with suggested pings this week
- `/submissions`: Festival submission tracker (Alpha Station + future films)
- Mobile bottom tab bar + desktop sidebar
- Quick Add (+) button on mobile
- PWA install support (manifest + service worker)

## Local Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
3. Create a Supabase project and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (`http://localhost:3000` locally)
4. In Supabase SQL editor, run:
   - `db/supabase.sql`
5. Run dev server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000/login`

## Supabase Notes
- All tables are protected with RLS.
- Policies enforce owner-only access with `user_id = auth.uid()`.
- `profiles` has owner-only read/update policies and auto-creation trigger from `auth.users`.
- Optional seed helper: after login, run in SQL editor:
  ```sql
  select public.seed_demo_data();
  ```

## Deploy to Vercel via GitHub
1. Push this repository to GitHub.
2. In Vercel: **Add New → Project** and import the repo.
3. Configure environment variables in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel production URL)
4. Deploy.
5. In Supabase, add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-domain>/auth/callback`

## Install on iPhone (Add to Home Screen)
1. Open the deployed app in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.
4. Confirm title and tap **Add**.

## Project Structure
- `app/` routes and server/client UI
- `components/` reusable UI + layout components
- `lib/supabase/` SSR/browser/middleware helpers
- `db/supabase.sql` schema + triggers + RLS policies
- `public/manifest.json`, `public/sw.js`, `public/icons/*` for PWA
