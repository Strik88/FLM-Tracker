# Background and Motivation
We willen één moderne app (responsive PWA) die op telefoon en computer werkt, met een simpel inlogscherm en een gratis maar slimme database. De bestaande losse pagina’s (`metascript-module.html`, `scope-planner.html`, `staq-tracker.html`, `weekly-review.html`) worden samengebracht in één applicatie met Auth en dataopslag per gebruiker.

# Key Challenges and Analysis
- Single app structuur: De vier HTML-tools migreren naar één SPA met routing en gedeelde UI/State.
- Auth (simpel, veilig, gratis): Email/wachtwoord is voldoende; magic link optioneel. Supabase biedt gratis Auth + Postgres.
- Database ontwerp: Relationeel schema met Row-Level Security (RLS) per gebruiker; uitbreidbaar zonder dure migraties.
- Offline & PWA: App moet offline bruikbaar zijn; data synct zodra er verbinding is (start met online-first + caching; optioneel latere IndexedDB sync).
- Migratie UI: Bestaande stijlen vertalen naar componenten (React + Tailwind) zonder het gevoel te verliezen.
- Beheer .env: Scheiden van build/runtime secrets; per omgeving (local/prod) correcte sleutels voor Supabase.
- Testbaarheid: Unit tests (Vitest) en kritische flows E2E (Playwright/Cypress).
- Deploy: Vercel (gratis), met PWA-headers en environment vars.

# High-level Task Breakdown
0) Decisions to Confirm (blocking)
- DB/Auth: Supabase (gratis) voor Auth + Postgres + RLS. [GEKOZEN]
- Inlog: Email/wachtwoord (simpel). [GEKOZEN]
- Doelgroep: Alleen jij (single-user). [GEKOZEN] — schema blijft multi-user-ready, maar policies beperken tot jouw account.
Success: Keuzes bevestigd in dit document. [DONE]

1) Project bootstrap
- Setup: Vite + React + TypeScript, Tailwind CSS, React Router, vite-plugin-pwa, ESLint/Prettier, Vitest.
- CI lokaal: `npm run test` werkt; dev server draait.
Success: App start op http://localhost:5173, basis tests groen, PWA manifest geladen.

2) Supabase project & omgeving
- Maak Supabase project aan; bewaar `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` in `.env`.
- Voeg schema en RLS policies toe (zie Schema sectie).
- Test verbinding met Supabase vanuit app.
Success: Ingelogde user kan eigen records lezen/schrijven; andere data is afgeschermd.

3) Auth flow + Protected routes
- Simple Login/Register pagina: email/wachtwoord; Knoppen: Log in, Registreren, Log uit.
- Session persistence; route guards; redirect naar `/dashboard` na login.
Success: In/uitloggen werkt; reload behoudt sessie.

4) Data layer (repositories)
- Type-veilige repository functies per entiteit (CRUD) met Supabase JS client.
- Unit tests met mocks; foutafhandeling met debug-vriendelijke messages.
Success: CRUD tests slagen; duidelijke errors in console/output.

5) Migratie modules (één voor één)
5a) Metascript
- Route `/metascript`; UI gemigreerd; Opslaan naar `metascripts` tabel; Lijst + detail.
Success: Ingevulde velden worden opgeslagen en terug te zien.

5b) SCOPE Planner
- Route `/scope`; UI gemigreerd; Opslaan naar `scopes` tabel; Current vs history.
Success: Laatste scope wordt geladen; nieuwe scope kan worden opgeslagen.

5c) STAQ Tracker
- Route `/staq`; Habits beheer (`habits`); dagelijkse logs (`habit_logs`); weekweergave.
Success: Aanvinken per dag slaat op; progress bar klopt per week.

5d) Weekly Review
- Route `/weekly-review`; UI gemigreerd; Opslaan naar `weekly_reviews`.
Success: Review bewaren en later inzien/export placeholder.

6) Dashboard & Navigatie
- Route `/dashboard` met snelle links/overzichten; globale navbar/tabbar.
Success: Navigatie werkt op mobiel/desktop; actieve modules tonen korte samenvattingen.

