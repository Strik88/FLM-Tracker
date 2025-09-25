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
De build staat in `dist`.

## Deploy
Geoptimaliseerd voor moderne hosting platforms.

Environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## PWA
- Manifest: `public/manifest.webmanifest`
- Service worker: `public/service-worker.js`
- Installable en basic offline caching (app shell)

## Troubleshooting  
- Auth errors: check environment variables en Supabase Auth configuratie
- RLS errors: zorg dat `user_id` wordt meegestuurd (zie repositories voor voorbeelden)
- Vulnerabilities: `npm audit` (let op: sommige fixes vereisen major upgrades)