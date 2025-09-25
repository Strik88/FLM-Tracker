# FLM Tracker

Een Progressive Web App (PWA) gebouwd met Vite + React + TypeScript + Supabase voor persoonlijke ontwikkeling en habit tracking.

## 🚀 Modules

- **Metascript**: Dagelijkse reflectie en mindset coaching
- **SCOPE Planner**: Van Apex Vision naar Daily Action
- **STAQ Tracker**: Systematic Training & Quantification (habit tracking)
- **Weekly Review**: Wekelijkse evaluatie en planning

## 🛠️ Lokaal draaien

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## 🔧 Environment Setup

Maak een `.env` bestand in de root met:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

1. Ga naar je Supabase project → SQL Editor
2. Voer de SQL uit van `supabase/schema.sql`
3. Dit creëert alle tabellen en Row Level Security policies

## 📱 PWA Features

- ✅ Installable op mobiel en desktop
- ✅ Offline functionaliteit (app shell caching)
- ✅ Responsive design met mobile-first navigation
- ✅ Service worker voor caching

## 🧪 Testing & Build

```bash
# Run tests
npm run test

# Build for production
npm run build

# Preview build
npm run preview
```

## 🚀 Deployment (Bolt Hosting)

De app is geoptimaliseerd voor Bolt Hosting:

1. Build wordt automatisch gegenereerd naar `dist/`
2. Alle paths zijn relatief (`./`) voor correcte routing
3. PWA manifest en service worker zijn geconfigureerd
4. Environment variables worden automatisch ingeladen

## 🔐 Authentication

- Email/password authentication via Supabase Auth
- Automatische profile creation bij registratie
- Row Level Security zorgt dat gebruikers alleen eigen data zien

## 📊 Database Schema

- `profiles`: Gebruikersprofielen
- `metascripts`: Dagelijkse metascript entries
- `scopes`: SCOPE planning entries
- `habits`: Habit definities
- `habit_logs`: Dagelijkse habit tracking
- `weekly_reviews`: Wekelijkse reviews

## 🐛 Troubleshooting

**Auth errors:**
- Check `.env` variabelen
- Verifieer Supabase Auth → URL Configuration

**RLS errors:**
- Zorg dat gebruiker is ingelogd
- Check of `user_id` correct wordt meegegeven

**Build errors:**
- Run `npm audit` voor security issues
- Check TypeScript errors met `npm run lint`

## 🎯 Roadmap

- [ ] Conversational AI Agent (MaxIan)
- [ ] Advanced analytics en insights
- [ ] Export functionaliteit (PDF, Markdown)
- [ ] Offline sync met IndexedDB
- [ ] Push notifications voor reminders