7) PWA polish
- Manifest, icons, theme color; service worker via vite-plugin-pwa; offline caching van shell en laatste data requests.
Success: “Install App” prompt; app start offline met shell.

8) QA & Tests
- Vitest coverage basis; E2E smoke: login → module open → bewaar → verifiëren.
Success: E2E smoke tests slagen lokaal.

9) Deployment
- Deploy naar Vercel; zet env vars; check PWA en Auth in productie.
Success: Publieke URL werkt; login + modules OK.

10) Docs
- README: lokaal runnen, env zetten, deploy stappen, troubleshooting.
Success: Volledige instructies aanwezig.

11) UX Upgrade Roadmap (gefaseerd, zonder Supabase/Vercel te breken)
11.1 Metascript Wizard & Summary
- Taken:
  - Bouw stap-voor-stap wizard (Scan → Heart → Head → Hat → Integratie) met progressbar en sticky navigatie.
  - Voeg “Samenvatting” scherm toe met kernvelden en datum/duur.
  - Toaster voor opslaan/verwijderen; skeletons tijdens laden.
- Succescriteria:
  - Door alle stappen navigeren met Vorige/Volgende; opslaan toont snackbar en samenvatting.
  - Historie- en detailpagina blijven werken; geen schema-wijzigingen nodig.
- Test:
  - Desktop en mobiel; stap-navigatie, opslag, samenvatting, terug naar geschiedenis.

11.2 SCOPE Cards & Resonantie Feedback
- Taken:
  - UI als kaarten (Apex, Quarterly, Week, Daily) met iconen/gradients.
  - Slider feedbacktekst afhankelijk van score.
  - Chips voor time blocks; presets (8u/4u/5u/10u).
- Succescriteria:
  - Visuele pariteit met origineel; opslag ongewijzigd.
- Test:
  - Resonantie schuiven toont tekst; opslaan werkt; historie-detail blijft intact.

11.3 STAQ Animaties, Streaks en Weekselector
- Taken:
  - Animatie bij togglen (scale/rotate), ‘checked/missed/not’ themes.
  - Statblokjes: huidige/beste streak, week%.
  - Weekselector (← →) om vorige weken te bekijken (alleen UI + queries; DB blijft gelijk).
- Succescriteria:
  - Togglen is vloeiend en optimistisch; stats en % kloppen; week wisselen werkt.
- Test:
  - Toggle meerdere dagen, wissel week, verwijder habit; geen RLS-fouten.

11.4 Weekly Review Polish & Export
- Taken:
  - Secties met icon/subtitel, grote resonantie waarde; nette typografie.
  - Export naar Markdown of eenvoudige PDF (client-side print-to-PDF) met nette layout.
- Succescriteria:
  - Export resulteert in leesbaar document met alle ingevulde velden.
- Test:
  - Maak review, exporteer, controleer inhoud en opmaak.

11.5 Navigatie & Dashboard
- Taken:
  - Mobiele bottom-tabbar (Dashboard, Metascript, Scope, STAQ, Review).
  - Dashboard kaarten met meer context (laatste datum/score/stats) en quick actions.
- Succescriteria:
  - Navigeren met duim is eenvoudig; kaarten laden snel en tonen recente data.
- Test:
  - iOS/Android/desktop; focus states; performantie check (Lighthouse sneltest).

11.6 UX Fundamentals
- Taken:
  - Toasters (succes/fout), Undo voor delete, skeletons op lijsten.
  - A11y labels/aria, focus outlines, kleurcontrast; i18n strings centraliseren.
- Succescriteria:
  - Alle kritieke flows hebben duidelijke feedback; basis a11y ok.
- Test:
  - Screenreader basis, keyboard navigatie, offline fallback.

11.7 PWA Icons & Meta
- Taken:
  - Echte 192/512 maskable PNG’s, manifest bijwerken.
  - SEO/meta per route (title/description), apple-touch-icon.
- Succescriteria:
  - Manifest volledig groen, app-icoon scherp op mobiel.
