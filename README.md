# BoostHomes v3 (Static + Serverless)

Luxury static site + Netlify Functions for MLS + ChatGPT.

## Deploy (Netlify)
1) **Import from Git** → choose your GitHub repo.
2) Build command: *(leave blank)*
3) Publish directory: `.`
4) Deploy.

### Environment Variables (Site → Settings → Environment variables)
- `BRIDGE_CLIENT_ID` — from Bridge Interactive (MLS)
- `BRIDGE_CLIENT_SECRET` — from Bridge
- `BRIDGE_MLS` — MLS slug (e.g., `miamire`)
- `OPENAI_API_KEY` — your OpenAI key
- `OPENAI_MODEL` — e.g., `gpt-4o-mini`

### Functions
- `netlify/functions/listings.js` → `/api/listings`
- `netlify/functions/chat.js` → `/api/chat`

The front-end chat widget is included (floating button).

