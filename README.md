# Viral Video Agent

Autonomous Next.js control surface and pipeline that ideates, assembles, and uploads a daily AI-generated vertical video to YouTube.

## Requirements

- Node.js 18+
- `ffmpeg` is bundled via `ffmpeg-static` (no system install needed)
- Accounts + API keys
  - OpenAI API key with access to Images + TTS (`OPENAI_API_KEY`)
  - YouTube Data API OAuth credentials + refresh token (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`)
  - Optional: set `ENABLE_YOUTUBE_UPLOAD=false` to work offline

## Setup

```bash
npm install
cp .env.example .env.local
# edit .env.local with the required credentials
```

## Usage

- `npm run dev` — local dashboard at `http://localhost:3000`
- `npm run generate` — run the full pipeline from the CLI (accepts optional prompt override)
- Deploy with Vercel and create a Cron Job targeting `GET https://<deployment>/api/run-daily` at your preferred cadence

## Pipeline Overview

1. Topic ideation (OpenAI Responses API)
2. Script and storyboard generation
3. Vertical image synthesis (OpenAI Images)
4. Lifelike narration (OpenAI TTS)
5. Video assembly with `ffmpeg`
6. Optional YouTube upload via YouTube Data API v3
7. Run logs persisted to `data/logs.json` and surfaced on the dashboard

## Environment Variables

```
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...
ENABLE_YOUTUBE_UPLOAD=true
```

## Deployment Notes

- Ensure `ENABLE_YOUTUBE_UPLOAD` remains `true` in production
- Provide the OAuth refresh token with `https://www.googleapis.com/auth/youtube.upload` scope
- Configure Vercel Cron (already present) or trigger `/api/run-daily` via any scheduler
