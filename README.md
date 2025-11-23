# PRALOR CORP // OS
Futuristic multi-agent control surface for PRALOR (Construct, Ledger, Command, Sentry) with Firebase auth and Gemini AI.

## Quick start
1) Install: `npm install`
2) Env: copy `.env.example` to `.env` and fill your Gemini + Firebase values
3) Run dev server: `npm run dev` (port 9000) • Build: `npm run build` • Preview prod: `npm run preview`

## Environment
- Gemini: `VITE_GEMINI_API_KEY`
- Firebase client config: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`
- Secrets live in `.env` (gitignored); template in `.env.example`

## App map (src/)
- `App.jsx` – lightweight view router between Landing, Sentry, Construct, Ledger, Command, Pricing; wraps `AuthProvider`
- `components/PralorLanding.jsx` – branded landing hero + agents/products/pricing
- `components/SentryDashboard.jsx` – ops dashboard with live metrics + AI chat entry
- `components/Construct.jsx` – idea-to-business generator (Gemini-backed)
- `components/Ledger.jsx` – live CoinGecko market view + fear/greed + ORACLE analysis modal
- `components/Command.jsx` – drag/drop prompt builder UI
- `components/Pricing.jsx` – tier cards (Stripe placeholder)
- `components/AuthModal.jsx` – email/password + Google auth
- `components/AgentChat.jsx` – floating multi-agent chat (ARCHITECT/ORACLE/SENTRY)
- `context/AuthContext.jsx` – auth state + usage gates
- `firebase/config.js` – Firebase init (auth/firestore/analytics)
- `ai/gemini.js` – Gemini client + agent prompts and helpers

## Archived projects (not part of the main app)
- `archive/buildboss` – Next.js meta-builder prototype (inactive)
- `archive/prompt-engine` – Electron prompt utility (inactive)
- `archive/resume-apps/web3-intelligence-hub` – Next.js Web3 dashboard (OpenAI/Alchemy). `.env.local` was removed; use `.env.local.example` if you need it again.

Notes: `archive/` and build artifacts are ignored by git; keep real keys only in `.env`. The production build was cleaned (`dist/` removed) to prevent accidental secret sharing.