- Test:
  - DevTools Application → Manifest: no warnings; install test op telefoon.

12) Conversational AI Agent (na UX, optioneel uitbreiden)
- Doel: Gesprek i.p.v. formulier, met empathische, doorvragende en kritische begeleiding. Start met Metascript; later uitbreidbaar naar SCOPE/Review.
- Architectuur:
  - UI: Chat-widget component (streaming, markdown), switch tussen Chat/Wizard.
  - Orchestratie: client-first; optioneel lichte proxy (serverless) voor key-hiding/rate-limits.
  - Provider-agnostisch: adapter voor OpenAI/Azure/Google; sleutels via env.
  - Prompting: rol (coach), stijl (empatisch/doorvragen), structuur (conversational state → structured output schema).
  - Output mapping: model-respons → schema (`metascripts`, `weekly_reviews`) met expliciete confirm stap voor opslag.
  - Context/RAG: optioneel retrieve laatste entries voor gepersonaliseerde vragen; waarborg privacy en toon contextbron aan gebruiker.
  - Safety/guardrails: inhoudsfilters, maximale context, onduidelijkheid → doorvragen; geen PII echo in logs.
  - Kosten/performance: token-budget, samenvatten van lange gesprekken, toggles voor “low-cost mode”.
- Fasen (MVP → v2):
  - MVP: Metascript chat die aan het einde een samenvatting + actiepunten teruggeeft en opslaat na akkoord.
  - v2: Persoonlijk geheugen (coach onthoudt stijl/voorkeuren), RAG op eerdere sessies, meer modules.
- Test: transcript → output JSON → validatie → opslag; E2E gesprek simulatietest; timeouts/hertries.

# Project Status Board
- [x] 0. Confirm choices: Supabase, inlog methode, single/multi-user
- [x] 1. Bootstrap Vite React TS + Tailwind + Router + ESLint/Prettier + Vitest (PWA later i.v.m. versieconflict)
- [x] 2. Supabase aanmaken + .env invullen + verbinding testen
- [x] 3. SQL schema toepassen + RLS policies
- [x] 4. Auth UI + Protected routes + session
- [ ] 5a. Metascript migratie (UI + CRUD + lijst)
 - [x] 5a. Metascript migratie (UI + CRUD + lijst)
 - [x] 5b. SCOPE Planner migratie (UI + CRUD + current/history)
 - [x] 5c. STAQ Tracker (habits CRUD + logs + week)
 - [x] 5d. Weekly Review (UI + CRUD)
- [ ] 6. Dashboard + navigatie
- [ ] 7. PWA polish (manifest, icons, SW, offline)
 - [x] 7. PWA polish (manifest, icons, SW, offline)
- [ ] 8. QA tests (unit + E2E smoke)
- [ ] 9. Deploy Vercel + env
- [ ] 10. README/docu
 - [ ] 11.1 Metascript wizard + summary
 - [ ] 11.2 SCOPE cards + resonantie feedback
 - [ ] 11.3 STAQ animaties + streaks + weekselector
 - [ ] 11.4 Weekly Review polish + export
 - [ ] 11.5 Bottom-nav + dashboard kaarten
 - [ ] 11.6 Toasters/skeletons/undo + a11y
 - [ ] 11.7 PWA icons + route meta

# Current Status / Progress Tracking
- Mode: Planner → UX roadmap opgesteld; klaar om 11.1 te starten
- Supabase: project + schema + RLS staan; `.env` gevuld; verbinding OK.
- Auth: Registreren/inloggen/uitloggen en protected routes werken.
- Metascript: Volledige UI + opslaan + geschiedenis + detail werken en zijn handmatig gevalideerd.
- Scope Planner: Volledige UI + opslaan; geschiedenis + detail werken en zijn handmatig gevalideerd.
- STAQ Tracker: Habits CRUD + week toggles werken; progress bar update; data in `habits` en `habit_logs`.
- Weekly Review: UI + opslaan als JSON; geschiedenis + detail werken.
- PWA: Manifest + service worker toegevoegd; app is installable en heeft basic offline caching.

