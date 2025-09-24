# FLM Tracker

Een PWA web app (Vite + React + TS + Supabase) met modules:
- Metascript (dagelijkse reflectie)
- SCOPE Planner
- STAQ Habit Tracker
- Weekly Review

## Lokal draaien
```
cd app
npm install
npm run dev
```
Open `http://localhost:5173`

## Omgeving (.env)
Maak `app/.env` met:
```
VITE_SUPABASE_URL=...   # Supabase project URL
VITE_SUPABASE_ANON_KEY=...  # Supabase anon public key
```

## DB schema
Zie `app/supabase/schema.sql` en voer uit in Supabase → SQL Editor.

## Tests & build
```
npm run test
npm run build
```
De build staat in `app/dist`.

## Deploy (Vercel)
1) `npx vercel` → link project, `dist` als output, rewrites via `vercel.json` aanwezig
2) Zet env vars (Preview + Production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3) `npx vercel --prod`

## PWA
- Manifest: `public/manifest.webmanifest`
- Service worker: `public/service-worker.js`
- Installable en basic offline caching (app shell)

## Troubleshooting
- Auth errors: check `.env` en Vercel env, en Supabase Auth → URL Configuration (site URL = Vercel URL)
- RLS errors: zorg dat `user_id` wordt meegestuurd (zie repositories voor voorbeelden)
- Vulnerabilities: `npm audit` (let op: sommige fixes vereisen major upgrades)
