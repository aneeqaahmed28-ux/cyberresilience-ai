# CyberResilience AI

A web app that helps small organisations understand their cyber resilience gaps and get a practical, prioritised action plan. Built for the Nebius × NVIDIA Global AI Hackathon (track: Best apps and agents).

**Live demo:** https://cyberresilience-ai.vercel.app
_(The backend runs on a free plan and may take a short while to wake up on the first request.)_

## What it does

1. You enter your organisation's name, sector and size.
2. You answer 8 multiple-choice questions covering backups, MFA, updates, incident planning, staff training, access control, suppliers and downtime tolerance.
3. The app returns a risk level, a summary, strengths, gaps (with why each matters and what to do), and a prioritised action plan.

## How it works

```text
React (Vercel)
   │  organisation + answers, each with a score 0-3
   ▼
Express API (Render)
   │  validates input, applies rate limits
   │  adds up the scores in code → risk level
   │  builds the prompt
   ▼
Nebius Token Factory → NVIDIA Nemotron
   │  writes summary, strengths, gaps, recommendations, action plan (JSON)
   ▼
Express API → React results page
```

**Design choice:** the risk level is calculated by code from the answers, and the model explains it. In early tests, when the model chose the level itself, it was inconsistent (for example, rating a mostly strong organisation as High and listing weak answers as strengths). Moving the scoring into code fixed that.

## Models and platform

- Platform: Nebius Token Factory (OpenAI-compatible chat completions API)
- Model: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`
- Reasoning can be switched off with `chat_template_kwargs: { enable_thinking: false }`. In my tests on identical answers this was faster and used fewer output tokens. See the testing notes for the figures.

## Tech stack

React (Vite), Node.js, Express, Nebius Token Factory, NVIDIA Nemotron. Hosted on Vercel and Render.

## Run it locally

Requires Node 22.12 or newer.

```bash
git clone https://github.com/aneeqaahmed28-ux/cyberresilience-ai.git
cd cyberresilience-ai

# Backend
cd server
npm install
cp .env.example .env     # then fill in your own values
npm start

# Frontend (second terminal)
cd client
npm install
npm run dev
```

Open http://localhost:5173.

### Environment variables (`server/.env`)

| Variable                  | Purpose                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `NEBIUS_API_KEY`          | Your Token Factory API key (never commit this)                            |
| `NEBIUS_BASE_URL`         | Token Factory API base URL (e.g. https://api.tokenfactory.nebius.com/v1/) |
| `NEBIUS_MODEL`            | Model ID (e.g: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B)                     |
| `NEBIUS_DISABLE_THINKING` | `true` or `false`                                                         |
| `ALLOWED_ORIGINS`         | Comma-separated list of frontend addresses allowed to call the API        |
| `DAILY_LIMIT`             | Maximum assessments per day across all visitors (e.g. 200)                |

The frontend uses `VITE_API_URL` (see `client/.env.example`) to find the backend.

## Safeguards

- The API key stays on the server and is never sent to the browser
- CORS allow-list
- Rate limit per visitor and a daily cap, to protect credit
- Input validation and length limits

## Testing

Tested with fictional organisations only. See `Notes.md` for the results, problems found and fixes.

## Limitations

- All questions are weighted equally and the risk thresholds are my own first estimate
- The model can occasionally add details that were not in the answers
- This is AI-generated guidance, not a security audit or compliance certification

## Licence

MIT