# Executor's Feedback or Assistance Requests
- Graag bevestigen:
  - Supabase als gratis DB/Auth?
  - Inlog via email/wachtwoord (simpel) of liever magic link?
  - Multi-user aan laten staan (zodat later eenvoudig te delen) of voorlopig alleen jij?
- Zodra bevestigd, start met stap 1 en rapporteer per stap.

# Lessons
- Include debug info in program output; heldere foutmeldingen bij API calls.
- Read the file before you try to edit it.
- If there are vulnerabilities that appear in the terminal, run `npm audit` voordat we verder gaan.
- Always ask before using the `-force` git command.

# Proposed Data Schema (Supabase Postgres)
Note: Alle tabellen met `user_id uuid` die verwijzen naar `auth.users`. Timestamps in UTC; `created_at` default now().

profiles
- user_id uuid primary key references auth.users
- display_name text
- created_at timestamptz default now()
RLS: user can select/update own row

metascripts
- id uuid pk default gen_random_uuid()
- user_id uuid not null references auth.users
- date timestamptz not null default now()
- scan1 text, scan2 text, scan3 text
- heart_shift text
- head_shift_options text
- head_shift_resonant text
- hat_shift_identity text
- hat_shift_wisdom text
- integration_action text
- integration_embodiment text
- duration_minutes int
- created_at timestamptz default now()
RLS: user can select/insert/update/delete where user_id = auth.uid()

scopes
- id uuid pk default gen_random_uuid()
- user_id uuid not null references auth.users
- date timestamptz default now()
- apex_vision text
- apex_resonance int
- quarterly_goals text[]
- week_priorities text[]
- time_blocks jsonb            -- {deepWork, meetings, sport, fun}
- daily_focus jsonb            -- {main, quick, fun}
- daily_energy int
- created_at timestamptz default now()
RLS: user can select/insert/update/delete where user_id = auth.uid()

habits
- id uuid pk default gen_random_uuid()
- user_id uuid not null references auth.users
- name text not null
- kind text check (kind in ('hardline','mainline'))
- icon text
- created_at timestamptz default now()
RLS: user can select/insert/update/delete where user_id = auth.uid()

habit_logs
- id uuid pk default gen_random_uuid()
- user_id uuid not null references auth.users
- habit_id uuid not null references habits(id) on delete cascade
- date date not null
- status text check (status in ('checked','missed','not_checked'))
- created_at timestamptz default now()
Unique: (user_id, habit_id, date)
RLS: user can select/insert/update/delete where user_id = auth.uid()

weekly_reviews
- id uuid pk default gen_random_uuid()
- user_id uuid not null references auth.users
- week int not null
- year int not null
- resonance int
- fields jsonb                  -- flexibele opslag voor vrije tekstvelden
- created_at timestamptz default now()
Unique: (user_id, week, year)
RLS: user can select/insert/update/delete where user_id = auth.uid()

Example policies (per tabel, samengevat):
- enable row level security;
- policy "Own rows" for select using (user_id = auth.uid());
- policy "Own rows" for insert with check (user_id = auth.uid());
- policy "Own rows" for update using (user_id = auth.uid());
- policy "Own rows" for delete using (user_id = auth.uid()).

# Testing Strategy (TDD-first where feasible)
- Unit: repository functies (CRUD) met Supabase client mocks; pure utils.
- Component: rendering en form validation van modules (React Testing Library).
- E2E (smoke): login → open module → invullen → opslaan → assert in lijst.
- PWA: basic check dat manifest/SW geladen is en app shell offline opent.

# Implementation Notes
- Stack: React + Vite + TypeScript, Tailwind, React Router, vite-plugin-pwa, Supabase JS.
- Styling: Tailwind; behoud look & feel uit HTML, maar componentized.
- Offline: start met app-shell caching; later optioneel IndexedDB (Dexie) sync.
- Accessibility: labels/aria voor inputs en knoppen.
- i18n: UI in NL; strings centraliseren voor later aanpasbaarheid.
