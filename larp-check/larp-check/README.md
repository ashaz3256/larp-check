# Larp Check

Paste a bio or post, or take or upload a picture, and get a larp score out of 100.

## Run it

    npm install
    cp .env.example .env.local   # add your GROQ_API_KEY or ANTHROPIC_API_KEY
    npm run dev                  # http://localhost:3000

Without a key the site still works using the basic keyword scorer, but picture checks need the key because only the AI can read a picture.

## Deploy

Push to GitHub, import the repo on Vercel, and add these environment variables:

- `GROQ_API_KEY` or `ANTHROPIC_API_KEY`: your key (Groq is used for text if both are set, Claude for pictures)
- `NEXT_PUBLIC_SITE_URL`: your domain, e.g. https://larpcheck.com
- `DAILY_LIMIT`: checks per visitor per day (default 5)

## Where things are

- `app/page.jsx`: the main page
- `app/api/check/route.js`: AI scoring and the daily limit
- `app/api/og/route.js`: the share card image
- `app/r/page.jsx`: the page a shared link opens
- `lib/score.js`: fallback keyword scorer
- `lib/image.js`: shrinks pictures in the browser before upload

## Before real traffic

The daily limit is held in memory, which resets on serverless hosting. Move it to Redis (Upstash has a free tier).
